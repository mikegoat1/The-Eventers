import { getUserReminders } from '../../../controllers/reminderController';
import { authMiddleware } from '../../../lib/authMiddleware';

const allowedMethods = ['GET'];

const remindersHandler = async (req, res) => {
  if (req.method === 'GET') {
    return getUserReminders(req, res);
  }

  res.setHeader('Allow', allowedMethods);
  return res.status(405).end(`Method ${req.method} Not Allowed on ${req.url}`);
};

export default authMiddleware(remindersHandler);
