import { setEventReminder } from '../../../../controllers/reminderController';
import { authMiddleware } from '../../../../lib/authMiddleware';
import { runValidation } from '../../../../utils/runValidation';
import { reminderValidator } from '../../../../lib/validators/reminderValidators';

const allowedMethods = ['POST'];

const reminderHandler = async (req, res) => {
  const { id: eventId } = req.query;
  if (req.method === 'POST') {
    const valid = await runValidation(reminderValidator, req, res);
    if (valid === false) return;
    return setEventReminder(req, res, eventId);
  } else {
    res.setHeader('Allow', allowedMethods);
    res.status(405).end(`Method ${req.method} Not Allowed on ${req.url}`);
  }
};

export default authMiddleware(reminderHandler);
