import { Router } from "express";
import * as busController from "../controllers/busController";

const router = Router();

// GET all buses (with optional filters: routeId, status)
router.get("/", busController.getBuses);

// GET bus statistics
router.get("/stats", busController.getBusStats);

// GET single bus by ID
router.get("/:id", busController.getBusById);

export default router;
