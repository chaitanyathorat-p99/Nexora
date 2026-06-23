const trimTrailingSlash = (value = "") => String(value).replace(/\/$/, "");

export const url = trimTrailingSlash(import.meta.env.VITE_API_URL || "/api/v1");

export const nexturl = trimTrailingSlash(import.meta.env.VITE_NEXT_URL || "");

export const socketURL = trimTrailingSlash(import.meta.env.VITE_SOCKET_URL || "");