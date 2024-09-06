import { getAllEvents,  s } from '../../../controllers/eventController';

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

// I need to question why am I 405 error coding in this situation.?