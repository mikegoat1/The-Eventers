import {
  getAllEvents,
  createEvent,
} from '../../../controllers/eventControllers';
import { authMiddleware } from '../../../lib/authMiddleware';

const allowedMethods = ['GET', 'POST'];

export default function eventHandler(req, res) {
  if (req.method === 'GET') {
    return getAllEvents(req, res);
  } else if (req.method === 'POST') {
    const createEventWithAuth = authMiddleware(createEvent);
    return createEventWithAuth(req, res);
  } else {
    res.setHeader('Allow', allowedMethods);
    res.status(405).end(`Method ${req.method} Not Allowed on ${req.url}`);
  }
}
