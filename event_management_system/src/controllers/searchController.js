import connectToDatabase from '../lib/mongoose';
import { Event } from '../models';

export const searchEvents = async (req, res) => {
  const { keyword, category, date } = req.query;

  try {
    await connectToDatabase();

    const query = {};
    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { location: { $regex: keyword, $options: 'i' } },
        { category: { $regex: keyword, $options: 'i' } },
      ];
    }

    // if (category) {
    //   query.category = category;
    // }
    // if (date) {
    //   const targetDate = new Date(date);
    //   query.date = { $gte: targetDate };
    // }
    const events = await Event.find(query);
    res.status(200).json(events);
  } catch (error) {
    console.error('Error searching events:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
