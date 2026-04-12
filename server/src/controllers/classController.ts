import { Request, Response } from 'express';
import YogaClass from '../models/Class';
import { DayOfWeek } from '../types';

export const getClasses = async (req: Request, res: Response) => {
  try {
    const { dayOfWeek, instructor, published } = req.query;
    const filter: Record<string, unknown> = {};

    if (dayOfWeek) filter.dayOfWeek = dayOfWeek;
    if (instructor) filter.instructor = instructor;
    if (published !== undefined) filter.isPublished = published === 'true';

    const classes = await YogaClass.find(filter)
      .populate('instructor', 'firstName lastName instructorId')
      .sort({ dayOfWeek: 1, startTime: 1 });

    const dayOrder: DayOfWeek[] = [
      'Sunday', 'Monday', 'Tuesday', 'Wednesday',
      'Thursday', 'Friday', 'Saturday',
    ];
    classes.sort(
      (a, b) =>
        dayOrder.indexOf(a.dayOfWeek) - dayOrder.indexOf(b.dayOfWeek) ||
        a.startTime.localeCompare(b.startTime)
    );

    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

export const getClassById = async (req: Request, res: Response) => {
  try {
    const yogaClass = await YogaClass.findById(req.params.id).populate(
      'instructor',
      'firstName lastName instructorId'
    );
    if (!yogaClass) {
      return res.status(404).json({ message: 'Class not found' });
    }
    res.json(yogaClass);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

export const checkConflicts = async (req: Request, res: Response) => {
  try {
    const { dayOfWeek, startTime, endTime, excludeId } = req.body;

    if (!dayOfWeek || !startTime || !endTime) {
      return res
        .status(400)
        .json({ message: 'dayOfWeek, startTime, and endTime are required' });
    }

    const conflicts = await YogaClass.findConflicts(
      dayOfWeek,
      startTime,
      endTime,
      excludeId
    );

    let availableSlots: { start: string; end: string }[] = [];
    if (conflicts.length > 0) {
      availableSlots = await YogaClass.findAvailableSlots(dayOfWeek);
    }

    res.json({ hasConflict: conflicts.length > 0, conflicts, availableSlots });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

export const getAvailableSlots = async (req: Request, res: Response) => {
  try {
    const slots = await YogaClass.findAvailableSlots(
      req.params.day as DayOfWeek
    );
    res.json(slots);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

export const createClass = async (req: Request, res: Response) => {
  try {
    const {
      instructor,
      dayOfWeek,
      startTime,
      endTime,
      classType,
      className,
      payRate,
    } = req.body;

    if (!instructor || !dayOfWeek || !startTime || !endTime || payRate == null) {
      return res.status(400).json({
        message:
          'instructor, dayOfWeek, startTime, endTime, and payRate are required',
      });
    }

    // Check for conflicts
    const conflicts = await YogaClass.findConflicts(
      dayOfWeek,
      startTime,
      endTime
    );
    if (conflicts.length > 0) {
      const availableSlots = await YogaClass.findAvailableSlots(dayOfWeek);
      return res.status(409).json({
        message: 'Schedule conflict detected',
        conflicts,
        availableSlots,
      });
    }

    const yogaClass = new YogaClass({
      instructor,
      dayOfWeek,
      startTime,
      endTime,
      classType: classType || 'General',
      className: className || 'All Levels',
      payRate,
    });

    const saved = await yogaClass.save();
    const populated = await saved.populate(
      'instructor',
      'firstName lastName instructorId'
    );

    res.status(201).json({
      class: populated,
      message: `Class successfully scheduled for ${dayOfWeek} ${startTime}-${endTime}`,
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

export const updateClass = async (req: Request, res: Response) => {
  try {
    const { dayOfWeek, startTime, endTime } = req.body;

    if (dayOfWeek || startTime || endTime) {
      const existing = await YogaClass.findById(req.params.id);
      if (!existing) {
        return res.status(404).json({ message: 'Class not found' });
      }

      const checkDay = (dayOfWeek || existing.dayOfWeek) as DayOfWeek;
      const checkStart = startTime || existing.startTime;
      const checkEnd = endTime || existing.endTime;

      const conflicts = await YogaClass.findConflicts(
        checkDay,
        checkStart,
        checkEnd,
        req.params.id as string      
    );
      if (conflicts.length > 0) {
        const availableSlots =
          await YogaClass.findAvailableSlots(checkDay);
        return res.status(409).json({
          message: 'Schedule conflict detected',
          conflicts,
          availableSlots,
        });
      }
    }

    const yogaClass = await YogaClass.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('instructor', 'firstName lastName instructorId');

    if (!yogaClass) {
      return res.status(404).json({ message: 'Class not found' });
    }
    res.json(yogaClass);
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

export const togglePublish = async (req: Request, res: Response) => {
  try {
    const yogaClass = await YogaClass.findById(req.params.id);
    if (!yogaClass) {
      return res.status(404).json({ message: 'Class not found' });
    }

    yogaClass.isPublished = !yogaClass.isPublished;
    await yogaClass.save();
    await yogaClass.populate('instructor', 'firstName lastName instructorId');

    res.json({
      class: yogaClass,
      message: yogaClass.isPublished
        ? 'Class has been published'
        : 'Class has been unpublished',
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

export const deleteClass = async (req: Request, res: Response) => {
  try {
    const yogaClass = await YogaClass.findByIdAndDelete(req.params.id);
    if (!yogaClass) {
      return res.status(404).json({ message: 'Class not found' });
    }
    res.json({ message: 'Class removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};
