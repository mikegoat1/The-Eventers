import { createMocks } from 'node-mocks-http';
import registerHandler from '../src/pages/api/auth/register';
import User from '../src/models/User';
import bcrypt from 'bcrypt';

jest.mock('../src/lib/mongoose');
jest.mock('../src/models/User');
jest.mock('bcrypt');

describe('POST /api/auth/register', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 405 if method is not POST', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    await registerHandler(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(res._getJSONData()).toEqual({ message: 'Method Not Allowed' });
  });

  it('should return 400 if user already exists', async () => {
    User.findOne.mockResolvedValue({ username: 'existingUser' });

    const { req, res } = createMocks({
      method: 'POST',
      body: {
        username: 'existingUser',
        password: 'password123',
      },
    });

    await registerHandler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toEqual({ message: 'User already exists' });
  });

  it('should return 200 if registration is successful', async () => {
    User.findOne.mockResolvedValue(null);
    bcrypt.genSalt.mockResolvedValue('salt');
    bcrypt.hash.mockResolvedValue('hashedPassword');
    User.prototype.save = jest.fn().mockResolvedValue({});

    const { req, res } = createMocks({
      method: 'POST',
      body: {
        username: 'newUser',
        password: 'password123',
      },
    });

    await registerHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({ message: 'Register successful' });
  });

  it('should return 500 if there is an internal server error', async () => {
    User.findOne.mockRejectedValue(new Error('Database error'));

    const { req, res } = createMocks({
      method: 'POST',
      body: {
        username: 'newUser',
        password: 'password123',
      },
    });

    await registerHandler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(res._getJSONData()).toEqual({ message: 'Internal server error' });
  });
});