import { Request, Response } from 'express';
import Sale from '../models/Sale';
import Customer from '../models/Customer';
import Package from '../models/Package';

const VALID_PAYMENT_METHODS = ['cash', 'credit', 'check'];

// @desc    Get all sales
// @route   GET /api/
// this function retrieves all sales from the database, populating the customer and package details for each sale, and returns them as JSON sorted by payment date in descending order. It also handles server errors.
export const getSales = async (_req: Request, res: Response) => {
  try {
    const sales = await Sale.find()
      .populate('customer', 'customerId firstName lastName fullName classBalance')
      .populate('package', 'packageId packageName price numberOfClasses classType category')
      .sort({ paymentDate: -1 });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

// @desc    Get a single sale by ID
// @route   GET /api/sales/:id
// this function retrieves a sale by its ID, populating the customer and package details, and returns it as JSON. If the sale is not found, it returns a 404 error. It also handles server errors.
export const getSaleById = async (req: Request, res: Response) => {
  try {
    const sale = await Sale.findById(req.params.id)
      .populate('customer', 'customerId firstName lastName fullName classBalance')
      .populate('package', 'packageId packageName price numberOfClasses classType category');
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }
    res.json(sale);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

// @desc    Create a new sale
// @route   POST /api/sales
// this function creates a new sale with the provided details, validates the input, updates the customer's class balance based on the package purchased, and returns the created sale along with a confirmation message. It also handles validation and server errors.
export const createSale = async (req: Request, res: Response) => {
  try {
    const { customer, package: packageId, paymentMethod, amount, validityStart, validityEnd } =
      req.body;

    if (!customer) {
      return res.status(400).json({ message: 'Customer is required' });
    }
    if (!packageId) {
      return res.status(400).json({ message: 'Package is required' });
    }
    if (!paymentMethod) {
      return res.status(400).json({ message: 'Payment method is required' });
    }
    if (!VALID_PAYMENT_METHODS.includes(paymentMethod)) {
      return res.status(400).json({ message: 'Payment method must be cash, credit, or check' });
    }
    if (amount == null || amount === '') {
      return res.status(400).json({ message: 'Amount is required' });
    }
    if (!validityStart) {
      return res.status(400).json({ message: 'Validity start date is required' });
    }
    if (!validityEnd) {
      return res.status(400).json({ message: 'Validity end date is required' });
    }

    // Validate that validity end date is after start date
    const vStart = new Date(validityStart);
    const vEnd = new Date(validityEnd);

    // Check if validity end date is after start date
    if (vEnd <= vStart) {
      return res
        .status(400)
        .json({ message: 'Validity end date must be after validity start date' });
    }

    // Validate that customer and package exist
    const customerDoc = await Customer.findById(customer);
    if (!customerDoc) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Validate that package exists
    const packageDoc = await Package.findById(packageId);
    if (!packageDoc) {
      return res.status(404).json({ message: 'Package not found' });
    }

    // Validate that amount matches package price
    const numericAmount = Number(amount);
    if (numericAmount !== packageDoc.price) {
      return res
        .status(400)
        .json({ message: `Amount must match the package rate of $${packageDoc.price}` });
    }

    // Validate that validity period falls within package start and end dates
    const pkgStart = new Date(packageDoc.startDate);
    pkgStart.setHours(0, 0, 0, 0);
    const pkgEnd = new Date(packageDoc.endDate);
    pkgEnd.setHours(23, 59, 59, 999);

    // Validate that validity start date is today or later, and falls within package dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    vStart.setHours(0, 0, 0, 0);
    vEnd.setHours(0, 0, 0, 0);

    // Check that validity start date is not in the past and falls within package dates
    if (vStart < today) {
      return res.status(400).json({ message: 'Validity start date must be today or later' });
    }
    if (vStart < pkgStart) {
      return res
        .status(400)
        .json({ message: 'Validity start date cannot be before the package start date' });
    }
    if (vEnd > pkgEnd) {
      return res
        .status(400)
        .json({ message: 'Validity end date cannot be after the package end date' });
    }

    // Calculate classes awarded based on package details
    const classesAwarded =
      packageDoc.numberOfClasses === 'unlimited' ? 9999 : (packageDoc.numberOfClasses as number);

    // Create the sale
    const sale = new Sale({
      customer,
      package: packageId,
      paymentDate: new Date(),
      amount: numericAmount,
      paymentMethod,
      validityStart: vStart,
      validityEnd: vEnd,
      classesAwarded,
    });

    // Save the sale and update the customer's class balance
    const saved = await sale.save();

    // Update customer's class balance
    customerDoc.classBalance += classesAwarded;
    await customerDoc.save();

    // Populate the saved sale with customer and package details for the response
    await saved.populate('customer', 'customerId firstName lastName fullName classBalance');
    await saved.populate('package', 'packageId packageName price numberOfClasses classType');

    // Prepare confirmation message with updated class balance
    const updatedCustomer = await Customer.findById(customer);
    const balanceDisplay =
      classesAwarded === 9999 ? 'Unlimited' : String(updatedCustomer?.classBalance ?? 0);

    const confirmationMessage = `Sale recorded! ${customerDoc.firstName} ${customerDoc.lastName} purchased the ${packageDoc.packageName} package. New class balance: ${balanceDisplay}.`;

    res.status(201).json({ sale: saved, confirmationMessage, customer: updatedCustomer });
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e: any) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete a sale (reverts customer classBalance)
// @route   DELETE /api/sales/:id
// this function deletes a sale by ID, first reverting the customer's class balance based on the classes awarded in the sale, and then removing the sale from the database. It returns a confirmation message or appropriate error messages if the sale is not found or if there is a server error.
export const deleteSale = async (req: Request, res: Response) => {
  try {
    const sale = await Sale.findById(req.params.id);
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }

    const customerDoc = await Customer.findById(sale.customer);
    if (customerDoc) {
      const deduct = Math.min(sale.classesAwarded, customerDoc.classBalance);
      customerDoc.classBalance = Math.max(0, customerDoc.classBalance - deduct);
      await customerDoc.save();
    }

    await Sale.findByIdAndDelete(req.params.id);
    res.json({ message: 'Sale deleted and class balance updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};
