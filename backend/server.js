import express from "express";
import cors from "cors";
import db from "./database/db.js";
import authRoutes from './routes/auth.js';
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", authRoutes);

app.listen(5000, () => console.log("🚀 Server chạy ở http://localhost:5000"));
