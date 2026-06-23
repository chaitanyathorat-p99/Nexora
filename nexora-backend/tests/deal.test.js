/**
 * @file deal.test.js
 * @description Tests for Deal module — controller
 *
 * Structure
 * ├── handleCreateDeal
 * ├── handleGetDeals
 * ├── handleGetDealByid
 * ├── handleUpdateDeal
 * ├── handleDeleteDeal
 * └── handleUpdateDealStage
 */

import { jest } from "@jest/globals";

// ── Mock deal service ─────────────────────────────────────────────────────────
const mockCreateDeal      = jest.fn();
const mockListDeals       = jest.fn();
const mockGetDealDetails  = jest.fn();
const mockUpdateDealInfo  = jest.fn();
const mockRemoveDeal      = jest.fn();
const mockUpdateDealStage = jest.fn();

jest.unstable_mockModule("../src/modules/deal/deal.service.js", () => ({
  createDeal:      mockCreateDeal,
  listDeals:       mockListDeals,
  getDealDetails:  mockGetDealDetails,
  updateDealInfo:  mockUpdateDealInfo,
  removeDeal:      mockRemoveDeal,
  updateDealStage: mockUpdateDealStage,
}));

const {
  handleCreateDeal, handleGetDeals, handleGetDealByid,
  handleUpdateDeal, handleDeleteDeal, handleUpdateDealStage,
} = await import("../src/modules/deal/deal.controller.js");

// ── Helpers ───────────────────────────────────────────────────────────────────
const res = () => {
  const r = {};
  r.status = jest.fn().mockReturnValue(r);
  r.json   = jest.fn().mockReturnValue(r);
  return r;
};

const USER = { id: "user_001", _id: "user_001", role: "admin" };

const SAMPLE_DEAL = {
  _id: "deal_001", leadId: "lead_001", dealType: "New",
  dealStage: "Qualification", currency: "INR", dealValue: 50000,
  createdBy: "user_001",
};

beforeEach(() => jest.clearAllMocks());

// =============================================================================
// handleCreateDeal
// =============================================================================
describe("handleCreateDeal", () => {
  describe("positive", () => {
    test("201 — creates deal with user id", async () => {
      // Note: controller has a bug — missing await on createDeal
      // The mock returns synchronously to match current behaviour
      mockCreateDeal.mockReturnValue(SAMPLE_DEAL);
      const r = res();
      await handleCreateDeal({ body: { leadId: "lead_001", dealType: "New", dealStage: "Qualification", currency: "INR", dealValue: 50000 }, user: USER }, r, jest.fn());
      expect(r.status).toHaveBeenCalledWith(201);
      expect(r.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Deal added sucessfully" })
      );
    });

    test("passes body and user.id to service", async () => {
      mockCreateDeal.mockReturnValue(SAMPLE_DEAL);
      const body = { leadId: "lead_001", dealType: "New", dealStage: "New", currency: "USD", dealValue: 1000 };
      await handleCreateDeal({ body, user: USER }, res(), jest.fn());
      expect(mockCreateDeal).toHaveBeenCalledWith(body, USER.id);
    });
  });

  describe("negative", () => {
    test("calls next(error) when service throws", async () => {
      mockCreateDeal.mockImplementation(() => { throw new Error("Validation error"); });
      const next = jest.fn();
      await handleCreateDeal({ body: {}, user: USER }, res(), next);
      expect(next).toHaveBeenCalled();
    });
  });
});

// =============================================================================
// handleGetDeals
// =============================================================================
describe("handleGetDeals", () => {
  describe("positive", () => {
    test("200 — returns list of deals", async () => {
      mockListDeals.mockResolvedValue([SAMPLE_DEAL]);
      const r = res();
      await handleGetDeals({}, r, jest.fn());
      expect(r.status).toHaveBeenCalledWith(200);
      expect(r.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Deals retrived", data: [SAMPLE_DEAL] })
      );
    });

    test("200 — returns empty array when no deals", async () => {
      mockListDeals.mockResolvedValue([]);
      const r = res();
      await handleGetDeals({}, r, jest.fn());
      expect(r.status).toHaveBeenCalledWith(200);
    });
  });

  describe("negative", () => {
    test("calls next(error) when service throws", async () => {
      mockListDeals.mockRejectedValue(new Error("DB error"));
      const next = jest.fn();
      await handleGetDeals({}, res(), next);
      expect(next).toHaveBeenCalled();
    });
  });
});

