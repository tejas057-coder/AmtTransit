import { Request, Response } from "express";
import { supabase } from "../config/database";
import { ApiResponse } from "../types";

export const getBuses = async (req: Request, res: Response<ApiResponse<any[]>>) => {
  try {
    const { routeId, status } = req.query;
    
    let query = supabase.from("buses").select("*");

    if (routeId) {
      query = query.eq("routeId", routeId);
    }
    if (status) {
      query = query.eq("status", status);
    }

    const { data: buses, error } = await query;

    if (error) throw error;

    res.json({
      success: true,
      data: buses || [],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error fetching buses:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch buses",
      timestamp: new Date().toISOString()
    });
  }
};

export const getBusById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data: bus, error: busError } = await supabase
      .from("buses")
      .select("*")
      .eq("id", id)
      .single();

    if (busError || !bus) {
      return res.status(404).json({
        success: false,
        error: "Bus not found",
        timestamp: new Date().toISOString()
      });
    }

    const { data: route } = await supabase
      .from("routes")
      .select("id, name, from, to")
      .eq("id", bus.routeId)
      .single();

    res.json({
      success: true,
      data: {
        ...bus,
        route: route || null
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error fetching bus:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch bus",
      timestamp: new Date().toISOString()
    });
  }
};

export const getBusStats = async (req: Request, res: Response) => {
  try {
    const { data: buses, error } = await supabase.from("buses").select("status, passengers, speed");
    
    if (error) throw error;
    
    const count = buses ? buses.length : 0;
    
    const stats = {
      total: count,
      onTime: (buses || []).filter(b => b.status === "on-time").length,
      delayed: (buses || []).filter(b => b.status === "delayed").length,
      atStop: (buses || []).filter(b => b.status === "at-stop").length,
      totalPassengers: (buses || []).reduce((sum, b) => sum + (b.passengers || 0), 0),
      averageSpeed: count > 0 
        ? ((buses || []).reduce((sum, b) => sum + (b.speed || 0), 0) / count).toFixed(2)
        : "0"
    };

    res.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error fetching bus stats:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch bus stats",
      timestamp: new Date().toISOString()
    });
  }
};