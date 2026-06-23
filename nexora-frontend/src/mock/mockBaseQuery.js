import { mockRequest } from "./mockRouter";

function buildUrlWithParams(url, params) {
  if (!params || typeof params !== "object") return url;
  const u = new URL(url, "http://mock.local");
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    u.searchParams.set(key, String(value));
  }
  // Return as path+search to keep router matching stable
  return u.pathname + (u.search ? u.search : "");
}

export function createMockBaseQuery({ delayMs = 350, errorRate = 0 } = {}) {
  return async (args, api) => {
    const normalized = typeof args === "string" ? { url: args } : (args || {});

    const url = buildUrlWithParams(normalized.url || "/", normalized.params);
    const method = normalized.method || "GET";
    const body = normalized.body;

    const res = await mockRequest(
      {
        url,
        method,
        body,
        headers: normalized.headers,
      },
      { delayMs, errorRate }
    );

    if (res.status >= 200 && res.status < 300) {
      return { data: res.data };
    }

    // Match RTK Query error shape
    return { error: { status: res.status, data: res.data } };
  };
}
