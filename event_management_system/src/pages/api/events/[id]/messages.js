import {
  createEventMessage,
  getEventMessages,
} from '../../../../controllers/messageController';
import { authMiddleware } from '../../../../lib/authMiddleware';
import { createMessageValidator } from '../../../../lib/validators/messageValidators';
import { runValidation } from '../../../../utils/runValidation';

const allowedMethods = ['GET', 'POST'];

const messagesHandler = async (req, res) => {
  const { id: eventId } = req.query;

  if (req.method === 'GET') {
    return getEventMessages(req, res, eventId);
  }

  if (req.method === 'POST') {
    const createWithAuth = authMiddleware(async (authedReq, authedRes) => {
      const validationResult = await runValidation(
        createMessageValidator,
        authedReq,
        authedRes
      );
      if (validationResult === false) return;
      return createEventMessage(authedReq, authedRes, eventId);
    });

    return createWithAuth(req, res);
  }

  res.setHeader('Allow', allowedMethods);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
};

export default messagesHandler;
