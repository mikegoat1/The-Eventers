import { getOrganizerAnalytics } from '../../../controllers/analyticsController';
import { authMiddleware } from '../../../lib/authMiddleware';

const allowedMethods = ['GET'];

const analyticsHandler = (req, res) => {
  if (req.method === 'GET') {
    return getOrganizerAnalytics(req, res);
  }

  res.setHeader('Allow', allowedMethods);
  return res
    .status(405)
    .end(`Method ${req.method} Not Allowed on ${req.url}`);
};

export default authMiddleware(analyticsHandler);
