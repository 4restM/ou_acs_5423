// interface for address, used in both instructors and customers
export interface IAddress {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
}

// interface for instructor
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

// form data for creating/updating an instructor
export interface InstructorFormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  preferredCommunication: 'phone' | 'email';
  address: IAddress;
}

// response for checking if an instructor name is already taken
export interface NameCheckResponse {
  exists: boolean;
  count: number;
  matches: { instructorId: string; fullName: string }[];
}

// day of week type for class scheduling
export type DayOfWeek =
  | 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday'
  | 'Thursday' | 'Friday' | 'Saturday';

// class type for general or special classes
export type ClassType = 'General' | 'Special';

// interface for class
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

// form data for creating/updating a class
export interface ClassFormData {
  instructor: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  classType: ClassType;
  className: string;
  payRate: number;
}

// interface for time slot, used in class scheduling conflict checks
export interface ITimeSlot {
  start: string;
  end: string;
}

// response for checking class scheduling conflicts
export interface ConflictCheckResponse {
  hasConflict: boolean;
  conflicts: IClass[];
  availableSlots: ITimeSlot[];
  message?: string;
}

// ============ Customer ============
// interface for customer, includes class balance and preferred communication method
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

// form data for creating/updating a customer
export interface CustomerFormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  preferredCommunication: 'phone' | 'email';
  address: IAddress;
}

// response for checking if a customer name is already taken
export interface CustomerNameCheckResponse {
  exists: boolean;
  count: number;
  matches: { customerId: string; fullName: string }[];
}

//alert message interface
export interface AlertMessage {
  type: 'success' | 'danger' | 'warning' | 'info';
  text: string;
}

// ============ Package ============
// package category type for general / senior categories and class type for general / special classes, 
// as well as number of classes which can be 1, 4, 10 or unlimited.
export type PackageCategory = 'General' | 'Senior';
export type PackageClassType = 'General' | 'Special';
export type NumberOfClasses = 1 | 4 | 10 | 'unlimited';

// interface for package, includes details about the package and its validity period
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

// form data for creating/updating a package
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
// payment method type for sales transactions
export type PaymentMethod = 'cash' | 'credit' | 'check';

// interface for sale, includes details about the customer, package, payment, and validity period of the sale
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

// form data for creating a sale, includes customer, package, payment details, and validity period
export interface SaleFormData {
  customer: string;
  package: string;
  amount: number;
  paymentMethod: PaymentMethod | '';
  validityStart: string;
  validityEnd: string;
}