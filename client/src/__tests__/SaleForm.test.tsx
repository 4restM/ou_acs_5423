import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import SaleForm from '../components/Sale/SaleForm';

vi.mock('../services/api', () => ({
  getCustomers: vi.fn().mockResolvedValue([
    {
      _id: 'cust1',
      customerId: 'C00001',
      firstName: 'Jane',
      lastName: 'Doe',
      fullName: 'Jane Doe',
      classBalance: 0,
    },
  ]),
  getPackages: vi.fn().mockResolvedValue([
    {
      _id: 'pkg1',
      packageId: 'P00001',
      packageName: 'Monthly General',
      price: 120,
      numberOfClasses: 10,
      classType: 'General',
      category: 'General',
      startDate: '2026-01-01',
      endDate: '2026-12-31',
    },
  ]),
}));

const noop = async () => {};

describe('SaleForm — required field validation', () => {
  it('shows error when customer is not selected', async () => {
    render(<SaleForm onSubmit={noop} />);
    fireEvent.submit(screen.getByRole('button', { name: /record sale/i }));
    expect(await screen.findByText(/customer is required/i)).toBeInTheDocument();
  });

  it('shows error when payment method is not selected', async () => {
    render(<SaleForm onSubmit={noop} />);
    fireEvent.submit(screen.getByRole('button', { name: /record sale/i }));
    expect(await screen.findByText(/payment method is required/i)).toBeInTheDocument();
  });

  it('shows error when amount is zero', async () => {
    render(<SaleForm onSubmit={noop} />);
    fireEvent.submit(screen.getByRole('button', { name: /record sale/i }));
    expect(await screen.findByText(/amount is required/i)).toBeInTheDocument();
  });

  it('shows error when validity start is missing', async () => {
    render(<SaleForm onSubmit={noop} />);
    fireEvent.submit(screen.getByRole('button', { name: /record sale/i }));
    expect(await screen.findByText(/validity start date is required/i)).toBeInTheDocument();
  });

  it('shows error when validity end is missing', async () => {
    render(<SaleForm onSubmit={noop} />);
    fireEvent.submit(screen.getByRole('button', { name: /record sale/i }));
    expect(await screen.findByText(/validity end date is required/i)).toBeInTheDocument();
  });
});

describe('SaleForm — date validation', () => {
  it('shows error when validity end is before validity start', async () => {
    render(<SaleForm onSubmit={noop} />);

    const startInput = screen.getByLabelText(/validity start/i);
    const endInput = screen.getByLabelText(/validity end/i);

    await userEvent.type(startInput, '2026-12-31');
    await userEvent.type(endInput, '2026-05-01');

    fireEvent.submit(screen.getByRole('button', { name: /record sale/i }));
    expect(
      await screen.findByText(/validity end date must be after validity start date/i),
    ).toBeInTheDocument();
  });
});
