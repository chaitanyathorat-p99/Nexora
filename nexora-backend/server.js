import express from "express";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/modules/auth/auth.routes.js";
import generalSettingRoutes from "./src/modules/generalSettings/generalSetting.routes.js";
import ticketRoutes from "./src/modules/tickets/ticket.routes.js";
import meetingRoutes from "./src/modules/meetings/meeting.routes.js";
import dotenv from "dotenv";
import { errorHandler } from "./src/middlewares/error.middleware.js";
import app from "./src/app.js";

// Load environment variables
dotenv.config();

const PORT = process.env.PORT|| 8000;



app.use(errorHandler);
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);

});