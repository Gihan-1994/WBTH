"use client";

import { useEffect, useState } from "react";

// Extend the Window interface to include Botpress WebChat
declare global {
    interface Window {
        botpressWebChat?: {
            init: (config: { configUrl: string; hostUrl: string }) => void;
            sendEvent: (event: { type: string }) => void;
        };
    }
}

interface ChatbotProps {
    inline?: boolean;
}

export default function Chatbot({ inline = false }: ChatbotProps) {
    const [iframeLoaded, setIframeLoaded] = useState(false);

    // TODO: Update Botpress webchat to newer version - v3.5 is deprecated and returning 404
    // Get new embed code from Botpress Cloud dashboard
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://cdn.botpress.cloud/webchat/v3.5/inject.js";
        script.async = true;

        script.onload = () => {
            setTimeout(() => {
                if (window.botpressWebChat) {
                    try {
                        window.botpressWebChat.init({
                            configUrl: "https://files.bpcontent.cloud/2025/12/31/22/20251231220130-A107GDPS.json",
                            hostUrl: "https://cdn.botpress.cloud/webchat/v3.5",
                        });
                        setIframeLoaded(true);
                    } catch {
                        // Silently fail - Botpress needs to be updated
                        setIframeLoaded(true);
                    }
                } else {
                    setIframeLoaded(true);
                }
            }, 2000);
        };

        script.onerror = () => {
            setIframeLoaded(true);
        };

        document.body.appendChild(script);

        return () => {
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
        };
    }, []);

    const openChat = () => {
        if (window.botpressWebChat) {
            try {
                window.botpressWebChat.sendEvent({ type: "show" });
            } catch {
                // Fallback: open in new window
                window.open(
                    "https://cdn.botpress.cloud/webchat/v3.5/shareable.html?configUrl=https://files.bpcontent.cloud/2025/12/31/22/20251231220130-A107GDPS.json",
                    "botpress-chat",
                    "width=400,height=600"
                );
            }
        } else {
            window.open(
                "https://cdn.botpress.cloud/webchat/v3.5/shareable.html?configUrl=https://files.bpcontent.cloud/2025/12/31/22/20251231220130-A107GDPS.json",
                "botpress-chat",
                "width=400,height=600"
            );
        }
    };

    if (inline) {
        return (
            <div className="w-full">
                <button
                    onClick={openChat}
                    disabled={!iframeLoaded}
                    className="w-full bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                        />
                    </svg>
                    {iframeLoaded ? "Chat with AI Assistant" : "Loading Chat..."}
                </button>
            </div>
        );
    }

    return null;
}
