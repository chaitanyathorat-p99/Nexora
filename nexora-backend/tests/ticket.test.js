/**
 * @file ticket.test.js
 * @description Tests for Ticket module — validation middleware + controller
 *
 * Structure
 * ├── validateTicketData
 * │   ├── positive
 * │   ├── negative
 * │   └── edge
 * ├── createTicket controller
 * ├── getTickets controller
 * ├── getTicketById controller
 * ├── updateTicket controller
 * └── deleteTicket controller
 */

import { jest } from "@jest/globals";

// ── Mock ticket service ───────────────────────────────────────────────────────
const mockCreate     = jest.fn();
const mockGetAll     = jest.fn();
const mockGetById    = jest.fn();
const mockUpdate     = jest.fn();
const mockDelete     = jest.fn();
const mockGetOptions = jest.fn();

jest.unstable_mockModule("../src/modules/tickets/ticket.service.js", () => ({
  createTicketService:     mockCreate,
  getAllTicketsService:     mockGetAll,
  getTicketByIdService:    mockGetById,
  updateTicketService:     mockUpdate,
  deleteTicketService:     mockDelete,
  getTicketOptionsService: mockGetOptions,
}));

const {
  createTicket, getTickets, getTicketById, updateTicket, deleteTicket, getTicketOptions,
} = await import("../src/modules/tickets/ticket.controller.js");

const { validateTicketData } = await import("../src/modules/tickets/ticket.validation.js");

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

const ADMIN   = { _id: "admin_id",   role: "admin" };
const REGULAR = { _id: "regular_id", role: "employee" };

const SAMPLE_TICKET = {
  _id: "ticket_001", subject: "Login issue", category: "Bug",
  status: "Open", priority: "High", assignedTo: { _id: "regular_id" },
  createdBy: { _id: "regular_id" },
};

beforeEach(() => jest.clearAllMocks());

// =============================================================================
// validateTicketData
// =============================================================================
describe("validateTicketData", () => {
  describe("positive", () => {
    test("passes with required fields only", () => {
      const { req, res: r, next } = rr({ subject: "Login issue", category: "Bug", assignedTo: "user_001" });
      validateTicketData(req, r, next);
      expect(next).toHaveBeenCalledTimes(1);
    });

    test("passes with valid status", () => {
      const { req, res: r, next } = rr({ subject: "S", category: "C", assignedTo: "u", status: "Open" });
      validateTicketData(req, r, next);
      expect(next).toHaveBeenCalledTimes(1);
    });

    test("passes with valid priority", () => {
      const { req, res: r, next } = rr({ subject: "S", category: "C", assignedTo: "u", priority: "High" });
      validateTicketData(req, r, next);
      expect(next).toHaveBeenCalledTimes(1);
    });

    test("passes with tags as array", () => {
      const { req, res: r, next } = rr({ subject: "S", category: "C", assignedTo: "u", tags: ["bug", "urgent"] });
      validateTicketData(req, r, next);
      expect(next).toHaveBeenCalledTimes(1);
    });

    test("passes with tags as comma-separated string", () => {
      const { req, res: r, next } = rr({ subject: "S", category: "C", assignedTo: "u", tags: "bug,urgent" });
      validateTicketData(req, r, next);
      expect(next).toHaveBeenCalledTimes(1);
    });

    test("passes with valid slaDueDate", () => {
      const { req, res: r, next } = rr({ subject: "S", category: "C", assignedTo: "u", slaDueDate: "2026-12-31" });
      validateTicketData(req, r, next);
      expect(next).toHaveBeenCalledTimes(1);
    });
  });

  describe("negative", () => {
    test("rejects when subject is missing", () => {
      const { req, res: r, next } = rr({ category: "Bug", assignedTo: "u" });
      validateTicketData(req, r, next);
      expect(next).not.toHaveBeenCalled();
      expect(r.status).toHaveBeenCalledWith(400);
      expect(r.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "subject, category, and assignedTo are required" })
      );
    });

    test("rejects when category is missing", () => {
      const { req, res: r, next } = rr({ subject: "S", assignedTo: "u" });
      validateTicketData(req, r, next);
      expect(next).not.toHaveBeenCalled();
      expect(r.status).toHaveBeenCalledWith(400);
    });

    test("rejects when assignedTo is missing", () => {
      const { req, res: r, next } = rr({ subject: "S", category: "C" });
      validateTicketData(req, r, next);
      expect(next).not.toHaveBeenCalled();
      expect(r.status).toHaveBeenCalledWith(400);
    });

    test("rejects invalid status", () => {
      const { req, res: r, next } = rr({ subject: "S", category: "C", assignedTo: "u", status: "Pending" });
      validateTicketData(req, r, next);
      expect(next).not.toHaveBeenCalled();
      expect(r.status).toHaveBeenCalledWith(400);
    });

    test("rejects invalid priority", () => {
      const { req, res: r, next } = rr({ subject: "S", category: "C", assignedTo: "u", priority: "Urgent" });
      validateTicketData(req, r, next);
      expect(next).not.toHaveBeenCalled();
      expect(r.status).toHaveBeenCalledWith(400);
    });

    test("rejects invalid slaDueDate", () => {
      const { req, res: r, next } = rr({ subject: "S", category: "C", assignedTo: "u", slaDueDate: "not-a-date" });
      validateTicketData(req, r, next);
      expect(next).not.toHaveBeenCalled();
      expect(r.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "slaDueDate must be a valid date" })
      );
    });

    test("rejects tags as a number", () => {
      const { req, res: r, next } = rr({ subject: "S", category: "C", assignedTo: "u", tags: 123 });
      validateTicketData(req, r, next);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("edge", () => {
    test("rejects empty body", () => {
      const { req, res: r, next } = rr({});
      validateTicketData(req, r, next);
      expect(next).not.toHaveBeenCalled();
    });

    test("passes all four valid statuses", () => {
      for (const status of ["Open", "In Progress", "Resolved", "Closed"]) {
        const { req, res: r, next } = rr({ subject: "S", category: "C", assignedTo: "u", status });
        validateTicketData(req, r, next);
        expect(next).toHaveBeenCalledTimes(1);
        jest.clearAllMocks();
      }
    });

    test("passes all four valid priorities", () => {
      for (const priority of ["Low", "Medium", "High", "Critical"]) {
        const { req, res: r, next } = rr({ subject: "S", category: "C", assignedTo: "u", priority });
        validateTicketData(req, r, next);
        expect(next).toHaveBeenCalledTimes(1);
        jest.clearAllMocks();
      }
    });
  });
});

