/**
 * @file lead.test.js
 * @description Tests for Lead module — controller
 *
 * Structure
 * ├── handleCreateLead
 * ├── handleGetLeads
 * ├── handleGetLeadById
 * ├── handleUpdateLead
 * └── handleDeleteLead
 */

import { jest } from "@jest/globals";

// ── Mock lead service ─────────────────────────────────────────────────────────
const mockCreateLead  = jest.fn();
const mockListLeads   = jest.fn();
const mockGetDetails  = jest.fn();
const mockUpdateLead  = jest.fn();
const mockRemoveLead  = jest.fn();

jest.unstable_mockModule("../src/modules/lead/lead.service.js", () => ({
  createLead:     mockCreateLead,
  listLeads:      mockListLeads,
  getLeadDetails: mockGetDetails,
  updateleadInfo: mockUpdateLead,
  removeLead:     mockRemoveLead,
}));

const {
  handleCreateLead, handleGetLeads, handleGetLeadById, handleUpdateLead, handleDeleteLead,
} = await import("../src/modules/lead/lead.controller.js");

// ── Helpers ───────────────────────────────────────────────────────────────────
const res = () => {
  const r = {};
  r.status = jest.fn().mockReturnValue(r);
  r.json   = jest.fn().mockReturnValue(r);
  return r;
};

const SAMPLE_USER = { _id: "user_001", role: "admin" };

const SAMPLE_LEAD = {
  _id: "lead_001", firstName: "Alice", lastName: "Smith",
  email: "alice@example.com", mobile: "9876543210",
  leadWeight: "Hot", status: "Active",
};

beforeEach(() => jest.clearAllMocks());

