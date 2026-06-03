const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb://localhost:27017/event_management_system';

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
  },
});

const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);

const seedEvents = async () => {
  try {
    const eventsPath = path.resolve(__dirname, '../Data/events.json');
    const events = JSON.parse(fs.readFileSync(eventsPath, 'utf-8'));

    await mongoose.connect(MONGODB_URI);
    await Event.deleteMany({});

    for (const eventData of events) {
      await Event.create({
        name: eventData.name,
        date: eventData.date,
        location: eventData.location,
        description: eventData.description,
        attendees: eventData.attendees,
        category: eventData.category,
      });
    }

    console.log(`Seeded ${events.length} events.`);
    await mongoose.disconnect();
  } catch (error) {
    console.error('Event seeding failed:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedEvents();
