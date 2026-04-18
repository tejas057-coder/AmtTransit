import { Request, Response } from "express";
import { supabase } from "../config/database";
import { ApiResponse } from "../types";

export const getRoutes = async (req: Request, res: Response<ApiResponse<any[]>>) => {
  try {
    const { data: routes, error } = await supabase.from("routes").select("*");
    
    if (error) throw error;

    res.json({
      success: true,
      data: routes || [],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error fetching routes:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch routes",
      timestamp: new Date().toISOString()
    });
  }
};

export const getRouteById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data: route, error } = await supabase
      .from("routes")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !route) {
      return res.status(404).json({
        success: false,
        error: "Route not found",
        timestamp: new Date().toISOString()
      });
    }

    res.json({
      success: true,
      data: route,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error fetching route:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch route",
      timestamp: new Date().toISOString()
    });
  }
};

export const getRouteBuses = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Verify route exists
    const { data: route, error: routeError } = await supabase
      .from("routes")
      .select("id")
      .eq("id", id)
      .single();

    if (routeError || !route) {
      return res.status(404).json({
        success: false,
        error: "Route not found",
        timestamp: new Date().toISOString()
      });
    }

    // Get buses for this route
    const { data: buses, error: busError } = await supabase
      .from("buses")
      .select("*")
      .eq("routeId", id);

    if (busError) throw busError;

    res.json({
      success: true,
      data: buses || [],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error fetching route buses:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch route buses",
      timestamp: new Date().toISOString()
    });
  }
};
