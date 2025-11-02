import dotenv from "dotenv";
dotenv.config(); // chỉ cần dòng này
import express from "express";
import cors from "cors";
import db from "./database/db.js";
import authRoutes from './routes/auth.js';
import uploadRoutes from './routes/movies.routes.js';
import tvSeriesRoutes from './routes/tvseries.routes.js';
import catalogRoutes from './routes/catalog.routes.js';
import userRoutes from './routes/users.routes.js';
const app = express();
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use("/api/users",userRoutes);
app.use("/api", authRoutes);
app.use("/api", uploadRoutes);
app.use('/api', tvSeriesRoutes);
app.use("/api",catalogRoutes);
app.listen(5000, () => console.log("🚀 Server chạy ở http://localhost:5000"));
