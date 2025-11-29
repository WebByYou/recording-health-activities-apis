import { Request, Response } from "express";
import { supabaseAdmin } from "../services/supabase.service";

const getAllActivityLevels = async (req: Request, res: Response) => {
    try {
        // Using 'any' for table name since it's not in the generated types yet
        const { data, error } = await supabaseAdmin
            .from("activity_level" as any)
            .select("*")
            .order("created_at", { ascending: true });

        if (error) {
            console.error("Get activity levels error:", error);
            return res.status(500).json({ error: "Failed to fetch activity levels" });
        }

        return res.status(200).json(data);
    } catch (error: any) {
        console.error("Get activity levels error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const activityLevelController = {
    getAllActivityLevels,
};