// =============================================================================
// handleCreateLead
// =============================================================================
describe("handleCreateLead", () => {
  describe("positive", () => {
    test("201 — creates and returns lead", async () => {
      mockCreateLead.mockResolvedValue(SAMPLE_LEAD);
      const r = res();
      await handleCreateLead(
        { body: { firstName: "Alice", lastName: "Smith", email: "alice@example.com", mobile: "9876543210", leadWeight: "Hot" }, user: SAMPLE_USER },
        r, jest.fn()
      );
      expect(r.status).toHaveBeenCalledWith(201);
      expect(r.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Lead created Sucessfully", data: SAMPLE_LEAD })
      );
    });

    test("passes req.body and req.user to service", async () => {
      mockCreateLead.mockResolvedValue(SAMPLE_LEAD);
      const body = { firstName: "Alice", lastName: "Smith", email: "alice@example.com", mobile: "9876543210", leadWeight: "Hot", source: "Web" };
      await handleCreateLead({ body, user: SAMPLE_USER }, res(), jest.fn());
      expect(mockCreateLead).toHaveBeenCalledWith(body, SAMPLE_USER);
    });
  });

  describe("negative", () => {
    test("calls next(error) when service throws", async () => {
      mockCreateLead.mockRejectedValue(new Error("Duplicate email"));
      const next = jest.fn();
      await handleCreateLead({ body: {}, user: SAMPLE_USER }, res(), next);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("edge", () => {
    test("calls next(error) on unexpected DB failure", async () => {
      mockCreateLead.mockRejectedValue(new Error("MongoNetworkError"));
      const next = jest.fn();
      await handleCreateLead({ body: { firstName: "A" }, user: SAMPLE_USER }, res(), next);
      expect(next).toHaveBeenCalled();
    });
  });
});

// =============================================================================
// handleGetLeads
// =============================================================================
describe("handleGetLeads", () => {
  describe("positive", () => {
    test("200 — returns list of leads", async () => {
      mockListLeads.mockResolvedValue({ leads: [SAMPLE_LEAD], totalCount: 1, page: 1, pageSize: 10 });
      const r = res();
      await handleGetLeads({ query: {}, user: SAMPLE_USER }, r, jest.fn());
      expect(r.status).toHaveBeenCalledWith(200);
      expect(r.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Leads retrived", data: [SAMPLE_LEAD] })
      );
    });

    test("passes req.query and req.user to service", async () => {
      mockListLeads.mockResolvedValue({ leads: [], totalCount: 0, page: 1, pageSize: 10 });
      const query = { status: "Active", page: "1" };
      await handleGetLeads({ query, user: SAMPLE_USER }, res(), jest.fn());
      expect(mockListLeads).toHaveBeenCalledWith(query, SAMPLE_USER);
    });

    test("200 — returns empty array when no leads", async () => {
      mockListLeads.mockResolvedValue({ leads: [], totalCount: 0, page: 1, pageSize: 10 });
      const r = res();
      await handleGetLeads({ query: {}, user: SAMPLE_USER }, r, jest.fn());
      expect(r.status).toHaveBeenCalledWith(200);
      expect(r.json).toHaveBeenCalledWith(expect.objectContaining({ data: [] }));
    });
  });

  describe("negative", () => {
    test("calls next(error) when service throws", async () => {
      mockListLeads.mockRejectedValue(new Error("DB error"));
      const next = jest.fn();
      await handleGetLeads({ query: {}, user: SAMPLE_USER }, res(), next);
      expect(next).toHaveBeenCalled();
    });
  });
});

// =============================================================================
// handleGetLeadById
// =============================================================================
describe("handleGetLeadById", () => {
  describe("positive", () => {
    test("200 — returns lead when found", async () => {
      mockGetDetails.mockResolvedValue(SAMPLE_LEAD);
      const r = res();
      await handleGetLeadById({ params: { id: "lead_001" }, user: SAMPLE_USER }, r, jest.fn());
      expect(r.status).toHaveBeenCalledWith(200);
      expect(r.json).toHaveBeenCalledWith(
        expect.objectContaining({ data: SAMPLE_LEAD })
      );
    });
  });

  describe("negative", () => {
    test("calls next(error) when service throws (not found)", async () => {
      mockGetDetails.mockRejectedValue(new Error("Lead not found"));
      const next = jest.fn();
      await handleGetLeadById({ params: { id: "bad_id" }, user: SAMPLE_USER }, res(), next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe("edge", () => {
    test("passes id and user to service", async () => {
      mockGetDetails.mockResolvedValue(SAMPLE_LEAD);
      await handleGetLeadById({ params: { id: "lead_001" }, user: SAMPLE_USER }, res(), jest.fn());
      expect(mockGetDetails).toHaveBeenCalledWith("lead_001", SAMPLE_USER);
    });
  });
});

// =============================================================================
// handleUpdateLead
// =============================================================================
describe("handleUpdateLead", () => {
  describe("positive", () => {
    test("200 — returns updated lead", async () => {
      const updated = { ...SAMPLE_LEAD, firstName: "Bob" };
      mockUpdateLead.mockResolvedValue(updated);
      const r = res();
      await handleUpdateLead({ params: { id: "lead_001" }, body: { firstName: "Bob" }, user: SAMPLE_USER }, r, jest.fn());
      expect(r.status).toHaveBeenCalledWith(200);
      expect(r.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Lead updated sucessfully", data: updated })
      );
    });

    test("passes id, body, and user to service", async () => {
      mockUpdateLead.mockResolvedValue(SAMPLE_LEAD);
      const body = { status: "Inactive" };
      await handleUpdateLead({ params: { id: "lead_001" }, body, user: SAMPLE_USER }, res(), jest.fn());
      expect(mockUpdateLead).toHaveBeenCalledWith("lead_001", body, SAMPLE_USER);
    });
  });

  describe("negative", () => {
    test("calls next(error) when service throws", async () => {
      mockUpdateLead.mockRejectedValue(new Error("Not found"));
      const next = jest.fn();
      await handleUpdateLead({ params: { id: "bad" }, body: {}, user: SAMPLE_USER }, res(), next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe("edge", () => {
    test("passes empty body without error", async () => {
      mockUpdateLead.mockResolvedValue(SAMPLE_LEAD);
      const r = res();
      await handleUpdateLead({ params: { id: "lead_001" }, body: {}, user: SAMPLE_USER }, r, jest.fn());
      expect(r.status).toHaveBeenCalledWith(200);
    });
  });
});

// =============================================================================
// handleDeleteLead
// =============================================================================
describe("handleDeleteLead", () => {
  describe("positive", () => {
    test("200 — deletes lead and returns result", async () => {
      mockRemoveLead.mockResolvedValue(SAMPLE_LEAD);
      const r = res();
      await handleDeleteLead({ params: { id: "lead_001" }, user: SAMPLE_USER }, r, jest.fn());
      expect(r.status).toHaveBeenCalledWith(200);
      expect(r.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Lead deleted Sucessfully" })
      );
    });
  });

  describe("negative", () => {
    test("calls next(error) when service throws", async () => {
      mockRemoveLead.mockRejectedValue(new Error("Not found"));
      const next = jest.fn();
      await handleDeleteLead({ params: { id: "bad" }, user: SAMPLE_USER }, res(), next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe("edge", () => {
    test("passes exact id to service", async () => {
      mockRemoveLead.mockResolvedValue(SAMPLE_LEAD);
      await handleDeleteLead({ params: { id: "lead_001" }, user: SAMPLE_USER }, res(), jest.fn());
      expect(mockRemoveLead).toHaveBeenCalledWith("lead_001");
    });
  });
});
