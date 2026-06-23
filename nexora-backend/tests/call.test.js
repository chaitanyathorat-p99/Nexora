/**
 * @file call.test.js
 * @description Tests for Call module — controller
 *
 * Structure
 * ├── createCall
 * ├── getCallsByLead
 * ├── getCallById
 * ├── updateCall
 * ├── deleteCall
 * └── getAllCalls
 */

import { jest } from "@jest/globals";

// ── Mock call service ─────────────────────────────────────────────────────────
const mockCreate         = jest.fn();
const mockGetByLead      = jest.fn();
const mockGetById        = jest.fn();
const mockUpdate         = jest.fn();
const mockDelete         = jest.fn();
const mockGetAll         = jest.fn();

jest.unstable_mockModule("../src/modules/call/call.service.js", () => ({
  createCall:     mockCreate,
  getCallsByLead: mockGetByLead,
  getCallById:    mockGetById,
  updateCall:     mockUpdate,
  deleteCall:     mockDelete,
  getAllCalls:     mockGetAll,
}));

const {
  createCall, getCallsByLead, getCallById, updateCall, deleteCall, getAllCalls,
} = await import("../src/modules/call/call.controller.js");

// ── Helpers ───────────────────────────────────────────────────────────────────
const res = () => {
  const r = {};
  r.status = jest.fn().mockReturnValue(r);
  r.json   = jest.fn().mockReturnValue(r);
  return r;
};

const USER = { _id: "user_001", id: "user_001", role: "employee" };

const SAMPLE_CALL = {
  _id: "call_001", lead: "lead_001", title: "Follow-up call",
  callType: "outgoing", status: "completed", duration: 15,
};

beforeEach(() => jest.clearAllMocks());

// =============================================================================
// createCall
// =============================================================================
describe("createCall", () => {
  describe("positive", () => {
    test("201 — creates call with user id", async () => {
      mockCreate.mockResolvedValue(SAMPLE_CALL);
      const r = res();
      await createCall({ body: { lead: "lead_001", title: "Follow-up" }, user: USER }, r);
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({ lead: "lead_001" }), USER._id
      );
      expect(r.status).toHaveBeenCalledWith(201);
      expect(r.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Call created successfully" })
      );
    });

    test("uses _id from req.user", async () => {
      mockCreate.mockResolvedValue(SAMPLE_CALL);
      await createCall({ body: { lead: "lead_001", title: "T" }, user: { _id: "uid", id: "uid2" } }, res());
      expect(mockCreate).toHaveBeenCalledWith(expect.anything(), "uid");
    });
  });

  describe("negative", () => {
    test("400 — returns error when service throws", async () => {
      mockCreate.mockRejectedValue(new Error("Lead not found"));
      const r = res();
      await createCall({ body: { lead: "bad", title: "T" }, user: USER }, r);
      expect(r.status).toHaveBeenCalledWith(400);
      expect(r.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Lead not found" })
      );
    });
  });

  describe("edge", () => {
    test("400 — generic fallback message when error has no message", async () => {
      mockCreate.mockRejectedValue(new Error());
      const r = res();
      await createCall({ body: {}, user: USER }, r);
      expect(r.status).toHaveBeenCalledWith(400);
      expect(r.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Failed to create call" })
      );
    });
  });
});

// =============================================================================
// getCallsByLead
// =============================================================================
describe("getCallsByLead", () => {
  const RESULT = { calls: [SAMPLE_CALL], total: 1 };

  describe("positive", () => {
    test("200 — returns calls for a lead", async () => {
      mockGetByLead.mockResolvedValue(RESULT);
      const r = res();
      await getCallsByLead({ query: { lead: "lead_001" }, user: USER }, r);
      expect(r.status).toHaveBeenCalledWith(200);
      expect(r.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Calls retrieved successfully" })
      );
    });

    test("applies search filter to $or", async () => {
      mockGetByLead.mockResolvedValue(RESULT);
      await getCallsByLead({ query: { lead: "lead_001", search: "follow" }, user: USER }, res());
      const [, , , filter] = mockGetByLead.mock.calls[0];
      expect(filter.$or).toBeDefined();
    });

    test("passes page and limit to service", async () => {
      mockGetByLead.mockResolvedValue(RESULT);
      await getCallsByLead({ query: { lead: "lead_001", page: "2", limit: "5" }, user: USER }, res());
      expect(mockGetByLead).toHaveBeenCalledWith("lead_001", 2, 5, expect.anything());
    });
  });

  describe("negative", () => {
    test("400 — returns error when lead id is missing", async () => {
      const r = res();
      await getCallsByLead({ query: {}, user: USER }, r);
      expect(r.status).toHaveBeenCalledWith(400);
      expect(r.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Lead ID is required" })
      );
    });

    test("400 — returns error when service throws", async () => {
      mockGetByLead.mockRejectedValue(new Error("DB error"));
      const r = res();
      await getCallsByLead({ query: { lead: "lead_001" }, user: USER }, r);
      expect(r.status).toHaveBeenCalledWith(400);
    });
  });
});

