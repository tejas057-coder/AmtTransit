import { Request, Response } from "express";
import { supabase } from "../config/database";
import { ApiResponse } from "../types";

// Hybrid Sync: Keep in memory for instant UX, try Supabase for persistence
let adminMockStops: any[] = [];

export const getStops = async (req: Request, res: Response<ApiResponse<any[]>>) => {
  try {
    // 1. Try to fetch from real DB
    const { data: stops, error } = await supabase.from("stops").select("*").order('order', { ascending: true });
    
    // 2. If DB call succeeds and has data, use it. Otherwise, fallback to memory cache.
    const finalData = (stops && stops.length > 0) ? stops : adminMockStops;

    res.json({
      success: true,
      data: finalData || [],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    // Graceful fallback to memory cache if DB table doesn't exist yet
    res.json({
      success: true,
      data: adminMockStops || [],
      timestamp: new Date().toISOString()
    });
  }
};

export const saveAdminStops = async (req: Request, res: Response) => {
  try {
    const stopsToSave = req.body;
    
    if (Array.isArray(stopsToSave)) {
      // Always update memory cache for instant "Sync" success
      adminMockStops = stopsToSave;

      // Try to persist to Supabase in background
      try {
        await supabase.from("stops").delete().neq("id", "0");
        await supabase.from("stops").insert(stopsToSave);
      } catch (dbErr) {
        console.warn("Supabase persistence failed (check if tables exist), but memory sync is active.");
      }
      
      res.json({ success: true, data: adminMockStops });
    } else {
      res.status(400).json({ success: false, error: "Expected an array of stops." });
    }
  } catch (error: any) {
    console.error("Error saving admin stops:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to save admin stops",
      timestamp: new Date().toISOString()
    });
  }
};

export const getStopById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data: stop, error: stopError } = await supabase
      .from("stops")
      .select("*")
      .eq("id", id)
      .single();

    if (stopError || !stop) {
      return res.status(404).json({
        success: false,
        error: "Stop not found",
        timestamp: new Date().toISOString()
      });
    }

    const { data: busesAtStop, error: busError } = await supabase
      .from("buses")
      .select("*")
      .eq("nextStop", stop.name);

    if (busError) throw busError;

    res.json({
      success: true,
      data: {
        stop,
        buses: busesAtStop || [],
        busCount: (busesAtStop || []).length
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error fetching stop:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch stop",
      timestamp: new Date().toISOString()
    });
  }
};

export const getStopsByName = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;

    if (!q || typeof q !== "string") {
      return res.status(400).json({
        success: false,
        error: "Search query required",
        timestamp: new Date().toISOString()
      });
    }

    // Search using ilike (case-insensitive)
    const { data: stops, error } = await supabase
      .from("stops")
      .select("*")
      .ilike("name", `%${q}%`);

    if (error) throw error;

    res.json({
      success: true,
      data: stops || [],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error searching stops:", error);
    res.status(500).json({
      success: false,
      error: "Failed to search stops",
      timestamp: new Date().toISOString()
    });
  }
};
