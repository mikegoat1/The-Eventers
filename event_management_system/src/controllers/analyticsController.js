import mongoose from 'mongoose';
import connectToDatabase from '../lib/mongoose';
import { Event } from '../models';

const objectId = (id) => {
  try {
    return new mongoose.Types.ObjectId(id);
  } catch {
    return null;
  }
};

const attendeeCountExpr = {
  $size: {
    $ifNull: ['$attendees', []],
  },
};

export const getOrganizerAnalytics = async (req, res) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const organizerObjectId = objectId(userId);
  if (!organizerObjectId) {
    return res.status(400).json({ message: 'Invalid user id' });
  }

  try {
    await connectToDatabase();
    const matchStage = { organizer: organizerObjectId };

    const [summaryResult] = await Event.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalEvents: { $sum: 1 },
          totalAttendees: { $sum: attendeeCountExpr },
        },
      },
    ]);

    const attendanceTrendsAgg = await Event.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m', date: '$date' },
          },
          totalEvents: { $sum: 1 },
          totalAttendees: { $sum: attendeeCountExpr },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const categoryPopularityAgg = await Event.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: { $ifNull: ['$category', 'Uncategorized'] },
          totalEvents: { $sum: 1 },
          totalAttendees: { $sum: attendeeCountExpr },
        },
      },
      { $sort: { totalEvents: -1 } },
    ]);

    const summary = {
      totalEvents: summaryResult?.totalEvents || 0,
      totalAttendees: summaryResult?.totalAttendees || 0,
    };
    summary.averageAttendeesPerEvent =
      summary.totalEvents > 0
        ? Number((summary.totalAttendees / summary.totalEvents).toFixed(1))
        : 0;

    const attendanceTrends = attendanceTrendsAgg.map((item) => ({
      period: item._id,
      totalEvents: item.totalEvents,
      totalAttendees: item.totalAttendees,
    }));

    const categoryPopularity = categoryPopularityAgg.map((item) => ({
      category: item._id,
      totalEvents: item.totalEvents,
      totalAttendees: item.totalAttendees,
    }));

    res
      .status(200)
      .json({ summary, attendanceTrends, categoryPopularity });
  } catch (error) {
    console.error('Error generating analytics:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
