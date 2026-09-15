import express from "express";
import {
  doctorList,
  loginDoctor,
  appointmentsDoctor,
  appointmentComplete,
  appointmentCancel,
  doctorDashboard,
  doctorProfile,
  updateDoctorProfile,
  changeAvailability,
} from "../controllers/doctorController.js";
import authDoctor from "../middleware/authDoctor.js";

const doctorRouter = express.Router();

// Public
doctorRouter.get("/list", doctorList);

// Auth
doctorRouter.post("/login", loginDoctor);

// Doctor Panel
doctorRouter.get("/appointments", authDoctor, appointmentsDoctor);
doctorRouter.post("/complete-appointment", authDoctor, appointmentComplete);
doctorRouter.post("/cancel-appointment", authDoctor, appointmentCancel);
doctorRouter.get("/dashboard", authDoctor, doctorDashboard);
doctorRouter.get("/profile", authDoctor, doctorProfile);
doctorRouter.post("/update-profile", authDoctor, updateDoctorProfile);
doctorRouter.post("/change-availability", authDoctor, changeAvailability);

export default doctorRouter;
