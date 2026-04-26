import express from "express";
import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  getMyJobs,
} from "../controllers/jobController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getJobs);
router.get("/:id", getJobById);

// Private routes
router.get("/myjobs", protect, authorizeRoles("employer"), getMyJobs);
router.post("/", protect, authorizeRoles("employer"), createJob);
router.put("/:id", protect, authorizeRoles("employer"), updateJob);
router.delete("/:id", protect, authorizeRoles("employer"), deleteJob);

export default router;
