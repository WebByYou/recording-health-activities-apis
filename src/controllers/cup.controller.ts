import { Request, Response } from "express";
import { supabaseAdmin } from "../services/supabase.service";

const getAllCups = async (req: Request, res: Response) => {
    try {
        const { data, error } = await supabaseAdmin
            .from("cup" as any)
            .select("*")
            .order("created_at", { ascending: true });

        if (error) {
            console.error("Get cups error:", error);
            return res.status(500).json({ error: "Failed to fetch cups" });
        }

        return res.status(200).json(data);
    } catch (error: any) {
        console.error("Get cups error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const cupController = {
    getAllCups,
};
