import { createMocks } from 'node-mocks-http';
import {
  createEventMessage,
  getEventMessages,
} from '../src/controllers/messageController';
import { Event, Message } from '../src/models';

jest.mock('../src/lib/mongoose', () => jest.fn());
jest.mock('../src/models', () => ({
  Event: {
    exists: jest.fn(),
  },
  Message: {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
  },
}));

describe('Message controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('rejects malformed event ids before loading messages', async () => {
    const { req, res } = createMocks({ method: 'GET' });

    await getEventMessages(req, res, 'bad-id');

    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toEqual({ message: 'Invalid event id' });
    expect(Event.exists).not.toHaveBeenCalled();
  });

  it('returns event messages in creation order', async () => {
    const eventId = '507f1f77bcf86cd799439021';
    const messages = [
      {
        _id: '507f1f77bcf86cd799439041',
        body: 'See you there',
      },
    ];
    const lean = jest.fn().mockResolvedValue(messages);
    const limit = jest.fn().mockReturnValue({ lean });
    const sort = jest.fn().mockReturnValue({ limit });
    const populate = jest.fn().mockReturnValue({ sort });

    Event.exists.mockResolvedValue({ _id: eventId });
    Message.find.mockReturnValue({ populate });

    const { req, res } = createMocks({ method: 'GET' });

    await getEventMessages(req, res, eventId);

    expect(Message.find).toHaveBeenCalledWith({ eventId });
    expect(populate).toHaveBeenCalledWith('userId', 'username');
    expect(sort).toHaveBeenCalledWith({ createdAt: 1 });
    expect(limit).toHaveBeenCalledWith(100);
    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({ messages });
  });

  it('requires authentication before creating a message', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: { body: 'Hello' },
    });

    await createEventMessage(req, res, '507f1f77bcf86cd799439021');

    expect(res._getStatusCode()).toBe(401);
    expect(res._getJSONData()).toEqual({ message: 'Unauthorized' });
  });

  it('creates a trimmed event message for the authenticated user', async () => {
    const eventId = '507f1f77bcf86cd799439021';
    const userId = '507f1f77bcf86cd799439011';
    const createdId = '507f1f77bcf86cd799439041';
    const message = {
      _id: createdId,
      eventId,
      userId: { _id: userId, username: 'nkalinowsky0' },
      body: 'Hello everyone',
    };
    const lean = jest.fn().mockResolvedValue(message);
    const populate = jest.fn().mockReturnValue({ lean });

    Event.exists.mockResolvedValue({ _id: eventId });
    Message.create.mockResolvedValue({ _id: createdId });
    Message.findById.mockReturnValue({ populate });

    const { req, res } = createMocks({
      method: 'POST',
      body: { body: '  Hello everyone  ' },
    });
    req.userId = userId;

    await createEventMessage(req, res, eventId);

    expect(Message.create).toHaveBeenCalledWith({
      eventId,
      userId,
      body: 'Hello everyone',
    });
    expect(Message.findById).toHaveBeenCalledWith(createdId);
    expect(populate).toHaveBeenCalledWith('userId', 'username');
    expect(res._getStatusCode()).toBe(201);
    expect(res._getJSONData()).toEqual({ message });
  });
});
