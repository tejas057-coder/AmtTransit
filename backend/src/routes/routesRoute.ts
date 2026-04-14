import { Router } from "express";
import * as routeController from "../controllers/routeController";

const router = Router();

// GET all routes
router.get("/", routeController.getRoutes);

// GET single route by ID
router.get("/:id", routeController.getRouteById);

// GET all buses for a specific route
router.get("/:id/buses", routeController.getRouteBuses);

export default router;
