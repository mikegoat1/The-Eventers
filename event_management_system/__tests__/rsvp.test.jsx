import { createMocks } from 'node-mocks-http';
import {
  createRsvp,
  updateRsvp,
  deleteRsvp,
} from '../src/controllers/rsvpController';
import Rsvp from '../src/models/Rsvp';

jest.mock('../src/lib/mongoose');
jest.mock('../src/models/Rsvp');

describe('RSVP API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/rsvp', () => {
    it('should return 405 if method is not POST', async () => {
      const { req, res } = createMocks({
        method: 'GET',
      });

      await createRsvp(req, res);

      expect(res._getStatusCode()).toBe(405);
      expect(res._getJSONData()).toEqual({ message: 'Method Not Allowed' });
    });

    it('should return 200 if RSVP is created successfully', async () => {
      Rsvp.prototype.save = jest.fn().mockResolvedValue({
        eventId: 'eventId123',
        userId: 'userId123',
        status: 'attending',
      });

      const { req, res } = createMocks({
        method: 'POST',
        body: {
          eventId: 'eventId123',
          userId: 'userId123',
          status: 'attending',
        },
      });

      await createRsvp(req, res);

      expect(res._getStatusCode()).toBe(200);
      expect(res._getJSONData()).toEqual({ message: 'RSVP created' });
    });

    it('should return 500 if there is an internal server error', async () => {
      Rsvp.prototype.save = jest
        .fn()
        .mockRejectedValue(new Error('Database error'));

      const { req, res } = createMocks({
        method: 'POST',
        body: {
          eventId: 'eventId123',
          userId: 'userId123',
          status: 'attending',
        },
      });

      await createRsvp(req, res);

      expect(res._getStatusCode()).toBe(500);
      expect(res._getJSONData()).toEqual({ message: 'Internal server error' });
    });
  });

  describe('PUT /api/rsvp', () => {
    it('should return 405 if method is not PUT', async () => {
      const { req, res } = createMocks({
        method: 'GET',
      });

      await updateRsvp(req, res, 'rsvpId123');

      expect(res._getStatusCode()).toBe(405);
      expect(res._getJSONData()).toEqual({ message: 'Method Not Allowed' });
    });

    it('should return 404 if RSVP is not found', async () => {
      Rsvp.findById.mockResolvedValue(null);

      const { req, res } = createMocks({
        method: 'PUT',
        body: {
          status: 'maybe',
        },
      });

      await updateRsvp(req, res, 'rsvpId123');

      expect(res._getStatusCode()).toBe(404);
      expect(res._getJSONData()).toEqual({ message: 'RSVP not found' });
    });

    it('should return 200 if RSVP is updated successfully', async () => {
      Rsvp.findById.mockResolvedValue({
        status: 'attending',
        save: jest.fn().mockResolvedValue({}),
      });

      const { req, res } = createMocks({
        method: 'PUT',
        body: {
          status: 'maybe',
        },
      });

      await updateRsvp(req, res, 'rsvpId123');

      expect(res._getStatusCode()).toBe(200);
      expect(res._getJSONData()).toEqual({ message: 'RSVP updated' });
    });

    it('should return 500 if there is an internal server error', async () => {
      Rsvp.findById.mockRejectedValue(new Error('Database error'));

      const { req, res } = createMocks({
        method: 'PUT',
        body: {
          status: 'maybe',
        },
      });

      await updateRsvp(req, res, 'rsvpId123');

      expect(res._getStatusCode()).toBe(500);
      expect(res._getJSONData()).toEqual({ message: 'Internal server error' });
    });
  });

  describe('DELETE /api/rsvp', () => {
    it('should return 405 if method is not DELETE', async () => {
      const { req, res } = createMocks({
        method: 'GET',
      });

      await deleteRsvp(req, res, 'rsvpId123');

      expect(res._getStatusCode()).toBe(405);
      expect(res._getJSONData()).toEqual({ message: 'Method Not Allowed' });
    });

    it('should return 404 if RSVP is not found', async () => {
      Rsvp.findById.mockResolvedValue(null);

      const { req, res } = createMocks({
        method: 'DELETE',
      });

      await deleteRsvp(req, res, 'rsvpId123');

      expect(res._getStatusCode()).toBe(404);
      expect(res._getJSONData()).toEqual({ message: 'RSVP not found' });
    });

    it('should return 200 if RSVP is deleted successfully', async () => {
      Rsvp.findById.mockResolvedValue({
        deleteOne: jest.fn().mockResolvedValue({}),
      });

      const { req, res } = createMocks({
        method: 'DELETE',
      });

      await deleteRsvp(req, res, 'rsvpId123');

      expect(res._getStatusCode()).toBe(200);
      expect(res._getJSONData()).toEqual({ message: 'RSVP deleted' });
    });

    it('should return 500 if there is an internal server error', async () => {
      Rsvp.findById.mockRejectedValue(new Error('Database error'));

      const { req, res } = createMocks({
        method: 'DELETE',
      });

      await deleteRsvp(req, res, 'rsvpId123');

      expect(res._getStatusCode()).toBe(500);
      expect(res._getJSONData()).toEqual({ message: 'Internal server error' });
    });
  });
});
