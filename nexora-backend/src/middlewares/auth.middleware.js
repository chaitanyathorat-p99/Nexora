import jwt from "jsonwebtoken";
import * as UserRepo from "../modules/user/user.repository.js"; // Use the repo!
import ApiError from "../utils/ApiError.js";

const protect = async (req, res, next) => {
  let token;

  // 1. Check for Bearer token in headers
  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // 2. Verify Token
      // If process.env.JWT_SECRET is missing here, it will throw an error

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      
      // 3. Get User from Repository (Identity Check)
      const user = await UserRepo.findById(decoded.id);

      if (!user) {
        return next(new ApiError(401, "The user belonging to this token no longer exists."));
      }

      // 4. Reject deactivated accounts
      if (!user.isActive) {
        return next(new ApiError(401, "Your account has been deactivated. Please contact an administrator."));
      }

      // 5. Attach user to request object
      req.user = user;
      return next();
    } catch (error) {
      // Log the actual error to your terminal so you can see if it's "JsonWebTokenError" or "TokenExpiredError"
      console.error("JWT Verification Error:", error.message);
      
      return next(new ApiError(401, "Not authorized, token failed"));
    }
  }

  if (!token) {
    return next(new ApiError(401, "Not authorized, no token provided"));
  }
};

export default protect;