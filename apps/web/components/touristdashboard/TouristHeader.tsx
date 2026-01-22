"use client";

import { Home } from "lucide-react";
import { useRouter } from "next/navigation";
import NotificationBell from "@/components/NotificationBell";
import { UserProfile } from "./types";

interface TouristHeaderProps {
    profile: UserProfile | null;
}

/**
 * Header component for the tourist dashboard
 */
export default function TouristHeader({ profile }: TouristHeaderProps) {
    const router = useRouter();

    return (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8 px-4 shadow-lg">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent drop-shadow-lg">
                            Welcome back, {profile?.name?.split(' ')[0] || 'Tourist'}!
                        </h1>
                        <p className="text-lg font-light">Manage your bookings and profile</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <NotificationBell />
                        <button
                            onClick={() => router.push("/")}
                            className="bg-white/10 backdrop-blur-sm border-2 border-white/50 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-white/20 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
                        >
                            <Home size={18} />
                            Home
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
