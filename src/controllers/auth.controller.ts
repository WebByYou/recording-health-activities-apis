import { Request, Response } from "express";

const handleRegister = async (req: Request, res: Response) => {
  return res.send("5555");
};

export const authController = {
  handleRegister,
};
