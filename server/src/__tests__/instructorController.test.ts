import { createInstructor, updateInstructor, checkInstructorName } from '../controllers/instructorController';

const mockRes = () => {
  const res = {} as any;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('createInstructor validation', () => {
  it('returns 400 when firstName is missing', async () => {
    const req = { body: { lastName: 'Smith' } } as any;
    const res = mockRes();
    await createInstructor(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining('required') }),
    );
  });

  it('returns 400 when lastName is missing', async () => {
    const req = { body: { firstName: 'Jane' } } as any;
    const res = mockRes();
    await createInstructor(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('returns 400 when email format is invalid', async () => {
    const req = { body: { firstName: 'Jane', lastName: 'Smith', email: 'notanemail' } } as any;
    const res = mockRes();
    await createInstructor(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining('email') }),
    );
  });

  it('returns 400 when phone format is invalid', async () => {
    const req = { body: { firstName: 'Jane', lastName: 'Smith', phone: 'abc' } } as any;
    const res = mockRes();
    await createInstructor(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining('phone') }),
    );
  });
});

describe('updateInstructor validation', () => {
  it('returns 400 when email format is invalid', async () => {
    const req = { params: { id: '507f1f77bcf86cd799439011' }, body: { email: 'bademail' } } as any;
    const res = mockRes();
    await updateInstructor(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining('email') }),
    );
  });

  it('returns 400 when phone format is invalid', async () => {
    const req = { params: { id: '507f1f77bcf86cd799439011' }, body: { phone: 'xyz' } } as any;
    const res = mockRes();
    await updateInstructor(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining('phone') }),
    );
  });
});

describe('checkInstructorName validation', () => {
  it('returns 400 when firstName is missing', async () => {
    const req = { body: { lastName: 'Smith' } } as any;
    const res = mockRes();
    await checkInstructorName(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('returns 400 when lastName is missing', async () => {
    const req = { body: { firstName: 'Jane' } } as any;
    const res = mockRes();
    await checkInstructorName(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});
