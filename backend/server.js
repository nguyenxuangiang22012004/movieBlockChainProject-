import express from "express";
import cors from "cors";
import db from "./database/db.js";
import authRoutes from './routes/auth.js';
import uploadRoutes from './routes/movies.routes.js';
import tvSeriesRoutes from './routes/tvseries.routes.js';
const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


app.use("/api", authRoutes);
app.use("/api", uploadRoutes);
app.use('/api', tvSeriesRoutes);
app.listen(5000, () => console.log("🚀 Server chạy ở http://localhost:5000"));
