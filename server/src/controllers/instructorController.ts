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

    // Generate instructor ID
    // Bad approach for production but fine for spike, TODO refactor.
    const count = await Instructor.countDocuments();
    const instructorId = `I${String(count + 1).padStart(5, '0')}`;

    const instructor = new Instructor({
      instructorId,
      firstName,
      lastName,
      address,
      phone,
      email,
      preferredCommunication,
    });

    const saved = await instructor.save();

    const confirmationMessage = `Instructor created with ID: ${saved.instructorId} and name: ${saved.fullName}`;

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