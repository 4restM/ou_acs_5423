import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import ClassForm from '../components/Class/ClassForm';

vi.mock('../services/api', () => ({
  getInstructors: vi.fn().mockResolvedValue([
    { _id: 'inst1', firstName: 'Jane', lastName: 'Smith' },
  ]),
}));

const noop = async () => {};

describe('ClassForm — required field validation', () => {
  it('shows error when no instructor is selected', async () => {
    render(<ClassForm onSubmit={noop} />);
    fireEvent.submit(screen.getByRole('button', { name: /add class/i }));
    expect(await screen.findByText(/please select an instructor/i)).toBeInTheDocument();
  });

  it('shows error when payRate is 0', async () => {
    render(<ClassForm onSubmit={noop} />);
    const payRateInput = screen.getByPlaceholderText('0.00');
    await userEvent.clear(payRateInput);
    fireEvent.submit(screen.getByRole('button', { name: /add class/i }));
    expect(await screen.findByText(/valid pay rate/i)).toBeInTheDocument();
  });

  it('shows error when endTime is before startTime', async () => {
    const { container } = render(<ClassForm onSubmit={noop} />);
    const startInput = container.querySelector('input[name="startTime"]')!;
    const endInput = container.querySelector('input[name="endTime"]')!;

    fireEvent.change(startInput, { target: { value: '10:00' } });
    fireEvent.change(endInput, { target: { value: '09:00' } });
    fireEvent.submit(screen.getByRole('button', { name: /add class/i }));
    expect(await screen.findByText(/end time must be after/i)).toBeInTheDocument();
  });

  it('shows error when endTime equals startTime', async () => {
    const { container } = render(<ClassForm onSubmit={noop} />);
    const startInput = container.querySelector('input[name="startTime"]')!;
    const endInput = container.querySelector('input[name="endTime"]')!;

    fireEvent.change(startInput, { target: { value: '09:00' } });
    fireEvent.change(endInput, { target: { value: '09:00' } });
    fireEvent.submit(screen.getByRole('button', { name: /add class/i }));
    expect(await screen.findByText(/end time must be after/i)).toBeInTheDocument();
  });
});

describe('ClassForm — className validation', () => {
  it('shows error when className exceeds 100 characters', async () => {
    render(<ClassForm onSubmit={noop} />);
    const classNameInput = screen.getByPlaceholderText(/all levels/i);
    await userEvent.clear(classNameInput);
    await userEvent.type(classNameInput, 'A'.repeat(101));
    fireEvent.submit(screen.getByRole('button', { name: /add class/i }));
    expect(await screen.findByText(/class name.*100/i)).toBeInTheDocument();
  });
});
