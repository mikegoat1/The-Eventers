import {
  createRsvp,
  updateRsvp,
  deleteRsvp,
  getRsvp,
} from '../../../controllers/rsvpController';
import { authMiddleware } from '../../../lib/authMiddleware';
import {
  createRsvpValidator,
  updateRsvpValidator,
} from '../../../lib/validators/rsvpValidators';
import { runValidation } from '../../../utils/runValidation';

const allowedMethods = ['POST', 'PUT', 'DELETE', 'GET'];

const rsvpHandler = (req, res) => {
  const id = req.body._id;
  if (req.method === 'POST') {
    return runValidation(createRsvpValidator, req, res).then((valid) => {
      if (valid === false) return;
      return createRsvp(req, res);
    });
  } else if (req.method === 'PUT') {
    return runValidation(updateRsvpValidator, req, res).then((valid) => {
      if (valid === false) return;
      return updateRsvp(req, res, id);
    });
  } else if (req.method === 'DELETE') {
    return deleteRsvp(req, res, id);
  } else if (req.method === 'GET') {
    return getRsvp(req, res);
  } else {
    res.setHeader('Allow', allowedMethods);
    res.status(405).end(`Method ${req.method} Not Allowed on ${req.url}`);
  }
};

export default authMiddleware(rsvpHandler);
