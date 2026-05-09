import { Request, Response } from 'express';
import Customer from '../models/Customer';

// @desc    Get all customers
// @route   GET /api/customers
// this function retrieves all customers from the database and returns them as JSON, sorted by last name and first name. It also handles server errors.
export const getCustomers = async (_req: Request, res: Response) => {
  try {
    const customers = await Customer.find().sort({ lastName: 1, firstName: 1 });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

// @desc    Get a single customer by ID
// @route   GET /api/customers/:id
// this function retrieves a customer by its ID and returns it, or returns a 404 error if the customer is not found. It also handles server errors.
export const getCustomerById = async (req: Request, res: Response) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

// @desc    Check if a customer name already exists
// @route   POST /api/customers/check-name
// this function checks if a customer with the given first and last name already exists in the database, and returns a response indicating whether it exists, how many matches there are, and the matching customer IDs and full names. It also handles server errors.
export const checkCustomerName = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName } = req.body;
    const existing = await Customer.find({
      firstName: { $regex: new RegExp(`^${firstName}$`, 'i') },
      lastName: { $regex: new RegExp(`^${lastName}$`, 'i') },
    });

    res.json({
      exists: existing.length > 0,
      count: existing.length,
      matches: existing.map((c) => ({
        customerId: c.customerId,
        fullName: c.fullName,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

// @desc    Create a new customer
// @route   POST /api/customers
// this function creates a new customer with the provided details, validates the input, and returns the created customer along with a confirmation message. It also handles validation and server errors.
export const createCustomer = async (req: Request, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      address,
      phone,
      email,
      preferredCommunication,
    } = req.body;

    if (!firstName || !lastName) {
      return res
        .status(400)
        .json({ message: 'First name and last name are required' });
    }

    const customer = new Customer({
      firstName,
      lastName,
      address,
      phone,
      email,
      preferredCommunication,
      classBalance: 0,
    });

    const saved = await customer.save();

    const confirmationMessage = `Welcome to Yoga'Hom! ... Your customer id is ${saved.customerId}.`;

    res.status(201).json({
      customer: saved,
      confirmationMessage,
    });
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e: any) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update a customer
// @route   PUT /api/customers/:id
// this function updates a customer with the provided details, validates the input, and returns the updated customer. It also handles validation and server errors.
export const updateCustomer = async (req: Request, res: Response) => {
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(customer);
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e: any) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete a customer
// @route   DELETE /api/customers/:id
// this function deletes a customer by ID and returns a confirmation message, or returns a 404 error if the customer is not found. It also handles server errors.
export const deleteCustomer = async (req: Request, res: Response) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json({ message: 'Customer removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};
