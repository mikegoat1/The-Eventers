import mongoose from 'mongoose';

const ReminderSchema = new mongoose.Schema(
  {
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
    status: {
      type: String,
      enum: ['scheduled', 'delivered', 'dismissed'],
      default: 'scheduled',
    },
    deliveredAt: {
      type: Date,
      default: null,
    },
    dismissedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Reminder =
  mongoose.models.Reminder || mongoose.model('Reminder', ReminderSchema);
export default Reminder;
