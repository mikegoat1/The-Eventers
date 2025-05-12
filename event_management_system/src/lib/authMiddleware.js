import jwt from 'jsonwebtoken';
import cookie from 'cookie';

export const authMiddleware = (handler) => (req, res) => {
  const cookies = cookie.parse(req.headers.cookie || '');
  const token = cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    return handler(req, res);
  } catch (error) {
    res
      .status(401)
      .json({ message: 'Token is not valid, authorization denied' });
  }
};
