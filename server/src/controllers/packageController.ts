import { Request, Response } from 'express';
import Package from '../models/Package';

// @desc    Get all packages
// @route   GET /api/packages
export const getPackages = async (_req: Request, res: Response) => {
  try {
    const packages = await Package.find().sort({ packageId: 1 });
    res.json(packages);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

// @desc    Get a single package by ID
// @route   GET /api/packages/:id
export const getPackageById = async (req: Request, res: Response) => {
  try {
    const pkg = await Package.findById(req.params.id);
    if (!pkg) {
      return res.status(404).json({ message: 'Package not found' });
    }
    res.json(pkg);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

// @desc    Create a new package
// @route   POST /api/packages
export const createPackage = async (req: Request, res: Response) => {
  try {
    const { packageName, category, numberOfClasses, classType, startDate, endDate, price } =
      req.body;

    if (!packageName || !category || numberOfClasses === undefined || !classType || !startDate || !endDate || price === undefined) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const pkg = new Package({
      packageName,
      category,
      numberOfClasses,
      classType,
      startDate,
      endDate,
      price,
    });

    const saved = await pkg.save();

    res.status(201).json({
      package: saved,
      confirmationMessage: `Package "${saved.packageName}" has been added. Package ID: ${saved.packageId}.`,
    });
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e: any) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update a package
// @route   PUT /api/packages/:id
export const updatePackage = async (req: Request, res: Response) => {
  try {
    const pkg = await Package.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!pkg) {
      return res.status(404).json({ message: 'Package not found' });
    }
    res.json(pkg);
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e: any) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete a package
// @route   DELETE /api/packages/:id
export const deletePackage = async (req: Request, res: Response) => {
  try {
    const pkg = await Package.findByIdAndDelete(req.params.id);
    if (!pkg) {
      return res.status(404).json({ message: 'Package not found' });
    }
    res.json({ message: 'Package removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};
