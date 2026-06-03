import { createMocks } from 'node-mocks-http';
import {
  dismissReminder,
  getUserReminders,
  setEventReminder,
} from '../src/controllers/reminderController';
import Event from '../src/models/Event';
import { Reminder } from '../src/models';

jest.mock('../src/lib/mongoose', () => jest.fn());
jest.mock('../src/models/Event', () => ({
  findById: jest.fn(),
}));

const mockReminderSave = jest.fn();

jest.mock('../src/models', () => {
  const MockReminder = jest.fn().mockImplementation((data) => ({
    ...data,
    save: mockReminderSave,
  }));

  MockReminder.updateMany = jest.fn();
  MockReminder.find = jest.fn();
  MockReminder.findById = jest.fn();

  return { Reminder: MockReminder };
});

describe('Reminder controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('rejects malformed event ids before setting a reminder', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        remindAt: '2026-06-10T12:00:00.000Z',
      },
    });
    req.userId = '507f1f77bcf86cd799439011';

    await setEventReminder(req, res, 'bad-id');

    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toEqual({ message: 'Invalid event id' });
    expect(Event.findById).not.toHaveBeenCalled();
  });

  it('creates a scheduled notification reminder for an existing event', async () => {
    const eventId = '507f1f77bcf86cd799439021';
    const userId = '507f1f77bcf86cd799439011';
    Event.findById.mockResolvedValue({ _id: eventId });
    mockReminderSave.mockResolvedValue({});

    const { req, res } = createMocks({
      method: 'POST',
      body: {
        remindAt: '2026-06-10T12:00:00.000Z',
      },
    });
    req.userId = userId;

    await setEventReminder(req, res, eventId);

    expect(Reminder).toHaveBeenCalledWith({
      eventId,
      userId,
      remindAt: new Date('2026-06-10T12:00:00.000Z'),
      method: 'notification',
    });
    expect(res._getStatusCode()).toBe(201);
    expect(res._getJSONData().message).toBe('Reminder set');
  });

  it('promotes due scheduled reminders to delivered before returning them', async () => {
    const userId = '507f1f77bcf86cd799439011';
    const reminders = [
      {
        _id: '507f1f77bcf86cd799439031',
        userId,
        status: 'delivered',
      },
    ];
    const lean = jest.fn().mockResolvedValue(reminders);
    const sort = jest.fn().mockReturnValue({ lean });
    const populate = jest.fn().mockReturnValue({ sort });
    Reminder.updateMany.mockResolvedValue({ modifiedCount: 1 });
    Reminder.find.mockReturnValue({ populate });

    const { req, res } = createMocks({
      method: 'GET',
      query: { state: 'due' },
    });
    req.userId = userId;

    await getUserReminders(req, res);

    expect(Reminder.updateMany).toHaveBeenCalledWith(
      {
        userId,
        remindAt: { $lte: expect.any(Date) },
        status: 'scheduled',
      },
      {
        $set: {
          status: 'delivered',
          deliveredAt: expect.any(Date),
        },
      }
    );
    expect(Reminder.find).toHaveBeenCalledWith({
      userId,
      remindAt: { $lte: expect.any(Date) },
      status: 'delivered',
    });
    expect(populate).toHaveBeenCalledWith(
      'eventId',
      'name date location category'
    );
    expect(sort).toHaveBeenCalledWith({ remindAt: 1 });
    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({ reminders });
  });

  it('rejects reminder dismissal for reminders owned by another user', async () => {
    Reminder.findById.mockResolvedValue({
      userId: '507f1f77bcf86cd799439012',
    });

    const { req, res } = createMocks({ method: 'PATCH' });
    req.userId = '507f1f77bcf86cd799439011';

    await dismissReminder(req, res, '507f1f77bcf86cd799439031');

    expect(res._getStatusCode()).toBe(403);
    expect(res._getJSONData()).toEqual({ message: 'Forbidden' });
  });

  it('dismisses a reminder owned by the authenticated user', async () => {
    const reminder = {
      userId: '507f1f77bcf86cd799439011',
      status: 'delivered',
      dismissedAt: null,
      save: jest.fn().mockResolvedValue({}),
    };
    Reminder.findById.mockResolvedValue(reminder);

    const { req, res } = createMocks({ method: 'PATCH' });
    req.userId = '507f1f77bcf86cd799439011';

    await dismissReminder(req, res, '507f1f77bcf86cd799439031');

    expect(reminder.status).toBe('dismissed');
    expect(reminder.dismissedAt).toBeInstanceOf(Date);
    expect(reminder.save).toHaveBeenCalled();
    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData().message).toBe('Reminder dismissed');
  });
});
