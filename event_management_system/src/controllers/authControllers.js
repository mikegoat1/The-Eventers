import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import connectToDatabase from '../lib/mongoose';
import * as cookie from 'cookie';
import { User } from '../models';

export const register = async (req, res) => {
  const { username, password } = req.body;

  try {
    await connectToDatabase();

    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      username,
      password: hashedPassword,
    });

    await user.save();

    const payload = { userId: user._id };
    const token = await new Promise((resolve, reject) => {
      jwt.sign(
        payload,
        process.env.JWT_SECRET || 'mocksecret',
        { expiresIn: '1h' },
        (err, token) => {
          if (err) reject(err);
          else resolve(token);
        }
      );
    });
    res.setHeader(
      'Set-Cookie',
      cookie.serialize('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60, // 1 hour
        sameSite: 'strict',
        path: '/',
      }));
    res
      .status(201)
      .json({ message: 'Register successful', userId: user._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  console.log('LOGIN USERNAME:', username);
  try {
    await connectToDatabase();
    // let test = await User.find();
    // console.log('TEST:', test);
    let user = await User.findOne({ username: username.toLowerCase() });
    // console.log('USER:', user);
    // console.log('Users in DB:', user.map(u => u.username));

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials username' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials password' });
    }

    const payload = { userId: user._id };
    const token = await new Promise((resolve, reject) => {
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '1h' },
        (err, token) => {
          if (err) reject(err);
          else resolve(token);
        }
      );
    });
    res.setHeader(
      'Set-Cookie',
      cookie.serialize('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60, // 1 hour
        sameSite: 'strict',
        path: '/',
      }));

    res.status(200).json({ userId: user._id });
  } catch (err) {
    console.error(err);
    console.error('LOGIN ERROR:', err.message);
    console.error('STACK:', err.stack);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const logout = async (req, res) => {
  res.status(200).json({ message: 'Logout successful' });
};
