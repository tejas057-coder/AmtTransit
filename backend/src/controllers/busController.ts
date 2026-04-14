import { Request, Response } from "express";
import { buses, routes } from "../data/mockData";
import { ApiResponse, Bus } from "../types";

export const getBuses = (req: Request, res: Response<ApiResponse<Bus[]>>) => {
  try {
    const { routeId, status } = req.query;
    
    let filtered = [...buses];

    if (routeId) {
      filtered = filtered.filter(b => b.routeId === routeId);
    }

    if (status) {
      filtered = filtered.filter(b => b.status === status);
    }

    res.json({
      success: true,
      data: filtered,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch buses",
      timestamp: new Date().toISOString()
    });
  }
};

export const getBusById = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const bus = buses.find(b => b.id === id);

    if (!bus) {
      return res.status(404).json({
        success: false,
        error: "Bus not found",
        timestamp: new Date().toISOString()
      });
    }

    const route = routes.find(r => r.id === bus.routeId);

    res.json({
      success: true,
      data: {
        ...bus,
        route
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch bus",
      timestamp: new Date().toISOString()
    });
  }
};

export const getBusStats = (req: Request, res: Response) => {
  try {
    const stats = {
      total: buses.length,
      onTime: buses.filter(b => b.status === "on-time").length,
      delayed: buses.filter(b => b.status === "delayed").length,
      atStop: buses.filter(b => b.status === "at-stop").length,
      totalPassengers: buses.reduce((sum, b) => sum + b.passengers, 0),
      averageSpeed: (buses.reduce((sum, b) => sum + b.speed, 0) / buses.length).toFixed(2)
    };

    res.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch bus statistics",
      timestamp: new Date().toISOString()
    });
  }
};