// =============================================================================
// createTicket controller
// =============================================================================
describe("createTicket controller", () => {
  describe("positive", () => {
    test("201 — creates ticket with createdBy from req.user", async () => {
      mockCreate.mockResolvedValue(SAMPLE_TICKET);
      const r = res();
      await createTicket({ body: { subject: "Login issue", category: "Bug", assignedTo: "u", tags: ["bug"] }, user: REGULAR }, r);
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({ createdBy: REGULAR._id })
      );
      expect(r.status).toHaveBeenCalledWith(201);
      expect(r.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Ticket created successfully" })
      );
    });

    test("converts comma-separated tags string to array", async () => {
      mockCreate.mockResolvedValue(SAMPLE_TICKET);
      await createTicket({ body: { subject: "S", category: "C", assignedTo: "u", tags: "bug,urgent" }, user: REGULAR }, res());
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({ tags: ["bug", "urgent"] })
      );
    });

    test("handles missing tags gracefully (defaults to [])", async () => {
      mockCreate.mockResolvedValue(SAMPLE_TICKET);
      await createTicket({ body: { subject: "S", category: "C", assignedTo: "u" }, user: REGULAR }, res());
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({ tags: [] })
      );
    });
  });

  describe("negative", () => {
    test("500 — returns error when service throws", async () => {
      mockCreate.mockRejectedValue(new Error("DB error"));
      const r = res();
      await createTicket({ body: { subject: "S", category: "C", assignedTo: "u" }, user: REGULAR }, r);
      expect(r.status).toHaveBeenCalledWith(500);
    });
  });
});

// =============================================================================
// getTickets controller
// =============================================================================
describe("getTickets controller", () => {
  const LIST = { tickets: [SAMPLE_TICKET], total: 1, pages: 1 };

  describe("positive", () => {
    test("200 — returns paginated tickets", async () => {
      mockGetAll.mockResolvedValue(LIST);
      const r = res();
      await getTickets({ query: {} }, r);
      expect(r.status).toHaveBeenCalledWith(200);
    });

    test("applies status filter", async () => {
      mockGetAll.mockResolvedValue(LIST);
      await getTickets({ query: { status: "Open" } }, res());
      const [filters] = mockGetAll.mock.calls[0];
      expect(filters.status).toBe("Open");
    });

    test("applies priority filter", async () => {
      mockGetAll.mockResolvedValue(LIST);
      await getTickets({ query: { priority: "High" } }, res());
      const [filters] = mockGetAll.mock.calls[0];
      expect(filters.priority).toBe("High");
    });

    test("applies search filter to $or", async () => {
      mockGetAll.mockResolvedValue(LIST);
      await getTickets({ query: { search: "login" } }, res());
      const [filters] = mockGetAll.mock.calls[0];
      expect(filters.$or).toBeDefined();
    });
  });

  describe("negative", () => {
    test("500 — returns error when service throws", async () => {
      mockGetAll.mockRejectedValue(new Error("DB error"));
      const r = res();
      await getTickets({ query: {} }, r);
      expect(r.status).toHaveBeenCalledWith(500);
    });
  });
});

