import connectToDatabase from '../lib/mongoose';
import { Event } from '../models/index';

export const getAllEvents = async (req, res) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  // The enhanced method allows for both filtered and unfiltered event retrieval through the same endpoint:
  // /api/events (all events)
  // /api/events?search=party (search events)
  // /api/events?category=Music (filter by category)
  // /api/events?search=party&category=Music (combined search and filter)
  const { search, category } = req.query;
  let filter = {};

  try {
    await connectToDatabase();
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) {
      filter.category = category;
    }

    const events = await Event.find(filter);
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getEventById = async (req, res, id) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  try {
    await connectToDatabase();
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
export const updateEvent = async (req, res, id) => {
  if (req.method !== 'PUT') {
    res.setHeader('Allow', ['PUT']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  const { name, date, location, description, attendees, category } = req.body;
  try {
    await connectToDatabase();
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    event.name = name;
    event.description = description;
    event.date = date;
    event.location = location;
    event.attendees = attendees;
    event.category = category;
    await event.save();
    res.status(200).json({ message: 'Event updated' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createEvent = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  const { name, date, location, description, attendees, category } = req.body;

  try {
    await connectToDatabase();
    const event = new Event({
      name,
      date,
      location,
      description,
      attendees,
      category,
    });
    await event.save();
    res.status(200).json({ message: 'Event created' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteEvent = async (req, res, id) => {
  if (req.method !== 'DELETE') {
    res.setHeader('Allow', ['DELETE']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  try {
    await connectToDatabase();
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    await event.deleteOne();
    res.status(200).json({ message: 'Event deleted' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
