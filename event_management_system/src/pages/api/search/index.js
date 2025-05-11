import { searchEvents } from '../../../controllers/searchController';

const allowedMethods = ['GET'];
export default function searchHandler(req, res) {
  if (req.method === 'GET') {
    return searchEvents(req, res);
  } else {
    res.setHeader('Allow', allowedMethods);
    res.status(405).end(`Method ${req.method} Not Allowed on ${req.url}`);
  }
}