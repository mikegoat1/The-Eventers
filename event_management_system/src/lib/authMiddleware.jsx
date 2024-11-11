import jwt from "jsonwebtoken";

export const authMiddleware = (handler) => (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;
    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        return handler(req, res);
    } catch (error) {
        res.status(401).json({ message: "Token is not valid, authorization denied" });
    }
};