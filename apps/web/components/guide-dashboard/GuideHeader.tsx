"use client";

import { useRouter } from "next/navigation";
import NotificationBell from "@/components/NotificationBell";

interface GuideHeaderProps {
    guideName: string | null;
}

export default function GuideHeader({ guideName }: GuideHeaderProps) {
    const router = useRouter();

    return (
        <div className="bg-gradient-to-r from-green-600 via-teal-600 to-blue-600 text-white p-8 rounded-2xl shadow-xl mb-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-bold mb-2">
                        🧭 Guide Dashboard
                    </h1>
                    {guideName && (
                        <p className="text-green-100 text-lg">
                            Welcome back, <span className="font-semibold">{guideName}</span>!
                        </p>
                    )}
                </div>
                <div className="flex items-center gap-4">
                    <NotificationBell />
                    <button
                        onClick={() => router.push("/")}
                        className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl hover:bg-white/30 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl hover:scale-105"
                    >
                        🏠 Home
                    </button>
                </div>
            </div>
        </div>
    );
}
