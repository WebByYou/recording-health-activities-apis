import { Request, Response } from "express";
import { supabaseAdmin } from "../services/supabase.service";
import bcrypt from "bcrypt";

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
    } = req.body;

    let avatar_url = req.body.avatar_url;
    if (req.file) {
      avatar_url = `/imgProfile/${req.file.filename}`;
    }

    // Check if profile exists
    const { data: existingProfile } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .single();

    if (existingProfile) {
      // Update existing profile
      const updates: any = {};
      if (first_name !== undefined) updates.first_name = first_name;
      if (last_name !== undefined) updates.last_name = last_name;
      if (gender !== undefined) updates.gender = gender;
      if (age !== undefined) updates.age = age;
      if (height !== undefined) updates.height = height;
      if (weight !== undefined) updates.weight = weight;
      if (activity_level !== undefined) updates.activity_level = activity_level;
      if (avatar_url !== undefined) updates.avatar_url = avatar_url;

      const { data, error } = await supabaseAdmin
        .from("profiles")
        .update(updates)
        .eq("id", userId)
        .select()
        .single();

      if (error) throw error;
      return res.status(200).json(data);
    } else {
      // Create new profile with defaults
      const { data, error } = await supabaseAdmin
        .from("profiles")
        .insert({
          id: userId,
          first_name: first_name || "User", // Default name
          last_name: last_name || "",
          gender,
          age,
          height,
          weight,
          activity_level,
          avatar_url,
        })
        .select()
        .single();

      if (error) throw error;
      return res.status(200).json(data);
    }

  } catch (error: any) {
    console.error("Update profile error:", error);
    // Debug log
    const fs = require("fs");
    fs.appendFileSync("debug.log", JSON.stringify(error) + "\n");
    return res.status(500).json({ error: "Failed to update profile" });
  }
};

const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "no login" });
    }

    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      // If profile not found, return 404 so frontend knows to show empty form
      if (error.code === "PGRST116") {
        return res.status(404).json({ error: "Profile not found" });
      }

      console.error("Get profile error:", error);
      return res.status(500).json({ error: "Failed to get profile" });
    }

    return res.status(200).json(data);
  } catch (error: any) {
    console.error("Get profile error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const updatePassword = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { currentPassword, newPassword } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "no login" });
    }

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Current and new password are required" });
    }

    // Get user to verify current password
    const { data: user, error: userError } = await supabaseAdmin
      .from("users")
      .select("password")
      .eq("id", userId)
      .single();

    if (userError || !user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "รหัสผ่านปัจจุบันไม่ถูกต้อง" });
    }

    // Hash new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    const { error: updateError } = await supabaseAdmin
      .from("users")
      .update({ password: hashedPassword })
      .eq("id", userId);

    if (updateError) throw updateError;

    return res.status(200).json({ message: "Password updated successfully" });

  } catch (error: any) {
    console.error("Update password error:", error);
    return res.status(500).json({ error: "Failed to update password" });
  }
};

export const userController = {
  updateProfile,
  getProfile,
  updatePassword,
};
