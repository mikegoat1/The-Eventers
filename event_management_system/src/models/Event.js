import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  description: { type: String },
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  category: {
    type: String,
    enum: ['Music', 'Sports', 'Education', 'Health', 'Technology', 'Other'],
    required: false,
  },
});

const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);

export default Event;
