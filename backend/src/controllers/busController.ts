import { Request, Response } from "express";
import { Bus } from "../models/Bus";
import { Route } from "../models/Route";
import { ApiResponse } from "../types";

export const getBuses = async (req: Request, res: Response<ApiResponse<any[]>>) => {
  try {
    const { routeId, status } = req.query;
    
    const filter: any = {};

    if (routeId) {
      filter.routeId = routeId;
    }

    if (status) {
      filter.status = status;
    }

    const buses = await Bus.find(filter);

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
    const bus = await Bus.findOne({ id });

    if (!bus) {
      return res.status(404).json({
        success: false,
        error: "Bus not found",
        timestamp: new Date().toISOString()
      });
    }

    const route = await Route.findOne({ id: bus.routeId });

    res.json({
      success: true,
      data: {
        id: bus.id,
        number: bus.number,
        routeId: bus.routeId,
        status: bus.status,
        nextStop: bus.nextStop,
        nextStopEta: bus.nextStopEta,
        latitude: bus.latitude,
        longitude: bus.longitude,
        speed: bus.speed,
        passengers: bus.passengers,
        route: route ? {
          id: route.id,
          name: route.name,
          from: route.from,
          to: route.to
        } : null
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
    const buses = await Bus.find();
    
    const stats = {
      total: buses.length,
      onTime: buses.filter(b => b.status === "on-time").length,
      delayed: buses.filter(b => b.status === "delayed").length,
      atStop: buses.filter(b => b.status === "at-stop").length,
      totalPassengers: buses.reduce((sum, b) => sum + b.passengers, 0),
      averageSpeed: buses.length > 0 
        ? (buses.reduce((sum, b) => sum + b.speed, 0) / buses.length).toFixed(2)
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