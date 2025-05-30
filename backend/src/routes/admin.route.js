import { Router } from "express";
import {getAdmin,createSong} from "../controller/admin.controller.js";
import {protectRoute, adminRoute} from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", getAdmin);
router.get("/createSong",protectRoute,adminRoute, createSong);

export default router;