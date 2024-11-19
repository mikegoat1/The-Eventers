import {
  createRsvp,
  updateRsvp,
  deleteRsvp,
} from '../../../controllers/rsvpController';

const allowedMethods = ['POST', 'PUT', 'DELETE'];

export default function rsvpHandler(req, res) {
  const id = req.body._id;
  if (req.method === 'POST') {
    return createRsvp(req, res);
  } else if (req.method === 'PUT') {
    return updateRsvp(req, res, id);
  } else if (req.method === 'DELETE') {
    return deleteRsvp(req, res, id);
  } else {
    res.setHeader('Allow', allowedMethods);
    res.status(405).end(`Method ${req.method} Not Allowed on ${req.url}`);
  }
}
