/**
 * @file auth.test.js
 * @description Tests for Auth module — validation middleware + controller
 *
 * Structure
 * ├── validateRegister
 * │   ├── positive
 * │   ├── negative
 * │   └── edge
 * ├── validateLogin
 * │   ├── positive
 * │   ├── negative
 * │   └── edge
 * ├── register controller
 * │   ├── positive
 * │   ├── negative
 * │   └── edge
 * ├── login controller
 * │   ├── positive
 * │   ├── negative
 * │   └── edge
 * ├── logout controller
 * └── getProfile controller
 */

import { jest } from "@jest/globals";

// ── Mock auth service ─────────────────────────────────────────────────────────
const mockRegisterUser = jest.fn();
const mockLoginUser    = jest.fn();

jest.unstable_mockModule("../src/modules/auth/auth.service.js", () => ({
  registerUser: mockRegisterUser,
  loginUser:    mockLoginUser,
}));

const { register, login, logout, getProfile } =
  await import("../src/modules/auth/auth.controller.js");

const { validateRegister, validateLogin } =
  await import("../src/modules/auth/auth.validation.js");

// ── Helpers ───────────────────────────────────────────────────────────────────
const res = () => {
  const r = {};
  r.status = jest.fn().mockReturnValue(r);
  r.json   = jest.fn().mockReturnValue(r);
  return r;
};

const rr = (body = {}) => ({
  req:  { body },
  res:  { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() },
  next: jest.fn(),
});

const VALID_REGISTER_BODY = {
  username:        "john_doe",
  fullName:        "John Doe",
  email:           "john@example.com",
  password:        "secret123",
  confirmPassword: "secret123",
};

const SAMPLE_USER = {
  _id: "user_001", username: "john_doe", fullName: "John Doe",
  email: "john@example.com", role: "employee",
};

beforeEach(() => jest.clearAllMocks());

// =============================================================================
// validateRegister
// =============================================================================
describe("validateRegister", () => {
  describe("positive", () => {
    test("passes with all required fields", () => {
      const { req, res: r, next } = rr(VALID_REGISTER_BODY);
      validateRegister(req, r, next);
      expect(next).toHaveBeenCalledTimes(1);
    });

    test("passes with optional role=admin", () => {
      const { req, res: r, next } = rr({ ...VALID_REGISTER_BODY, role: "admin" });
      validateRegister(req, r, next);
      expect(next).toHaveBeenCalledTimes(1);
    });

    test("passes with valid phone number", () => {
      const { req, res: r, next } = rr({ ...VALID_REGISTER_BODY, phone: "9876543210" });
      validateRegister(req, r, next);
      expect(next).toHaveBeenCalledTimes(1);
    });
  });

  describe("negative", () => {
    test("rejects when username is missing", () => {
      const { username, ...body } = VALID_REGISTER_BODY;
      const { req, res: r, next } = rr(body);
      validateRegister(req, r, next);
      expect(next).not.toHaveBeenCalled();
      expect(r.status).toHaveBeenCalledWith(400);
    });

    test("rejects when email is missing", () => {
      const { email, ...body } = VALID_REGISTER_BODY;
      const { req, res: r, next } = rr(body);
      validateRegister(req, r, next);
      expect(next).not.toHaveBeenCalled();
      expect(r.status).toHaveBeenCalledWith(400);
    });

    test("rejects when passwords do not match", () => {
      const { req, res: r, next } = rr({ ...VALID_REGISTER_BODY, confirmPassword: "wrong" });
      validateRegister(req, r, next);
      expect(next).not.toHaveBeenCalled();
      expect(r.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Password and confirm password must match" })
      );
    });

    test("rejects invalid email format", () => {
      const { req, res: r, next } = rr({ ...VALID_REGISTER_BODY, email: "not-an-email" });
      validateRegister(req, r, next);
      expect(next).not.toHaveBeenCalled();
      expect(r.status).toHaveBeenCalledWith(400);
    });

    test("rejects password shorter than 6 characters", () => {
      const { req, res: r, next } = rr({ ...VALID_REGISTER_BODY, password: "abc", confirmPassword: "abc" });
      validateRegister(req, r, next);
      expect(next).not.toHaveBeenCalled();
      expect(r.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Password must be at least 6 characters long" })
      );
    });

    test("rejects invalid role", () => {
      const { req, res: r, next } = rr({ ...VALID_REGISTER_BODY, role: "hacker" });
      validateRegister(req, r, next);
      expect(next).not.toHaveBeenCalled();
      expect(r.status).toHaveBeenCalledWith(400);
    });

    test("rejects username with special characters", () => {
      const { req, res: r, next } = rr({ ...VALID_REGISTER_BODY, username: "john doe!" });
      validateRegister(req, r, next);
      expect(next).not.toHaveBeenCalled();
      expect(r.status).toHaveBeenCalledWith(400);
    });
  });

  describe("edge", () => {
    test("passes when username contains underscores and numbers", () => {
      const { req, res: r, next } = rr({ ...VALID_REGISTER_BODY, username: "john_doe_99" });
      validateRegister(req, r, next);
      expect(next).toHaveBeenCalledTimes(1);
    });

    test("rejects empty body", () => {
      const { req, res: r, next } = rr({});
      validateRegister(req, r, next);
      expect(next).not.toHaveBeenCalled();
      expect(r.status).toHaveBeenCalledWith(400);
    });

    test("passes with role=super_admin", () => {
      const { req, res: r, next } = rr({ ...VALID_REGISTER_BODY, role: "super_admin" });
      validateRegister(req, r, next);
      expect(next).toHaveBeenCalledTimes(1);
    });
  });
});

