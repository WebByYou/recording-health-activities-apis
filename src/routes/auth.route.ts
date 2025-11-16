import { Router, Request, Response } from "express";
import { authController } from "../controllers/auth.controller";

const router = Router();

// router.post("/login", (req: Request, res: Response) => {
//   const { email, password } = req.body;

//   console.log("Login attempt:", { email, password });

//   res.json({ message: "Login successful!", user: email });
// });

router.post("/register", authController.handleRegister);

export default router;
