import { Request, Response } from "express";
import { Stop } from "../models/Stop";
import { Bus } from "../models/Bus";
import { ApiResponse } from "../types";

export const getStops = async (req: Request, res: Response<ApiResponse<any[]>>) => {
  try {
    const stops = await Stop.find();
    res.json({
      success: true,
      data: stops.map(s => ({
        id: s.id,
        name: s.name,
        latitude: s.latitude,
        longitude: s.longitude
      })),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error fetching stops:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch stops",
      timestamp: new Date().toISOString()
    });
  }
};

export const getStopById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const stop = await Stop.findOne({ id });

    if (!stop) {
      return res.status(404).json({
        success: false,
        error: "Stop not found",
        timestamp: new Date().toISOString()
      });
    }

    const busesAtStop = await Bus.find({ nextStop: stop.name });

    res.json({
      success: true,
      data: {
        stop: {
          id: stop.id,
          name: stop.name,
          latitude: stop.latitude,
          longitude: stop.longitude
        },
        buses: busesAtStop.map(b => ({
          id: b.id,
          number: b.number,
          routeId: b.routeId,
          status: b.status,
          nextStopEta: b.nextStopEta
        })),
        busCount: busesAtStop.length
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

    // Search using regex
    const stops = await Stop.find({
      name: { $regex: q, $options: "i" }
    });

    res.json({
      success: true,
      data: stops.map(s => ({
        id: s.id,
        name: s.name,
        latitude: s.latitude,
        longitude: s.longitude
      })),
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
