import * as DashboardService from "./dashboard.service.js";
import ApiResponse from "../../utils/ApiResponse.js";

export const handleGetStats = async (req, res, next) => {
  try {
    // Pass the authenticated user so the service can apply ownership scoping
    const dashboardData = await DashboardService.getDashboardSummary(req.user);
    res.status(200).json(
      new ApiResponse(200, dashboardData, "Dashboard analytics generated successfully")
    );
  } catch (error) {
    next(error);
  }
};
