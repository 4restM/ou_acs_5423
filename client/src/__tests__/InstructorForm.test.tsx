import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import InstructorForm from '../components/Instructor/InstructorForm';

vi.mock('../services/api', () => ({
  checkInstructorName: vi.fn().mockResolvedValue({ exists: false, count: 0, matches: [] }),
}));

const noop = async () => {};

describe('InstructorForm — required field validation', () => {
  it('shows error when firstName is empty on submit', async () => {
    render(<InstructorForm onSubmit={noop} />);
    fireEvent.submit(screen.getByRole('button', { name: /add instructor/i }));
    expect(await screen.findByText(/first name is required/i)).toBeInTheDocument();
  });

  it('shows error when lastName is empty on submit', async () => {
    render(<InstructorForm onSubmit={noop} />);
    fireEvent.submit(screen.getByRole('button', { name: /add instructor/i }));
    expect(await screen.findByText(/last name is required/i)).toBeInTheDocument();
  });

  it('shows error when preferred communication is email and email is empty', async () => {
    render(<InstructorForm onSubmit={noop} />);
    await userEvent.type(screen.getByPlaceholderText(/enter first name/i), 'Jane');
    await userEvent.type(screen.getByPlaceholderText(/enter last name/i), 'Smith');
    fireEvent.submit(screen.getByRole('button', { name: /add instructor/i }));
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
  });

  it('shows error when preferred communication is phone and phone is empty', async () => {
    render(<InstructorForm onSubmit={noop} />);
    await userEvent.type(screen.getByPlaceholderText(/enter first name/i), 'Jane');
    await userEvent.type(screen.getByPlaceholderText(/enter last name/i), 'Smith');
    await userEvent.selectOptions(
      screen.getByRole('combobox'),
      'phone',
    );
    fireEvent.submit(screen.getByRole('button', { name: /add instructor/i }));
    expect(await screen.findByText(/phone is required/i)).toBeInTheDocument();
  });
});

describe('InstructorForm — format validation', () => {
  it('shows error when email format is invalid', async () => {
    render(<InstructorForm onSubmit={noop} />);
    await userEvent.type(screen.getByPlaceholderText(/enter first name/i), 'Jane');
    await userEvent.type(screen.getByPlaceholderText(/enter last name/i), 'Smith');
    await userEvent.type(screen.getByPlaceholderText(/instructor@example\.com/i), 'notanemail');
    fireEvent.submit(screen.getByRole('button', { name: /add instructor/i }));
    expect(await screen.findByText(/invalid email/i)).toBeInTheDocument();
  });

  it('shows error when phone format is invalid', async () => {
    render(<InstructorForm onSubmit={noop} />);
    await userEvent.type(screen.getByPlaceholderText(/enter first name/i), 'Jane');
    await userEvent.type(screen.getByPlaceholderText(/enter last name/i), 'Smith');
    await userEvent.type(screen.getByPlaceholderText(/\(412\)/i), 'abc');
    fireEvent.submit(screen.getByRole('button', { name: /add instructor/i }));
    expect(await screen.findByText(/invalid phone/i)).toBeInTheDocument();
  });

  it('does not show format error when email field is empty (format check skipped)', async () => {
    render(<InstructorForm onSubmit={noop} />);
    await userEvent.type(screen.getByPlaceholderText(/enter first name/i), 'Jane');
    await userEvent.type(screen.getByPlaceholderText(/enter last name/i), 'Smith');
    fireEvent.submit(screen.getByRole('button', { name: /add instructor/i }));
    expect(screen.queryByText(/invalid email/i)).not.toBeInTheDocument();
  });
});
