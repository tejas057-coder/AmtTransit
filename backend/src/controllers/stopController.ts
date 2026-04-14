import { Request, Response } from "express";
import { stops, buses } from "../data/mockData";
import { ApiResponse, Stop } from "../types";

export const getStops = (req: Request, res: Response<ApiResponse<Stop[]>>) => {
  try {
    res.json({
      success: true,
      data: stops,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch stops",
      timestamp: new Date().toISOString()
    });
  }
};

export const getStopById = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const stop = stops.find(s => s.id === id);

    if (!stop) {
      return res.status(404).json({
        success: false,
        error: "Stop not found",
        timestamp: new Date().toISOString()
      });
    }

    const busesAtStop = buses.filter(b => b.nextStop === stop.name);

    res.json({
      success: true,
      data: {
        stop,
        buses: busesAtStop,
        busCount: busesAtStop.length
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch stop",
      timestamp: new Date().toISOString()
    });
  }
};

export const getStopsByName = (req: Request, res: Response) => {
  try {
    const { q } = req.query;

    if (!q || typeof q !== "string") {
      return res.status(400).json({
        success: false,
        error: "Query parameter 'q' is required",
        timestamp: new Date().toISOString()
      });
    }

    const results = stops.filter(s => 
      s.name.toLowerCase().includes(q.toLowerCase())
    );

    res.json({
      success: true,
      data: results,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to search stops",
      timestamp: new Date().toISOString()
    });
  }
};
