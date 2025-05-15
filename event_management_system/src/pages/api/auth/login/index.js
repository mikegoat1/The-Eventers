import { login } from '../../../../controllers/authControllers';

const allowedMethods = ['POST'];

export default function loginHandler(req, res) {
  if (req.method === 'POST') {
    return login(req, res);
  } else {
    res.setHeader('Allow', allowedMethods);
    res.status(405).end(`Method ${req.method} Not Allowed on ${req.url}`);
  }
}
