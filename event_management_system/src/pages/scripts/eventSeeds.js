import { Event } from '../../models/index.js';
import fs from 'fs';
import path, { dirname }  from 'path';
import dotenv from 'dotenv';
import connectToDatabase from '../../lib/mongoose.js';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
const events = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../../Data/events.json'), 'utf-8'));
const seedEvents = async () => {
  try {
    await connectToDatabase();

    // await Event.deleteMany({}); // Clear existing events
    // console.log('Existing events deleted');

    for (const eventData of events) {
      const event = new Event({
        name: eventData.name,
        date: eventData.date,
        location: eventData.location,
        description: eventData.description,
        createdAt: eventData.createdAt,
      });
      await event.save();
      console.log(`✅ Created event: ${event.name}`);
    }
    console.log('🌱 Seeding complete!');
    process.exit();
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
}
seedEvents();