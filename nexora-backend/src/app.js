import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './modules/auth/auth.routes.js';
import leadRoutes from './modules/lead/lead.routes.js';
import productRoutes from './modules/product/product.routes.js';
import taskRoutes from './modules/task/task.routes.js';
import dealRoutes from "./modules/deal/deal.routes.js";
import ticketRoutes from "./modules/tickets/ticket.routes.js";
import meetingRoutes from "./modules/meetings/meeting.routes.js"
import callRoutes from "./modules/call/call.routes.js";
import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";
import generalSettingRoutes from './modules/generalSettings/generalSetting.routes.js';
import chatbotRoutes from './modules/chatbot/chatbot.routes.js';
import { productTypeRouter } from './modules/generalSettings/generalSetting.routes.js';
import userRoutes from './modules/user/user.routes.js';
import userRoleRoutes from './modules/userRole/userRole.routes.js';
import logger from './utils/logger.js';
import { errorHandler } from './middlewares/error.middleware.js';

import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

const app = express();

// Middlewares
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests from localhost on any port in development
    if (!origin || /^http:\/\/localhost(:\d+)?$/.test(origin) || /^http:\/\/127\.0\.0\.1(:\d+)?$/.test(origin)) {
      callback(null, true);
    } else {
      // In production, check against env variable
      const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',');
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(logger);
// DB Connection
connectDB();

// Routes
app.get("/", (req, res) => {
  res.send("API Running");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/auth", authRoutes);

app.use("/api/v1/leads", leadRoutes);
app.use("/api/leads", leadRoutes);

app.use("/api/v1/general-settings", generalSettingRoutes);
app.use("/api/general-settings", generalSettingRoutes);

app.use("/api/v1/users", userRoutes);
app.use("/api/users", userRoutes);

// user-roles: frontend calls /api/user-roles/ which appends to base /api/v1
// resulting in /api/v1/api/user-roles — register both patterns
app.use("/api/v1/api/user-roles", userRoleRoutes);
app.use("/api/user-roles", userRoleRoutes);

app.use("/api/v1/tasks", taskRoutes);
app.use("/api/tasks", taskRoutes);

app.use("/api/v1/products", productRoutes);
app.use("/api/products", productRoutes);

// Product type is managed under general settings
app.use("/api/v1/product-type", productTypeRouter);
app.use("/api/product-type", productTypeRouter);

app.use("/api/v1/deals", dealRoutes);
app.use("/api/deals", dealRoutes);

app.use("/api/v1/tickets", ticketRoutes);
app.use("/api/tickets", ticketRoutes);

app.use("/api/v1/meetings", meetingRoutes);
app.use("/api/meetings", meetingRoutes);

app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use("/api/v1/calls", callRoutes);
app.use("/api/calls", callRoutes);

app.use("/api/v1/chatbot", chatbotRoutes);
app.use("/api/chatbot", chatbotRoutes);

app.use(errorHandler);

export  default app;