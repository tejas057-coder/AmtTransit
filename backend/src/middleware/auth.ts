import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "amravati_transit_secret_123";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: "admin" | "user";
  };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: "admin" | "user" };
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ success: false, error: "Invalid token." });
  }
};

export const optionalAuthenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: "admin" | "user" };
    req.user = decoded;
    next();
  } catch (err) {
    // If token is invalid, we'll just treat them as unauthenticated instead of erroring
    next();
  }
};

export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ success: false, error: "Access denied. Admin only." });
  }
  next();
};
