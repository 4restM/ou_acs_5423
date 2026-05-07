import { createClass, updateClass, checkConflicts } from '../controllers/classController';

const mockRes = () => {
  const res = {} as any;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const validClassBody = {
  instructor: '507f1f77bcf86cd799439011',
  dayOfWeek: 'Monday',
  startTime: '09:00',
  endTime: '10:15',
  payRate: 25,
};

describe('createClass validation', () => {
  it('returns 400 when instructor is missing', async () => {
    const req = { body: { ...validClassBody, instructor: undefined } } as any;
    const res = mockRes();
    await createClass(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('returns 400 when dayOfWeek is invalid', async () => {
    const req = { body: { ...validClassBody, dayOfWeek: 'Funday' } } as any;
    const res = mockRes();
    await createClass(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining('dayOfWeek') }),
    );
  });

  it('returns 400 when startTime format is invalid', async () => {
    const req = { body: { ...validClassBody, startTime: '9am' } } as any;
    const res = mockRes();
    await createClass(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining('time') }),
    );
  });

  it('returns 400 when endTime format is invalid', async () => {
    const req = { body: { ...validClassBody, endTime: '10:15am' } } as any;
    const res = mockRes();
    await createClass(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining('time') }),
    );
  });

  it('returns 400 when endTime is before startTime', async () => {
    const req = { body: { ...validClassBody, startTime: '10:00', endTime: '09:00' } } as any;
    const res = mockRes();
    await createClass(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining('End time') }),
    );
  });

  it('returns 400 when endTime equals startTime', async () => {
    const req = { body: { ...validClassBody, startTime: '09:00', endTime: '09:00' } } as any;
    const res = mockRes();
    await createClass(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe('updateClass validation', () => {
  it('returns 400 when dayOfWeek is invalid', async () => {
    const req = { params: { id: '507f1f77bcf86cd799439011' }, body: { dayOfWeek: 'Funday' } } as any;
    const res = mockRes();
    await updateClass(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining('dayOfWeek') }),
    );
  });

  it('returns 400 when startTime format is invalid', async () => {
    const req = { params: { id: '507f1f77bcf86cd799439011' }, body: { startTime: '9am' } } as any;
    const res = mockRes();
    await updateClass(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('returns 400 when endTime is before startTime (both provided)', async () => {
    const req = {
      params: { id: '507f1f77bcf86cd799439011' },
      body: { startTime: '10:00', endTime: '09:00' },
    } as any;
    const res = mockRes();
    await updateClass(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining('End time') }),
    );
  });
});

describe('checkConflicts validation', () => {
  it('returns 400 when dayOfWeek is missing', async () => {
    const req = { body: { startTime: '09:00', endTime: '10:15' } } as any;
    const res = mockRes();
    await checkConflicts(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('returns 400 when dayOfWeek is invalid', async () => {
    const req = { body: { dayOfWeek: 'Funday', startTime: '09:00', endTime: '10:15' } } as any;
    const res = mockRes();
    await checkConflicts(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining('dayOfWeek') }),
    );
  });

  it('returns 400 when startTime format is invalid', async () => {
    const req = { body: { dayOfWeek: 'Monday', startTime: '9am', endTime: '10:15' } } as any;
    const res = mockRes();
    await checkConflicts(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});
