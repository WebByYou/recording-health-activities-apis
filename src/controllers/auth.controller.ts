import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { supabase, supabaseAdmin } from "../services/supabase.service";
import jwt from "jsonwebtoken";

const handleRegister = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert user into the 'users' table
    const { error } = await supabase
      .from("users")
      .insert({ email, password: hashedPassword });

    if (error) {
      // Check for unique constraint violation (duplicate email)
      if (error.code === "23505") {
        return res.status(409).json({ error: "Email already exists" });
      }
      throw error;
    }

    return res.status(201).json({ message: "ลงทะเบียนสำเร็จ" });
  } catch (error: any) {
    console.error("Registration error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const handleLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Check if user exists
    const { data: user, error } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate JWT
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("JWT_SECRET is missing");
      return res.status(500).json({ error: "Internal server error" });
    }

    const token = jwt.sign({ id: user.id }, secret, { expiresIn: "1h" });

    return res.status(200).json({
      access_token: token,
    });
  } catch (error: any) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getMe = async (req: Request, res: Response) => {
  try {
    // req.user is populated by authMiddleware
    const user = req.user;
    const { password, ...userWithoutPassword } = user;
    return res.status(200).json(userWithoutPassword);
  } catch (error: any) {
    console.error("GetMe error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const authController = {
  handleRegister,
  handleLogin,
  getMe,
};
