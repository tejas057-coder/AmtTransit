import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

const JWT_SECRET = process.env.JWT_SECRET || "amravati_transit_secret_123";

// Simple mock login for development
export const login = async (req: Request, res: Response) => {
  const { username, role } = req.body; // In real app, validate password

  const user = {
    id: uuidv4(),
    username: username || "GuestUser",
    role: role === "admin" ? "admin" : "user"
  };

  const token = jwt.sign(user, JWT_SECRET, { expiresIn: "7d" });

  res.json({
    success: true,
    data: {
      token,
      user
    }
  });
};
