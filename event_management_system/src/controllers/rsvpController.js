import connectToDatabase from '../lib/mongoose';

import { Rsvp, Event } from '../models';

export const getRsvp = async (req, res) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    await connectToDatabase();

    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: 'Missing userId in query' });
    }

    const rsvp = await Rsvp.find({ userId }).populate('eventId');

    const events = rsvp.map(rsvp => {
      const event = rsvp.eventId;
      return {
        _id: event._id.toString(),
        name: event.name,
        date: event.date,
        description: event.description,
        category: event.category,
        location: event.location,
        attendees: event.attendees || [],
      };
    });

    res.status(200).json({ events });
  } catch (error) {
    console.error('Error fetching RSVPs:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createRsvp = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  const { eventId, userId, status } = req.body;

  try {
    await connectToDatabase();
    const rsvp = new Rsvp({ eventId, userId, status });
    await rsvp.save();
    if (status === 'attending') {
      const eventUpdateResult = await Event.findByIdAndUpdate(eventId, {
        $addToSet: { attendees: userId },
      });
      console.log('Event update result:', eventUpdateResult);
    }
    res.status(200).json({ message: 'RSVP created' });
  } catch (error) {
    console.error('Error creating RSVP:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateRsvp = async (req, res, id) => {
  if (req.method !== 'PUT') {
    res.setHeader('Allow', ['PUT']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  const { status } = req.body;

  try {
    await connectToDatabase();
    const rsvp = await Rsvp.findById(id).exec();
    if (!rsvp) {
      return res.status(404).json({ message: 'RSVP not found' });
    }
    const previousStatus = rsvp.status;
    rsvp.status = status;
    await rsvp.save();
    if (previousStatus !== 'attending' && status === 'attending') {
      await Event.findByIdAndUpdate(rsvp.eventId, {
        $addToSet: { attendees: rsvp.userId },
      });
    } else if (previousStatus === 'attending' && status !== 'attending') {
      await Event.findByIdAndUpdate(rsvp.eventId, {
        $pull: { attendees: rsvp.userId },
      });
    }
    res.status(200).json({ message: 'RSVP updated' });
  } catch (error) {
    console.error('Error updating RSVP:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteRsvp = async (req, res, id) => {
  if (req.method !== 'DELETE') {
    res.setHeader('Allow', ['DELETE']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  try {
    await connectToDatabase();
    const rsvp = await Rsvp.findById(id);
    if (!rsvp) {
      return res.status(404).json({ message: 'RSVP not found' });
    }
    if (rsvp.status === 'attending') {
      await Event.findByIdAndUpdate(rsvp.eventId, {
        $pull: { attendees: rsvp.userId },
      });
    }
    await rsvp.deleteOne();
    res.status(200).json({ message: 'RSVP deleted' });
  } catch (error) {
    console.error('Error deleting RSVP:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
