import { getAllEvents, createEvent } from '../../../controllers/eventController';

export default function handler(req, res) {
  if (req.method === 'GET') {
    return getAllEvents(req, res);
  } else if (req.method === 'POST') {
    return createEvent(req, res);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}