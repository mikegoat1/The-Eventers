import bcrypt from 'bcrypt';
import connectToDatabase from '../../../lib/mongoose';
import User from '../../../models/User';

const registerHandler = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { username, password } = req.body;

  try {
    await connectToDatabase();

    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(200).json({ message: 'Register successful' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default registerHandler;
