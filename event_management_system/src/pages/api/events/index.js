import {
  getAllEvents,
  createEvent,
} from '../../../controllers/eventControllers';
import { authMiddleware } from '../../../lib/authMiddleware';
import { createEventValidator } from '../../../lib/validators/eventValidators';
import { runValidation } from '../../../utils/runValidation';

const allowedMethods = ['GET', 'POST'];

export default function eventHandler(req, res) {
  if (req.method === 'GET') {
    return getAllEvents(req, res);
  } else if (req.method === 'POST') {
    const createEventWithAuth = authMiddleware(async (authedReq, authedRes) => {
      const validationResult = await runValidation(
        createEventValidator,
        authedReq,
        authedRes
      );
      if (validationResult === false) return;
      return createEvent(authedReq, authedRes);
    });
    return createEventWithAuth(req, res);
  } else {
    res.setHeader('Allow', allowedMethods);
    res.status(405).end(`Method ${req.method} Not Allowed on ${req.url}`);
  }
}
