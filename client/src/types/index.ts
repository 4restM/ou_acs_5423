export interface IAddress {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
}

export interface IInstructor {
  _id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  address?: IAddress;
  phone?: string;
  email?: string;
  preferredCommunication: 'phone' | 'email';
  createdAt: string;
  updatedAt: string;
}

export interface InstructorFormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  preferredCommunication: 'phone' | 'email';
  address: IAddress;
}

export interface NameCheckResponse {
  exists: boolean;
  count: number;
  matches: { instructorId: string; fullName: string }[];
}

export type DayOfWeek =
  | 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday'
  | 'Thursday' | 'Friday' | 'Saturday';

export type ClassType = 'General' | 'Special';

export interface IClass {
  _id: string;
  instructor: {
    _id: string;
    firstName: string;
    lastName: string;
  } | string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  classType: ClassType;
  className: string;
  payRate: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ClassFormData {
  instructor: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  classType: ClassType;
  className: string;
  payRate: number;
}

export interface ITimeSlot {
  start: string;
  end: string;
}

export interface ConflictCheckResponse {
  hasConflict: boolean;
  conflicts: IClass[];
  availableSlots: ITimeSlot[];
  message?: string;
}

export interface AlertMessage {
  type: 'success' | 'danger' | 'warning' | 'info';
  text: string;
}