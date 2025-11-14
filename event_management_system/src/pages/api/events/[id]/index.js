import {
  getEventById,
  updateEvent,
  deleteEvent,
} from '../../../../controllers/eventControllers';
import { authMiddleware } from '../../../../lib/authMiddleware';
import { updateEventValidator } from '../../../../lib/validators/eventValidators';
import { runValidation } from '../../../../utils/runValidation';

const allowedMethods = ['GET', 'PUT', 'DELETE'];

const eventHandlerId = (req, res) => {
  const id = req.query.id;
  try {
    if (req.method === 'GET') {
      return getEventById(req, res, id);
    } else if (req.method === 'PUT') {
      const authedUpdate = authMiddleware(async (authedReq, authedRes) => {
        const validationResult = await runValidation(
          updateEventValidator,
          authedReq,
          authedRes
        );
        if (validationResult === false) return;
        return updateEvent(authedReq, authedRes, id);
      });
      return authedUpdate(req, res);
    } else if (req.method === 'DELETE') {
      const authedDelete = authMiddleware((authedReq, authedRes) =>
        deleteEvent(authedReq, authedRes, id)
      );
      return authedDelete(req, res);
    } else {
      res.setHeader('Allow', allowedMethods);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'Internal Server Error', error: error.message });
  }
};

export default eventHandlerId;
