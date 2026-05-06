import { Request, Response } from 'express';

jest.mock('../models/Customer');

import Customer from '../models/Customer';
import {
  getCustomers,
  getCustomerById,
  checkCustomerName,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from '../controllers/customerController';

const mockCustomer = Customer as jest.MockedClass<typeof Customer>;

function makeRes() {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as unknown as Response;
  return res;
}

function makeReq(overrides: Partial<Request> = {}): Request {
  return { params: {}, body: {}, query: {}, ...overrides } as Request;
}

const validBody = {
  firstName: 'Jane',
  lastName: 'Doe',
  phone: '412-555-0100',
  email: 'jane@example.com',
  preferredCommunication: 'email',
  address: { street: '1 Yoga Ln', city: 'Pittsburgh', state: 'PA', zip: '15213' },
};

// ─── getCustomers ───────────────────────────────────────────────────────────

describe('GET /api/customers - getCustomers', () => {
  it('returns all customers sorted by lastName, firstName', async () => {
    const customers = [{ customerId: 'C00001', firstName: 'Jane', lastName: 'Doe' }];
    (Customer.find as jest.Mock).mockReturnValue({
      sort: jest.fn().mockResolvedValue(customers),
    });

    const res = makeRes();
    await getCustomers(makeReq(), res);

    expect(Customer.find).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(customers);
  });

  it('returns 500 on database error', async () => {
    (Customer.find as jest.Mock).mockReturnValue({
      sort: jest.fn().mockRejectedValue(new Error('DB error')),
    });

    const res = makeRes();
    await getCustomers(makeReq(), res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ─── getCustomerById ─────────────────────────────────────────────────────────

describe('GET /api/customers/:id - getCustomerById', () => {
  it('returns a customer when found', async () => {
    const customer = { _id: 'abc123', customerId: 'C00001', ...validBody };
    (Customer.findById as jest.Mock).mockResolvedValue(customer);

    const res = makeRes();
    await getCustomerById(makeReq({ params: { id: 'abc123' } }), res);

    expect(res.json).toHaveBeenCalledWith(customer);
  });

  it('returns 404 when customer not found', async () => {
    (Customer.findById as jest.Mock).mockResolvedValue(null);

    const res = makeRes();
    await getCustomerById(makeReq({ params: { id: 'notexist' } }), res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Customer not found' });
  });
});

// ─── checkCustomerName ───────────────────────────────────────────────────────

describe('POST /api/customers/check-name - checkCustomerName', () => {
  it('returns exists=false when no match', async () => {
    (Customer.find as jest.Mock).mockResolvedValue([]);

    const res = makeRes();
    await checkCustomerName(makeReq({ body: { firstName: 'Jane', lastName: 'Doe' } }), res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ exists: false, count: 0 }),
    );
  });

  it('returns exists=true with matches when name already used', async () => {
    const existing = [{ _id: 'x1', customerId: 'C00001', fullName: 'Jane Doe' }];
    (Customer.find as jest.Mock).mockResolvedValue(existing);

    const res = makeRes();
    await checkCustomerName(makeReq({ body: { firstName: 'Jane', lastName: 'Doe' } }), res);

    const result = (res.json as jest.Mock).mock.calls[0][0];
    expect(result.exists).toBe(true);
    expect(result.count).toBe(1);
    expect(result.matches[0].customerId).toBe('C00001');
  });
});

// ─── createCustomer ──────────────────────────────────────────────────────────

describe('POST /api/customers - createCustomer', () => {
  it('creates a customer and returns 201 with a confirmation message', async () => {
    const saved = { ...validBody, _id: 'abc123', customerId: 'C00001' };
    const saveMock = jest.fn().mockResolvedValue(saved);
    mockCustomer.mockImplementation(() => ({ save: saveMock } as any));

    const res = makeRes();
    await createCustomer(makeReq({ body: validBody }), res);

    expect(res.status).toHaveBeenCalledWith(201);
    const jsonCall = (res.json as jest.Mock).mock.calls[0][0];
    expect(jsonCall).toHaveProperty('confirmationMessage');
    expect(jsonCall.confirmationMessage).toContain('C00001');
    expect(jsonCall.confirmationMessage).toContain("Welcome to Yoga'Hom!");
  });

  it('returns 400 when firstName is missing', async () => {
    const res = makeRes();
    await createCustomer(makeReq({ body: { lastName: 'Doe' } }), res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'First name and last name are required',
    });
  });

  it('returns 400 when lastName is missing', async () => {
    const res = makeRes();
    await createCustomer(makeReq({ body: { firstName: 'Jane' } }), res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('returns 400 on mongoose ValidationError', async () => {
    const validationError = Object.assign(new Error('Validation failed'), {
      name: 'ValidationError',
      errors: { email: { message: 'Email is invalid' } },
    });
    mockCustomer.mockImplementation(() => ({
      save: jest.fn().mockRejectedValue(validationError),
    } as any));

    const res = makeRes();
    await createCustomer(makeReq({ body: validBody }), res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Email is invalid' });
  });

  it('initialises classBalance to 0', async () => {
    const saved = { ...validBody, _id: 'abc123', customerId: 'C00001', classBalance: 0 };
    mockCustomer.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(saved),
    } as any));

    const res = makeRes();
    await createCustomer(makeReq({ body: validBody }), res);

    const jsonCall = (res.json as jest.Mock).mock.calls[0][0];
    expect(jsonCall.customer.classBalance).toBe(0);
  });

  it('sends confirmation via preferred mode in the message', async () => {
    const saved = {
      ...validBody,
      preferredCommunication: 'phone',
      _id: 'abc123',
      customerId: 'C00001',
    };
    mockCustomer.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(saved),
    } as any));

    const res = makeRes();
    await createCustomer(makeReq({ body: { ...validBody, preferredCommunication: 'phone' } }), res);

    const jsonCall = (res.json as jest.Mock).mock.calls[0][0];
    expect(jsonCall.confirmationMessage).toContain('C00001');
  });
});

// ─── updateCustomer ──────────────────────────────────────────────────────────

describe('PUT /api/customers/:id - updateCustomer', () => {
  it('returns updated customer', async () => {
    const updated = { ...validBody, _id: 'abc123', customerId: 'C00001' };
    (Customer.findByIdAndUpdate as jest.Mock).mockResolvedValue(updated);

    const res = makeRes();
    await updateCustomer(makeReq({ params: { id: 'abc123' }, body: { firstName: 'Janet' } }), res);

    expect(res.json).toHaveBeenCalledWith(updated);
  });

  it('returns 404 when customer not found', async () => {
    (Customer.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

    const res = makeRes();
    await updateCustomer(makeReq({ params: { id: 'notexist' }, body: {} }), res);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});

// ─── deleteCustomer ──────────────────────────────────────────────────────────

describe('DELETE /api/customers/:id - deleteCustomer', () => {
  it('removes a customer and returns success message', async () => {
    (Customer.findByIdAndDelete as jest.Mock).mockResolvedValue({ _id: 'abc123' });

    const res = makeRes();
    await deleteCustomer(makeReq({ params: { id: 'abc123' } }), res);

    expect(res.json).toHaveBeenCalledWith({ message: 'Customer removed' });
  });

  it('returns 404 when customer not found', async () => {
    (Customer.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

    const res = makeRes();
    await deleteCustomer(makeReq({ params: { id: 'notexist' } }), res);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});
