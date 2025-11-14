import mongoose from 'mongoose';
import connectToDatabase from '../../../lib/mongoose';
import { Event } from '../../../models/index';
import { authMiddleware } from '../../../lib/authMiddleware';

const allowedMethods = ['GET'];

const organizerEventsHandler = async (req, res) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', allowedMethods);
    return res.status(405).end(`Method ${req.method} Not Allowed on ${req.url}`);
  }

  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  let organizerId;
  try {
    organizerId = new mongoose.Types.ObjectId(userId);
  } catch {
    return res.status(400).json({ message: 'Invalid user id' });
  }

  try {
    await connectToDatabase();
    const events = await Event.find({ organizer: organizerId })
      .sort({ date: 1 })
      .lean();
    return res.status(200).json({ events });
  } catch (error) {
    console.error('Error fetching organizer events:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export default authMiddleware(organizerEventsHandler);
