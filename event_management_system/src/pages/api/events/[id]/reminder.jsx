import connectToDatabase from '../lib/mongoose';
import Event from '../models/Event';
import Reminder from '../models/Reminder';

export const setEventReminder = async (req, res, eventId) => {
  const { userId, remindAt } = req.body;

  try {
    await connectToDatabase();
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const reminder = new Reminder({
      eventId,
      userId,
      remindAt,
    });

    await reminder.save();

    res.status(201).json({ message: 'Reminder set', reminder });
  } catch (error) {
    console.error('Error setting reminder:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
