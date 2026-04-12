import { Document, Types } from 'mongoose';

// ============ Address ============
export interface IAddress {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
}

// ============ Instructor ============
export interface IInstructor {
  instructorId?: string;
  firstName: string;
  lastName: string;
  address?: IAddress;
  phone?: string;
  email?: string;
  preferredCommunication: 'phone' | 'email';
}

export interface IInstructorDocument extends IInstructor, Document {
  fullName: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============ Class ============
export type DayOfWeek =
  | 'Sunday'
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday';

export type ClassType = 'General' | 'Special';

export interface IClass {
  instructor: Types.ObjectId;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  classType: ClassType;
  className: string;
  payRate: number;
  isPublished: boolean;
}

export interface IClassDocument extends IClass, Document {
  createdAt: Date;
  updatedAt: Date;
}

export interface ITimeSlot {
  start: string;
  end: string;
}

// ============ API Response Types ============
export interface NameCheckResponse {
  exists: boolean;
  count: number;
  matches: { instructorId: string; fullName: string }[];
}

export interface ConflictCheckResponse {
  hasConflict: boolean;
  conflicts: IClassDocument[];
  availableSlots: ITimeSlot[];
}