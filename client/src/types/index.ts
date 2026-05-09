export interface IAddress {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
}

export interface IInstructor {
  _id: string;
  instructorId: string;
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

// ============ Customer ============
export interface ICustomer {
  _id: string;
  customerId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  address?: IAddress;
  phone?: string;
  email?: string;
  preferredCommunication: 'phone' | 'email';
  classBalance: number;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerFormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  preferredCommunication: 'phone' | 'email';
  address: IAddress;
}

export interface CustomerNameCheckResponse {
  exists: boolean;
  count: number;
  matches: { customerId: string; fullName: string }[];
}

export interface AlertMessage {
  type: 'success' | 'danger' | 'warning' | 'info';
  text: string;
}

// ============ Package ============
export type PackageCategory = 'General' | 'Senior';
export type PackageClassType = 'General' | 'Special';
export type NumberOfClasses = 1 | 4 | 10 | 'unlimited';

export interface IPackage {
  _id: string;
  packageId: string;
  packageName: string;
  category: PackageCategory;
  numberOfClasses: NumberOfClasses;
  classType: PackageClassType;
  startDate: string;
  endDate: string;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface PackageFormData {
  packageName: string;
  category: PackageCategory;
  numberOfClasses: NumberOfClasses;
  classType: PackageClassType;
  startDate: string;
  endDate: string;
  price: number;
}

// ============ Sale ============
export type PaymentMethod = 'cash' | 'credit' | 'check';

export interface ISale {
  _id: string;
  saleId: string;
  customer: {
    _id: string;
    customerId: string;
    firstName: string;
    lastName: string;
    fullName: string;
    classBalance: number;
  };
  package: {
    _id: string;
    packageId: string;
    packageName: string;
    price: number;
    numberOfClasses: NumberOfClasses;
    classType: PackageClassType;
    category: PackageCategory;
  };
  paymentDate: string;
  amount: number;
  paymentMethod: PaymentMethod;
  validityStart: string;
  validityEnd: string;
  classesAwarded: number;
  createdAt: string;
  updatedAt: string;
}

export interface SaleFormData {
  customer: string;
  package: string;
  amount: number;
  paymentMethod: PaymentMethod | '';
  validityStart: string;
  validityEnd: string;
}