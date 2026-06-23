import { mockDb } from "./mockDb";

const DEFAULT_DELAY_MS = 350;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function toUrl(url) {
  // Supports relative and absolute URLs
  return new URL(url, "http://mock.local");
}

function normalizePath(pathname) {
  // keep root as '/'
  if (!pathname) return "/";
  if (pathname.length > 1 && pathname.endsWith("/")) return pathname.slice(0, -1);
  return pathname;
}

function parseQuery(searchParams) {
  const out = {};
  for (const [key, value] of searchParams.entries()) {
    if (Object.prototype.hasOwnProperty.call(out, key)) {
      out[key] = Array.isArray(out[key]) ? [...out[key], value] : [out[key], value];
    } else {
      out[key] = value;
    }
  }
  return out;
}

function pickAuthUser() {
  const users = mockDb.list("users");
  // Prefer a "System" user as the logged-in user.
  return users.find((u) => u.userType === "System") || users[0] || null;
}

const ALL_MODULE_NAMES = [
  "Lead",
  "Meeting",
  "Call",
  "Task",
  "Product",
  "Deal",
  "TICKET",
  "User-Role",
  "System-User",
  "Client-User",
  "Lead-Status",
  "Product-Type",
  "Industry-Type",
  "Type of Buyer",
];

const MOCK_LOGIN_PASSWORDS = {
  superadmin: "super123",
  owneradmin: "owner123",
  employee1: "emp123",
};

function buildSeededPermissions() {
  return ALL_MODULE_NAMES.map((modelName) => ({
    modelName,
    read: true,
    write: true,
    create: true,
    update: true,
    delete: true,
    special: false,
  }));
}

function buildSeededFeatures() {
  return ALL_MODULE_NAMES.map((name) => ({
    name,
    description: "",
  }));
}

function buildFeaturesFromPermissions(permissions) {
  if (!Array.isArray(permissions)) return [];
  return permissions
    .filter(
      (permission) =>
        permission?.read ||
        permission?.write ||
        permission?.create ||
        permission?.update ||
        permission?.delete ||
        permission?.special
    )
    .map((permission) => ({ name: permission.modelName, description: "" }));
}

function enrichAuthUser(user) {
  const permissions = buildSeededPermissions();
  const roleId = typeof user?.role === "string" ? user.role : user?.role?._id;
  const dbRole = roleId ? mockDb.findById("userRoles", roleId) : null;

  const roleObj =
    user?.role && typeof user.role === "object" && Array.isArray(user.role.permissions)
      ? user.role
      : dbRole || {
          _id: user?.role || "role_mock",
          name: String(user?.role || "User"),
        };

  const rolePermissions =
    Array.isArray(roleObj?.permissions) && roleObj.permissions.length
      ? roleObj.permissions
      : permissions;
  const isEmployeeRole =
    roleObj?._id === "role_employee" ||
    String(roleObj?.name || "").toLowerCase() === "employee";
  const featuresMasterIds = isEmployeeRole
    ? []
    : buildFeaturesFromPermissions(rolePermissions);

  return {
    ...user,
    email: user?.email || "demo@nexora.local",
    companyMaster: user?.companyMaster || { name: "Nexora" },
    role: {
      ...roleObj,
      permissions: rolePermissions,
    },
    plan: isEmployeeRole
      ? { ...(user?.plan || {}), featuresMasterIds: [] }
      : user?.plan && Array.isArray(user.plan.featuresMasterIds) && user.plan.featuresMasterIds.length
      ? user.plan
      : { ...(user?.plan || {}), featuresMasterIds: featuresMasterIds.length ? featuresMasterIds : buildSeededFeatures() },
  };
}

function findAuthUserByUsername(username) {
  const normalized = String(username || "").trim().toLowerCase();
  if (!normalized) return null;
  return mockDb
    .list("users")
    .find((u) => String(u?.username || "").trim().toLowerCase() === normalized) || null;
}

function tokenToUserId(token) {
  const value = String(token || "").trim();
  const prefix = "mock_access_token_";
  if (!value.startsWith(prefix)) return null;
  return value.slice(prefix.length) || null;
}

function authHeaderToToken(headers) {
  const h = headers || {};
  const raw = h.Authorization || h.authorization || "";
  const match = String(raw).match(/^\s*Bearer\s+(.+)\s*$/i);
  return match ? match[1] : null;
}

function paginate(items, query) {
  const pageRaw = query?.page;
  const page = Math.max(1, Number(pageRaw || 1));
  const pageSize = 10;
  const start = (page - 1) * pageSize;
  const content = items.slice(start, start + pageSize);
  return {
    content,
    totalElements: items.length,
    page,
    size: pageSize,
  };
}

function filterBySearch(items, query) {
  const search = String(query?.search || "").trim().toLowerCase();
  if (!search) return items;
  return items.filter((item) => JSON.stringify(item).toLowerCase().includes(search));
}

function listOrPaginate(collection, query) {
  const base = filterBySearch(mockDb.list(collection), query);
  if (query?.page) return paginate(base, query);
  return base;
}

function ok(data, headers = {}) {
  return { status: 200, data, headers };
}

function created(data, headers = {}) {
  return { status: 201, data, headers };
}

function badRequest(message = "Bad request") {
  return { status: 400, data: { message } };
}

