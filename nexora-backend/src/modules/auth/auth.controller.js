import { registerUser, loginUser } from "./auth.service.js";
import ApiResponse from "../../utils/ApiResponse.js";

/**
 * REGISTER CONTROLLER
 * POST /api/auth/register
 *
 * Public endpoint — always creates an "employee" account.
 * Role field in body is intentionally ignored.
 */
export const register = async (req, res) => {
  try {
    const user = await registerUser(req.body);

    res.status(201).json(
      new ApiResponse(201, user, "User registered successfully")
    );
  } catch (error) {
    res.status(400).json(
      new ApiResponse(400, null, error.message || "Registration failed")
    );
  }
};

/**
 * LOGIN CONTROLLER
 * POST /api/auth/login
 */
export const login = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const loginIdentifier = username || email;

    const result = await loginUser(loginIdentifier, password);

    res.status(200).json(
      new ApiResponse(
        200,
        {
          token: result.token,
          user: result.user,
        },
        "Login successful"
      )
    );
  } catch (error) {
    res.status(401).json(
      new ApiResponse(401, null, error.message || "Login failed")
    );
  }
};

/**
 * LOGOUT CONTROLLER
 * POST /api/auth/logout
 */
export const logout = async (req, res) => {
  try {
    res.status(200).json(new ApiResponse(200, null, "Logout successful"));
  } catch (error) {
    res.status(500).json(
      new ApiResponse(500, null, error.message || "Logout failed")
    );
  }
};

/**
 * GET PROFILE
 * GET /api/auth/profile
 */
export const getProfile = async (req, res) => {
  try {
    res
      .status(200)
      .json(new ApiResponse(200, req.user, "Profile retrieved successfully"));
  } catch (error) {
    res.status(500).json(
      new ApiResponse(500, null, error.message || "Failed to fetch profile")
    );
  }
};
