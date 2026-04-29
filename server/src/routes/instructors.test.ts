import request from 'supertest';
import { app } from '../server';
import { connectTestDB, clearTestDB, disconnectTestDB } from '../test/db';

beforeAll(async () => {
  await connectTestDB();
});

afterEach(async () => {
  await clearTestDB();
});

afterAll(async () => {
  await disconnectTestDB();
});

describe('GET /api/instructors', () => {
  it('returns an empty array when no instructors exist', async () => {
    const res = await request(app).get('/api/instructors');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('returns created instructors', async () => {
    await request(app)
      .post('/api/instructors')
      .send({ firstName: 'Jane', lastName: 'Doe', preferredCommunication: 'email' });

    const res = await request(app).get('/api/instructors');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].firstName).toBe('Jane');
  });
});

describe('POST /api/instructors', () => {
  it('creates an instructor and returns a confirmation message', async () => {
    const res = await request(app)
      .post('/api/instructors')
      .send({ firstName: 'Jane', lastName: 'Doe', preferredCommunication: 'email' });

    expect(res.status).toBe(201);
    expect(res.body.instructor.firstName).toBe('Jane');
    expect(res.body.confirmationMessage).toMatch(/Welcome to Yoga'Hom/);
  });

  it('returns 400 when required fields are missing', async () => {
    const res = await request(app)
      .post('/api/instructors')
      .send({ firstName: 'Jane' });

    expect(res.status).toBe(400);
  });
});

describe('POST /api/instructors/check-name', () => {
  it('returns exists: false when no match', async () => {
    const res = await request(app)
      .post('/api/instructors/check-name')
      .send({ firstName: 'Ghost', lastName: 'User' });

    expect(res.status).toBe(200);
    expect(res.body.exists).toBe(false);
    expect(res.body.count).toBe(0);
  });

  it('detects a duplicate name case-insensitively', async () => {
    await request(app)
      .post('/api/instructors')
      .send({ firstName: 'Jane', lastName: 'Doe', preferredCommunication: 'email' });

    const res = await request(app)
      .post('/api/instructors/check-name')
      .send({ firstName: 'jane', lastName: 'doe' });

    expect(res.status).toBe(200);
    expect(res.body.exists).toBe(true);
    expect(res.body.count).toBe(1);
  });
});

describe('DELETE /api/instructors/:id', () => {
  it('deletes an instructor', async () => {
    const created = await request(app)
      .post('/api/instructors')
      .send({ firstName: 'Jane', lastName: 'Doe', preferredCommunication: 'email' });

    const id = created.body.instructor._id;
    const res = await request(app).delete(`/api/instructors/${id}`);
    expect(res.status).toBe(200);

    const check = await request(app).get(`/api/instructors/${id}`);
    expect(check.status).toBe(404);
  });
});
