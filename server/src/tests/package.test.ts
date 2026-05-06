import { Request, Response } from 'express';

// Must mock before importing controller
jest.mock('../models/Package');

import Package from '../models/Package';
import {
  getPackages,
  getPackageById,
  createPackage,
} from '../controllers/packageController';

const mockPackage = Package as jest.MockedClass<typeof Package>;

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
  packageName: 'Monthly General',
  category: 'General',
  numberOfClasses: 10,
  classType: 'General',
  startDate: '2026-01-01',
  endDate: '2026-12-31',
  price: 120,
};

describe('GET /api/packages - getPackages', () => {
  it('returns all packages sorted by packageId', async () => {
    const packages = [{ packageId: 'P00001', packageName: 'Monthly General' }];
    (Package.find as jest.Mock).mockReturnValue({
      sort: jest.fn().mockResolvedValue(packages),
    });

    const req = makeReq();
    const res = makeRes();
    await getPackages(req, res);

    expect(Package.find).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(packages);
  });

  it('returns 500 on database error', async () => {
    (Package.find as jest.Mock).mockReturnValue({
      sort: jest.fn().mockRejectedValue(new Error('DB error')),
    });

    const req = makeReq();
    const res = makeRes();
    await getPackages(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe('GET /api/packages/:id - getPackageById', () => {
  it('returns a package when found', async () => {
    const pkg = { _id: 'abc123', packageId: 'P00001', packageName: 'Monthly General' };
    (Package.findById as jest.Mock).mockResolvedValue(pkg);

    const req = makeReq({ params: { id: 'abc123' } });
    const res = makeRes();
    await getPackageById(req, res);

    expect(res.json).toHaveBeenCalledWith(pkg);
  });

  it('returns 404 when package not found', async () => {
    (Package.findById as jest.Mock).mockResolvedValue(null);

    const req = makeReq({ params: { id: 'notexist' } });
    const res = makeRes();
    await getPackageById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Package not found' });
  });
});

describe('POST /api/packages - createPackage', () => {
  it('creates a package and returns 201 with confirmation', async () => {
    const saved = {
      ...validBody,
      _id: 'abc123',
      packageId: 'P00001',
    };
    const saveMock = jest.fn().mockResolvedValue(saved);
    mockPackage.mockImplementation(() => ({ save: saveMock } as any));

    const req = makeReq({ body: validBody });
    const res = makeRes();
    await createPackage(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    const jsonCall = (res.json as jest.Mock).mock.calls[0][0];
    expect(jsonCall).toHaveProperty('confirmationMessage');
    expect(jsonCall.confirmationMessage).toContain('P00001');
  });

  it('returns 400 when required fields are missing', async () => {
    const req = makeReq({ body: { packageName: 'Test' } });
    const res = makeRes();
    await createPackage(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'All fields are required' });
  });

  it('returns 400 on mongoose ValidationError', async () => {
    const validationError = Object.assign(new Error('Validation failed'), {
      name: 'ValidationError',
      errors: {
        category: { message: 'Category is required' },
      },
    });
    mockPackage.mockImplementation(() => ({
      save: jest.fn().mockRejectedValue(validationError),
    } as any));

    const req = makeReq({ body: validBody });
    const res = makeRes();
    await createPackage(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Category is required' });
  });

  it('auto-generates a confirmation message containing the package name', async () => {
    const saved = {
      ...validBody,
      packageId: 'P00002',
      packageName: 'Monthly General',
    };
    mockPackage.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(saved),
    } as any));

    const req = makeReq({ body: validBody });
    const res = makeRes();
    await createPackage(req, res);

    const jsonCall = (res.json as jest.Mock).mock.calls[0][0];
    expect(jsonCall.confirmationMessage).toContain('Monthly General');
    expect(jsonCall.confirmationMessage).toContain('P00002');
  });
});
