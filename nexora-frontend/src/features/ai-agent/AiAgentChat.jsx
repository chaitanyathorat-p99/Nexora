import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  sendMessageToAgent,
  fetchChatSessionMessages,
  clearChat,
  setSessionId,
} from "./aiAgentSlice";
import ChatMessage from "./ChatMessage";
import AnimatedAIAssistant from "./AnimatedAIAssistant";
import { Plus, Send, Paperclip, Sparkles, Trash2 } from "lucide-react";
import { useParams } from "react-router-dom";

const SUPPORTED_EXTENSIONS = ["pdf", "doc", "docx"];

const AiAgentChat = () => {
  const dispatch = useDispatch();
  const { chatId } = useParams();
  const { messages, isLoading, sessionId, error } = useSelector((state) => state.aiAgent);
  const [userInput, setUserInput] = useState("");
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [assistantAvatarState, setAssistantAvatarState] = useState("idle");
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const responseTimerRef = useRef(null);
  const previousLoadingRef = useRef(false);

  useEffect(() => {
    if (chatId && chatId !== sessionId) {
      dispatch(setSessionId(chatId));
      dispatch(fetchChatSessionMessages(chatId));
      return;
    }

    if (!chatId && sessionId) {
      dispatch(fetchChatSessionMessages(sessionId));
    }
  }, [chatId, sessionId, dispatch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (responseTimerRef.current) {
      clearTimeout(responseTimerRef.current);
      responseTimerRef.current = null;
    }

    if (error) {
      setAssistantAvatarState("error");
      responseTimerRef.current = setTimeout(() => setAssistantAvatarState("idle"), 1100);
      previousLoadingRef.current = false;
      return undefined;
    }

    if (isLoading) {
      previousLoadingRef.current = true;
      setAssistantAvatarState(attachedFiles.length > 0 || userInput.trim().length > 0 ? "typing" : "thinking");
      return undefined;
    }

    if (previousLoadingRef.current) {
      previousLoadingRef.current = false;
      setAssistantAvatarState("success");
      responseTimerRef.current = setTimeout(() => setAssistantAvatarState("idle"), 900);
      return undefined;
    }

    if (attachedFiles.length > 0 || userInput.trim().length > 0) {
      setAssistantAvatarState("typing");
      return undefined;
    }

    setAssistantAvatarState("idle");
    return undefined;
  }, [attachedFiles.length, error, isLoading, userInput]);

  useEffect(
    () => () => {
      if (responseTimerRef.current) {
        clearTimeout(responseTimerRef.current);
      }
    },
    [],
  );

  const addFiles = (files) => {
    const accepted = Array.from(files || []).filter((file) => {
      const extension = file.name.split(".").pop()?.toLowerCase();
      return extension && SUPPORTED_EXTENSIONS.includes(extension);
    });

    if (accepted.length === 0) return;

    setAttachedFiles((current) => {
      const existingNames = new Set(current.map((file) => file.name));
      const merged = [...current];
      accepted.forEach((file) => {
        if (!existingNames.has(file.name)) {
          merged.push(file);
        }
      });
      return merged;
    });
  };

  const handleFileInputChange = (event) => {
    addFiles(event.target.files);
    event.target.value = "";
  };

  const handleDrop = (event) => {
    event.preventDefault();
    addFiles(event.dataTransfer.files);
  };

  const handleSend = (event) => {
    event.preventDefault();
    const trimmedInput = userInput.trim();
    if (!trimmedInput && attachedFiles.length === 0) return;

    const attachmentSummary = attachedFiles.length
      ? `\n\nAttached files: ${attachedFiles.map((file) => file.name).join(", ")}`
      : "";

    dispatch(
      sendMessageToAgent({
        userInput: `${trimmedInput}${attachmentSummary}`.trim(),
        sessionId,
      }),
    );

    setUserInput("");
    setAttachedFiles([]);
  };

  const canSend = userInput.trim().length > 0 || attachedFiles.length > 0;

  const renderComposer = (variant = "active") => {
    const isWelcomeState = variant === "welcome";

    return (
      <form onSubmit={handleSend} className={isWelcomeState ? "mt-8 w-full" : "mx-auto w-full max-w-4xl"}>
        {attachedFiles.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {attachedFiles.map((file) => (
              <div
                key={file.name}
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700"
              >
                <Paperclip size={12} />
                {file.name}
                <button
                  type="button"
                  onClick={() => setAttachedFiles((current) => current.filter((item) => item.name !== file.name))}
                  className="ml-1 text-slate-500 transition hover:text-slate-700"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-end gap-3 rounded-3xl border border-slate-200 bg-white p-3 shadow-[0_20px_50px_rgba(15,23,42,0.08)] transition-all duration-300 focus-within:border-slate-400 focus-within:shadow-[0_20px_50px_rgba(15,23,42,0.12)]">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl text-slate-600 transition hover:cursor-pointer hover:bg-slate-100 hover:text-slate-900"
            title="Upload file"
          >
            <Plus size={20} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            multiple
            className="hidden"
            onChange={handleFileInputChange}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          />
          <textarea
            value={userInput}
            onChange={(event) => setUserInput(event.target.value)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            placeholder="Message AI Assistant..."
            className="max-h-36 flex-1 resize-none border-0 bg-transparent py-2.5 text-[15px] leading-6 text-slate-800 outline-none placeholder:text-slate-400"
            rows={1}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                handleSend(event);
              }
            }}
          />
          <button
            type="submit"
            disabled={!canSend || isLoading}
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            <Send size={16} />
          </button>
        </div>

        <p className={`mt-2 text-xs text-slate-500 ${isWelcomeState ? "text-center" : ""}`}>
          Press Enter to send, Shift+Enter for new line
        </p>
      </form>
    );
  };

  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-slate-50 text-slate-900">
      <main className="feature-table-layout flex min-h-0 flex-1 flex-col pt-6">
        <div className="mb-4 flex flex-col gap-3 border-b border-slate-200/80 pb-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-3">
            <AnimatedAIAssistant state={assistantAvatarState} size={40} />
            <div>
              <h1 className="text-[30px] font-semibold leading-none text-slate-900">AI Assistant</h1>
              <p className="mt-1 text-sm text-slate-500">Upload files and ask questions</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => dispatch(clearChat())}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:cursor-pointer hover:border-slate-300 hover:text-slate-900 sm:self-auto"
          >
            <Trash2 size={16} />
            Clear Chat
          </button>
        </div>

        {messages.length === 0 ? (
          <div className="flex min-h-0 flex-1 items-center justify-center px-4 py-10 sm:px-6">
            <div className="w-full max-w-2xl text-center">
              <AnimatedAIAssistant state="idle" size={58} className="mx-auto" />
              <h2 className="mt-6 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Welcome to AI Assistant
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-slate-500 sm:text-lg">
                Upload files and ask questions
              </p>

              {renderComposer("welcome")}
            </div>
          </div>
        ) : (
          <div className="flex flex-1 min-h-0 flex-col">
            <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
              <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 pb-6">
                {messages.map((message, index) => (
                  <ChatMessage key={message.id || message.timestamp || index} message={message} />
                ))}

                {isLoading && (
                  <div className="flex w-full justify-start">
                    <div className="flex items-center gap-3 rounded-2xl rounded-bl-lg border border-slate-200 bg-slate-100 px-4 py-3 text-slate-500 shadow-sm">
                      <AnimatedAIAssistant state={assistantAvatarState === "idle" ? "thinking" : assistantAvatarState} size={34} />
                      <div className="flex gap-1">
                        <div className="h-2 w-2 animate-bounce rounded-full bg-slate-400" />
                        <div className="h-2 w-2 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: "0.1s" }} />
                        <div className="h-2 w-2 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: "0.2s" }} />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="border-t border-slate-200/80 bg-white/95 px-4 py-4 shadow-[0_-8px_30px_rgba(15,23,42,0.04)] backdrop-blur sm:px-6">
              {renderComposer("active")}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AiAgentChat;
