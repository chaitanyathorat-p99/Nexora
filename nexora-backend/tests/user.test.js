/**
 * @file user.test.js
 * @description Tests for User module — controller
 *
 * Structure
 * ├── getAllUsers
 * ├── getUserById
 * ├── createUser
 * ├── updateUser
 * ├── deactivateUser
 * └── deleteUser
 */

import { jest } from "@jest/globals";

// ── Mock user service ─────────────────────────────────────────────────────────
const mockListUsers      = jest.fn();
const mockGetUserById    = jest.fn();
const mockCreateUser     = jest.fn();
const mockUpdateUser     = jest.fn();
const mockDeactivateUser = jest.fn();
const mockReactivateUser = jest.fn();
const mockDeleteUser     = jest.fn();
const mockResetPassword  = jest.fn();

jest.unstable_mockModule("../src/modules/user/user.service.js", () => ({
  listUsers:        mockListUsers,
  getUserById:      mockGetUserById,
  createUser:       mockCreateUser,
  updateUser:       mockUpdateUser,
  deactivateUser:   mockDeactivateUser,
  reactivateUser:   mockReactivateUser,
  deleteUser:       mockDeleteUser,
  resetUserPassword: mockResetPassword,
}));

const {
  getAllUsers, getUserById, createUser, updateUser,
  deactivateUser, reactivateUser, deleteUser, resetPassword,
} = await import("../src/modules/user/user.controller.js");

// ── Helpers ───────────────────────────────────────────────────────────────────
const res = () => {
  const r = {};
  r.status = jest.fn().mockReturnValue(r);
  r.json   = jest.fn().mockReturnValue(r);
  return r;
};

const SUPER_ADMIN = { _id: "sa_001", role: "super_admin" };
const ADMIN_USER  = { _id: "admin_001", role: "admin" };

const SAMPLE_USER = {
  _id: "user_001", fullName: "Alice Smith", email: "alice@example.com",
  role: "employee", isActive: true,
};

beforeEach(() => jest.clearAllMocks());

// =============================================================================
// getAllUsers
// =============================================================================
describe("getAllUsers", () => {
  describe("positive", () => {
    test("200 — returns list of users", async () => {
      mockListUsers.mockResolvedValue({ users: [SAMPLE_USER], totalCount: 1, page: 1, pageSize: 20 });
      const r = res();
      await getAllUsers({ user: SUPER_ADMIN, query: {} }, r, jest.fn());
      expect(r.status).toHaveBeenCalledWith(200);
      expect(r.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Users fetched successfully", data: [SAMPLE_USER] })
      );
    });

    test("200 — returns empty array when no users", async () => {
      mockListUsers.mockResolvedValue({ users: [], totalCount: 0, page: 1, pageSize: 20 });
      const r = res();
      await getAllUsers({ user: SUPER_ADMIN, query: {} }, r, jest.fn());
      expect(r.status).toHaveBeenCalledWith(200);
      expect(r.json).toHaveBeenCalledWith(expect.objectContaining({ data: [] }));
    });

    test("passes actor and query to service", async () => {
      mockListUsers.mockResolvedValue({ users: [], totalCount: 0, page: 1, pageSize: 20 });
      const query = { role: "employee" };
      await getAllUsers({ user: ADMIN_USER, query }, res(), jest.fn());
      expect(mockListUsers).toHaveBeenCalledWith(ADMIN_USER, query);
    });
  });

  describe("negative", () => {
    test("calls next(error) when service throws", async () => {
      mockListUsers.mockRejectedValue(new Error("DB error"));
      const next = jest.fn();
      await getAllUsers({ user: SUPER_ADMIN, query: {} }, res(), next);
      expect(next).toHaveBeenCalled();
    });
  });
});

