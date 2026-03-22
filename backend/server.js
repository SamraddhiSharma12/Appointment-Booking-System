import express from "express";
import cors from "cors";
import "dotenv/config";

import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import adminRouter from "./routes/adminRoutes.js";


const app = express();

// connect DB
connectDB();
connectCloudinary();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


// routes
app.use('/api/admin',adminRouter);


app.get("/", (req, res) => {
  res.send("API  is working");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
app.use((req, res) => {
    res.status(404).send("Route not found");
});
