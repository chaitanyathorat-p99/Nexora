/**
 * Auth Validation Middleware
 *
 * validateRegister — public registration (role field is intentionally ignored)
 * validateLogin    — login by username or email
 * validateCreateUser — privileged user creation by admin/super_admin
 */

export const validateRegister = (req, res, next) => {
  const { username, fullName, email, password, confirmPassword, phone } = req.body;

  if (!username || !fullName || !email || !password || !confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "username, fullName, email, password and confirmPassword are required",
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Password and confirm password must match",
    });
  }

  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  if (!usernameRegex.test(username)) {
    return res.status(400).json({
      success: false,
      message: "Username can only contain letters, numbers, and underscores",
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid email address",
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 characters long",
    });
  }

  if (phone) {
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(phone.replace(/[^0-9]/g, ""))) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid phone number (10-15 digits)",
      });
    }
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { username, email, password } = req.body;
  const identifier = username || email;

  if (!identifier || !password) {
    return res.status(400).json({
      success: false,
      message: "Username/email and password are required",
    });
  }

  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }
  }

  next();
};

/**
 * Validates the body for privileged user creation (admin/super_admin routes).
 * Role is required here and validated against allowed values.
 */
export const validateCreateUser = (req, res, next) => {
  const { username, fullName, email, password, confirmPassword, role, phone } = req.body;

  if (!username || !fullName || !email || !password || !confirmPassword || !role) {
    return res.status(400).json({
      success: false,
      message: "username, fullName, email, password, confirmPassword and role are required",
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Password and confirm password must match",
    });
  }

  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  if (!usernameRegex.test(username)) {
    return res.status(400).json({
      success: false,
      message: "Username can only contain letters, numbers, and underscores",
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid email address",
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 characters long",
    });
  }

  const validRoles = ["super_admin", "admin", "employee"];
  if (!validRoles.includes(role)) {
    return res.status(400).json({
      success: false,
      message: `Role must be one of: ${validRoles.join(", ")}`,
    });
  }

  if (phone) {
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(phone.replace(/[^0-9]/g, ""))) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid phone number (10-15 digits)",
      });
    }
  }

  next();
};
