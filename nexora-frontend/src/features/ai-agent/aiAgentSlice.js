import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { url } from "../../components/common/api";

const API_URL = '/agents/process';

// Create a new chat session
export const createChatSession = createAsyncThunk(
  "aiAgent/createChatSession",
  async (initialMessage, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("userToken");
      const response = await axios.post(
        `${url}/agents/sessions`,
        { initialMessage },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        }
      );
      // localStorage.setItem("aiSessionId", response.data.id); // Store session ID
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get all chat sessions
export const getAllChatSessions = createAsyncThunk(
  "aiAgent/getAllChatSessions",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("userToken");
      const response = await axios.get(
        `${url}/agents/sessions`,
        {
          headers: {
            Accept: "application/json",
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete a chat session
export const deleteChatSession = createAsyncThunk(
  "aiAgent/deleteChatSession",
  async (sessionId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("userToken");
      const response = await axios.delete(
        `${url}/agents/sessions/${sessionId}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        }
      );
      return { sessionId, message: response.data.message };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const sendMessageToAgent = createAsyncThunk(
  "aiAgent/sendMessageToAgent",
  async ({ userInput, sessionId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("userToken");
      const response = await axios.post(
        url + API_URL,
        { userInput, sessionId },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        }
      );

      // Handle the new response format
      const responseData = response.data;
      
      // If the response has query_results type, return it as is
      if (responseData.type === 'query_results') {
        return { 
          ...responseData, 
          sessionId,
          // Add a formatted answer for display
          answer: responseData.explanation || 'Query results received'
        };
      }
      
      // Handle other response types (existing format)
      return { ...responseData, sessionId };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchChatSessionMessages = createAsyncThunk(
  "aiAgent/fetchChatSessionMessages",
  async (sessionId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("userToken");
      const response = await axios.get(
        `${url}/agents/sessions/${sessionId}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        }
      );
      return response.data?.messages || [];
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const aiAgentSlice = createSlice({
  name: "aiAgent",
  initialState: {
    messages: [],
    isLoading: false,
    error: null,
    sessionId: null,
    sessions: [],
    activeSession: null,
  },
  reducers: {
    setSessionId(state, action) {
      state.sessionId = action.payload;
      // localStorage.setItem("aiSessionId", action.payload);
    },
    clearChat(state) {
      state.messages = [];
      state.sessionId = null;
      state.activeSession = null;
      // localStorage.removeItem("aiSessionId");
    },
    addMessage(state, action) {
      state.messages.push(action.payload);
    },
    setActiveSession(state, action) {
      state.activeSession = action.payload;
      state.sessionId = action.payload.id;
      // localStorage.setItem("aiSessionId", action.payload.id);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createChatSession.fulfilled, (state, action) => {
        state.sessionId = action.payload.id;
        state.activeSession = action.payload;
        state.sessions.push(action.payload);
      })
      .addCase(getAllChatSessions.fulfilled, (state, action) => {
        state.sessions = action.payload;
      })
      .addCase(deleteChatSession.fulfilled, (state, action) => {
        state.sessions = state.sessions.filter(session => session.id !== action.payload.sessionId);
        if (state.sessionId === action.payload.sessionId) {
          state.sessionId = null;
          state.activeSession = null;
          state.messages = [];
          // localStorage.removeItem("aiSessionId");
        }
      })
      .addCase(sendMessageToAgent.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
        if (action.meta && action.meta.arg && action.meta.arg.userInput) {
          state.messages.push({
            role: 'user',
            content: action.meta.arg.userInput,
            timestamp: new Date().toISOString(),
          });
        }
      })
      .addCase(sendMessageToAgent.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload?.type === 'query_results') {
          // Handle query results format
          state.messages.push({
            role: 'assistant',
            content: action.payload, // Pass the entire object for proper rendering
            timestamp: new Date().toISOString(),
          });
        } else if (action.payload?.error) {
          // Show backend error as assistant message
          state.messages.push({
            role: 'assistant',
            content: { error: action.payload.error },
            isError: true,
            timestamp: new Date().toISOString(),
          });
        } else if (action.payload?.explanation) {
          // Always show explanation if present
          state.messages.push({
            role: 'assistant',
            content: { explanation: action.payload.explanation },
            timestamp: new Date().toISOString(),
          });
        } else if (action.payload?.results) {
          // Handle old format with results
          state.messages.push({
            role: 'assistant',
            content: action.payload.explanation || JSON.stringify(action.payload.results),
            timestamp: new Date().toISOString(),
          });
        } else if (action.payload?.answer) {
          // Handle simple answer format
          state.messages.push({
            role: 'assistant',
            content: action.payload.answer,
            timestamp: new Date().toISOString(),
          });
        }
      })
      .addCase(sendMessageToAgent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to send message';
      })
      .addCase(fetchChatSessionMessages.fulfilled, (state, action) => {
        state.messages = action.payload;
      });
  },
});

export const { setSessionId, clearChat, addMessage, setActiveSession } = aiAgentSlice.actions;
export default aiAgentSlice.reducer;
