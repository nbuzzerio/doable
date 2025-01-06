import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import mongoose from "mongoose";
import authRoutes from "./server/dist/routes/authRoutes.js";
import userRoutes from "./server/dist/routes/userRoutes.js";
import listRoutes from "./server/dist/routes/listRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 7000;

const mongoUri = process.env.MONGO_URI;
mongoose
  .connect(mongoUri)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/lists", listRoutes);

app.use(express.static(join(__dirname, "client/dist")));

app.get("*", (req, res) => {
  res.sendFile(join(__dirname, "client/dist/index.html"));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
