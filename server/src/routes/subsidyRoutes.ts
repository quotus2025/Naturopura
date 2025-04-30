// routes/subsidyRoutes.ts
import express from "express";
import {
  applySubsidy,
  updateSubsidyStatus,
  getFarmerSubsidies,
  getAllSubsidies,
} from "../controllers/subsidyController";
import { authenticate } from "../middleware/authMiddleware"; // Assuming you have an auth middleware

const router = express.Router();

// Auth middleware assumed to be applied globally or here
router.post("/apply",authenticate, applySubsidy);
router.patch("/:id/status",authenticate, updateSubsidyStatus);
router.get("/my",authenticate, getFarmerSubsidies);
router.get("/all",authenticate, getAllSubsidies);

export default router;