function notFound(message = "Not found") {
  return { status: 404, data: { message } };
}

function unauthorized(message = "Unauthorized") {
  return { status: 401, data: { message } };
}

function parseJsonBody(body) {
  if (!body) return null;
  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch {
      return null;
    }
  }
  return body;
}

function matchId(path, prefix) {
  // e.g. matchId('/api/lead/abc', '/api/lead') -> 'abc'
  const normalizedPrefix = normalizePath(prefix);
  const normalizedPath = normalizePath(path);
  if (!normalizedPath.startsWith(normalizedPrefix + "/")) return null;
  const rest = normalizedPath.slice((normalizedPrefix + "/").length);
  if (!rest) return null;
  return rest.split("/")[0];
}

function isMutation(method) {
  return ["POST", "PUT", "PATCH", "DELETE"].includes(String(method || "GET").toUpperCase());
}

export async function mockRequest(request, { delayMs = DEFAULT_DELAY_MS, errorRate = 0 } = {}) {
  const method = String(request?.method || "GET").toUpperCase();
  const urlObj = toUrl(request?.url || "/");
  const path = normalizePath(urlObj.pathname);
  const query = parseQuery(urlObj.searchParams);
  const body = parseJsonBody(request?.body);

  if (delayMs > 0) await sleep(delayMs);

  if (errorRate > 0 && Math.random() < errorRate && !isMutation(method)) {
    return { status: 500, data: { message: "Mock server error" } };
  }

  // -------------------- AUTH --------------------
  if (path === "/auth/login" || path === "/auth/login/") {
    if (method !== "POST") return badRequest("Unsupported method");
    const username = body?.username;
    const password = body?.password;

    const user = findAuthUserByUsername(username);
    if (!user) return unauthorized("Invalid credentials");

    const expectedPassword = MOCK_LOGIN_PASSWORDS[String(user.username || "").toLowerCase()];
    if (!expectedPassword || String(password || "") !== expectedPassword) {
      return unauthorized("Invalid credentials");
    }

    const accessToken = `mock_access_token_${user._id}`;
    return ok({
      data: {
        accessToken,
        refreshToken: "mock_refresh_token",
        user: enrichAuthUser(user),
        subscriptions: [],
        subscriptionStatus: "active",
      },
    });
  }

  if (path === "/auth/verify") {
    const token = authHeaderToToken(request?.headers);
    const userIdFromToken = tokenToUserId(token);
    const user = userIdFromToken
      ? mockDb.findById("users", userIdFromToken)
      : pickAuthUser();
    if (!user) return unauthorized("No mock user available");
    return ok({
      data: {
        user: enrichAuthUser(user),
        subscriptions: [],
        subscriptionStatus: "active",
      },
    });
  }

  if (path === "/auth/google-login" || path === "/auth/google-auth") {
    if (method !== "POST") return badRequest("Unsupported method");
    const user = pickAuthUser();
    if (!user) return unauthorized("No mock user available");
    return ok({
      data: {
        accessToken: "mock_access_token",
        refreshToken: "mock_refresh_token",
        user,
      },
    });
  }

  if (path === "/auth/forgot-password" || path === "/auth/verify-reset-otp" || path === "/auth/reset-password") {
    if (method !== "POST") return badRequest("Unsupported method");
    return ok({ success: true, message: "Action successful" });
  }

  // -------------------- USERS --------------------
  if (path === "/users" || path === "/users/") {
    if (method === "GET") {
      const all = mockDb.list("users");
      const userTypeParam = query?.userType;
      const filtered = userTypeParam ? all.filter((u) => String(u.userType).toLowerCase() === String(userTypeParam).toLowerCase()) : all;
      return ok({ data: filtered });
    }

    return badRequest("Unsupported method");
  }

  if (path === "/users/register" || path === "/users/register/") {
    if (method !== "POST") return badRequest("Unsupported method");
    const createdUser = mockDb.create("users", body || {}, { idPrefix: "user" });
    return created({ data: createdUser });
  }

  const userId = matchId(path, "/users");
  if (userId) {
    if (method === "GET") {
      const item = mockDb.findById("users", userId);
      return item ? ok({ data: item }) : notFound("User not found");
    }
    if (method === "PUT" || method === "PATCH") {
      const updated = mockDb.update("users", userId, body || {});
      return updated ? ok({ data: updated }) : notFound("User not found");
    }
    if (method === "DELETE") {
      const removed = mockDb.remove("users", userId);
      return removed ? ok({ success: true, message: "Deleted" }) : notFound("User not found");
    }
  }

  // -------------------- LEADS --------------------
  if (path === "/api/lead" || path === "/api/lead/") {
    if (method === "GET") {
      const base = filterBySearch(mockDb.list("leads"), query);
      // The UI expects a paginated payload shape across list usages.
      return ok(paginate(base, query));
    }
    if (method === "POST") {
      const createdLead = mockDb.create("leads", body || {}, { idPrefix: "lead" });
      return created(createdLead);
    }
  }

  if (path.startsWith("/api/lead/detail/")) {
    const id = matchId(path, "/api/lead/detail");
    const lead = id ? mockDb.findById("leads", id) : null;
    return lead ? ok(lead) : notFound("Lead not found");
  }

  if (path.startsWith("/api/lead/export")) {
    const base = filterBySearch(mockDb.list("leads"), query);
    return ok({ content: base, totalElements: base.length });
  }

  if (path === "/api/lead/import-csv") {
    if (method !== "POST") return badRequest("Unsupported method");
    return ok({ success: true, message: "Imported successfully" });
  }

  const leadId = matchId(path, "/api/lead");
  if (leadId) {
    if (method === "GET") {
      const lead = mockDb.findById("leads", leadId);
      return lead ? ok(lead) : notFound("Lead not found");
    }
    if (method === "PUT" || method === "PATCH") {
      const updated = mockDb.update("leads", leadId, body || {});
      return updated ? ok(updated) : notFound("Lead not found");
    }
    if (method === "DELETE") {
      const removed = mockDb.remove("leads", leadId);
      return removed ? ok({ success: true, message: "Deleted" }) : notFound("Lead not found");
    }
  }

  // -------------------- LEAD STATUS --------------------
  if (path === "/api/leadstatus" || path === "/api/leadstatus/") {
    if (method === "GET") {
      return ok(mockDb.list("leadStatuses"));
    }
    if (method === "POST") {
      const createdStatus = mockDb.create("leadStatuses", body || {}, { idPrefix: "leadstatus" });
      return created(createdStatus);
    }
  }

  const leadStatusId = matchId(path, "/api/leadstatus");
  if (leadStatusId) {
    if (method === "GET") {
      const item = mockDb.findById("leadStatuses", leadStatusId);
      return item ? ok(item) : notFound("Lead status not found");
    }
    if (method === "PUT" || method === "PATCH") {
      const updated = mockDb.update("leadStatuses", leadStatusId, body || {});
      return updated ? ok(updated) : notFound("Lead status not found");
    }
    if (method === "DELETE") {
      const removed = mockDb.remove("leadStatuses", leadStatusId);
      return removed ? ok({ success: true, message: "Deleted" }) : notFound("Lead status not found");
    }
  }

  // -------------------- TASKS --------------------
  if (path === "/api/tasks" || path === "/api/tasks/") {
    if (method === "GET") {
      const base = filterBySearch(mockDb.list("tasks"), query);
      if (query?.page) return ok(paginate(base, query));
      return ok(base);
    }
    if (method === "POST") {
      const createdTask = mockDb.create("tasks", body || {}, { idPrefix: "task" });
      return created(createdTask);
    }
  }

  const taskId = matchId(path, "/api/tasks");
  if (taskId) {
    if (method === "GET") {
      const item = mockDb.findById("tasks", taskId);
      return item ? ok(item) : notFound("Task not found");
    }
    if (method === "PUT" || method === "PATCH") {
      const updated = mockDb.update("tasks", taskId, body || {});
      return updated ? ok(updated) : notFound("Task not found");
    }
    if (method === "DELETE") {
      const removed = mockDb.remove("tasks", taskId);
      return removed ? ok({ success: true, message: "Deleted" }) : notFound("Task not found");
    }
  }

  // -------------------- DEALS --------------------
  if (path === "/api/deals" || path === "/api/deals/") {
    if (method === "GET") {
      const base = filterBySearch(mockDb.list("deals"), query);
      if (query?.page) return ok(paginate(base, query));
      return ok(base);
    }
    if (method === "POST") {
      const createdDeal = mockDb.create("deals", body || {}, { idPrefix: "deal" });
      return created(createdDeal);
    }
  }

  if (path.startsWith("/api/deals/detail/")) {
    const id = matchId(path, "/api/deals/detail");
    const deal = id ? mockDb.findById("deals", id) : null;
    return deal ? ok(deal) : notFound("Deal not found");
  }

  const dealId = matchId(path, "/api/deals");
  if (dealId) {
    if (method === "GET") {
      const item = mockDb.findById("deals", dealId);
      return item ? ok(item) : notFound("Deal not found");
    }
    if (method === "PUT" || method === "PATCH") {
      const updated = mockDb.update("deals", dealId, body || {});
      return updated ? ok(updated) : notFound("Deal not found");
    }
    if (method === "DELETE") {
      const removed = mockDb.remove("deals", dealId);
      return removed ? ok({ success: true, message: "Deleted" }) : notFound("Deal not found");
    }
  }

  // -------------------- PRODUCTS --------------------
  if (path === "/api/products" || path === "/api/products/") {
    if (method === "GET") {
      const base = filterBySearch(mockDb.list("products"), query);
      return ok(base);
    }
    if (method === "POST") {
      const createdProduct = mockDb.create("products", body || {}, { idPrefix: "product" });
      return created(createdProduct);
    }
  }

  const productId = matchId(path, "/api/products");
  if (productId) {
    if (method === "GET") {
      const item = mockDb.findById("products", productId);
      return item ? ok(item) : notFound("Product not found");
    }
    if (method === "PUT" || method === "PATCH") {
      const updated = mockDb.update("products", productId, body || {});
      return updated ? ok(updated) : notFound("Product not found");
    }
    if (method === "DELETE") {
      const removed = mockDb.remove("products", productId);
      return removed ? ok({ success: true, message: "Deleted" }) : notFound("Product not found");
    }
  }

  // -------------------- TICKETS --------------------
  if (path === "/tickets" || path === "/tickets/") {
    if (method === "GET") {
      const base = filterBySearch(mockDb.list("tickets"), query);
      return ok({ data: { tickets: query?.page ? paginate(base, query).content : base, total: base.length } });
    }
    if (method === "POST") {
      const createdTicket = mockDb.create("tickets", body || {}, { idPrefix: "ticket" });
      return created({ data: createdTicket });
    }
  }

  const ticketId = matchId(path, "/tickets");
  if (ticketId) {
    if (method === "GET") {
      const item = mockDb.findById("tickets", ticketId);
      return item ? ok(item) : notFound("Ticket not found");
    }
    if (method === "PATCH" || method === "PUT") {
      const updated = mockDb.update("tickets", ticketId, body || {});
      return updated ? ok(updated) : notFound("Ticket not found");
    }
    if (method === "DELETE") {
      const removed = mockDb.remove("tickets", ticketId);
      return removed ? ok({ success: true, message: "Deleted" }) : notFound("Ticket not found");
    }
  }

  // -------------------- NOTES --------------------
  if (path === "/api/notes" || path === "/api/notes/") {
    if (method === "GET") {
      const lead = query?.lead;
      const notes = mockDb.list("notes");
      return ok(lead ? notes.filter((n) => n.lead === lead) : notes);
    }
    if (method === "POST") {
      const createdNote = mockDb.create("notes", body || {}, { idPrefix: "note" });
      return created(createdNote);
    }
  }

  // -------------------- COMPANIES --------------------
  if (path === "/api/companies" || path === "/api/companies/") {
    if (method === "GET") {
      const leadId = query?.lead_id || query?.lead;
      const companies = mockDb.list("companies");
      return ok(leadId ? companies.filter((c) => c.lead_id === leadId || c.lead === leadId) : companies);
    }
    if (method === "POST") {
      const createdCompany = mockDb.create("companies", body || {}, { idPrefix: "company" });
      return created(createdCompany);
    }
  }

  const companyId = matchId(path, "/api/companies");
  if (companyId) {
    if (method === "GET") {
      const item = mockDb.findById("companies", companyId);
      return item ? ok(item) : notFound("Company not found");
    }
    if (method === "PUT" || method === "PATCH") {
      const updated = mockDb.update("companies", companyId, body || {});
      return updated ? ok(updated) : notFound("Company not found");
    }
    if (method === "DELETE") {
      const removed = mockDb.remove("companies", companyId);
      return removed ? ok({ success: true, message: "Deleted" }) : notFound("Company not found");
    }
  }

  // -------------------- COMPANY MASTER --------------------
  if (path === "/api/company-master" || path === "/api/company-master/") {
    if (method === "GET") return ok(listOrPaginate("companyMasters", query));
    if (method === "POST") {
      const createdCompanyMaster = mockDb.create("companyMasters", body || {}, { idPrefix: "companymaster" });
      return created(createdCompanyMaster);
    }
  }

  const companyMasterId = matchId(path, "/api/company-master");
  if (companyMasterId) {
    if (method === "GET") {
      const item = mockDb.findById("companyMasters", companyMasterId);
      return item ? ok(item) : notFound("Company master not found");
    }
    if (method === "PUT" || method === "PATCH") {
      const updated = mockDb.update("companyMasters", companyMasterId, body || {});
      return updated ? ok(updated) : notFound("Company master not found");
    }
    if (method === "DELETE") {
      const removed = mockDb.remove("companyMasters", companyMasterId);
      return removed ? ok({ success: true, message: "Deleted" }) : notFound("Company master not found");
    }
  }

  // -------------------- USER ROLES --------------------
  if (path === "/api/user-roles" || path === "/api/user-roles/") {
    if (method === "GET") {
      const base = filterBySearch(mockDb.list("userRoles"), query);
      return ok({ data: base });
    }
    if (method === "POST") {
      const createdRole = mockDb.create("userRoles", body || {}, { idPrefix: "role" });
      return created({ data: createdRole });
    }
  }

  const userRoleId = matchId(path, "/api/user-roles");
  if (userRoleId) {
    if (method === "GET") {
      const item = mockDb.findById("userRoles", userRoleId);
      return item ? ok({ data: item }) : notFound("User role not found");
    }
    if (method === "PUT" || method === "PATCH") {
      const updated = mockDb.update("userRoles", userRoleId, body || {});
      return updated ? ok({ data: updated }) : notFound("User role not found");
    }
    if (method === "DELETE") {
      const removed = mockDb.remove("userRoles", userRoleId);
      return removed ? ok({ success: true, message: "Deleted" }) : notFound("User role not found");
    }
  }

  // -------------------- QUOTATIONS --------------------
  if (path === "/api/quotation" || path === "/api/quotation/") {
    if (method === "GET") return ok(mockDb.list("quotations"));
    if (method === "POST") {
      const createdQuotation = mockDb.create("quotations", body || {}, { idPrefix: "quotation" });
      return created(createdQuotation);
    }
  }

  if (path.startsWith("/api/quotation/detail/")) {
    const id = matchId(path, "/api/quotation/detail");
    const quotation = id ? mockDb.findById("quotations", id) : null;
    return quotation ? ok(quotation) : notFound("Quotation not found");
  }

  const quotationId = matchId(path, "/api/quotation");
  if (quotationId) {
    if (method === "GET") {
      const item = mockDb.findById("quotations", quotationId);
      return item ? ok(item) : notFound("Quotation not found");
    }
    if (method === "PUT" || method === "PATCH") {
      const updated = mockDb.update("quotations", quotationId, body || {});
      return updated ? ok(updated) : notFound("Quotation not found");
    }
    if (method === "DELETE") {
      const removed = mockDb.remove("quotations", quotationId);
      return removed ? ok({ success: true, message: "Deleted" }) : notFound("Quotation not found");
    }
  }

  // -------------------- MEETINGS --------------------
  if (path === "/api/meetings" || path === "/api/meetings/") {
    if (method === "GET") {
      const leadFilter = query?.lead;
      const baseAll = filterBySearch(mockDb.list("meetings"), query);
      const base = leadFilter
        ? baseAll.filter((m) => {
            const meetingLeadId = typeof m?.lead === "object" && m?.lead ? m.lead._id : m?.lead;
            return meetingLeadId === leadFilter;
          })
        : baseAll;

      const pageResult = paginate(base, query);

      const populateFrom = (collection, value) => {
        if (!value) return value;
        if (typeof value === "object") return value;
        return mockDb.findById(collection, value) || value;
      };

      const populatedContent = pageResult.content.map((m) => {
        const assignedTo = Array.isArray(m.assignedTo)
          ? m.assignedTo.map((u) => populateFrom("users", u))
          : populateFrom("users", m.assignedTo);

        return {
          ...m,
          lead: populateFrom("leads", m.lead),
          createdBy: populateFrom("users", m.createdBy),
          assignedTo,
        };
      });

      return ok({ ...pageResult, content: populatedContent });
    }
    if (method === "POST") {
      const createdMeeting = mockDb.create("meetings", body || {}, { idPrefix: "meeting" });
      return created(createdMeeting);
    }
  }

  const meetingId = matchId(path, "/api/meetings");
  if (meetingId) {
    if (method === "GET") {
      const item = mockDb.findById("meetings", meetingId);
      return item ? ok(item) : notFound("Meeting not found");
    }
    if (method === "PUT" || method === "PATCH") {
      const updated = mockDb.update("meetings", meetingId, body || {});
      return updated ? ok(updated) : notFound("Meeting not found");
    }
    if (method === "DELETE") {
      const removed = mockDb.remove("meetings", meetingId);
      return removed ? ok({ success: true, message: "Deleted" }) : notFound("Meeting not found");
    }
  }

  // -------------------- CALLS --------------------
  if (path === "/api/calls" || path === "/api/calls/") {
    if (method === "GET") {
      const leadFilter = query?.lead;
      const baseAll = filterBySearch(mockDb.list("calls"), query);
      const base = leadFilter
        ? baseAll.filter((c) => {
            const callLeadId = typeof c?.lead === "object" && c?.lead ? c.lead._id : c?.lead;
            return callLeadId === leadFilter;
          })
        : baseAll;

      const pageResult = paginate(base, query);

      const populateFrom = (collection, value) => {
        if (!value) return value;
        if (typeof value === "object") return value;
        return mockDb.findById(collection, value) || value;
      };

      const populatedContent = pageResult.content.map((c) => {
        const assignedTo = Array.isArray(c.assignedTo)
          ? c.assignedTo.map((u) => populateFrom("users", u))
          : populateFrom("users", c.assignedTo);

        return {
          ...c,
          lead: populateFrom("leads", c.lead),
          createdBy: populateFrom("users", c.createdBy),
          assignedTo,
        };
      });

      return ok({ ...pageResult, content: populatedContent });
    }
    if (method === "POST") {
      const createdCall = mockDb.create("calls", body || {}, { idPrefix: "call" });
      return created(createdCall);
    }
  }

  const callId = matchId(path, "/api/calls");
  if (callId) {
    if (method === "GET") {
      const item = mockDb.findById("calls", callId);
      return item ? ok(item) : notFound("Call not found");
    }
    if (method === "PUT" || method === "PATCH") {
      const updated = mockDb.update("calls", callId, body || {});
      return updated ? ok(updated) : notFound("Call not found");
    }
    if (method === "DELETE") {
      const removed = mockDb.remove("calls", callId);
      return removed ? ok({ success: true, message: "Deleted" }) : notFound("Call not found");
    }
  }

  // -------------------- RATINGS --------------------
  if (path === "/api/rating" || path === "/api/rating/") {
    if (method === "GET") return ok(mockDb.list("ratings") || []);
    if (method === "POST") {
      const createdRating = mockDb.create("ratings", body || {}, { idPrefix: "rating" });
      return created(createdRating);
    }
  }

  const ratingId = matchId(path, "/api/rating");
  if (ratingId) {
    if (method === "GET") {
      const item = mockDb.findById("ratings", ratingId);
      return item ? ok(item) : notFound("Rating not found");
    }
    if (method === "PUT" || method === "PATCH") {
      const updated = mockDb.update("ratings", ratingId, body || {});
      return updated ? ok(updated) : notFound("Rating not found");
    }
    if (method === "DELETE") {
      const removed = mockDb.remove("ratings", ratingId);
      return removed ? ok({ success: true, message: "Deleted" }) : notFound("Rating not found");
    }
  }

  // -------------------- ACTIVITY --------------------
  if (path === "/api/activity" || path === "/api/activity/") {
    // Used for lead timelines; safe to return an array.
    return ok([]);
  }

  const noteId = matchId(path, "/api/note");
  if (noteId) {
    if (method === "PUT" || method === "PATCH") {
      const updated = mockDb.update("notes", noteId, body || {});
      return updated ? ok(updated) : notFound("Note not found");
    }
  }

  // -------------------- DASHBOARD STATS --------------------
  if (path.startsWith("/api/dashboard/count-by-created-date")) {
    // array of { _id: 'YYYY-MM', lead_count: number }
    return ok([
      { _id: "2026-03", lead_count: 4 },
      { _id: "2026-04", lead_count: 6 },
    ]);
  }

  if (path.startsWith("/api/dashboard/count-day-by-created-date")) {
    return ok([
      { _id: "2026-04-10", lead_count: 1 },
      { _id: "2026-04-11", lead_count: 2 },
      { _id: "2026-04-12", lead_count: 1 },
    ]);
  }

  if (path.startsWith("/api/dashboard/count-products")) {
    return ok([
      { _id: "Software", count: 2 },
      { _id: "Service", count: 1 },
    ]);
  }

  if (path === "/api/dashboard/year-options") {
    return ok([2024, 2025, 2026]);
  }

  // -------------------- REPORTS --------------------
  if (path.startsWith("/api/report/")) {
    // Keep a safe shape for report pages that check `.content`.
    return ok({ content: [], totalElements: 0 });
  }

  // -------------------- COMMON API / CSV / IMPORT --------------------
  if (path === "/api/common-api") {
    return ok({ content: [] });
  }

  if (path.startsWith("/api/common-api/export-csv")) {
    // Used by ExportCsvButton: expects { url: '/some/path' }
    return ok({ url: "/mock-files/export.csv" });
  }

  if (path === "/mock-files/export.csv") {
    // For axios blob download
    const csv = "id,name\n1,Mock\n";
    return ok(csv, { "content-type": "text/csv" });
  }

  if (path.startsWith("/api/common-api/import-csv")) {
    if (method !== "POST") return badRequest("Unsupported method");
    return ok({ success: true, message: "Imported successfully" });
  }

  // -------------------- COLUMNS --------------------
  if (path === "/api/columns" || path === "/api/columns/") {
    if (method === "GET") return ok(mockDb.list("columns"));
    if (method === "POST") {
      const createdColumn = mockDb.create("columns", body || {}, { idPrefix: "col" });
      return created(createdColumn);
    }
  }

  // -------------------- DYNAMIC FIELDS --------------------
  if (path === "/api/dynamic-fields" || path === "/api/dynamic-fields/") {
    if (method === "GET") return ok(mockDb.list("dynamicFields"));
    if (method === "POST") {
      const createdField = mockDb.create("dynamicFields", body || {}, { idPrefix: "dyn" });
      return created(createdField);
    }
  }

  if (path.startsWith("/api/dynamic-fields/module/")) {
    // Return module-filtered fields
    const moduleType = path.split("/").pop();
    const all = mockDb.list("dynamicFields");
    return ok(all.filter((f) => f.moduleType === moduleType));
  }

  const dynamicFieldId = matchId(path, "/api/dynamic-fields");
  if (dynamicFieldId) {
    if (method === "GET") {
      const item = mockDb.findById("dynamicFields", dynamicFieldId);
      return item ? ok(item) : notFound("Dynamic field not found");
    }
    if (method === "PUT" || method === "PATCH") {
      const updated = mockDb.update("dynamicFields", dynamicFieldId, body || {});
      return updated ? ok(updated) : notFound("Dynamic field not found");
    }
    if (method === "DELETE") {
      const removed = mockDb.remove("dynamicFields", dynamicFieldId);
      return removed ? ok({ success: true, message: "Deleted" }) : notFound("Dynamic field not found");
    }
  }

  if (path.endsWith("/toggle") && path.startsWith("/api/dynamic-fields/")) {
    const id = path.split("/")[3];
    const item = mockDb.findById("dynamicFields", id);
    if (!item) return notFound("Dynamic field not found");
    const updated = mockDb.update("dynamicFields", id, { isActive: !item.isActive });
    return ok(updated);
  }

  if (path === "/api/dynamic-fields/reorder") {
    return ok({ success: true, message: "Reordered" });
  }

  // -------------------- EMAIL TOKENS --------------------
  if (path === "/email-tokens") {
    if (method === "POST") {
      const token = mockDb.create("emailTokens", body || {}, { idPrefix: "emailtoken" });
      return ok({ success: true, data: token });
    }
    if (method === "GET") {
      const list = mockDb.list("emailTokens");
      const companyId = query?.companyId;
      const email = query?.email;
      const found = list.find((x) => x.companyId === companyId && x.email === email);
      return ok({ success: true, data: found || null });
    }
  }

  // -------------------- PLANS --------------------
  if (path === "/api/plans" || path === "/api/plans/") {
    if (method === "GET") {
      const base = filterBySearch(mockDb.list("plans"), query);
      return ok(paginate(base, query));
    }
    if (method === "POST") {
      const createdPlan = mockDb.create("plans", body || {}, { idPrefix: "plan" });
      return created(createdPlan);
    }
  }

  const planId = matchId(path, "/api/plans");
  if (planId) {
    if (method === "GET") {
      const item = mockDb.findById("plans", planId);
      return item ? ok(item) : notFound("Plan not found");
    }
    if (method === "PUT" || method === "PATCH") {
      const updated = mockDb.update("plans", planId, body || {});
      return updated ? ok(updated) : notFound("Plan not found");
    }
    if (method === "DELETE") {
      const removed = mockDb.remove("plans", planId);
      return removed ? ok({ success: true, message: "Deleted" }) : notFound("Plan not found");
    }
  }

  // -------------------- SUBSCRIPTIONS --------------------
  if (path === "/api/subscriptions" || path === "/api/subscriptions/") {
    if (method === "GET") {
      const base = filterBySearch(mockDb.list("subscriptions"), query);
      return ok(paginate(base, query));
    }
    if (method === "POST") {
      const createdSubscription = mockDb.create("subscriptions", body || {}, { idPrefix: "subscription" });
      return created(createdSubscription);
    }
  }

  if (path.startsWith("/api/subscriptions/user/")) {
    const userId = path.split("/").pop();
    const subs = mockDb.list("subscriptions");
    return ok({ data: subs.filter((s) => s.userId === userId) });
  }

  const subscriptionId = matchId(path, "/api/subscriptions");
  if (subscriptionId) {
    if (method === "GET") {
      const item = mockDb.findById("subscriptions", subscriptionId);
      return item ? ok(item) : notFound("Subscription not found");
    }
    if (method === "PUT" || method === "PATCH") {
      const updated = mockDb.update("subscriptions", subscriptionId, body || {});
      return updated ? ok(updated) : notFound("Subscription not found");
    }
    if (method === "DELETE") {
      const removed = mockDb.remove("subscriptions", subscriptionId);
      return removed ? ok({ success: true, message: "Deleted" }) : notFound("Subscription not found");
    }
  }

  // -------------------- FEATURES MASTER --------------------
  if (path === "/features-master" || path === "/features-master/") {
    if (method === "GET") return ok(mockDb.list("featuresMaster"));
    if (method === "POST") {
      const createdFeature = mockDb.create("featuresMaster", body || {}, { idPrefix: "feature" });
      return created(createdFeature);
    }
  }

  const featureId = matchId(path, "/features-master");
  if (featureId) {
    if (method === "GET") {
      const item = mockDb.findById("featuresMaster", featureId);
      return item ? ok(item) : notFound("Feature not found");
    }
    if (method === "PUT" || method === "PATCH") {
      const updated = mockDb.update("featuresMaster", featureId, body || {});
      return updated ? ok(updated) : notFound("Feature not found");
    }
    if (method === "DELETE") {
      const removed = mockDb.remove("featuresMaster", featureId);
      return removed ? ok({ success: true, message: "Deleted" }) : notFound("Feature not found");
    }
  }

  // -------------------- LIMITS --------------------
  if (path === "/limit" || path === "/limit/") {
    if (method === "GET") {
      const base = filterBySearch(mockDb.list("limits"), query);
      return ok({ content: base, totalElements: base.length });
    }
    if (method === "POST") {
      const createdLimit = mockDb.create("limits", body || {}, { idPrefix: "limit" });
      return created(createdLimit);
    }
  }

  const limitId = matchId(path, "/limit");
  if (limitId) {
    if (method === "GET") {
      const item = mockDb.findById("limits", limitId);
      return item ? ok(item) : notFound("Limit not found");
    }
    if (method === "PUT" || method === "PATCH") {
      const updated = mockDb.update("limits", limitId, body || {});
      return updated ? ok(updated) : notFound("Limit not found");
    }
    if (method === "DELETE") {
      const removed = mockDb.remove("limits", limitId);
      return removed ? ok({ success: true, message: "Deleted" }) : notFound("Limit not found");
    }
  }

  // -------------------- ENQUIRIES --------------------
  if (path === "/api/enquiry" || path === "/api/enquiry/") {
    if (method === "GET") {
      const base = filterBySearch(mockDb.list("enquiries"), query);
      return ok(paginate(base, query));
    }
    if (method === "POST") {
      const createdEnquiry = mockDb.create("enquiries", body || {}, { idPrefix: "enquiry" });
      return created(createdEnquiry);
    }
  }

  const enquiryId = matchId(path, "/api/enquiry");
  if (enquiryId) {
    if (method === "GET") {
      const item = mockDb.findById("enquiries", enquiryId);
      return item ? ok(item) : notFound("Enquiry not found");
    }
    if (method === "PUT" || method === "PATCH") {
      const updated = mockDb.update("enquiries", enquiryId, body || {});
      return updated ? ok(updated) : notFound("Enquiry not found");
    }
    if (method === "DELETE") {
      const removed = mockDb.remove("enquiries", enquiryId);
      return removed ? ok({ success: true, message: "Deleted" }) : notFound("Enquiry not found");
    }
  }

  // -------------------- INDUSTRY TYPE --------------------
  if (path === "/api/industry-type" || path === "/api/industry-type/") {
    if (method === "GET") return ok(mockDb.list("industryTypes"));
    if (method === "POST") {
      const createdIndustryType = mockDb.create("industryTypes", body || {}, { idPrefix: "industry" });
      return created(createdIndustryType);
    }
  }

  const industryTypeId = matchId(path, "/api/industry-type");
  if (industryTypeId) {
    if (method === "GET") {
      const item = mockDb.findById("industryTypes", industryTypeId);
      return item ? ok(item) : notFound("Industry type not found");
    }
    if (method === "PUT" || method === "PATCH") {
      const updated = mockDb.update("industryTypes", industryTypeId, body || {});
      return updated ? ok(updated) : notFound("Industry type not found");
    }
    if (method === "DELETE") {
      const removed = mockDb.remove("industryTypes", industryTypeId);
      return removed ? ok({ success: true, message: "Deleted" }) : notFound("Industry type not found");
    }
  }

  // -------------------- TYPE OF BUYER --------------------
  if (path === "/api/type-of-buyer" || path === "/api/type-of-buyer/") {
    if (method === "GET") return ok(mockDb.list("typeOfBuyers"));
    if (method === "POST") {
      const createdBuyer = mockDb.create("typeOfBuyers", body || {}, { idPrefix: "buyer" });
      return created(createdBuyer);
    }
  }

  const buyerId = matchId(path, "/api/type-of-buyer");
  if (buyerId) {
    if (method === "GET") {
      const item = mockDb.findById("typeOfBuyers", buyerId);
      return item ? ok(item) : notFound("Buyer type not found");
    }
    if (method === "PUT" || method === "PATCH") {
      const updated = mockDb.update("typeOfBuyers", buyerId, body || {});
      return updated ? ok(updated) : notFound("Buyer type not found");
    }
    if (method === "DELETE") {
      const removed = mockDb.remove("typeOfBuyers", buyerId);
      return removed ? ok({ success: true, message: "Deleted" }) : notFound("Buyer type not found");
    }
  }

  // -------------------- PRODUCT TYPE --------------------
  if (path === "/api/product-type" || path === "/api/product-type/") {
    if (method === "GET") return ok(mockDb.list("productTypes"));
    if (method === "POST") {
      const createdProductType = mockDb.create("productTypes", body || {}, { idPrefix: "producttype" });
      return created(createdProductType);
    }
  }

  const productTypeId = matchId(path, "/api/product-type");
  if (productTypeId) {
    if (method === "GET") {
      const item = mockDb.findById("productTypes", productTypeId);
      return item ? ok(item) : notFound("Product type not found");
    }
    if (method === "PUT" || method === "PATCH") {
      const updated = mockDb.update("productTypes", productTypeId, body || {});
      return updated ? ok(updated) : notFound("Product type not found");
    }
    if (method === "DELETE") {
      const removed = mockDb.remove("productTypes", productTypeId);
      return removed ? ok({ success: true, message: "Deleted" }) : notFound("Product type not found");
    }
  }

  // -------------------- EMAIL TEMPLATES --------------------
  if (path === "/api/email-templates" || path === "/api/email-templates/") {
    if (method === "GET") return ok({ data: mockDb.list("emailTemplates") });
    if (method === "POST") {
      const createdTemplate = mockDb.create("emailTemplates", body || {}, { idPrefix: "emailtpl" });
      return created(createdTemplate);
    }
  }

  const emailTemplateId = matchId(path, "/api/email-templates");
  if (emailTemplateId) {
    if (method === "GET") {
      const item = mockDb.findById("emailTemplates", emailTemplateId);
      return item ? ok(item) : notFound("Email template not found");
    }
    if (method === "PUT" || method === "PATCH") {
      const updated = mockDb.update("emailTemplates", emailTemplateId, body || {});
      return updated ? ok(updated) : notFound("Email template not found");
    }
    if (method === "DELETE") {
      const removed = mockDb.remove("emailTemplates", emailTemplateId);
      return removed ? ok({ success: true, message: "Deleted" }) : notFound("Email template not found");
    }
  }

  if (path.startsWith("/emails/google-auth-url")) {
    // Used by ConnectGoogleButton; safe URL that won't leave the app.
    return ok({ url: "#" });
  }

  // -------------------- FILE UPLOADS --------------------
  if (path === "/upload/files") {
    if (method !== "POST") return badRequest("Unsupported method");
    // The UI expects an array like [{ location: '...' }]
    return ok([{ location: "/mock-files/uploaded-file.png" }]);
  }

  // -------------------- AI AGENT --------------------
  if (path === "/agents/sessions" && method === "POST") {
    const session = { id: `sess_${Date.now()}`, createdAt: new Date().toISOString(), initialMessage: body?.initialMessage || "" };
    mockDb.getState().aiSessions.unshift(session);
    return created(session);
  }

  if (path === "/agents/sessions" && method === "GET") {
    return ok(mockDb.getState().aiSessions);
  }

  if (path.startsWith("/agents/sessions/") && method === "GET") {
    const id = path.split("/").pop();
    const session = mockDb.getState().aiSessions.find((s) => s.id === id);
    return ok({ ...session, messages: [] });
  }

  if (path.startsWith("/agents/sessions/") && method === "DELETE") {
    const id = path.split("/").pop();
    mockDb.getState().aiSessions = mockDb.getState().aiSessions.filter((s) => s.id !== id);
    return ok({ message: "Deleted" });
  }

  if (path === "/agents/process" && method === "POST") {
    return ok({ explanation: "Mock AI response", results: [] });
  }

  // -------------------- FALLBACK --------------------
  return ok({ success: true, data: [], message: `Mock response for ${method} ${path}` });
}
