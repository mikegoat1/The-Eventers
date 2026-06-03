import connectToDatabase from '../lib/mongoose';
import Event from '../models/Event';
import { Reminder } from '../models';
import { validationResult } from 'express-validator';
import mongoose from 'mongoose';

const ACTIVE_REMINDER_STATUSES = ['scheduled', 'delivered'];

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const setEventReminder = async (req, res, eventId) => {
  const { remindAt, method } = req.body;
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  if (!isValidObjectId(eventId)) {
    return res.status(400).json({ message: 'Invalid event id' });
  }

  try {
    await connectToDatabase();
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const reminder = new Reminder({
      eventId,
      userId,
      remindAt: new Date(remindAt),
      method: method || 'notification',
    });

    await reminder.save();

    res.status(201).json({ message: 'Reminder set', reminder });
  } catch (error) {
    console.error('Error setting reminder:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getUserReminders = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const state = req.query?.state || 'active';
  const now = new Date();
  let query = {
    userId,
    status: { $in: ACTIVE_REMINDER_STATUSES },
  };

  if (state === 'due') {
    query = {
      userId,
      remindAt: { $lte: now },
      status: 'delivered',
    };
  } else if (state === 'upcoming') {
    query = {
      userId,
      remindAt: { $gt: now },
      status: 'scheduled',
    };
  } else if (state === 'all') {
    query = {
      userId,
      status: { $ne: 'dismissed' },
    };
  }

  try {
    await connectToDatabase();

    if (state === 'due') {
      await Reminder.updateMany(
        {
          userId,
          remindAt: { $lte: now },
          status: 'scheduled',
        },
        {
          $set: {
            status: 'delivered',
            deliveredAt: now,
          },
        }
      );
    }

    const reminders = await Reminder.find(query)
      .populate('eventId', 'name date location category')
      .sort({ remindAt: 1 })
      .lean();

    return res.status(200).json({ reminders });
  } catch (error) {
    console.error('Error loading reminders:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const dismissReminder = async (req, res, reminderId) => {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (!isValidObjectId(reminderId)) {
    return res.status(400).json({ message: 'Invalid reminder id' });
  }

  try {
    await connectToDatabase();

    const reminder = await Reminder.findById(reminderId);

    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }

    if (String(reminder.userId) !== String(userId)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    reminder.status = 'dismissed';
    reminder.dismissedAt = new Date();
    await reminder.save();

    return res.status(200).json({ message: 'Reminder dismissed', reminder });
  } catch (error) {
    console.error('Error dismissing reminder:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
