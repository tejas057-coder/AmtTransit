import { Request, Response } from "express";
import { routes, buses } from "../data/mockData";
import { ApiResponse, Route } from "../types";

export const getRoutes = (req: Request, res: Response<ApiResponse<Route[]>>) => {
  try {
    res.json({
      success: true,
      data: routes,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch routes",
      timestamp: new Date().toISOString()
    });
  }
};

export const getRouteById = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const route = routes.find(r => r.id === id);

    if (!route) {
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
    res.status(500).json({
      success: false,
      error: "Failed to fetch route",
      timestamp: new Date().toISOString()
    });
  }
};

export const getRouteBuses = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const route = routes.find(r => r.id === id);

    if (!route) {
      return res.status(404).json({
        success: false,
        error: "Route not found",
        timestamp: new Date().toISOString()
      });
    }

    const routeBuses = buses.filter(b => b.routeId === id);

    res.json({
      success: true,
      data: {
        route,
        buses: routeBuses,
        activeCount: routeBuses.length
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch route buses",
      timestamp: new Date().toISOString()
    });
  }
};
