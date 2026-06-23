/**
 * @file meeting.test.js
 * @description Tests for Meeting module — validation middleware + controller
 *
 * Structure
 * ├── validateMeetingData
 * │   ├── positive
 * │   ├── negative
 * │   └── edge
 * ├── createMeeting controller
 * ├── getMeetings controller
 * ├── getMeetingById controller
 * ├── updateMeeting controller
 * └── deleteMeeting controller
 */

import { jest } from "@jest/globals";

// ── Mock meeting service ──────────────────────────────────────────────────────
const mockCreate    = jest.fn();
const mockGetAll    = jest.fn();
const mockGetById   = jest.fn();
const mockUpdate    = jest.fn();
const mockDelete    = jest.fn();
const mockGetOptions = jest.fn();

jest.unstable_mockModule("../src/modules/meetings/meeting.service.js", () => ({
  createMeetingService:     mockCreate,
  getAllMeetingsService:     mockGetAll,
  getMeetingByIdService:    mockGetById,
  updateMeetingService:     mockUpdate,
  deleteMeetingService:     mockDelete,
  getMeetingOptionsService: mockGetOptions,
}));

const {
  createMeeting, getMeetings, getMeetingById, updateMeeting, deleteMeeting, getMeetingOptions,
} = await import("../src/modules/meetings/meeting.controller.js");

const { validateMeetingData } = await import("../src/modules/meetings/meeting.validation.js");

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
const SUPER   = { _id: "super_id",   role: "super_admin" };
const REGULAR = { _id: "regular_id", role: "sales" };

const SAMPLE = {
  _id: "mtg_001", title: "Demo", meetingType: "Online", platForm: "Zoom Meet",
  meetingDone: false,
  assignedTo: { _id: "regular_id" },
  createdBy:  { _id: "regular_id" },
};

beforeEach(() => jest.clearAllMocks());

// =============================================================================
// validateMeetingData
// =============================================================================
describe("validateMeetingData", () => {
  describe("positive", () => {
    test("passes with title only", () => {
      const { req, res: r, next } = rr({ title: "Kickoff" });
      validateMeetingData(req, r, next);
      expect(next).toHaveBeenCalledTimes(1);
    });

    test("passes with all optional fields", () => {
      const { req, res: r, next } = rr({
        title: "Demo", dueDate: "2026-06-15T10:00:00.000Z",
        desc: "Details", meetingType: "Online", platForm: "Zoom Meet",
        meetingLink: "https://zoom.us/j/123", meetingDone: false,
      });
      validateMeetingData(req, r, next);
      expect(next).toHaveBeenCalledTimes(1);
    });

    test("passes when meetingDone is true", () => {
      const { req, res: r, next } = rr({ title: "Done", meetingDone: true });
      validateMeetingData(req, r, next);
      expect(next).toHaveBeenCalledTimes(1);
    });

    test("passes with valid ISO dueDate", () => {
      const { req, res: r, next } = rr({ title: "T", dueDate: "2026-12-31T23:59:59.000Z" });
      validateMeetingData(req, r, next);
      expect(next).toHaveBeenCalledTimes(1);
    });
  });

  describe("negative", () => {
    test("rejects missing title", () => {
      const { req, res: r, next } = rr({ desc: "no title" });
      validateMeetingData(req, r, next);
      expect(next).not.toHaveBeenCalled();
      expect(r.status).toHaveBeenCalledWith(400);
      expect(r.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "title is required" })
      );
    });

    test("rejects empty string title", () => {
      const { req, res: r, next } = rr({ title: "" });
      validateMeetingData(req, r, next);
      expect(next).not.toHaveBeenCalled();
      expect(r.status).toHaveBeenCalledWith(400);
    });

    test("rejects null title", () => {
      const { req, res: r, next } = rr({ title: null });
      validateMeetingData(req, r, next);
      expect(next).not.toHaveBeenCalled();
    });

    test("rejects invalid dueDate string", () => {
      const { req, res: r, next } = rr({ title: "T", dueDate: "not-a-date" });
      validateMeetingData(req, r, next);
      expect(next).not.toHaveBeenCalled();
      expect(r.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "dueDate must be a valid date" })
      );
    });

    test("rejects meetingDone as string", () => {
      const { req, res: r, next } = rr({ title: "T", meetingDone: "yes" });
      validateMeetingData(req, r, next);
      expect(next).not.toHaveBeenCalled();
      expect(r.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "meetingDone must be a boolean" })
      );
    });

    test("rejects meetingDone as number", () => {
      const { req, res: r, next } = rr({ title: "T", meetingDone: 1 });
      validateMeetingData(req, r, next);
      expect(next).not.toHaveBeenCalled();
    });

    test("rejects empty body", () => {
      const { req, res: r, next } = rr({});
      validateMeetingData(req, r, next);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("edge", () => {
    test("passes single-char title", () => {
      const { req, res: r, next } = rr({ title: "A" });
      validateMeetingData(req, r, next);
      expect(next).toHaveBeenCalledTimes(1);
    });

    test("passes 1000-char title", () => {
      const { req, res: r, next } = rr({ title: "x".repeat(1000) });
      validateMeetingData(req, r, next);
      expect(next).toHaveBeenCalledTimes(1);
    });

    test("whitespace-only title is truthy — passes (documents gap)", () => {
      const { req, res: r, next } = rr({ title: "   " });
      validateMeetingData(req, r, next);
      expect(next).toHaveBeenCalledTimes(1); // current behaviour
    });

    test("null dueDate is treated as not provided — passes", () => {
      const { req, res: r, next } = rr({ title: "T", dueDate: null });
      validateMeetingData(req, r, next);
      expect(next).toHaveBeenCalledTimes(1);
    });

    test("rejects meetingDone='undefined' string", () => {
      const { req, res: r, next } = rr({ title: "T", meetingDone: "undefined" });
      validateMeetingData(req, r, next);
      expect(next).not.toHaveBeenCalled();
    });

    test("passes with extra unknown fields", () => {
      const { req, res: r, next } = rr({ title: "T", unknownField: 42 });
      validateMeetingData(req, r, next);
      expect(next).toHaveBeenCalledTimes(1);
    });
  });
});

