import { dismissReminder } from '../../../controllers/reminderController';
import { authMiddleware } from '../../../lib/authMiddleware';

const allowedMethods = ['PATCH'];

const reminderHandler = async (req, res) => {
  const { id } = req.query;

  if (req.method === 'PATCH') {
    return dismissReminder(req, res, id);
  }

  res.setHeader('Allow', allowedMethods);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
};

export default authMiddleware(reminderHandler);