// =============================================================================
// getCallById
// =============================================================================
describe("getCallById", () => {
  describe("positive", () => {
    test("200 — returns call when found", async () => {
      mockGetById.mockResolvedValue(SAMPLE_CALL);
      const r = res();
      await getCallById({ params: { id: "call_001" }, user: USER }, r);
      expect(r.status).toHaveBeenCalledWith(200);
      expect(r.json).toHaveBeenCalledWith(
        expect.objectContaining({ data: SAMPLE_CALL })
      );
    });
  });

  describe("negative", () => {
    test("404 — call not found", async () => {
      mockGetById.mockRejectedValue(new Error("Call not found"));
      const r = res();
      await getCallById({ params: { id: "bad" }, user: USER }, r);
      expect(r.status).toHaveBeenCalledWith(404);
    });
  });

  describe("edge", () => {
    test("passes exact id to service", async () => {
      mockGetById.mockResolvedValue(SAMPLE_CALL);
      await getCallById({ params: { id: "call_001" }, user: USER }, res());
      expect(mockGetById).toHaveBeenCalledWith("call_001");
    });
  });
});

// =============================================================================
// updateCall
// =============================================================================
describe("updateCall", () => {
  describe("positive", () => {
    test("200 — updates call successfully", async () => {
      const updated = { ...SAMPLE_CALL, status: "cancelled" };
      mockUpdate.mockResolvedValue(updated);
      const r = res();
      await updateCall({ params: { id: "call_001" }, body: { status: "cancelled" }, user: USER }, r);
      expect(r.status).toHaveBeenCalledWith(200);
      expect(r.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Call updated successfully" })
      );
    });
  });

  describe("negative", () => {
    test("400 — returns error when service throws", async () => {
      mockUpdate.mockRejectedValue(new Error("Not found"));
      const r = res();
      await updateCall({ params: { id: "bad" }, body: {}, user: USER }, r);
      expect(r.status).toHaveBeenCalledWith(400);
    });
  });

  describe("edge", () => {
    test("passes user id to service", async () => {
      mockUpdate.mockResolvedValue(SAMPLE_CALL);
      await updateCall({ params: { id: "call_001" }, body: {}, user: USER }, res());
      expect(mockUpdate).toHaveBeenCalledWith("call_001", expect.anything(), USER._id);
    });
  });
});

// =============================================================================
// deleteCall
// =============================================================================
describe("deleteCall", () => {
  describe("positive", () => {
    test("200 — deletes call successfully", async () => {
      mockDelete.mockResolvedValue(SAMPLE_CALL);
      const r = res();
      await deleteCall({ params: { id: "call_001" }, user: USER }, r);
      expect(r.status).toHaveBeenCalledWith(200);
      expect(r.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Call deleted successfully" })
      );
    });
  });

  describe("negative", () => {
    test("404 — call not found", async () => {
      mockDelete.mockRejectedValue(new Error("Call not found"));
      const r = res();
      await deleteCall({ params: { id: "bad" }, user: USER }, r);
      expect(r.status).toHaveBeenCalledWith(404);
    });
  });
});

// =============================================================================
// getAllCalls
// =============================================================================
describe("getAllCalls", () => {
  const RESULT = { calls: [SAMPLE_CALL], total: 1 };

  describe("positive", () => {
    test("200 — returns all calls with default pagination", async () => {
      mockGetAll.mockResolvedValue(RESULT);
      const r = res();
      await getAllCalls({ query: {}, user: USER }, r);
      expect(r.status).toHaveBeenCalledWith(200);
      expect(mockGetAll).toHaveBeenCalledWith(1, 10, expect.anything());
    });

    test("applies search filter", async () => {
      mockGetAll.mockResolvedValue(RESULT);
      await getAllCalls({ query: { search: "follow" }, user: USER }, res());
      const [, , filter] = mockGetAll.mock.calls[0];
      expect(filter.$or).toBeDefined();
    });

    test("passes custom page and limit", async () => {
      mockGetAll.mockResolvedValue(RESULT);
      await getAllCalls({ query: { page: "3", limit: "5" }, user: USER }, res());
      expect(mockGetAll).toHaveBeenCalledWith(3, 5, expect.anything());
    });
  });

  describe("negative", () => {
    test("400 — returns error when service throws", async () => {
      mockGetAll.mockRejectedValue(new Error("DB error"));
      const r = res();
      await getAllCalls({ query: {}, user: USER }, r);
      expect(r.status).toHaveBeenCalledWith(400);
    });
  });

  describe("edge", () => {
    test("no search filter when search is not provided", async () => {
      mockGetAll.mockResolvedValue(RESULT);
      await getAllCalls({ query: {} }, res());
      const [, , filter] = mockGetAll.mock.calls[0];
      expect(filter.$or).toBeUndefined();
    });
  });
});
