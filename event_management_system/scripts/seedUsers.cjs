const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb://localhost:27017/event_management_system';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

const seedUsers = async () => {
  try {
    const usersPath = path.resolve(__dirname, '../Data/users.json');
    const users = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));

    await mongoose.connect(MONGODB_URI);

    for (const userData of users) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      await User.findOneAndUpdate(
        { username: userData.username.toLowerCase() },
        {
          username: userData.username.toLowerCase(),
          password: hashedPassword,
          createdAt: userData.createdAt,
        },
        { upsert: true, new: true }
      );
    }

    console.log(`Seeded ${users.length} users.`);
    await mongoose.disconnect();
  } catch (error) {
    console.error('User seeding failed:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedUsers();
