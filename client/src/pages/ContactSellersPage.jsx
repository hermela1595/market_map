import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function getSanitizedToken() {
  const raw = String(localStorage.getItem("mm_token") || "").trim();
  const token = raw.replace(/^"|"$/g, "");
  if (!token || token === "undefined" || token === "null") return "";
  return token.split(".").length === 3 ? token : "";
}

function getSeenKey(userId) {
  return `mm_seen_conversations_${userId || "guest"}`;
}

function loadSeenMap(userId) {
  try {
    const raw = localStorage.getItem(getSeenKey(userId));
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveSeenMap(userId, map) {
  localStorage.setItem(getSeenKey(userId), JSON.stringify(map));
}

export default function ContactSellersPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isSellerView = user?.role === "seller";
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [seenMap, setSeenMap] = useState(() => loadSeenMap(user?.id));

  useEffect(() => {
    setSeenMap(loadSeenMap(user?.id));
  }, [user?.id]);

  useEffect(() => {
    initializePage();
  }, []);

  function getUnreadCount(conv) {
    if (!conv?.last_message_at) return 0;
    if (Number(conv.last_message_sender_id) === Number(user?.id)) return 0;

    const seenAt = seenMap[conv.id];
    if (!seenAt) return 1;

    return new Date(conv.last_message_at) > new Date(seenAt) ? 1 : 0;
  }

  function markConversationSeen(conv) {
    const seenAt = conv?.last_message_at || new Date().toISOString();
    setSeenMap((prev) => {
      const next = { ...prev, [conv.id]: seenAt };
      saveSeenMap(user?.id, next);
      return next;
    });
  }

  function getAuthHeaders() {
    const token = getSanitizedToken();
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  async function initializePage() {
    try {
      let conversationIdToSelect = null;

      const listingId = Number(location.state?.listingId);
      if (Number.isInteger(listingId) && listingId > 0) {
        const initRes = await fetch("/api/messages/conversations", {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({ listing_id: listingId }),
        });

        if (initRes.ok) {
          const initData = await initRes.json();
          conversationIdToSelect = initData.conversation_id;
        }
      }

      await loadConversations(conversationIdToSelect);
      setLoading(false);
    } catch (err) {
      console.error("Error loading conversations:", err);
      setLoading(false);
    }
  }

  async function loadConversations(conversationIdToSelect = null) {
    const response = await fetch("/api/messages/conversations", {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to load conversations");
    }

    const data = await response.json();
    setConversations(data);

    if (!data.length) {
      setSelectedConversation(null);
      setMessages([]);
      return;
    }

    const nextConversation = conversationIdToSelect
      ? data.find((c) => c.id === conversationIdToSelect)
      : null;

    if (nextConversation) {
      await handleSelectConversation(nextConversation);
      return;
    }

    if (!selectedConversation) {
      await handleSelectConversation(data[0]);
    }
  }

  async function handleSelectConversation(conv) {
    setSelectedConversation(conv);
    markConversationSeen(conv);
    try {
      const response = await fetch(
        `/api/messages/conversations/${conv.id}/messages`,
        {
          headers: getAuthHeaders(),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to load messages");
      }

      const data = await response.json();
      setMessages(data.messages || []);
    } catch (err) {
      console.error("Error loading messages:", err);
      setMessages([]);
    }
  }

  async function handleSendMessage() {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      setSending(true);
      const response = await fetch(
        `/api/messages/conversations/${selectedConversation.id}/messages`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({ body: newMessage.trim() }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setNewMessage("");
      await handleSelectConversation(selectedConversation);
      await loadConversations(selectedConversation.id);
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-brand-600 hover:text-brand-700 font-medium text-sm"
          >
            ← Back
          </button>
          <span className="text-brand-600 text-xl font-extrabold tracking-tight">
            MarketMap <span className="text-gray-700">Ethiopia</span>
          </span>
          <span className="w-16" />
        </div>
      </header>

      {/* Body */}
      <main className="mx-auto max-w-5xl px-4 py-10">
        <div className="grid gap-4 lg:grid-cols-3 min-h-[500px]">
          {/* Conversations List */}
          <div className="rounded-2xl bg-white shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-bold text-gray-800">
                {isSellerView ? "💬 Buyer Messages" : "💬 Messages"}
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                {conversations.length} conversation(s)
              </p>
            </div>

            {loading ? (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-gray-500">Loading messages...</p>
              </div>
            ) : conversations.length === 0 ? (
              <div className="flex-1 flex items-center justify-center p-4 text-center">
                <p className="text-sm text-gray-500">
                  {isSellerView
                    ? "No buyer messages yet. Buyers can contact you from your listings."
                    : "No conversations yet. Contact sellers from listings!"}
                </p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto">
                {conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => handleSelectConversation(conv)}
                    className={`w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      selectedConversation?.id === conv.id
                        ? "bg-brand-50 border-l-4 border-l-brand-600"
                        : ""
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-sm text-gray-800 truncate">
                        {conv.counterpart_name}
                      </p>
                      {getUnreadCount(conv) > 0 ? (
                        <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                          {getUnreadCount(conv)}
                        </span>
                      ) : null}
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-1">
                      {conv.last_message || "No messages yet"}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Chat Area */}
          {selectedConversation ? (
            <div className="lg:col-span-2 rounded-2xl bg-white shadow-sm overflow-hidden flex flex-col">
              {/* Header */}
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-bold text-gray-800">
                  {selectedConversation.counterpart_name}
                </h3>
                <p className="text-xs text-gray-500">
                  Listing: {selectedConversation.listing_title}
                </p>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                  <p className="text-center text-gray-400 text-sm">
                    Say hi to start the conversation!
                  </p>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.sender_id === user?.id
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs rounded-lg px-4 py-2 ${
                          msg.sender_id === user?.id
                            ? "bg-brand-600 text-white"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        <p className="text-sm">{msg.body}</p>
                        <p
                          className={`text-xs mt-1 ${
                            msg.sender_id === user?.id
                              ? "text-brand-100"
                              : "text-gray-500"
                          }`}
                        >
                          {new Date(msg.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || sending}
                    className="rounded-lg bg-brand-600 text-white px-4 py-2 font-medium hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sending ? "Sending..." : "Send"}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="lg:col-span-2 rounded-2xl bg-white shadow-sm flex items-center justify-center">
              <p className="text-gray-400">Select a conversation to start</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
