import type {
  IInstructor,
  InstructorFormData,
  NameCheckResponse,
  IClass,
  ClassFormData,
  ConflictCheckResponse,
  ITimeSlot,
  IPackage,
  PackageFormData,
  ICustomer,
  CustomerFormData,
  CustomerNameCheckResponse,
  ISale,
  SaleFormData,
} from '../types';

const BASE = '/api';

// this is a helper function to make API requests. It handles JSON parsing and error handling in a consistent way.
async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Request failed' }));
    throw { status: res.status, ...error };
  }

  return res.json();
}

// ============ Instructors ============

// get all instructors
export const getInstructors = () => request<IInstructor[]>('/instructors');

// get a single instructor by ID
export const getInstructorById = (id: string) =>
  request<IInstructor>(`/instructors/${id}`);

// check if an instructor name is already taken
export const checkInstructorName = (firstName: string, lastName: string) =>
  request<NameCheckResponse>('/instructors/check-name', {
    method: 'POST',
    body: JSON.stringify({ firstName, lastName }),
  });

// create a new instructor
export const createInstructor = (data: InstructorFormData) =>
  request<{ instructor: IInstructor; confirmationMessage: string }>(
    '/instructors',
    { method: 'POST', body: JSON.stringify(data) },
  );

// update an existing instructor
export const updateInstructor = (
  id: string,
  data: Partial<InstructorFormData>,
) =>
  request<IInstructor>(`/instructors/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

// delete an instructor
export const deleteInstructor = (id: string) =>
  request<{ message: string }>(`/instructors/${id}`, { method: 'DELETE' });

// ============ Classes ============

// get all classes with optional query parameters for filtering
export const getClasses = (params?: Record<string, string>) => {
  const query = params ? '?' + new URLSearchParams(params).toString() : '';
  return request<IClass[]>(`/classes${query}`);
};

// get a single class by ID
export const getClassById = (id: string) => request<IClass>(`/classes/${id}`);

// check for scheduling conflicts when creating or updating a class
export const checkClassConflicts = (data: {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  excludeId?: string;
}) =>
  request<ConflictCheckResponse>('/classes/check-conflicts', {
    method: 'POST',
    body: JSON.stringify(data),
  });

// get available time slots for a given day to help with scheduling classes
export const getAvailableSlots = (day: string) =>
  request<ITimeSlot[]>(`/classes/available-slots/${day}`);

// create a new class
export const createClass = (data: ClassFormData) =>
  request<{ class: IClass; message: string }>('/classes', {
    method: 'POST',
    body: JSON.stringify(data),
  });

// update an existing class
export const updateClass = (id: string, data: Partial<ClassFormData>) =>
  request<IClass>(`/classes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

// toggle the published status of a class
export const toggleClassPublish = (id: string) =>
  request<{ class: IClass; message: string }>(`/classes/${id}/publish`, {
    method: 'PATCH',
  });

// delete a class
export const deleteClass = (id: string) =>
  request<{ message: string }>(`/classes/${id}`, { method: 'DELETE' });

// ============ Packages ============

// get all packages
export const getPackages = () => request<IPackage[]>('/packages');

// get a single package by ID
export const getPackageById = (id: string) =>
  request<IPackage>(`/packages/${id}`);

// create a new package
export const createPackage = (data: PackageFormData) =>
  request<{ package: IPackage; confirmationMessage: string }>('/packages', {
    method: 'POST',
    body: JSON.stringify(data),
  });

// update an existing package
export const updatePackage = (id: string, data: Partial<PackageFormData>) =>
  request<IPackage>(`/packages/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

// delete a package
export const deletePackage = (id: string) =>
  request<{ message: string }>(`/packages/${id}`, { method: 'DELETE' });

// ============ Customers ============

// get all customers
export const getCustomers = () => request<ICustomer[]>('/customers');

// get a single customer by ID
export const getCustomerById = (id: string) =>
  request<ICustomer>(`/customers/${id}`);

// check if a customer name is already taken
export const checkCustomerName = (firstName: string, lastName: string) =>
  request<CustomerNameCheckResponse>('/customers/check-name', {
    method: 'POST',
    body: JSON.stringify({ firstName, lastName }),
  });

// create a new customer
export const createCustomer = (data: CustomerFormData) =>
  request<{ customer: ICustomer; confirmationMessage: string }>('/customers', {
    method: 'POST',
    body: JSON.stringify(data),
  });

// update an existing customer
export const updateCustomer = (id: string, data: Partial<CustomerFormData>) =>
  request<ICustomer>(`/customers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

// delete a customer
export const deleteCustomer = (id: string) =>
  request<{ message: string }>(`/customers/${id}`, { method: 'DELETE' });

// ============ Sales ============

// get all sales
export const getSales = () => request<ISale[]>('/sales');

// get a single sale by ID
export const getSaleById = (id: string) => request<ISale>(`/sales/${id}`);

// create a new sale
export const createSale = (data: SaleFormData) =>
  request<{ sale: ISale; confirmationMessage: string; customer: ICustomer }>('/sales', {
    method: 'POST',
    body: JSON.stringify(data),
  });

// delete a sale
export const deleteSale = (id: string) =>
  request<{ message: string }>(`/sales/${id}`, { method: 'DELETE' });
