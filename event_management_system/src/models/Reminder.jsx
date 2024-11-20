import mongoose from 'mongoose';

const ReminderSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  remindAt: {
    type: Date,
    required: true,
  },
  method: {
    type: String,
    enum: ['email', 'notification'],
    default: 'notification',
  },
});
const Reminder =
  mongoose.models.Reminder || mongoose.model('Reminder', ReminderSchema);
export default Reminder;
