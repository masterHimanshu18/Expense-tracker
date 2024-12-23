import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

// Middleware to verify the token
export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.header("Authorization")?.split(" ")[1]; // Extract the token from the Authorization header
  if (!token) {
    res.status(401).json({ error: "Access Denied: No Token Provided" });
    return;
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET!); // Verify the token
    (req as any).user = verified; // Attach user info to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    res.status(403).json({ error: "Invalid Token" });
  }
};
