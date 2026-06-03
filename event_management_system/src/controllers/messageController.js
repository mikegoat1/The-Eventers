import mongoose from 'mongoose';
import { validationResult } from 'express-validator';
import connectToDatabase from '../lib/mongoose';
import { Event, Message } from '../models';

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const getEventMessages = async (req, res, eventId) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  if (!isValidObjectId(eventId)) {
    return res.status(400).json({ message: 'Invalid event id' });
  }

  try {
    await connectToDatabase();

    const eventExists = await Event.exists({ _id: eventId });
    if (!eventExists) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const messages = await Message.find({ eventId })
      .populate('userId', 'username')
      .sort({ createdAt: 1 })
      .limit(100)
      .lean();

    return res.status(200).json({ messages });
  } catch (error) {
    console.error('Error loading event messages:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const createEventMessage = async (req, res, eventId) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (!isValidObjectId(eventId)) {
    return res.status(400).json({ message: 'Invalid event id' });
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    await connectToDatabase();

    const eventExists = await Event.exists({ _id: eventId });
    if (!eventExists) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const created = await Message.create({
      eventId,
      userId,
      body: req.body.body.trim(),
    });

    const message = await Message.findById(created._id)
      .populate('userId', 'username')
      .lean();

    return res.status(201).json({ message });
  } catch (error) {
    console.error('Error creating event message:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
