"use client";

import { useState } from "react";
import { Send, Mail, Users } from "lucide-react";

export default function MessagesSection() {
    const [messageType, setMessageType] = useState<"broadcast" | "selective">("broadcast");
    const [message, setMessage] = useState("");
    const [sendEmail, setSendEmail] = useState(false);
    const [sending, setSending] = useState(false);

    const handleSendMessage = async () => {
        if (!message.trim()) {
            alert("Please enter a message");
            return;
        }

        try {
            setSending(true);
            const response = await fetch("/api/admin/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: messageType, message, sendEmail }),
            });

            if (response.ok) {
                const data = await response.json();
                alert(`Message sent successfully to ${data.count} users!`);
                setMessage("");
            } else {
                const data = await response.json();
                alert(data.error || "Failed to send message");
            }
        } catch (error) {
            console.error("Error sending message:", error);
            alert("Failed to send message");
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900">Send Message</h3>
                    <p className="text-sm text-gray-500 mt-1">Broadcast a message to all platform users</p>
                </div>

                <div className="p-6 space-y-6">
                    {/* Type Toggle */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setMessageType("broadcast")}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${
                                messageType === "broadcast"
                                    ? "bg-gray-900 text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                        >
                            <Users size={18} />
                            Broadcast
                        </button>
                        <button
                            disabled
                            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed"
                        >
                            <Mail size={18} />
                            Selective (Soon)
                        </button>
                    </div>

                    {/* Message */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Enter your message..."
                            rows={5}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                        />
                    </div>

                    {/* Email Option */}
                    <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer">
                        <input
                            type="checkbox"
                            checked={sendEmail}
                            onChange={(e) => setSendEmail(e.target.checked)}
                            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                        <div>
                            <p className="font-medium text-gray-900">Also send via email</p>
                            <p className="text-sm text-gray-500">Only to users with email notifications enabled</p>
                        </div>
                    </label>

                    {/* Send */}
                    <button
                        onClick={handleSendMessage}
                        disabled={sending || !message.trim()}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {sending ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                Sending...
                            </>
                        ) : (
                            <>
                                <Send size={18} />
                                Send Message
                            </>
                        )}
                    </button>
                </div>
            </div>

            <p className="text-sm text-gray-500">
                Messages will be sent as in-app notifications.
            </p>
        </div>
    );
}
