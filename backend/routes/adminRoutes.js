import express from 'express';
import upload from '../middlewares/multer.js';
import { addDoctor, loginAdmin } from '../controllers/adminController.js';
import authAdmin from '../middlewares/authAdmin.js';

const adminRouter = express.Router();

{/*-the 2nd parameter stands for middleware so that form data gets processed with image-*/}
adminRouter.post('/add-doctor',authAdmin,upload.single('image'),addDoctor);

adminRouter.post('/login',loginAdmin);

export default adminRouter;