// =============================================================================
// validateLogin
// =============================================================================
describe("validateLogin", () => {
  describe("positive", () => {
    test("passes with email + password", () => {
      const { req, res: r, next } = rr({ email: "john@example.com", password: "secret123" });
      validateLogin(req, r, next);
      expect(next).toHaveBeenCalledTimes(1);
    });

    test("passes with username + password", () => {
      const { req, res: r, next } = rr({ username: "john_doe", password: "secret123" });
      validateLogin(req, r, next);
      expect(next).toHaveBeenCalledTimes(1);
    });
  });

  describe("negative", () => {
    test("rejects when both username and email are missing", () => {
      const { req, res: r, next } = rr({ password: "secret123" });
      validateLogin(req, r, next);
      expect(next).not.toHaveBeenCalled();
      expect(r.status).toHaveBeenCalledWith(400);
    });

    test("rejects when password is missing", () => {
      const { req, res: r, next } = rr({ email: "john@example.com" });
      validateLogin(req, r, next);
      expect(next).not.toHaveBeenCalled();
      expect(r.status).toHaveBeenCalledWith(400);
    });

    test("rejects invalid email format", () => {
      const { req, res: r, next } = rr({ email: "bad-email", password: "secret123" });
      validateLogin(req, r, next);
      expect(next).not.toHaveBeenCalled();
      expect(r.status).toHaveBeenCalledWith(400);
    });
  });

  describe("edge", () => {
    test("rejects empty body", () => {
      const { req, res: r, next } = rr({});
      validateLogin(req, r, next);
      expect(next).not.toHaveBeenCalled();
    });
  });
});

