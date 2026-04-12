import type {
  IInstructor,
  InstructorFormData,
  NameCheckResponse,
  IClass,
  ClassFormData,
  ConflictCheckResponse,
  ITimeSlot,
} from '../types';

const BASE = '/api';

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

export const getInstructors = () => request<IInstructor[]>('/instructors');

export const getInstructorById = (id: string) =>
  request<IInstructor>(`/instructors/${id}`);

export const checkInstructorName = (firstName: string, lastName: string) =>
  request<NameCheckResponse>('/instructors/check-name', {
    method: 'POST',
    body: JSON.stringify({ firstName, lastName }),
  });

export const createInstructor = (data: InstructorFormData) =>
  request<{ instructor: IInstructor; confirmationMessage: string }>(
    '/instructors',
    { method: 'POST', body: JSON.stringify(data) },
  );

export const updateInstructor = (
  id: string,
  data: Partial<InstructorFormData>,
) =>
  request<IInstructor>(`/instructors/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const deleteInstructor = (id: string) =>
  request<{ message: string }>(`/instructors/${id}`, { method: 'DELETE' });

// ============ Classes ============

export const getClasses = (params?: Record<string, string>) => {
  const query = params ? '?' + new URLSearchParams(params).toString() : '';
  return request<IClass[]>(`/classes${query}`);
};

export const getClassById = (id: string) => request<IClass>(`/classes/${id}`);

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

export const getAvailableSlots = (day: string) =>
  request<ITimeSlot[]>(`/classes/available-slots/${day}`);

export const createClass = (data: ClassFormData) =>
  request<{ class: IClass; message: string }>('/classes', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const updateClass = (id: string, data: Partial<ClassFormData>) =>
  request<IClass>(`/classes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const toggleClassPublish = (id: string) =>
  request<{ class: IClass; message: string }>(`/classes/${id}/publish`, {
    method: 'PATCH',
  });

export const deleteClass = (id: string) =>
  request<{ message: string }>(`/classes/${id}`, { method: 'DELETE' });