// =============================================================================
// createMeeting controller
// =============================================================================
describe("createMeeting controller", () => {
  describe("positive", () => {
    test("201 — creates meeting, defaults assignedTo to creator", async () => {
      mockCreate.mockResolvedValue(SAMPLE);
      const r = res();
      await createMeeting({ body: { title: "Demo" }, user: REGULAR }, r, jest.fn());
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({ createdBy: REGULAR._id, assignedTo: REGULAR._id })
      );
      expect(r.status).toHaveBeenCalledWith(201);
      expect(r.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Meeting created successfully" })
      );
    });

    test("201 — respects explicit assignedTo in body", async () => {
      mockCreate.mockResolvedValue(SAMPLE);
      const r = res();
      await createMeeting({ body: { title: "Demo", assignedTo: "other_id" }, user: REGULAR }, r, jest.fn());
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({ assignedTo: "other_id" })
      );
    });
  });

  describe("negative", () => {
    test("calls next(error) when service throws", async () => {
      mockCreate.mockRejectedValue(new Error("DB error"));
      const next = jest.fn();
      await createMeeting({ body: { title: "Demo" }, user: REGULAR }, res(), next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe("edge", () => {
    test("createdBy cannot be spoofed from body", async () => {
      mockCreate.mockResolvedValue(SAMPLE);
      await createMeeting({ body: { title: "T", createdBy: "spoofed" }, user: REGULAR }, res(), jest.fn());
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({ createdBy: REGULAR._id })
      );
    });
  });
});

// =============================================================================
// getMeetings controller
// =============================================================================
describe("getMeetings controller", () => {
  const LIST = { meetings: [SAMPLE], total: 1, pages: 1, currentPage: 1 };

  describe("positive", () => {
    test("200 — returns paginated list", async () => {
      mockGetAll.mockResolvedValue(LIST);
      const r = res();
      await getMeetings({ query: {}, user: REGULAR }, r, jest.fn());
      expect(r.status).toHaveBeenCalledWith(200);
      expect(r.json).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ content: [SAMPLE] }) })
      );
    });

    test("applies search filter to $or across title/desc/meetingLink", async () => {
      mockGetAll.mockResolvedValue(LIST);
      await getMeetings({ query: { search: "demo" }, user: REGULAR }, res(), jest.fn());
      const [filters] = mockGetAll.mock.calls[0];
      expect(filters.$or[0].title).toEqual({ $regex: "demo", $options: "i" });
    });

    test("meetingDone='true' is cast to boolean true", async () => {
      mockGetAll.mockResolvedValue(LIST);
      await getMeetings({ query: { meetingDone: "true" }, user: REGULAR }, res(), jest.fn());
      const [filters] = mockGetAll.mock.calls[0];
      expect(filters.meetingDone).toBe(true);
    });

    test("meetingDone='false' is cast to boolean false", async () => {
      mockGetAll.mockResolvedValue(LIST);
      await getMeetings({ query: { meetingDone: "false" }, user: REGULAR }, res(), jest.fn());
      const [filters] = mockGetAll.mock.calls[0];
      expect(filters.meetingDone).toBe(false);
    });

    test("date range sets $gte/$lte as Date objects", async () => {
      mockGetAll.mockResolvedValue(LIST);
      await getMeetings({ query: { from: "2026-01-01", to: "2026-12-31" }, user: REGULAR }, res(), jest.fn());
      const [filters] = mockGetAll.mock.calls[0];
      expect(filters.createdAt.$gte).toBeInstanceOf(Date);
      expect(filters.createdAt.$lte).toBeInstanceOf(Date);
    });

    test("sort defaults to createdAt desc", async () => {
      mockGetAll.mockResolvedValue(LIST);
      await getMeetings({ query: {}, user: REGULAR }, res(), jest.fn());
      const [, , , sort] = mockGetAll.mock.calls[0];
      expect(sort).toEqual({ createdAt: -1 });
    });
  });

  describe("negative", () => {
    test("calls next(error) when service throws", async () => {
      mockGetAll.mockRejectedValue(new Error("DB error"));
      const next = jest.fn();
      await getMeetings({ query: {}, user: REGULAR }, res(), next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe("edge", () => {
    test("page=0 is clamped to 1", async () => {
      mockGetAll.mockResolvedValue(LIST);
      await getMeetings({ query: { page: "0" }, user: REGULAR }, res(), jest.fn());
      const [, skip] = mockGetAll.mock.calls[0];
      expect(skip).toBe(0);
    });

    test("non-numeric page defaults to 1", async () => {
      mockGetAll.mockResolvedValue(LIST);
      await getMeetings({ query: { page: "abc" }, user: REGULAR }, res(), jest.fn());
      const [, skip] = mockGetAll.mock.calls[0];
      expect(skip).toBe(0);
    });

    test("empty meetingDone string is skipped", async () => {
      mockGetAll.mockResolvedValue(LIST);
      await getMeetings({ query: { meetingDone: "" }, user: REGULAR }, res(), jest.fn());
      const [filters] = mockGetAll.mock.calls[0];
      expect(filters.meetingDone).toBeUndefined();
    });
  });
});

// =============================================================================
// getMeetingById controller
// =============================================================================
describe("getMeetingById controller", () => {
  describe("positive", () => {
    test("200 — returns meeting when found", async () => {
      mockGetById.mockResolvedValue(SAMPLE);
      const r = res();
      await getMeetingById({ params: { id: "mtg_001" }, user: REGULAR }, r, jest.fn());
      expect(r.status).toHaveBeenCalledWith(200);
    });
  });

  describe("negative", () => {
    test("404 — meeting not found", async () => {
      mockGetById.mockResolvedValue(null);
      const r = res();
      await getMeetingById({ params: { id: "bad" }, user: REGULAR }, r, jest.fn());
      expect(r.status).toHaveBeenCalledWith(404);
      expect(r.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Meeting not found" })
      );
    });

    test("calls next(error) when service throws", async () => {
      mockGetById.mockRejectedValue(new Error("Cast error"));
      const next = jest.fn();
      await getMeetingById({ params: { id: "bad" }, user: REGULAR }, res(), next);
      expect(next).toHaveBeenCalled();
    });
  });
});

// =============================================================================
// updateMeeting controller
// =============================================================================
describe("updateMeeting controller", () => {
  describe("positive", () => {
    test("200 — admin can update any meeting", async () => {
      mockGetById.mockResolvedValue(SAMPLE);
      mockUpdate.mockResolvedValue({ ...SAMPLE, title: "Updated" });
      const r = res();
      await updateMeeting({ params: { id: "mtg_001" }, body: { title: "Updated" }, user: ADMIN }, r, jest.fn());
      expect(r.status).toHaveBeenCalledWith(200);
    });

    test("200 — creator can update their own meeting", async () => {
      mockGetById.mockResolvedValue(SAMPLE);
      mockUpdate.mockResolvedValue(SAMPLE);
      const r = res();
      await updateMeeting({ params: { id: "mtg_001" }, body: {}, user: REGULAR }, r, jest.fn());
      expect(r.status).toHaveBeenCalledWith(200);
    });

    test("200 — assignedTo user can update", async () => {
      const mtg = { ...SAMPLE, assignedTo: { _id: "assigned_id" }, createdBy: { _id: "other" } };
      mockGetById.mockResolvedValue(mtg);
      mockUpdate.mockResolvedValue(mtg);
      const r = res();
      await updateMeeting(
        { params: { id: "mtg_001" }, body: {}, user: { _id: "assigned_id", role: "sales" } },
        r, jest.fn()
      );
      expect(r.status).toHaveBeenCalledWith(200);
    });
  });

  describe("negative", () => {
    test("404 — meeting not found", async () => {
      mockGetById.mockResolvedValue(null);
      const r = res();
      await updateMeeting({ params: { id: "bad" }, body: {}, user: ADMIN }, r, jest.fn());
      expect(r.status).toHaveBeenCalledWith(404);
    });

    test("403 — unrelated non-admin user denied", async () => {
      const mtg = { ...SAMPLE, assignedTo: { _id: "x" }, createdBy: { _id: "y" } };
      mockGetById.mockResolvedValue(mtg);
      const r = res();
      await updateMeeting({ params: { id: "mtg_001" }, body: {}, user: REGULAR }, r, jest.fn());
      expect(r.status).toHaveBeenCalledWith(403);
      expect(r.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Access denied to update this meeting" })
      );
    });
  });

  describe("edge", () => {
    test("403 — 'manager' role is not in admin list", async () => {
      const mtg = { ...SAMPLE, assignedTo: { _id: "x" }, createdBy: { _id: "y" } };
      mockGetById.mockResolvedValue(mtg);
      const r = res();
      await updateMeeting({ params: { id: "mtg_001" }, body: {}, user: { _id: "m", role: "manager" } }, r, jest.fn());
      expect(r.status).toHaveBeenCalledWith(403);
    });

    test("200 — update succeeds when assignedTo is null but user is creator", async () => {
      const mtg = { ...SAMPLE, assignedTo: null, createdBy: { _id: REGULAR._id } };
      mockGetById.mockResolvedValue(mtg);
      mockUpdate.mockResolvedValue(mtg);
      const r = res();
      await updateMeeting({ params: { id: "mtg_001" }, body: {}, user: REGULAR }, r, jest.fn());
      expect(r.status).toHaveBeenCalledWith(200);
    });
  });
});

// =============================================================================
// deleteMeeting controller
// =============================================================================
describe("deleteMeeting controller", () => {
  describe("positive", () => {
    test("200 — admin can delete", async () => {
      mockGetById.mockResolvedValue(SAMPLE);
      mockDelete.mockResolvedValue(true);
      const r = res();
      await deleteMeeting({ params: { id: "mtg_001" }, user: ADMIN }, r, jest.fn());
      expect(r.status).toHaveBeenCalledWith(200);
      expect(r.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Meeting deleted successfully" })
      );
    });

    test("200 — super_admin can delete", async () => {
      mockGetById.mockResolvedValue(SAMPLE);
      mockDelete.mockResolvedValue(true);
      const r = res();
      await deleteMeeting({ params: { id: "mtg_001" }, user: SUPER }, r, jest.fn());
      expect(r.status).toHaveBeenCalledWith(200);
    });
  });

  describe("negative", () => {
    test("404 — meeting not found", async () => {
      mockGetById.mockResolvedValue(null);
      const r = res();
      await deleteMeeting({ params: { id: "bad" }, user: ADMIN }, r, jest.fn());
      expect(r.status).toHaveBeenCalledWith(404);
    });

    test("403 — regular user cannot delete", async () => {
      mockGetById.mockResolvedValue(SAMPLE);
      const r = res();
      await deleteMeeting({ params: { id: "mtg_001" }, user: REGULAR }, r, jest.fn());
      expect(r.status).toHaveBeenCalledWith(403);
      expect(r.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Only admins can delete meetings" })
      );
    });

    test("403 — creator who is not admin cannot delete", async () => {
      const mtg = { ...SAMPLE, createdBy: { _id: REGULAR._id } };
      mockGetById.mockResolvedValue(mtg);
      const r = res();
      await deleteMeeting({ params: { id: "mtg_001" }, user: REGULAR }, r, jest.fn());
      expect(r.status).toHaveBeenCalledWith(403);
    });
  });

  describe("edge", () => {
    test("403 — unknown role 'moderator' is denied", async () => {
      mockGetById.mockResolvedValue(SAMPLE);
      const r = res();
      await deleteMeeting({ params: { id: "mtg_001" }, user: { _id: "x", role: "moderator" } }, r, jest.fn());
      expect(r.status).toHaveBeenCalledWith(403);
    });
  });
});
