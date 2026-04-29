import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InstructorForm from './InstructorForm';
import { checkInstructorName } from '../../services/api';

vi.mock('../../services/api', () => ({
  checkInstructorName: vi.fn().mockResolvedValue({ exists: false, count: 0, matches: [] }),
}));

const noop = async () => {};

describe('InstructorForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the submit button', () => {
    render(<InstructorForm onSubmit={noop} />);
    expect(screen.getByRole('button', { name: /add instructor/i })).toBeInTheDocument();
  });

  it('shows inline errors for required fields on submit', async () => {
    render(<InstructorForm onSubmit={noop} />);
    fireEvent.submit(screen.getByRole('button', { name: /add instructor/i }).closest('form')!);

    await waitFor(() => {
      expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/last name is required/i)).toBeInTheDocument();
    });
  });

  it('shows email error when preferred communication is email but email is empty', async () => {
    const user = userEvent.setup();
    render(<InstructorForm onSubmit={noop} />);

    await user.type(screen.getByPlaceholderText(/enter first name/i), 'Jane');
    await user.type(screen.getByPlaceholderText(/enter last name/i), 'Doe');
    // preferred communication defaults to email, leave email blank

    fireEvent.submit(screen.getByRole('button', { name: /add instructor/i }).closest('form')!);

    await waitFor(() => {
      expect(screen.getByText(/email is required when preferred communication is email/i)).toBeInTheDocument();
    });
  });

  it('shows phone error when preferred communication is phone but phone is empty', async () => {
    const user = userEvent.setup();
    render(<InstructorForm onSubmit={noop} />);

    await user.type(screen.getByPlaceholderText(/enter first name/i), 'Jane');
    await user.type(screen.getByPlaceholderText(/enter last name/i), 'Doe');
    await user.selectOptions(screen.getByRole('combobox'), 'phone');

    fireEvent.submit(screen.getByRole('button', { name: /add instructor/i }).closest('form')!);

    await waitFor(() => {
      expect(screen.getByText(/phone is required when preferred communication is phone/i)).toBeInTheDocument();
    });
  });

  it('calls onSubmit when all required fields are filled and name check passes', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn().mockResolvedValue(undefined);
    render(<InstructorForm onSubmit={handleSubmit} />);

    await user.type(screen.getByPlaceholderText(/enter first name/i), 'Jane');
    await user.type(screen.getByPlaceholderText(/enter last name/i), 'Doe');
    await user.type(screen.getByPlaceholderText(/instructor@example.com/i), 'jane@example.com');

    const form = screen.getByRole('button', { name: /add instructor/i }).closest('form')!;

    // First submit triggers the async name-check; second submit fires onSubmit
    fireEvent.submit(form);
    await waitFor(() => expect(vi.mocked(checkInstructorName)).toHaveBeenCalled());
    fireEvent.submit(form);

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledOnce();
    });
  });
});
