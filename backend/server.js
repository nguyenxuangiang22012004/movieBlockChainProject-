import dotenv from "dotenv";
dotenv.config(); 

import express from "express";
import session from "express-session";
import cors from "cors";
import passport from "./config/passport.js"; 
import db from "./database/db.js";
import authMiddleware from "./middlewares/authMiddleware.js";
import authRoutes from "./routes/auth.js";
import uploadRoutes from "./routes/movies.routes.js";
import tvSeriesRoutes from "./routes/tvseries.routes.js";
import catalogRoutes from "./routes/catalog.routes.js";
import userRoutes from "./routes/users.routes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";

const app = express();
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded( { limit: '50mb', extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "mysecret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/users",userRoutes);
app.use("/api", authRoutes);
app.use("/api", uploadRoutes);
app.use('/api', tvSeriesRoutes);
app.use("/api", authMiddleware,catalogRoutes);
app.use("/api/subscription", subscriptionRoutes);


app.listen(5000, () => console.log("🚀 Server chạy ở http://localhost:5000"));
