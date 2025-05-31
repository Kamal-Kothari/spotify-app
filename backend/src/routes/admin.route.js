import { Router } from "express";
import {createSong} from "../controller/admin.controller.js";
import {protectRoute, requireAdmin} from "../middleware/auth.middleware.js";

const router = Router();

// /api/admin/songs
// Route to create a new song, protected and requires admin access
router.post("/songs",protectRoute,requireAdmin, createSong);

export default router;