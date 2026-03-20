"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/admin-dashboard/AdminHeader";
import AnalyticsSection from "@/components/admin-dashboard/AnalyticsSection";
import UsersSection from "@/components/admin-dashboard/UsersSection";
import GuidesSection from "@/components/admin-dashboard/GuidesSection";
import AccommodationsSection from "@/components/admin-dashboard/AccommodationsSection";
import MessagesSection from "@/components/admin-dashboard/MessagesSection";
import AdminProfileSection from "@/components/admin-dashboard/AdminProfileSection";
import EventsSection from "@/components/admin-dashboard/EventsSection";
import {
    BarChart3,
    Users,
    MessageSquare,
    Calendar,
    Hotel,
    Compass,
    UserCog,
    Waves,
} from "lucide-react";

export default function AdminDashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("analytics");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "loading") return;

        if (!session) {
            router.push("/login");
            return;
        }

        // @ts-ignore
        if (session.user.role !== "admin") {
            alert("Access denied. Admin privileges required.");
            router.push("/");
            return;
        }

        setLoading(false);
    }, [session, status, router]);

    if (loading || status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900">
                <div className="text-center">
                    <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse border border-white/20">
                        <Waves className="text-white" size={40} />
                    </div>
                    <p className="text-white/80 font-medium text-lg">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    const tabs = [
        { id: "analytics", label: "Analytics", icon: BarChart3 },
        { id: "users", label: "Users", icon: Users },
        { id: "guides", label: "Guides", icon: Compass },
        { id: "accommodations", label: "Stays", icon: Hotel },
        { id: "events", label: "Events", icon: Calendar },
        { id: "messages", label: "Messages", icon: MessageSquare },
        { id: "profile", label: "Profile", icon: UserCog },
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <AdminHeader adminName={session?.user?.name || "Admin"} />

            {/* Navigation Tabs */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex gap-1 overflow-x-auto py-4 scrollbar-hide">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium whitespace-nowrap transition-all ${
                                        isActive
                                            ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25"
                                            : "text-gray-600 hover:bg-gray-100"
                                    }`}
                                >
                                    <Icon size={18} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activeTab === "analytics" && <AnalyticsSection />}
                {activeTab === "users" && <UsersSection />}
                {activeTab === "guides" && <GuidesSection />}
                {activeTab === "accommodations" && <AccommodationsSection />}
                {activeTab === "events" && <EventsSection />}
                {activeTab === "messages" && <MessagesSection />}
                {activeTab === "profile" && <AdminProfileSection />}
            </main>
        </div>
    );
}
