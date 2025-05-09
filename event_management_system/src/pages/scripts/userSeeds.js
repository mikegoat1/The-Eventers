import { User } from '../../models';
import bcrypt from 'bcrypt';
import fs from 'fs';

import path from require('path');


// const users = JSON.parse(readFileSync(new URL('../../../Data/users.json', import.meta.url), 'utf-8'));
import users from '../../../Data/users.json';
const users = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../../Data/users.json'), 'utf-8'));
const seedUsers = async () => {
    try {
        await connectToDatabase();

        // await User.deleteMany({}); // Clear existing users
        // console.log('Existing users deleted');

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

seedUsers();