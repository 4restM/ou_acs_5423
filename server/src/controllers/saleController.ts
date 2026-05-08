import { Request, Response } from 'express';
import Sale from '../models/Sale';
import Customer from '../models/Customer';
import Package from '../models/Package';

const VALID_PAYMENT_METHODS = ['cash', 'credit', 'check'];

// @desc    Get all sales
// @route   GET /api/sales
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

    const vStart = new Date(validityStart);
    const vEnd = new Date(validityEnd);

    if (vEnd <= vStart) {
      return res
        .status(400)
        .json({ message: 'Validity end date must be after validity start date' });
    }

    const customerDoc = await Customer.findById(customer);
    if (!customerDoc) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const packageDoc = await Package.findById(packageId);
    if (!packageDoc) {
      return res.status(404).json({ message: 'Package not found' });
    }

    const numericAmount = Number(amount);
    if (numericAmount !== packageDoc.price) {
      return res
        .status(400)
        .json({ message: `Amount must match the package rate of $${packageDoc.price}` });
    }

    const pkgStart = new Date(packageDoc.startDate);
    pkgStart.setHours(0, 0, 0, 0);
    const pkgEnd = new Date(packageDoc.endDate);
    pkgEnd.setHours(23, 59, 59, 999);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    vStart.setHours(0, 0, 0, 0);
    vEnd.setHours(0, 0, 0, 0);

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

    const classesAwarded =
      packageDoc.numberOfClasses === 'unlimited' ? 9999 : (packageDoc.numberOfClasses as number);

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

    const saved = await sale.save();

    customerDoc.classBalance += classesAwarded;
    await customerDoc.save();

    await saved.populate('customer', 'customerId firstName lastName fullName classBalance');
    await saved.populate('package', 'packageId packageName price numberOfClasses classType');

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
