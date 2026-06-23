import { useEffect } from "react";

// Mock/no-op realtime listener.
// The production app likely listened to socket events to trigger `refetch()`.
// In mock mode there is no backend socket, so this component intentionally does nothing.

export default function ModelRealtimeListener({ eventNames = [], refetch }) {
  useEffect(() => {
    // No-op: keep signature for existing imports.
    // If you later re-enable sockets, this is the place to wire them back.
  }, [refetch, Array.isArray(eventNames) ? eventNames.join(",") : String(eventNames)]);

  return null;
}
