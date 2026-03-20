"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col z-50">
                {/* Logo */}
                <div className="h-[73px] px-6 border-b border-gray-200 flex items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
                            <Waves className="text-white" size={20} />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900">Tourism Hub</p>
                            <p className="text-xs text-gray-500">Admin Panel</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                                    isActive
                                        ? "bg-gray-900 text-white"
                                        : "text-gray-600 hover:bg-gray-100"
                                }`}
                            >
                                <Icon size={20} />
                                {tab.label}
                            </button>
                        );
                    })}
                </nav>

                {/* User Info */}
                <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center gap-3 px-4 py-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <span className="text-gray-600 font-medium">
                                {session?.user?.name?.charAt(0) || "A"}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{session?.user?.name || "Admin"}</p>
                            <p className="text-xs text-gray-500 truncate">{session?.user?.email}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64">
                {/* Top Bar */}
                <header className="h-[73px] bg-white border-b border-gray-200 px-8 flex items-center sticky top-0 z-40">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        {tabs.find(t => t.id === activeTab)?.label}
                    </h1>
                </header>

                {/* Content */}
                <div className="p-8">
                    {activeTab === "analytics" && <AnalyticsSection />}
                    {activeTab === "users" && <UsersSection />}
                    {activeTab === "guides" && <GuidesSection />}
                    {activeTab === "accommodations" && <AccommodationsSection />}
                    {activeTab === "events" && <EventsSection />}
                    {activeTab === "messages" && <MessagesSection />}
                    {activeTab === "profile" && <AdminProfileSection />}
                </div>
            </main>
        </div>
    );
}
