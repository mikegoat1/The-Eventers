import eventHandler from '../src/pages/api/events/index';
import eventHandlerId from '../src/pages/api/events/[id]';
import jwt from 'jsonwebtoken';
import {
  getAllEvents,
  createEvent,
  getEventById,
  updateEvent,
  deleteEvent,
} from '../src/controllers/eventControllers';
import { createMocks } from 'node-mocks-http';

jest.mock('../src/controllers/eventControllers');

const JWT_SECRET = 'mocksecret';
const authCookie = () =>
  `token=${jwt.sign({ userId: 'userId123' }, JWT_SECRET)}`;

describe('API Route: /api/events', () => {
  beforeAll(() => {
    process.env.JWT_SECRET = JWT_SECRET;
  });

  it('should handle GET requests', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    await eventHandler(req, res);

    expect(getAllEvents).toHaveBeenCalledWith(req, res);
  });

  it('should handle POST requests', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      headers: {
        cookie: authCookie(),
      },
      body: {
        name: 'Test Event',
        date: '2026-06-10T12:00:00.000Z',
        location: 'Test Hall',
        category: 'Music',
      },
    });

    await eventHandler(req, res);

    expect(createEvent).toHaveBeenCalledWith(req, res);
  });

  it('should return 405 for unsupported methods', async () => {
    const { req, res } = createMocks({
      method: 'DELETE',
    });

    await eventHandler(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(res._getHeaders().allow).toEqual(['GET', 'POST']);
    expect(res._getData()).toBe('Method DELETE Not Allowed on ');
  });

  describe('API Route: /api/events/[id]', () => {
    it('should handle GET requests', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        query: { id: '1' },
      });

      await eventHandlerId(req, res);

      expect(getEventById).toHaveBeenCalledWith(req, res, '1');
    });

    it('should handle PUT requests', async () => {
      const { req, res } = createMocks({
        method: 'PUT',
        query: { id: '1' },
        headers: {
          cookie: authCookie(),
        },
        body: {
          name: 'Updated Event',
        },
      });

      await eventHandlerId(req, res);

      expect(updateEvent).toHaveBeenCalledWith(req, res, '1');
    });

    it('should handle DELETE requests', async () => {
      const { req, res } = createMocks({
        method: 'DELETE',
        query: { id: '1' },
        headers: {
          cookie: authCookie(),
        },
      });

      await eventHandlerId(req, res);

      expect(deleteEvent).toHaveBeenCalledWith(req, res, '1');
    });

    it('should return 405 for unsupported methods', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        query: { id: '1' },
      });

      await eventHandlerId(req, res);

      expect(res._getStatusCode()).toBe(405);
      expect(res._getHeaders().allow).toEqual(['GET', 'PUT', 'DELETE']);
      expect(res._getData()).toBe('Method POST Not Allowed');
    });
  });
});
