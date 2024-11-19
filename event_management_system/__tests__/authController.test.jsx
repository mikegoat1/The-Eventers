import { createMocks } from 'node-mocks-http';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { register, login } from '../src/controllers/authControllers';
import registerHandler from '../src/pages/api/auth/register';
import loginHandler from '../src/pages/api/auth/login';
import logoutHandler from '../src/pages/api/auth/logout';
import User from '../src/models/User';

jest.mock('../src/lib/mongoose');
jest.mock('../src/models/User');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('Auth Controllers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should return 405 if method is not POST', async () => {
      const { req, res } = createMocks({
        method: 'GET',
      });

      await registerHandler(req, res);

      expect(res._getStatusCode()).toBe(405);
      expect(res._getData()).toEqual('Method GET Not Allowed on ');
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

    it('should return 201 if registration is successful', async () => {
      User.findOne.mockResolvedValue(null);
      bcrypt.genSalt.mockResolvedValue('salt');
      bcrypt.hash.mockResolvedValue('hashedPassword');
      User.prototype.save = jest.fn().mockResolvedValue({});
      jwt.sign.mockImplementation((payload, secret, options, callback) => {
        callback(null, 'token');
      });

      const { req, res } = createMocks({
        method: 'POST',
        body: {
          username: 'newUser',
          password: 'password123',
        },
      });

      await register(req, res);

      expect(res._getStatusCode()).toBe(201);
      expect(res._getJSONData()).toEqual({ token: 'token' });
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

      await register(req, res);

      expect(res._getStatusCode()).toBe(500);
      expect(res._getJSONData()).toEqual({ message: 'Server Error' });
    });
  });

  describe('POST /api/auth/login', () => {
    it('should return 405 if method is not POST', async () => {
      const { req, res } = createMocks({
        method: 'GET',
      });

      await loginHandler(req, res);

      expect(res._getStatusCode()).toBe(405);
      expect(res._getData()).toEqual('Method GET Not Allowed on ');
    });

    it('should return 400 if user is not found', async () => {
      User.findOne.mockResolvedValue(null);

      const { req, res } = createMocks({
        method: 'POST',
        body: {
          username: 'nonexistentUser',
          password: 'password123',
        },
      });

      await loginHandler(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(res._getJSONData()).toEqual({ message: 'Invalid credentials' });
    });

    it('should return 400 if password does not match', async () => {
      User.findOne.mockResolvedValue({
        username: 'existingUser',
        password: 'hashedPassword',
      });
      bcrypt.compare.mockResolvedValue(false);

      const { req, res } = createMocks({
        method: 'POST',
        body: {
          username: 'existingUser',
          password: 'wrongPassword',
        },
      });

      await login(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(res._getJSONData()).toEqual({ message: 'Invalid credentials' });
    });

    it('should return 200 if login is successful', async () => {
      User.findOne.mockResolvedValue({
        username: 'existingUser',
        password: 'hashedPassword',
      });
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockImplementation((payload, secret, options, callback) => {
        callback(null, 'token');
      });

      const { req, res } = createMocks({
        method: 'POST',
        body: {
          username: 'existingUser',
          password: 'password123',
        },
      });

      await login(req, res);

      expect(res._getStatusCode()).toBe(200);
      expect(res._getJSONData()).toEqual({ token: 'token' });
    });

    it('should return 500 if there is an internal server error', async () => {
      User.findOne.mockRejectedValue(new Error('Database error'));

      const { req, res } = createMocks({
        method: 'POST',
        body: {
          username: 'existingUser',
          password: 'password123',
        },
      });

      await login(req, res);

      expect(res._getStatusCode()).toBe(500);
      expect(res._getJSONData()).toEqual({ message: 'Server Error' });
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should return 405 if method is not POST', async () => {
      const { req, res } = createMocks({
        method: 'GET',
      });

      await logoutHandler(req, res);

      expect(res._getStatusCode()).toBe(405);
      expect(res._getData()).toEqual('Method GET Not Allowed on ');
    });

    it('should return 200 if logout is successful', async () => {
      const { req, res } = createMocks({
        method: 'POST',
      });

      await logoutHandler(req, res);

      expect(res._getStatusCode()).toBe(200);
      expect(res._getJSONData()).toEqual({ message: 'Logout successful' });
    });
  });
});