// =============================================================================
// getUserById
// =============================================================================
describe("getUserById", () => {
  describe("positive", () => {
    test("200 — returns user when found", async () => {
      mockGetUserById.mockResolvedValue(SAMPLE_USER);
      const r = res();
      await getUserById({ user: SUPER_ADMIN, params: { id: "user_001" } }, r, jest.fn());
      expect(r.status).toHaveBeenCalledWith(200);
      expect(r.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "User fetched successfully", data: SAMPLE_USER })
      );
    });
  });

  describe("negative", () => {
    test("calls next(error) when service throws (not found)", async () => {
      mockGetUserById.mockRejectedValue(new Error("User not found"));
      const next = jest.fn();
      await getUserById({ user: SUPER_ADMIN, params: { id: "bad_id" } }, res(), next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe("edge", () => {
    test("passes actor and id to service", async () => {
      mockGetUserById.mockResolvedValue(SAMPLE_USER);
      await getUserById({ user: SUPER_ADMIN, params: { id: "user_001" } }, res(), jest.fn());
      expect(mockGetUserById).toHaveBeenCalledWith(SUPER_ADMIN, "user_001");
    });
  });
});

// =============================================================================
// createUser
// =============================================================================
describe("createUser", () => {
  describe("positive", () => {
    test("201 — creates and returns user", async () => {
      mockCreateUser.mockResolvedValue(SAMPLE_USER);
      const r = res();
      await createUser({ user: ADMIN_USER, body: { username: "alice", role: "employee" } }, r, jest.fn());
      expect(r.status).toHaveBeenCalledWith(201);
      expect(r.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "User created successfully", data: SAMPLE_USER })
      );
    });
  });

  describe("negative", () => {
    test("calls next(error) when service throws", async () => {
      mockCreateUser.mockRejectedValue(new Error("Username taken"));
      const next = jest.fn();
      await createUser({ user: ADMIN_USER, body: {} }, res(), next);
      expect(next).toHaveBeenCalled();
    });
  });
});

// =============================================================================
// updateUser
// =============================================================================
describe("updateUser", () => {
  describe("positive", () => {
    test("200 — returns updated user", async () => {
      const updated = { ...SAMPLE_USER, fullName: "Alice Updated" };
      mockUpdateUser.mockResolvedValue(updated);
      const r = res();
      await updateUser({ user: ADMIN_USER, params: { id: "user_001" }, body: { fullName: "Alice Updated" } }, r, jest.fn());
      expect(r.status).toHaveBeenCalledWith(200);
      expect(r.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "User updated successfully", data: updated })
      );
    });
  });

  describe("negative", () => {
    test("calls next(error) when service throws", async () => {
      mockUpdateUser.mockRejectedValue(new Error("Not found"));
      const next = jest.fn();
      await updateUser({ user: ADMIN_USER, params: { id: "bad" }, body: {} }, res(), next);
      expect(next).toHaveBeenCalled();
    });
  });
});

// =============================================================================
// deactivateUser
// =============================================================================
describe("deactivateUser", () => {
  describe("positive", () => {
    test("200 — deactivates user", async () => {
      mockDeactivateUser.mockResolvedValue({ ...SAMPLE_USER, isActive: false });
      const r = res();
      await deactivateUser({ user: ADMIN_USER, params: { id: "user_001" } }, r, jest.fn());
      expect(r.status).toHaveBeenCalledWith(200);
      expect(r.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "User deactivated successfully" })
      );
    });
  });

  describe("negative", () => {
    test("calls next(error) when service throws", async () => {
      mockDeactivateUser.mockRejectedValue(new Error("Cannot deactivate self"));
      const next = jest.fn();
      await deactivateUser({ user: ADMIN_USER, params: { id: "admin_001" } }, res(), next);
      expect(next).toHaveBeenCalled();
    });
  });
});

// =============================================================================
// deleteUser
// =============================================================================
describe("deleteUser", () => {
  describe("positive", () => {
    test("200 — deletes user", async () => {
      mockDeleteUser.mockResolvedValue(SAMPLE_USER);
      const r = res();
      await deleteUser({ user: SUPER_ADMIN, params: { id: "user_001" } }, r, jest.fn());
      expect(r.status).toHaveBeenCalledWith(200);
      expect(r.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "User deleted successfully" })
      );
    });
  });

  describe("negative", () => {
    test("calls next(error) when service throws", async () => {
      mockDeleteUser.mockRejectedValue(new Error("Cannot delete self"));
      const next = jest.fn();
      await deleteUser({ user: SUPER_ADMIN, params: { id: "sa_001" } }, res(), next);
      expect(next).toHaveBeenCalled();
    });
  });
});
