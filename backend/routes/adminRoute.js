import express from "express";
import {
  loginAdmin,
  addDoctor,
  allDoctors,
  appointmentsAdmin,
  appointmentCancel,
  adminDashboard,
} from "../controllers/adminController.js";
import authAdmin from "../middleware/authAdmin.js";
import upload from "../middleware/multer.js";
import { changeAvailability } from "../controllers/doctorController.js";

const adminRouter = express.Router();

// Auth
adminRouter.post("/login", loginAdmin);

// Doctors management
adminRouter.post("/add-doctor", authAdmin, upload.single("image"), addDoctor);
adminRouter.get("/all-doctors", authAdmin, allDoctors);
adminRouter.post("/change-availability", authAdmin, changeAvailability);

// Appointments
adminRouter.get("/appointments", authAdmin, appointmentsAdmin);
adminRouter.post("/cancel-appointment", authAdmin, appointmentCancel);

// Dashboard
adminRouter.get("/dashboard", authAdmin, adminDashboard);

export default adminRouter;
