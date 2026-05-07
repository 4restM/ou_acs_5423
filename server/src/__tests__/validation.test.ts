import {
  isValidEmail,
  isValidPhone,
  isValidTime,
  isValidDayOfWeek,
  escapeRegex,
  isEndAfterStart,
} from '../utils/validation';

describe('isValidEmail', () => {
  it('accepts a standard email', () => expect(isValidEmail('user@example.com')).toBe(true));
  it('accepts subdomain email', () => expect(isValidEmail('user@mail.example.com')).toBe(true));
  it('rejects missing @', () => expect(isValidEmail('notanemail')).toBe(false));
  it('rejects missing domain', () => expect(isValidEmail('user@')).toBe(false));
  it('rejects space before @', () => expect(isValidEmail('user @example.com')).toBe(false));
  it('rejects empty string', () => expect(isValidEmail('')).toBe(false));
});

describe('isValidPhone', () => {
  it('accepts 10 digit number', () => expect(isValidPhone('4125550123')).toBe(true));
  it('accepts formatted US phone', () => expect(isValidPhone('(412) 555-0123')).toBe(true));
  it('accepts international format', () => expect(isValidPhone('+1 412 555 0123')).toBe(true));
  it('rejects too short (< 7 chars)', () => expect(isValidPhone('123')).toBe(false));
  it('rejects letters', () => expect(isValidPhone('abc-defg-hijk')).toBe(false));
  it('rejects empty string', () => expect(isValidPhone('')).toBe(false));
});

describe('isValidTime', () => {
  it('accepts HH:MM', () => expect(isValidTime('09:00')).toBe(true));
  it('accepts midnight', () => expect(isValidTime('00:00')).toBe(true));
  it('accepts end of day', () => expect(isValidTime('23:59')).toBe(true));
  it('rejects no colon', () => expect(isValidTime('0900')).toBe(false));
  it('rejects HH:MM:SS', () => expect(isValidTime('09:00:00')).toBe(false));
  it('rejects empty string', () => expect(isValidTime('')).toBe(false));
});

describe('isValidDayOfWeek', () => {
  const validDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  it.each(validDays)('accepts %s', (day) => expect(isValidDayOfWeek(day)).toBe(true));
  it('rejects invalid day', () => expect(isValidDayOfWeek('Funday')).toBe(false));
  it('rejects lowercase day', () => expect(isValidDayOfWeek('monday')).toBe(false));
  it('rejects empty string', () => expect(isValidDayOfWeek('')).toBe(false));
});

describe('escapeRegex', () => {
  it('escapes special regex characters', () => {
    expect(escapeRegex('O(Brien)')).toBe('O\\(Brien\\)');
  });
  it('escapes dots', () => {
    expect(escapeRegex('Dr. Smith')).toBe('Dr\\. Smith');
  });
  it('leaves plain text unchanged', () => {
    expect(escapeRegex('Smith')).toBe('Smith');
  });
});

describe('isEndAfterStart', () => {
  it('returns true when end is after start', () =>
    expect(isEndAfterStart('09:00', '10:15')).toBe(true));
  it('returns false when end equals start', () =>
    expect(isEndAfterStart('09:00', '09:00')).toBe(false));
  it('returns false when end is before start', () =>
    expect(isEndAfterStart('10:00', '09:00')).toBe(false));
});
