/**
 * AiChatWindow — Floating AI chat panel
 *
 * Props:
 *  isOpen       {boolean}  - whether the window is visible
 *  onClose      {function} - close handler
 *  propertyId   {string}   - property context (optional)
 *  propertyTitle {string}  - display label
 */

import { useEffect, useRef, useState } from "react";
import { IoClose, IoSend } from "react-icons/io5";
import { BsRobot } from "react-icons/bs";
import { useSelector } from "react-redux";
import ApiClient from "../../methods/api/apiClient";

const AI_BOT_NAME = "Bookaroo AI";

const AiChatWindow = ({ isOpen, onClose, propertyId, propertyTitle }) => {
  const { user } = useSelector((state) => state);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 80);
  };

  // Load history when opened
  useEffect(() => {
    if (isOpen) {
      loadHistory(1);
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen, propertyId]);

  const loadHistory = async (pg = 1) => {
    try {
      const params = { page: pg, count: 30 };
      if (propertyId) params.propertyId = propertyId;
      const res = await ApiClient.get("ai-agent/history", params);
      if (res?.success) {
        if (pg === 1) {
          setMessages(res.data.data || []);
        } else {
          setMessages((prev) => [...(res.data.data || []), ...prev]);
        }
        setTotal(res.data.total || 0);
        setPage(pg);
        if (pg === 1) scrollToBottom();
      }
    } catch (e) {
      console.error("AI history error:", e);
    }
  };

  const sendMessage = async () => {
    if (!String(input ?? "").trim() || isLoading) return;
    const userMsg = String(input ?? "").trim();
    setInput("");

    // Optimistic update
    const tempUserMsg = {
      _id: `temp_${Date.now()}`,
      role: "user",
      content: userMsg,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);
    scrollToBottom();

    // Loading placeholder
    const loadingMsg = {
      _id: `loading_${Date.now()}`,
      role: "ai",
      content: "__loading__",
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, loadingMsg]);
    setIsLoading(true);

    try {
      const payload = { message: userMsg };
      if (propertyId) payload.propertyId = propertyId;
      const res = await ApiClient.post("ai-agent/message", payload);
      // Remove loading placeholder and add real response
      setMessages((prev) => {
        const filtered = prev.filter((m) => m._id !== loadingMsg._id);
        if (res?.success && res.data?.aiResponse) {
          return [
            ...filtered,
            {
              _id: `ai_${Date.now()}`,
              role: "ai",
              content: res.data.aiResponse,
              createdAt: new Date().toISOString(),
            },
          ];
        }
        return filtered;
      });
    } catch (e) {
      setMessages((prev) => prev.filter((m) => m._id !== loadingMsg._id));
      console.error("AI send error:", e);
    } finally {
      setIsLoading(false);
      scrollToBottom();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed bottom-24 right-6 z-50 flex flex-col"
      style={{
        width: "380px",
        height: "520px",
        background: "#fff",
        borderRadius: "16px",
        boxShadow: "0 8px 32px rgba(124,58,237,0.18), 0 2px 8px rgba(0,0,0,0.10)",
        overflow: "hidden",
        border: "1.5px solid #e8d5ff",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ background: "linear-gradient(90deg, #7c3aed 0%, #9b59b6 100%)", color: "#fff" }}
      >
        <div className="flex items-center gap-2">
          <div
            className="flex items-center justify-center rounded-full"
            style={{ width: 36, height: 36, background: "rgba(255,255,255,0.18)" }}
          >
            <BsRobot size={20} color="#fff" />
          </div>
          <div>
            <div className="font-semibold text-sm">{AI_BOT_NAME}</div>
            <div className="text-xs opacity-75">
              {propertyTitle ? `Re: ${propertyTitle.substring(0, 28)}…` : "Real estate assistant"}
            </div>
          </div>
        </div>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20 transition">
          <IoClose size={20} color="#fff" />
        </button>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto px-3 py-3 space-y-3"
        style={{ background: "#f7f3ff" }}
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <BsRobot size={40} color="#7c3aed" style={{ opacity: 0.4 }} />
            <p className="text-sm text-gray-500 mt-3">
              Hi! I'm your Bookaroo AI assistant. Ask me anything about your property, pricing,
              or the selling process.
            </p>
          </div>
        )}

        {messages.map((msg) => {
          const isAi = msg.role === "ai";
          const isLoaderMsg = msg.content === "__loading__";
          return (
            <div
              key={msg._id}
              className={`flex ${isAi ? "justify-start" : "justify-end"}`}
            >
              {isAi && (
                <div
                  className="flex items-end justify-center mr-2 flex-shrink-0"
                  style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: "linear-gradient(135deg, #7c3aed, #9b59b6)",
                  }}
                >
                  <BsRobot size={14} color="#fff" style={{ marginBottom: 4 }} />
                </div>
              )}
              <div
                style={{
                  maxWidth: "78%",
                  background: isAi ? "#fff" : "linear-gradient(135deg, #7c3aed, #9b59b6)",
                  color: isAi ? "#1a1a2e" : "#fff",
                  borderRadius: isAi ? "0 12px 12px 12px" : "12px 0 12px 12px",
                  padding: "10px 14px",
                  fontSize: 13,
                  lineHeight: 1.5,
                  boxShadow: isAi ? "0 1px 4px rgba(0,0,0,0.08)" : "0 2px 8px rgba(124,58,237,0.25)",
                }}
              >
                {isLoaderMsg ? (
                  <div className="flex gap-1 items-center py-1">
                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                ) : (
                  msg.content
                )}
                {!isLoaderMsg && (
                  <div style={{ fontSize: 10, opacity: 0.55, marginTop: 4, textAlign: "right" }}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div
        className="flex items-center gap-2 px-3 py-3"
        style={{ background: "#fff", borderTop: "1px solid #ede9fe" }}
      >
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about pricing, selling tips, market data…"
          rows={1}
          className="flex-1 resize-none rounded-xl px-3 py-2 text-sm outline-none"
          style={{
            background: "#f7f3ff",
            border: "1.5px solid #ddd6fe",
            maxHeight: 80,
            lineHeight: 1.4,
          }}
          disabled={isLoading}
        />
        <button
          onClick={sendMessage}
          disabled={!String(input ?? "").trim() || isLoading}
          className="flex items-center justify-center rounded-xl transition"
          style={{
            width: 40, height: 40, flexShrink: 0,
            background: !String(input ?? "").trim() || isLoading
              ? "#e5d9fb"
              : "linear-gradient(135deg, #7c3aed, #9b59b6)",
            color: "#fff",
          }}
        >
          <IoSend size={18} />
        </button>
      </div>
    </div>
  );
};

export default AiChatWindow;
