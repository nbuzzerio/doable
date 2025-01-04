import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface AuthenticatedRequest extends Request {
  user?: string | JwtPayload;
}

export default function (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void {
  const token = req.header("x-auth-token");
  if (!token) {
    res.status(401).send("Access denied. No token provided.");
    return;
  }

  try {
    const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;
    if (!JWT_PRIVATE_KEY) {
      throw new Error(
        "JWT_PRIVATE_KEY is not defined in environment variables.",
      );
    }

    const decoded = jwt.verify(token, JWT_PRIVATE_KEY);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send("Invalid token.");
  }
}
