import request from 'supertest';
import bcrypt from 'bcrypt';
import { createMocks } from 'node-mocks-http';
import loginHandler from '../src/pages/api/auth/login';
import connectToDatabase from '../src/lib/mongoose';
import {User} from '../src/models';

jest.mock('../src/lib/mongoose');
jest.mock('../src/models/User');

describe('POST /api/auth/login', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 405 if method is not POST', async () => {
        const { req, res } = createMocks({
            method: 'GET',
        });

        await loginHandler[1](req, res);

        expect(res.statusCode).toBe(405);
        expect(res._getJSONData()).toEqual({ message: 'Method Not Allowed' });
    });

    it('should return 400 if input is invalid', async () => {
        const { req, res } = createMocks({
            method: 'POST',
            body: {
                username: '',
                password: '',
            },
        });

        await loginHandler[0](req, res);
        await loginHandler[1](req, res);

        expect(res.statusCode).toBe(400);
        expect(res._getJSONData()).toEqual({ message: 'Invalid input' });
    });

    it('should return 400 if user is not found', async () => {
        User.findOne.mockResolvedValue(null);

        const { req, res } = createMocks({
            method: 'POST',
            body: {
                username: 'testuser',
                password: 'testpassword',
            },
        });

        await loginHandler[0](req, res);
        await loginHandler[1](req, res);

        expect(res.statusCode).toBe(400);
        expect(res._getJSONData()).toEqual({ message: 'Invalid credentials' });
    });

    it('should return 400 if password does not match', async () => {
        User.findOne.mockResolvedValue({ username: 'testuser', password: 'hashedpassword' });
        bcrypt.compare.mockResolvedValue(false);

        const { req, res } = createMocks({
            method: 'POST',
            body: {
                username: 'testuser',
                password: 'testpassword',
            },
        });

        await loginHandler[0](req, res);
        await loginHandler[1](req, res);

        expect(res.statusCode).toBe(400);
        expect(res._getJSONData()).toEqual({ message: 'Invalid credentials' });
    });

    it('should return 200 if login is successful', async () => {
        User.findOne.mockResolvedValue({ username: 'testuser', password: 'hashedpassword' });
        bcrypt.compare.mockResolvedValue(true);

        const { req, res } = createMocks({
            method: 'POST',
            body: {
                username: 'testuser',
                password: 'testpassword',
            },
        });

        await loginHandler[0](req, res);
        await loginHandler[1](req, res);

        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual({ message: 'Login successful' });
    });

    it('should return 500 if there is a server error', async () => {
        User.findOne.mockRejectedValue(new Error('Database error'));

        const { req, res } = createMocks({
            method: 'POST',
            body: {
                username: 'testuser',
                password: 'testpassword',
            },
        });

        await loginHandler[0](req, res);
        await loginHandler[1](req, res);

        expect(res.statusCode).toBe(500);
        expect(res._getJSONData()).toEqual({ message: 'Internal server error' });
    });
});