// =============================================================================
// getTicketById controller
// =============================================================================
describe("getTicketById controller", () => {
  describe("positive", () => {
    test("200 — returns ticket when found", async () => {
      mockGetById.mockResolvedValue(SAMPLE_TICKET);
      const r = res();
      await getTicketById({ params: { id: "ticket_001" } }, r);
      expect(r.status).toHaveBeenCalledWith(200);
    });
  });

  describe("negative", () => {
    test("404 — ticket not found", async () => {
      mockGetById.mockResolvedValue(null);
      const r = res();
      await getTicketById({ params: { id: "bad" } }, r);
      expect(r.status).toHaveBeenCalledWith(404);
      expect(r.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Ticket not found" })
      );
    });
  });
});

// =============================================================================
// updateTicket controller
// =============================================================================
describe("updateTicket controller", () => {
  describe("positive", () => {
    test("200 — admin can update any ticket", async () => {
      mockGetById.mockResolvedValue(SAMPLE_TICKET);
      mockUpdate.mockResolvedValue({ ...SAMPLE_TICKET, status: "Resolved" });
      const r = res();
      await updateTicket({ params: { id: "ticket_001" }, body: { status: "Resolved" }, user: ADMIN }, r);
      expect(r.status).toHaveBeenCalledWith(200);
    });

    test("200 — creator can update their own ticket", async () => {
      mockGetById.mockResolvedValue(SAMPLE_TICKET);
      mockUpdate.mockResolvedValue(SAMPLE_TICKET);
      const r = res();
      await updateTicket({ params: { id: "ticket_001" }, body: {}, user: REGULAR }, r);
      expect(r.status).toHaveBeenCalledWith(200);
    });
  });

  describe("negative", () => {
    test("404 — ticket not found", async () => {
      mockGetById.mockResolvedValue(null);
      const r = res();
      await updateTicket({ params: { id: "bad" }, body: {}, user: ADMIN }, r);
      expect(r.status).toHaveBeenCalledWith(404);
    });

    test("403 — unrelated non-admin user denied", async () => {
      const ticket = { ...SAMPLE_TICKET, assignedTo: { _id: "x" }, createdBy: { _id: "y" } };
      mockGetById.mockResolvedValue(ticket);
      const r = res();
      await updateTicket({ params: { id: "ticket_001" }, body: {}, user: REGULAR }, r);
      expect(r.status).toHaveBeenCalledWith(403);
      expect(r.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Access denied to update this ticket" })
      );
    });
  });
});

// =============================================================================
// deleteTicket controller
// =============================================================================
describe("deleteTicket controller", () => {
  describe("positive", () => {
    test("200 — admin can delete ticket", async () => {
      mockGetById.mockResolvedValue(SAMPLE_TICKET);
      mockDelete.mockResolvedValue(true);
      const r = res();
      await deleteTicket({ params: { id: "ticket_001" }, user: ADMIN }, r);
      expect(r.status).toHaveBeenCalledWith(200);
      expect(r.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Ticket deleted successfully" })
      );
    });
  });

  describe("negative", () => {
    test("404 — ticket not found", async () => {
      mockGetById.mockResolvedValue(null);
      const r = res();
      await deleteTicket({ params: { id: "bad" }, user: ADMIN }, r);
      expect(r.status).toHaveBeenCalledWith(404);
    });

    test("403 — regular user cannot delete", async () => {
      mockGetById.mockResolvedValue(SAMPLE_TICKET);
      const r = res();
      await deleteTicket({ params: { id: "ticket_001" }, user: REGULAR }, r);
      expect(r.status).toHaveBeenCalledWith(403);
      expect(r.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Only admins can delete tickets" })
      );
    });
  });

  describe("edge", () => {
    test("403 — 'manager' role is not in admin list", async () => {
      mockGetById.mockResolvedValue(SAMPLE_TICKET);
      const r = res();
      await deleteTicket({ params: { id: "ticket_001" }, user: { _id: "m", role: "manager" } }, r);
      expect(r.status).toHaveBeenCalledWith(403);
    });
  });
});
