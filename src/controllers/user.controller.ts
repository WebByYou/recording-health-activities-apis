import { Request, Response } from "express";
import { supabaseAdmin } from "../services/supabase.service";

const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "no login" });
    }

    const {
      first_name,
      last_name,
      gender,
      age,
      height,
      weight,
      activity_level,
      avatar_url,
    } = req.body;

    // Upsert profile in Supabase
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .upsert({
        id: userId,
        first_name,
        last_name,
        gender,
        age,
        height,
        weight,
        activity_level,
        avatar_url,
      })
      .select()
      .single();

    if (error) {
      console.error("Update profile error:", error);
      // Debug log
      const fs = require("fs");
      fs.appendFileSync("debug.log", JSON.stringify(error) + "\n");
      return res.status(500).json({ error: "Failed to update profile" });
    }

    return res.status(200).json(data);
  } catch (error: any) {
    console.error("Update profile error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const userController = {
  updateProfile,
};
