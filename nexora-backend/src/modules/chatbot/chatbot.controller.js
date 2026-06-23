import ApiResponse from "../../utils/ApiResponse.js";

const CHATBOT_SERVICE_URL = process.env.CHATBOT_SERVICE_URL || "http://localhost:8001";

/**
 * POST /api/v1/chatbot/chat
 */
export const chat = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query || !query.trim()) {
      return res.status(400).json(new ApiResponse(400, null, "Query is required"));
    }

    const response = await fetch(`${CHATBOT_SERVICE_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return res.status(502).json(
        new ApiResponse(502, null, err.detail || "Chatbot service error")
      );
    }

    const data = await response.json();
    return res.status(200).json(new ApiResponse(200, data, "Success"));
  } catch (error) {
    return res.status(503).json(
      new ApiResponse(503, null, "Chatbot service is unavailable")
    );
  }
};

/**
 * POST /api/v1/chatbot/ingest
 */
export const ingestPdf = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json(new ApiResponse(400, null, "PDF file is required"));
    }

    // Use native FormData (Node 18+)
    const form = new FormData();
    const blob = new Blob([req.file.buffer], { type: req.file.mimetype });
    form.append("file", blob, req.file.originalname);

    const response = await fetch(`${CHATBOT_SERVICE_URL}/ingest`, {
      method: "POST",
      body: form,
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return res.status(502).json(
        new ApiResponse(502, null, err.detail || "Ingestion failed")
      );
    }

    const data = await response.json();
    return res.status(200).json(new ApiResponse(200, data, "PDF ingested successfully"));
  } catch (error) {
    return res.status(503).json(
      new ApiResponse(503, null, "Chatbot service is unavailable")
    );
  }
};
