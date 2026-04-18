import { Router } from "express";
import * as stopController from "../controllers/stopController";

const router = Router();

// GET all stops
router.get("/", stopController.getStops);

// POST explicitly for syncing stops from Admin Panel
router.post("/admin-sync", stopController.saveAdminStops);

// GET stops by search query
router.get("/search", stopController.getStopsByName);

// GET single stop by ID
router.get("/:id", stopController.getStopById);

export default router;
