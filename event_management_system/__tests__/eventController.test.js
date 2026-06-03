import { createMocks } from 'node-mocks-http';
import {
  createEvent,
  deleteEvent,
  updateEvent,
} from '../src/controllers/eventControllers';
import { Event, Rsvp } from '../src/models/index';

jest.mock('../src/lib/mongoose', () => jest.fn().mockResolvedValue({}));
jest.mock('../src/models/index', () => {
  const Event = jest.fn();
  Event.findById = jest.fn();
  Event.findByIdAndUpdate = jest.fn();

  return {
    Event,
    Rsvp: {
      findOneAndUpdate: jest.fn(),
    },
  };
});

const EVENT_ID = '507f1f77bcf86cd799439011';
const USER_ID = '507f1f77bcf86cd799439012';
const OTHER_USER_ID = '507f1f77bcf86cd799439013';

describe('Event controller authorization', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('rejects malformed event ids before updating', async () => {
    const { req, res } = createMocks({
      method: 'PUT',
      body: { name: 'Updated Event' },
    });
    req.userId = USER_ID;

    await updateEvent(req, res, 'not-an-id');

    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toEqual({ message: 'Invalid event id' });
    expect(Event.findById).not.toHaveBeenCalled();
  });

  it('allows an organizer to update their event without wiping omitted fields', async () => {
    const event = {
      name: 'Original Event',
      location: 'Original Hall',
      organizer: USER_ID,
      save: jest.fn().mockResolvedValue({}),
    };
    Event.findById.mockResolvedValue(event);

    const { req, res } = createMocks({
      method: 'PUT',
      body: { name: 'Updated Event' },
    });
    req.userId = USER_ID;

    await updateEvent(req, res, EVENT_ID);

    expect(res._getStatusCode()).toBe(200);
    expect(event.name).toBe('Updated Event');
    expect(event.location).toBe('Original Hall');
    expect(event.save).toHaveBeenCalledTimes(1);
  });

  it('rejects event updates from non-organizers', async () => {
    const event = {
      organizer: OTHER_USER_ID,
      save: jest.fn(),
    };
    Event.findById.mockResolvedValue(event);

    const { req, res } = createMocks({
      method: 'PUT',
      body: { name: 'Updated Event' },
    });
    req.userId = USER_ID;

    await updateEvent(req, res, EVENT_ID);

    expect(res._getStatusCode()).toBe(403);
    expect(res._getJSONData()).toEqual({ message: 'Forbidden' });
    expect(event.save).not.toHaveBeenCalled();
  });

  it('allows an organizer to delete their event', async () => {
    const event = {
      organizer: USER_ID,
      deleteOne: jest.fn().mockResolvedValue({}),
    };
    Event.findById.mockResolvedValue(event);

    const { req, res } = createMocks({ method: 'DELETE' });
    req.userId = USER_ID;

    await deleteEvent(req, res, EVENT_ID);

    expect(res._getStatusCode()).toBe(200);
    expect(event.deleteOne).toHaveBeenCalledTimes(1);
  });

  it('rejects event deletion from non-organizers', async () => {
    const event = {
      organizer: OTHER_USER_ID,
      deleteOne: jest.fn(),
    };
    Event.findById.mockResolvedValue(event);

    const { req, res } = createMocks({ method: 'DELETE' });
    req.userId = USER_ID;

    await deleteEvent(req, res, EVENT_ID);

    expect(res._getStatusCode()).toBe(403);
    expect(res._getJSONData()).toEqual({ message: 'Forbidden' });
    expect(event.deleteOne).not.toHaveBeenCalled();
  });

  it('ignores client-supplied attendees when creating an event', async () => {
    const save = jest.fn().mockResolvedValue({});
    Event.mockImplementation(function EventModel(data) {
      Object.assign(this, data);
      this._id = EVENT_ID;
      this.save = save;
    });
    Rsvp.findOneAndUpdate.mockResolvedValue({});
    Event.findByIdAndUpdate.mockResolvedValue({});

    const { req, res } = createMocks({
      method: 'POST',
      body: {
        name: 'New Event',
        date: '2026-06-10T12:00:00.000Z',
        location: 'Test Hall',
        category: 'Music',
        attendees: [OTHER_USER_ID],
      },
    });
    req.userId = USER_ID;

    await createEvent(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(Event).toHaveBeenCalledWith(
      expect.objectContaining({
        attendees: [],
        organizer: USER_ID,
      })
    );
    expect(Rsvp.findOneAndUpdate).toHaveBeenCalledWith(
      { eventId: EVENT_ID, userId: USER_ID },
      { status: 'attending' },
      { upsert: true, new: true }
    );
  });
});
