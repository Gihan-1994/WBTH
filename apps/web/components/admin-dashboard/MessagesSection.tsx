"use client";

import { useState } from "react";
import { Send, Mail } from "lucide-react";

/**
 * Messaging section for broadcast and selective messages
 */
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
                body: JSON.stringify({
                    type: messageType,
                    message,
                    sendEmail,
                }),
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
            <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4">📢 Send Message to Users</h3>

                <div className="space-y-4">
                    {/* Message Type */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Message Type
                        </label>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setMessageType("broadcast")}
                                className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${messageType === "broadcast"
                                        ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                            >
                                Broadcast to All
                            </button>
                            <button
                                onClick={() => setMessageType("selective")}
                                className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${messageType === "selective"
                                        ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                disabled
                                title="Selective messaging coming soon"
                            >
                                Selective (Coming Soon)
                            </button>
                        </div>
                    </div>

                    {/* Message Input */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Message
                        </label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Enter your message here..."
                            rows={5}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                        />
                    </div>

                    {/* Email Option */}
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="sendEmail"
                            checked={sendEmail}
                            onChange={(e) => setSendEmail(e.target.checked)}
                            className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <label htmlFor="sendEmail" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <Mail size={18} />
                            Also send as email (only to users with email notifications enabled)
                        </label>
                    </div>

                    {/* Send Button */}
                    <button
                        onClick={handleSendMessage}
                        disabled={sending || !message.trim()}
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {sending ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                Sending...
                            </>
                        ) : (
                            <>
                                <Send size={20} />
                                Send Message
                            </>
                        )}
                    </button>
                </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
                <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Messages will be sent as in-app notifications. Users will see them in their notification bell.
                    {sendEmail && " Emails will only be sent to users who have email notifications enabled."}
                </p>
            </div>
        </div>
    );
}
