import request from 'supertest';
import User from '../../db/models/User.js';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import createApp from '../../index.js';

config();

describe('/api/auth/me', () => {
  let app;

  beforeEach(async () => {
    app = createApp();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  it('should return 401 if no token is provided', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Unauthorized: No token provided');
  });

  it('should return 200 and user data if valid token is provided', async () => {
    const user = new User({
      username: 'testuser',
      password: 'Password123',
    });

    await user.save();

    const token = jwt.sign(
      { _id: user._id, username: user.username },
      process.env.JWT_SECRET || 'testsecret'
    );

    const res = await request(app)
      .get('/api/auth/me')
      .set('Cookie', [`token=${token}`]);

    expect(res.status).toBe(200);
    expect(res.body.user).toHaveProperty('username', user.username);
  });
});