// =============================================================================
// register controller
// =============================================================================
describe("register controller", () => {
  describe("positive", () => {
    test("201 — returns created user on success", async () => {
      mockRegisterUser.mockResolvedValue(SAMPLE_USER);
      const r = res();
      await register({ body: VALID_REGISTER_BODY }, r);
      expect(r.status).toHaveBeenCalledWith(201);
      expect(r.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "User registered successfully", data: SAMPLE_USER })
      );
    });
  });

  describe("negative", () => {
    test("400 — returns error when service throws (duplicate email)", async () => {
      mockRegisterUser.mockRejectedValue(new Error("User already exists with this email"));
      const r = res();
      await register({ body: VALID_REGISTER_BODY }, r);
      expect(r.status).toHaveBeenCalledWith(400);
      expect(r.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "User already exists with this email" })
      );
    });

    test("400 — returns error when username is taken", async () => {
      mockRegisterUser.mockRejectedValue(new Error("Username is already taken"));
      const r = res();
      await register({ body: VALID_REGISTER_BODY }, r);
      expect(r.status).toHaveBeenCalledWith(400);
    });
  });

  describe("edge", () => {
    test("400 — generic fallback message when error has no message", async () => {
      mockRegisterUser.mockRejectedValue(new Error());
      const r = res();
      await register({ body: VALID_REGISTER_BODY }, r);
      expect(r.status).toHaveBeenCalledWith(400);
      expect(r.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Registration failed" })
      );
    });
  });
});

// =============================================================================
// login controller
// =============================================================================
describe("login controller", () => {
  const LOGIN_RESULT = { token: "jwt_token_abc", user: SAMPLE_USER };

  describe("positive", () => {
    test("200 — returns token and user on success with email", async () => {
      mockLoginUser.mockResolvedValue(LOGIN_RESULT);
      const r = res();
      await login({ body: { email: "john@example.com", password: "secret123" } }, r);
      expect(r.status).toHaveBeenCalledWith(200);
      expect(r.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Login successful" })
      );
    });

    test("200 — returns token and user on success with username", async () => {
      mockLoginUser.mockResolvedValue(LOGIN_RESULT);
      const r = res();
      await login({ body: { username: "john_doe", password: "secret123" } }, r);
      expect(r.status).toHaveBeenCalledWith(200);
    });

    test("uses username as identifier when both username and email provided", async () => {
      mockLoginUser.mockResolvedValue(LOGIN_RESULT);
      const r = res();
      await login({ body: { username: "john_doe", email: "john@example.com", password: "x" } }, r);
      // username takes precedence (loginIdentifier = username || email)
      expect(mockLoginUser).toHaveBeenCalledWith("john_doe", "x");
    });
  });

  describe("negative", () => {
    test("401 — wrong password", async () => {
      mockLoginUser.mockRejectedValue(new Error("Invalid email or password"));
      const r = res();
      await login({ body: { email: "john@example.com", password: "wrong" } }, r);
      expect(r.status).toHaveBeenCalledWith(401);
    });

    test("401 — inactive account", async () => {
      mockLoginUser.mockRejectedValue(new Error("User account is inactive"));
      const r = res();
      await login({ body: { email: "john@example.com", password: "secret123" } }, r);
      expect(r.status).toHaveBeenCalledWith(401);
      expect(r.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "User account is inactive" })
      );
    });
  });

  describe("edge", () => {
    test("401 — generic fallback when error has no message", async () => {
      mockLoginUser.mockRejectedValue(new Error());
      const r = res();
      await login({ body: { email: "x@x.com", password: "y" } }, r);
      expect(r.status).toHaveBeenCalledWith(401);
      expect(r.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Login failed" })
      );
    });
  });
});

// =============================================================================
// logout controller
// =============================================================================
describe("logout controller", () => {
  test("200 — always succeeds", async () => {
    const r = res();
    await logout({}, r);
    expect(r.status).toHaveBeenCalledWith(200);
    expect(r.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Logout successful" })
    );
  });
});

// =============================================================================
// getProfile controller
// =============================================================================
describe("getProfile controller", () => {
  test("200 — returns req.user as profile", async () => {
    const r = res();
    await getProfile({ user: SAMPLE_USER }, r);
    expect(r.status).toHaveBeenCalledWith(200);
    expect(r.json).toHaveBeenCalledWith(
      expect.objectContaining({ data: SAMPLE_USER, message: "Profile retrieved successfully" })
    );
  });
});
