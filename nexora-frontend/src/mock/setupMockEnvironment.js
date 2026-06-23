import axios from "axios";
import { mockRequest } from "./mockRouter";

function ensureMockAuthSeed() {
  if (typeof window === "undefined" || !window.localStorage) return;

  const token = window.localStorage.getItem("userToken");
  const rawUser = window.localStorage.getItem("user");

  let parsedUser = null;
  try {
    parsedUser = rawUser ? JSON.parse(rawUser) : null;
  } catch {
    parsedUser = null;
  }

  // Only seed when missing (or clearly incomplete), so we don't clobber real user data.
  const needsRole = !parsedUser?.role?.permissions?.length;
  const needsPlan = !parsedUser?.plan?.featuresMasterIds?.length;

  const legacyBrandRegex = /\bkarmacts\b/i;
  const legacyCompanyNames = new Set(["Karmacts Systems", "Karmacts Management"]);

  const currentCompanyName = parsedUser?.companyMaster?.name;
  const shouldNormalizeCompany =
    !currentCompanyName ||
    legacyCompanyNames.has(currentCompanyName) ||
    legacyBrandRegex.test(String(currentCompanyName));

  const currentEmail = parsedUser?.email;
  const shouldNormalizeEmail =
    !currentEmail || legacyBrandRegex.test(String(currentEmail));

  if (!token) {
    window.localStorage.setItem("userToken", "mock-token");
  }

  if (!parsedUser || typeof parsedUser !== "object") {
    parsedUser = {};
  }

  const allModuleNames = [
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

  const seededPermissions = allModuleNames.map((modelName) => ({
    modelName,
    read: true,
    create: true,
    update: true,
    delete: true,
  }));

  const seededFeatures = allModuleNames.map((name) => ({ name }));

  const nextUser = {
    ...parsedUser,
    email: shouldNormalizeEmail ? "demo@nexora.local" : parsedUser.email,
    companyMaster: shouldNormalizeCompany
      ? { ...(parsedUser.companyMaster || {}), name: "Nexora" }
      : parsedUser.companyMaster,
    role: needsRole
      ? { ...(parsedUser.role || {}), permissions: seededPermissions }
      : parsedUser.role,
    plan: needsPlan
      ? { ...(parsedUser.plan || {}), featuresMasterIds: seededFeatures }
      : parsedUser.plan,
  };

  window.localStorage.setItem("user", JSON.stringify(nextUser));

  if (!window.localStorage.getItem("subscriptionData")) {
    window.localStorage.setItem(
      "subscriptionData",
      JSON.stringify({ subscriptions: [], subscriptionStatus: "ACTIVE" })
    );
  }
}

function getPathAndQuery(url) {
  try {
    const u = new URL(url, window?.location?.origin || "http://mock.local");
    return u.pathname + (u.search || "");
  } catch {
    return String(url || "/");
  }
}

function makeHeadersObject(headers) {
  if (!headers) return {};
  if (headers instanceof Headers) {
    const out = {};
    headers.forEach((v, k) => {
      out[k] = v;
    });
    return out;
  }
  if (typeof headers === "object") return { ...headers };
  return {};
}

function toBlob(data, contentType = "application/octet-stream") {
  if (data instanceof Blob) return data;
  if (data instanceof ArrayBuffer) return new Blob([data], { type: contentType });
  if (typeof data === "string") return new Blob([data], { type: contentType });
  return new Blob([JSON.stringify(data)], { type: "application/json" });
}

class MockFetchResponse {
  constructor(status, data, headers = {}) {
    this.status = status;
    this._data = data;
    this.headers = new Headers(headers);
    this.ok = status >= 200 && status < 300;
  }

  async json() {
    if (typeof this._data === "string") {
      try {
        return JSON.parse(this._data);
      } catch {
        return { data: this._data };
      }
    }
    return this._data;
  }

  async text() {
    if (typeof this._data === "string") return this._data;
    return JSON.stringify(this._data);
  }

  async blob() {
    const contentType = this.headers.get("content-type") || "application/octet-stream";
    return toBlob(this._data, contentType);
  }
}

export function setupMockEnvironment({ delayMs = 350, errorRate = 0 } = {}) {
  if (typeof window === "undefined") return;

  // Always normalize/seed user (safe/no-network) even if already set up.
  ensureMockAuthSeed();

  if (window.__MOCK_ENV_SETUP__) return;
  window.__MOCK_ENV_SETUP__ = true;

  // -------------------- fetch() interception --------------------
  const originalFetch = window.fetch ? window.fetch.bind(window) : null;

  window.fetch = async (input, init = {}) => {
    const reqUrl = typeof input === "string" ? input : input?.url;
    const method = String(init.method || (typeof input !== "string" ? input?.method : "GET") || "GET").toUpperCase();
    const headers = makeHeadersObject(init.headers || (typeof input !== "string" ? input?.headers : undefined));

    // Note: for this codebase we mostly intercept GET/POST with JSON or empty body.
    const body = init.body;

    const mockRes = await mockRequest(
      {
        url: getPathAndQuery(reqUrl),
        method,
        headers,
        body,
      },
      { delayMs, errorRate }
    );

    return new MockFetchResponse(mockRes.status, mockRes.data, mockRes.headers);
  };

  // -------------------- axios interception --------------------
  // Force all axios requests through a custom adapter so no real network happens.
  axios.defaults.adapter = async (config) => {
    const method = String(config.method || "get").toUpperCase();

    // Axios may provide relative URL + baseURL.
    const rawUrl = config.baseURL
      ? new URL(config.url || "/", config.baseURL).toString()
      : (config.url || "/");

    const mockRes = await mockRequest(
      {
        url: getPathAndQuery(rawUrl),
        method,
        headers: config.headers,
        body: config.data,
      },
      { delayMs, errorRate }
    );

    // axios expects the adapter to resolve even for non-2xx; it will reject if validateStatus says so.
    let responseData = mockRes.data;

    if (config.responseType === "blob") {
      const contentType = (mockRes.headers && (mockRes.headers["content-type"] || mockRes.headers["Content-Type"])) || "application/octet-stream";
      responseData = toBlob(responseData, contentType);
    }

    return {
      data: responseData,
      status: mockRes.status,
      statusText: String(mockRes.status),
      headers: mockRes.headers || {},
      config,
      request: {},
    };
  };

  // Keep a reference if you ever want to restore.
  window.__ORIGINAL_FETCH__ = originalFetch;
}

// Auto-setup in dev/prod builds for this mock refactor.
setupMockEnvironment();
