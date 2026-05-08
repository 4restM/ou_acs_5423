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

// ============ Package ============
export type PackageCategory = 'General' | 'Senior';
export type PackageClassType = 'General' | 'Special';
export type NumberOfClasses = 1 | 4 | 10 | 'unlimited';

export interface IPackage {
  packageId?: string;
  packageName: string;
  category: PackageCategory;
  numberOfClasses: NumberOfClasses;
  classType: PackageClassType;
  startDate: Date;
  endDate: Date;
  price: number;
}

export interface IPackageDocument extends IPackage, Document {
  createdAt: Date;
  updatedAt: Date;
}

// ============ Customer ============
export interface ICustomer {
  customerId?: string;
  firstName: string;
  lastName: string;
  address?: IAddress;
  phone?: string;
  email?: string;
  preferredCommunication: 'phone' | 'email';
  classBalance: number;
}

export interface ICustomerDocument extends ICustomer, Document {
  fullName: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============ Sale ============
export type PaymentMethod = 'cash' | 'credit' | 'check';

export interface ISale {
  saleId?: string;
  customer: Types.ObjectId;
  package: Types.ObjectId;
  paymentDate: Date;
  amount: number;
  paymentMethod: PaymentMethod;
  validityStart: Date;
  validityEnd: Date;
  classesAwarded: number;
}

export interface ISaleDocument extends ISale, Document {
  createdAt: Date;
  updatedAt: Date;
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