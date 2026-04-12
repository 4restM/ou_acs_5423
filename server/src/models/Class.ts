import mongoose, { Schema, Model, Types } from 'mongoose';
import { IClassDocument, ITimeSlot, DayOfWeek } from '../types';

interface IClassModel extends Model<IClassDocument> {
  findConflicts(
    dayOfWeek: DayOfWeek,
    startTime: string,
    endTime: string,
    excludeId?: string | Types.ObjectId | null
  ): Promise<IClassDocument[]>;
  findAvailableSlots(dayOfWeek: DayOfWeek): Promise<ITimeSlot[]>;
}

const classSchema = new Schema<IClassDocument>(
  {
    instructor: {
      type: Schema.Types.ObjectId,
      ref: 'Instructor',
      required: [true, 'Instructor is required'],
    },
    dayOfWeek: {
      type: String,
      required: [true, 'Day of week is required'],
      enum: [
        'Sunday', 'Monday', 'Tuesday', 'Wednesday',
        'Thursday', 'Friday', 'Saturday',
      ],
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required'],
    },
    endTime: {
      type: String,
      required: [true, 'End time is required'],
    },
    classType: {
      type: String,
      required: [true, 'Class type is required'],
      enum: ['General', 'Special'],
      default: 'General',
    },
    className: {
      type: String,
      trim: true,
      default: 'All Levels',
    },
    payRate: {
      type: Number,
      required: [true, 'Pay rate is required'],
      min: [0, 'Pay rate cannot be negative'],
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

classSchema.index({ dayOfWeek: 1, startTime: 1 });

classSchema.statics.findConflicts = async function (
  dayOfWeek: DayOfWeek,
  startTime: string,
  endTime: string,
  excludeId: string | Types.ObjectId | null = null
): Promise<IClassDocument[]> {
  const query: Record<string, unknown> = {
    dayOfWeek,
    startTime: { $lt: endTime },
    endTime: { $gt: startTime },
  };
  if (excludeId) {
    query._id = { $ne: excludeId };
  }
  return this.find(query).populate(
    'instructor',
    'firstName lastName instructorId'
  );
};

classSchema.statics.findAvailableSlots = async function (
  dayOfWeek: DayOfWeek
): Promise<ITimeSlot[]> {
  const existing: IClassDocument[] = await this.find({ dayOfWeek }).sort({
    startTime: 1,
  });

  const possibleSlots: ITimeSlot[] = [
    { start: '06:00', end: '07:15' },
    { start: '07:30', end: '08:45' },
    { start: '09:00', end: '10:15' },
    { start: '10:30', end: '11:45' },
    { start: '12:00', end: '13:00' },
    { start: '14:00', end: '15:15' },
    { start: '16:00', end: '17:15' },
    { start: '16:45', end: '18:00' },
    { start: '18:15', end: '19:15' },
  ];

  return possibleSlots.filter(
    (slot) =>
      !existing.some(
        (cls) => cls.startTime < slot.end && cls.endTime > slot.start
      )
  );
};

const YogaClass = mongoose.model<IClassDocument, IClassModel>(
  'Class',
  classSchema
);

export default YogaClass;
