export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPhone(phone: string): boolean {
  return /^[\d\s\-().+]{7,20}$/.test(phone);
}

export function isValidTime(time: string): boolean {
  return /^\d{2}:\d{2}$/.test(time);
}

export const VALID_DAYS = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday',
  'Thursday', 'Friday', 'Saturday',
] as const;

export function isValidDayOfWeek(day: string): boolean {
  return (VALID_DAYS as readonly string[]).includes(day);
}

export function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function isEndAfterStart(startTime: string, endTime: string): boolean {
  return endTime > startTime;
}
