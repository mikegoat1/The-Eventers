import connectToDatabase from '../lib/mongoose';
import Rsvp from '../models/Rsvp';
import Event from '../models/Event';

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
      await Event.findByIdAndUpdate(eventId, {
        $addToSet: { attendees: userId },
      });
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
    const rsvp = await Rsvp.findById(id);
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
