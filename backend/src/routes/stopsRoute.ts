import { Router } from "express";
import * as stopController from "../controllers/stopController";
import { authenticate, optionalAuthenticate } from "../middleware/auth";

const router = Router();

// GET all stops (Filtered by role logic in controller) - ALLOWS PUBLIC
router.get("/", optionalAuthenticate, (req: any, res: any) => stopController.getStops(req, res));

// POST Create a single stop - REQUIRES TOKEN
router.post("/", authenticate, (req: any, res: any) => stopController.createStop(req, res));

// DELETE a stop - REQUIRES TOKEN
router.delete("/:id", authenticate, (req: any, res: any) => stopController.deleteStop(req, res));

// Backward compatibility for Admin Panel sync
router.post("/admin-sync", (req: any, res: any) => stopController.saveAdminStops(req, res));

export default router;
