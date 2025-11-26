import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { supabaseAdmin } from "../services/supabase.service";

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Skip authentication for /auth routes (except /auth/me)
  if (req.path.startsWith("/auth") && req.path !== "/auth/me") {
    return next();
  }

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "no login" });
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    console.error("JWT_SECRET is missing in .env");
    return res.status(500).json({ error: "Internal server error" });
  }

  try {
    const decoded: any = jwt.verify(token, secret);
    const userId = decoded.id;

    if (!userId) {
      return res.status(401).json({ error: "no login" });
    }

    // Query user from DB
    const { data: user, error } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: "no login" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: "no login" });
  }
};
