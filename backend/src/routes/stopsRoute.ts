import { Router } from "express";
import * as stopController from "../controllers/stopController";

const router = Router();

// GET all stops
router.get("/", stopController.getStops);

// GET stops by search query
router.get("/search", stopController.getStopsByName);

// GET single stop by ID
router.get("/:id", stopController.getStopById);

export default router;
