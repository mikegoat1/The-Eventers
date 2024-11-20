import { setEventReminder } from '../../../../controllers/reminderController';

const allowedMethods = ['POST'];

export default function reminderHandler(req, res) {
  const { id: eventId } = req.query;
  if (req.method === 'POST') {
    return setEventReminder(req, res, eventId);
  } else {
    res.setHeader('Allow', allowedMethods);
    res.status(405).end(`Method ${req.method} Not Allowed on ${req.url}`);
  }
}
