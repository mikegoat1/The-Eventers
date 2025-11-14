import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import connectToDatabase from '../lib/mongoose';
import * as cookie from 'cookie';
import { User } from '../models';

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  return secret;
};

export const register = async (req, res) => {
  const { username, password } = req.body;

  try {
    await connectToDatabase();
    const secret = getJwtSecret();
    const normalizedUsername = username?.toLowerCase();

    let user = await User.findOne({ username: normalizedUsername });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      username: normalizedUsername,
      password: hashedPassword,
    });

    await user.save();

    const payload = { userId: user._id };
    const token = await new Promise((resolve, reject) => {
      jwt.sign(
        payload,
        secret,
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
      })
    );
    res
      .status(201)
      .json({ message: 'Register successful', userId: user._id });
  } catch (err) {
    console.error(err);
    if (err.message.includes('JWT_SECRET')) {
      return res
        .status(500)
        .json({ message: 'Server misconfiguration: JWT secret missing' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    await connectToDatabase();
    const secret = getJwtSecret();
    const normalizedUsername = username?.toLowerCase();

    let user = await User.findOne({ username: normalizedUsername });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload = { userId: user._id };
    const token = await new Promise((resolve, reject) => {
      jwt.sign(
        payload,
        secret,
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
      })
    );

    res.status(200).json({ userId: user._id });
  } catch (err) {
    console.error(err);
    if (err.message.includes('JWT_SECRET')) {
      return res
        .status(500)
        .json({ message: 'Server misconfiguration: JWT secret missing' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
};

export const logout = async (req, res) => {
  res.setHeader(
    'Set-Cookie',
    cookie.serialize('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: -1,
      sameSite: 'strict',
      path: '/',
    })
  );
  res.status(200).json({ message: 'Logout successful' });
};
