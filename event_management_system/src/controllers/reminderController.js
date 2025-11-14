import connectToDatabase from '../lib/mongoose';
import Event from '../models/Event';
import { Reminder } from '../models';
import { validationResult } from 'express-validator';

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
