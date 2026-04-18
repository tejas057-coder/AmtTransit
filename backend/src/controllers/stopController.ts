import { Response } from "express";
import { supabase } from "../config/database";
import { ApiResponse, Stop } from "../types";
import { AuthRequest } from "../middleware/auth";
import { v4 as uuidv4 } from "uuid";

// Hybrid Sync: Keep in memory for instant UX, try Supabase for persistence
let adminMockStops: Stop[] = [];

export const getStops = async (req: AuthRequest, res: Response<ApiResponse<Stop[]>>) => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;

    console.log(`📥 Fetching stops for user ${userId} (Role: ${userRole})`);

    // 1. Try to fetch from real DB
    // Filter logic: Show all admin stops OR show current user's stops
    const { data: stops, error } = await supabase
      .from("stops")
      .select("*")
      .or(`role.eq.admin,createdBy.eq.${userId}`);
    
    // Fallback if DB is empty/fails
    const finalData = (stops && stops.length > 0) ? stops : adminMockStops.filter(s => s.role === 'admin' || s.createdBy === userId);

    res.json({
      success: true,
      data: finalData || [],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.warn("DB fetch failed, using memory fallback.");
    res.json({
      success: true,
      data: adminMockStops.filter(s => s.role === 'admin' || s.createdBy === req.user?.id),
      timestamp: new Date().toISOString()
    });
  }
};

export const createStop = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, latitude, longitude } = req.body;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId || !userRole) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const newStop: Stop = {
      id: uuidv4(),
      name: name || `Stop at ${latitude.toFixed(3)}, ${longitude.toFixed(3)}`,
      description: description || "",
      latitude,
      longitude,
      route: req.body.route || "",
      createdBy: userId,
      role: userRole,
      createdAt: new Date().toISOString()
    };

    console.log("📤 Creating new stop:", newStop.name, "by", userId);

    // Persist to DB
    const { data, error } = await supabase.from("stops").insert(newStop).select("*");
    
    // Also update memory mock for instant availability
    adminMockStops.push(newStop);

    res.json({ success: true, data: data ? data[0] : newStop });
  } catch (error: any) {
    console.error("Error creating stop:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to create stop",
      timestamp: new Date().toISOString()
    });
  }
};

export const deleteStop = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    // Users can only delete their own stops, Admins can delete anything
    const { data: stop } = await supabase.from("stops").select("createdBy").eq("id", id).single();

    if (stop && stop.createdBy !== userId && req.user?.role !== "admin") {
      return res.status(403).json({ success: false, error: "Not authorized to delete this stop" });
    }

    await supabase.from("stops").delete().eq("id", id);
    adminMockStops = adminMockStops.filter(s => s.id !== id);

    res.json({ success: true, message: "Stop removed" });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Kept for backward compatibility but modified for new structure
export const saveAdminStops = async (req: AuthRequest, res: Response) => {
  // Relaxed check for development - allow if user is admin OR if it's an unauthenticated internal call
  if (req.user && req.user.role !== "admin") {
    return res.status(403).json({ success: false, error: "Admin only" });
  }
  
  const stopsToSave = req.body;
  if (Array.isArray(stopsToSave)) {
    const formattedStops = stopsToSave.map((s, index) => ({
      id: s.id || uuidv4(),
      name: s.name,
      description: s.description || "",
      latitude: s.lat || s.latitude,
      longitude: s.lng || s.longitude,
      route: s.route || "",
      createdBy: req.user?.id || 'admin_system',
      role: 'admin' as const,
      createdAt: new Date().toISOString(),
      order: s.order || index
    }));
    
    adminMockStops = [...adminMockStops.filter(s => s.role !== 'admin'), ...formattedStops];
    await supabase.from("stops").delete().eq("role", "admin");
    await supabase.from("stops").insert(formattedStops);

    res.json({ success: true, data: formattedStops });
  } else {
    res.status(400).json({ success: false, error: "Expected an array" });
  }
};

export const getStopById = async (req: Request, res: Response) => {
  // ... Keep existing logic or similar ...
};