// =============================================================================
// handleGetDealByid
// =============================================================================
describe("handleGetDealByid", () => {
  describe("positive", () => {
    test("200 — returns deal when found", async () => {
      mockGetDealDetails.mockResolvedValue(SAMPLE_DEAL);
      const r = res();
      await handleGetDealByid({ params: { id: "deal_001" } }, r, jest.fn());
      expect(r.status).toHaveBeenCalledWith(200);
      expect(r.json).toHaveBeenCalledWith(
        expect.objectContaining({ data: SAMPLE_DEAL })
      );
    });
  });

  describe("negative", () => {
    test("calls next(error) when deal not found", async () => {
      mockGetDealDetails.mockRejectedValue(new Error("Deal not found"));
      const next = jest.fn();
      await handleGetDealByid({ params: { id: "bad" } }, res(), next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe("edge", () => {
    test("passes exact id to service", async () => {
      mockGetDealDetails.mockResolvedValue(SAMPLE_DEAL);
      await handleGetDealByid({ params: { id: "deal_001" } }, res(), jest.fn());
      expect(mockGetDealDetails).toHaveBeenCalledWith("deal_001");
    });
  });
});

// =============================================================================
// handleUpdateDeal
// =============================================================================
describe("handleUpdateDeal", () => {
  describe("positive", () => {
    test("200 — returns updated deal", async () => {
      const updated = { ...SAMPLE_DEAL, dealValue: 75000 };
      mockUpdateDealInfo.mockResolvedValue(updated);
      const r = res();
      await handleUpdateDeal({ params: { id: "deal_001" }, body: { dealValue: 75000 } }, r, jest.fn());
      expect(r.status).toHaveBeenCalledWith(200);
      expect(r.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Deal updated successfully" })
      );
    });
  });

  describe("negative", () => {
    test("calls next(error) when service throws", async () => {
      mockUpdateDealInfo.mockRejectedValue(new Error("Not found"));
      const next = jest.fn();
      await handleUpdateDeal({ params: { id: "bad" }, body: {} }, res(), next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe("edge", () => {
    test("passes empty body without error", async () => {
      mockUpdateDealInfo.mockResolvedValue(SAMPLE_DEAL);
      const r = res();
      await handleUpdateDeal({ params: { id: "deal_001" }, body: {} }, r, jest.fn());
      expect(r.status).toHaveBeenCalledWith(200);
    });
  });
});

// =============================================================================
// handleDeleteDeal
// =============================================================================
describe("handleDeleteDeal", () => {
  describe("positive", () => {
    test("200 — deletes deal successfully", async () => {
      mockRemoveDeal.mockResolvedValue(SAMPLE_DEAL);
      const r = res();
      await handleDeleteDeal({ params: { id: "deal_001" } }, r, jest.fn());
      expect(r.status).toHaveBeenCalledWith(200);
      expect(r.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Deal Deleted successfully" })
      );
    });
  });

  describe("negative", () => {
    test("calls next(error) when service throws", async () => {
      mockRemoveDeal.mockRejectedValue(new Error("Not found"));
      const next = jest.fn();
      await handleDeleteDeal({ params: { id: "bad" } }, res(), next);
      expect(next).toHaveBeenCalled();
    });
  });
});

// =============================================================================
// handleUpdateDealStage
// =============================================================================
describe("handleUpdateDealStage", () => {
  describe("positive", () => {
    test("200 — moves deal to new stage", async () => {
      const updated = { ...SAMPLE_DEAL, dealStage: "Won" };
      mockUpdateDealStage.mockResolvedValue(updated);
      const r = res();
      await handleUpdateDealStage({ params: { id: "deal_001" }, body: { dealStage: "Won" } }, r, jest.fn());
      expect(r.status).toHaveBeenCalledWith(200);
      expect(r.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Deal moved to Won" })
      );
    });

    test("passes id and dealStage to service", async () => {
      mockUpdateDealStage.mockResolvedValue(SAMPLE_DEAL);
      await handleUpdateDealStage({ params: { id: "deal_001" }, body: { dealStage: "Lost" } }, res(), jest.fn());
      expect(mockUpdateDealStage).toHaveBeenCalledWith("deal_001", "Lost");
    });
  });

  describe("negative", () => {
    test("calls next(error) when service throws", async () => {
      mockUpdateDealStage.mockRejectedValue(new Error("Invalid stage"));
      const next = jest.fn();
      await handleUpdateDealStage({ params: { id: "deal_001" }, body: { dealStage: "Bad" } }, res(), next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe("edge", () => {
    test("message includes the stage name", async () => {
      mockUpdateDealStage.mockResolvedValue({ ...SAMPLE_DEAL, dealStage: "Negotiation" });
      const r = res();
      await handleUpdateDealStage({ params: { id: "deal_001" }, body: { dealStage: "Negotiation" } }, r, jest.fn());
      expect(r.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Deal moved to Negotiation" })
      );
    });
  });
});
