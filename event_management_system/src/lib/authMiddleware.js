import jwt from 'jsonwebtoken';
import { parse as parseCookie } from 'cookie';

export const authMiddleware = (handler) => (req, res) => {
  const rawCookieHeader = req.headers?.cookie ?? '';
  const cookies = rawCookieHeader ? parseCookie(rawCookieHeader) : {};
  const token = cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    return handler(req, res);
  } catch (error) {
    res
      .status(401)
      .json({ message: 'Token is not valid, authorization denied' });
  }
};
