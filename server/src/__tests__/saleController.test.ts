import { createSale, deleteSale, getSales, getSaleById } from '../controllers/saleController';

const mockRes = () => {
  const res = {} as any;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('createSale validation', () => {
  it('returns 400 when customer is missing', async () => {
    const req = {
      body: {
        package: '507f1f77bcf86cd799439011',
        paymentMethod: 'cash',
        amount: 50,
        validityStart: '2026-05-08',
        validityEnd: '2026-12-31',
      },
    } as any;
    const res = mockRes();
    await createSale(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining('Customer') }),
    );
  });

  it('returns 400 when package is missing', async () => {
    const req = {
      body: {
        customer: '507f1f77bcf86cd799439011',
        paymentMethod: 'cash',
        amount: 50,
        validityStart: '2026-05-08',
        validityEnd: '2026-12-31',
      },
    } as any;
    const res = mockRes();
    await createSale(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining('Package') }),
    );
  });

  it('returns 400 when paymentMethod is missing', async () => {
    const req = {
      body: {
        customer: '507f1f77bcf86cd799439011',
        package: '507f1f77bcf86cd799439012',
        amount: 50,
        validityStart: '2026-05-08',
        validityEnd: '2026-12-31',
      },
    } as any;
    const res = mockRes();
    await createSale(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining('Payment method') }),
    );
  });

  it('returns 400 when paymentMethod is invalid', async () => {
    const req = {
      body: {
        customer: '507f1f77bcf86cd799439011',
        package: '507f1f77bcf86cd799439012',
        paymentMethod: 'bitcoin',
        amount: 50,
        validityStart: '2026-05-08',
        validityEnd: '2026-12-31',
      },
    } as any;
    const res = mockRes();
    await createSale(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining('cash, credit, or check') }),
    );
  });

  it('returns 400 when amount is missing', async () => {
    const req = {
      body: {
        customer: '507f1f77bcf86cd799439011',
        package: '507f1f77bcf86cd799439012',
        paymentMethod: 'cash',
        validityStart: '2026-05-08',
        validityEnd: '2026-12-31',
      },
    } as any;
    const res = mockRes();
    await createSale(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining('Amount') }),
    );
  });

  it('returns 400 when validityStart is missing', async () => {
    const req = {
      body: {
        customer: '507f1f77bcf86cd799439011',
        package: '507f1f77bcf86cd799439012',
        paymentMethod: 'cash',
        amount: 50,
        validityEnd: '2026-12-31',
      },
    } as any;
    const res = mockRes();
    await createSale(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining('Validity start') }),
    );
  });

  it('returns 400 when validityEnd is missing', async () => {
    const req = {
      body: {
        customer: '507f1f77bcf86cd799439011',
        package: '507f1f77bcf86cd799439012',
        paymentMethod: 'cash',
        amount: 50,
        validityStart: '2026-05-08',
      },
    } as any;
    const res = mockRes();
    await createSale(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining('Validity end') }),
    );
  });

  it('returns 400 when validityEnd is before validityStart', async () => {
    const req = {
      body: {
        customer: '507f1f77bcf86cd799439011',
        package: '507f1f77bcf86cd799439012',
        paymentMethod: 'cash',
        amount: 50,
        validityStart: '2026-12-31',
        validityEnd: '2026-05-08',
      },
    } as any;
    const res = mockRes();
    await createSale(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining('after') }),
    );
  });
});

describe('getSaleById validation', () => {
  it('returns 500 on invalid ObjectId format', async () => {
    const req = { params: { id: 'not-an-id' } } as any;
    const res = mockRes();
    await getSaleById(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});
