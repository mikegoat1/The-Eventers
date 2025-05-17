import { logout } from '../../../../controllers/authControllers';

const allowedMethods = ['POST'];

export default function logoutHandler(req, res) {
  if (req.method === 'POST') {
    return logout(req, res);
  } else {
    res.setHeader('Allow', allowedMethods);
    res.status(405).end(`Method ${req.method} Not Allowed on ${req.url}`);
  }
}
