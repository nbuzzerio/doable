import express from "express";
import auth from "../middleware/auth.js";
import { getCurrentUser, registerUser } from "../controllers/userController.js";

const router = express.Router();

router.get("/me", auth, getCurrentUser);

router.post("/", registerUser);

export default router;
