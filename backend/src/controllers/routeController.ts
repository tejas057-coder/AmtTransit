import { Request, Response } from "express";
import { Route } from "../models/Route";
import { Bus } from "../models/Bus";
import { ApiResponse } from "../types";

export const getRoutes = async (req: Request, res: Response<ApiResponse<any[]>>) => {
  try {
    const routes = await Route.find();
    res.json({
      success: true,
      data: routes.map(r => ({
        id: r.id,
        name: r.name,
        from: r.from,
        to: r.to,
        distance: r.distance,
        frequency: r.frequency
      })),
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
    const route = await Route.findOne({ id });

    if (!route) {
      return res.status(404).json({
        success: false,
        error: "Route not found",
        timestamp: new Date().toISOString()
      });
    }

    res.json({
      success: true,
      data: {
        id: route.id,
        name: route.name,
        from: route.from,
        to: route.to,
        distance: route.distance,
        frequency: route.frequency
      },
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
    const route = await Route.findOne({ id });
    if (!route) {
      return res.status(404).json({
        success: false,
        error: "Route not found",
        timestamp: new Date().toISOString()
      });
    }

    // Get buses for this route
    const buses = await Bus.find({ routeId: id });

    res.json({
      success: true,
      data: buses.map(b => ({
        id: b.id,
        number: b.number,
        routeId: b.routeId,
        status: b.status,
        nextStop: b.nextStop,
        nextStopEta: b.nextStopEta,
        latitude: b.latitude,
        longitude: b.longitude,
        speed: b.speed,
        passengers: b.passengers
      })),
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
