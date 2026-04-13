import { Request, Response } from 'express';
import Instructor from '../models/Instructor';

// @desc    Get all instructors
// @route   GET /api/instructors
export const getInstructors = async (_req: Request, res: Response) => {
  try {
    const instructors = await Instructor.find().sort({
      lastName: 1,
      firstName: 1,
    });
    res.json(instructors);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

// @desc    Get a single instructor by ID
// @route   GET /api/instructors/:id
export const getInstructorById = async (req: Request, res: Response) => {
  try {
    const instructor = await Instructor.findById(req.params.id);
    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }
    res.json(instructor);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

// @desc    Check if an instructor name already exists
// @route   POST /api/instructors/check-name
export const checkInstructorName = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName } = req.body;
    const existing = await Instructor.find({
      firstName: { $regex: new RegExp(`^${firstName}$`, 'i') },
      lastName: { $regex: new RegExp(`^${lastName}$`, 'i') },
    });

    res.json({
      exists: existing.length > 0,
      count: existing.length,
      matches: existing.map((i) => ({
        instructorId: i._id,
        fullName: i.fullName,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

// @desc    Create a new instructor
// @route   POST /api/instructors
export const createInstructor = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, address, phone, email, preferredCommunication } =
      req.body;

    if (!firstName || !lastName) {
      return res
        .status(400)
        .json({ message: 'First name and last name are required' });
    }

    const instructor = new Instructor({
      firstName,
      lastName,
      address,
      phone,
      email,
      preferredCommunication,
    });

    const saved = await instructor.save();

    const confirmationMessage = `Welcome to Yoga'Hom! ... Your instructor id is ${saved._id}.`; // Specifically mentioned in reqs

    res.status(201).json({
      instructor: saved,
      confirmationMessage,
    });
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(
        (e: any) => e.message
      );
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update an instructor
// @route   PUT /api/instructors/:id
export const updateInstructor = async (req: Request, res: Response) => {
  try {
    const instructor = await Instructor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }
    res.json(instructor);
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(
        (e: any) => e.message
      );
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete an instructor
// @route   DELETE /api/instructors/:id
export const deleteInstructor = async (req: Request, res: Response) => {
  try {
    const instructor = await Instructor.findByIdAndDelete(req.params.id);
    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }
    res.json({ message: 'Instructor removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};