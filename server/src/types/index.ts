import { Document, Types } from 'mongoose';

// ============ Address ============
// this interface defines the structure of an address, used in both instructors and customers
export interface IAddress {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
}

// ============ Instructor ============
// this interface defines the structure of an instructor, including personal details and contact information
export interface IInstructor {
  instructorId?: string;
  firstName: string;
  lastName: string;
  address?: IAddress;
  phone?: string;
  email?: string;
  preferredCommunication: 'phone' | 'email';
}

// this interface extends the IInstructor interface and includes additional fields for full name and timestamps, used for MongoDB documents
export interface IInstructorDocument extends IInstructor, Document {
  fullName: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============ Class ============
// this interface defines the structure of a class, including scheduling details and instructor reference
export type DayOfWeek =
  | 'Sunday'
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday';

// this type defines the class type, which can be either General or Special
export type ClassType = 'General' | 'Special';

// this interface defines the structure of a class, including scheduling details and instructor reference
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

// this interface extends the IClass interface and includes additional fields for timestamps, used for MongoDB documents
export interface IClassDocument extends IClass, Document {
  createdAt: Date;
  updatedAt: Date;
}

// this interface defines a time slot with start and end times, used for checking class scheduling conflicts
export interface ITimeSlot {
  start: string;
  end: string;
}

// ============ Package ============
// this type defines the package, which can be either General or Senior category, and General or Special class type 
// with specific number of classes allowed
export type PackageCategory = 'General' | 'Senior';
export type PackageClassType = 'General' | 'Special';
export type NumberOfClasses = 1 | 4 | 10 | 'unlimited';

// this interface defines the structure of a package, including details about the package and its validity period
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

// this interface extends the IPackage interface and includes additional fields for timestamps, used for MongoDB documents
export interface IPackageDocument extends IPackage, Document {
  createdAt: Date;
  updatedAt: Date;
}

// ============ Customer ============
// this interface defines the structure of a customer, including personal details, contact information, preferred communication method, and class balance
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

// this interface extends the ICustomer interface and includes additional fields for full name and timestamps, used for MongoDB documents
export interface ICustomerDocument extends ICustomer, Document {
  fullName: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============ Sale ============
// this type defines the payment method for a sale, which can be cash, credit, or check
export type PaymentMethod = 'cash' | 'credit' | 'check';

// this interface defines the structure of a sale, including details about the customer, package, payment, and validity period of the sale
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

// this interface extends the ISale interface and includes additional fields for timestamps, used for MongoDB documents
export interface ISaleDocument extends ISale, Document {
  createdAt: Date;
  updatedAt: Date;
}

// ============ API Response Types ============
// this interface defines the structure of the response when checking if a customer name is already taken, including whether it exists, the count of matches, and any matching instructor details
export interface NameCheckResponse {
  exists: boolean;
  count: number;
  matches: { instructorId: string; fullName: string }[];
}

// this interface defines the structure of the response when checking for scheduling conflicts, including whether there are conflicts, the conflicting classes, and available time slots
export interface ConflictCheckResponse {
  hasConflict: boolean;
  conflicts: IClassDocument[];
  availableSlots: ITimeSlot[];
}