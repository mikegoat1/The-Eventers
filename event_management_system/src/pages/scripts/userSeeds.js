import connectToDatabase from '../lib/mongoose';
import User from '../models/User';
import bcrypt from 'bcrypt';

import users from './userSeeds.json';
import { create } from '@mui/material/styles/createTransitions';

const seedUsers = async () => {
    try {
        await connectToDatabase();

        await User.deleteMany({}); // Clear existing users
        console.log('Existing users deleted');

        for (const userData of users) {
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            const user = new User({
                username: userData.username,
                password: hashedPassword,
                createdAt: userData.createdAt,
            });
            await user.save();
            console.log(`✅ Created user: ${user.username}`);
        }
        console.log('🌱 Seeding complete!');
        process.exit();
    } catch (error) {
        console.error('❌ Seeding error:', error);
        process.exit(1);
    }
}