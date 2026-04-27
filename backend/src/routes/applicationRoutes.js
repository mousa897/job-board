import express from "express";
import {
  applyToJob,
  getJobApplications,
  getMyApplications,
  updateApplicationStatus,
} from "../controllers/applicationController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post(
  "/:jobId",
  protect,
  authorizeRoles("seeker"),
  upload.single("cv"),
  applyToJob,
);

router.get(
  "/myapplications",
  protect,
  authorizeRoles("seeker"),
  getMyApplications,
);

router.get(
  "/job/:jobId",
  protect,
  authorizeRoles("employer"),
  getJobApplications,
);

router.put(
  "/:id/status",
  protect,
  authorizeRoles("employer"),
  updateApplicationStatus,
);

export default router;
