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
import { BarChart3, Users, MessageSquare, Calendar, Hotel, Compass, UserCog } from "lucide-react";

/**
 * Main admin dashboard page
 */
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
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    const tabs = [
        { id: "analytics", label: "Analytics", icon: BarChart3 },
        { id: "users", label: "Users", icon: Users },
        { id: "guides", label: "Guides", icon: Compass },
        { id: "accommodations", label: "Accommodations", icon: Hotel },
        { id: "messages", label: "Messages", icon: MessageSquare },
        { id: "profile", label: "Profile", icon: UserCog },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 px-24 py-6">
            <div className="mx-auto">
                {/* Header */}
                <AdminHeader adminName={session?.user?.name || "Admin"} />

                {/* Tabs */}
                <div className="bg-white p-2 rounded-2xl shadow-lg mb-6 flex gap-2 overflow-x-auto">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-base font-semibold transition-all duration-200 whitespace-nowrap ${activeTab === tab.id
                                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                                    : "text-gray-700 hover:bg-gray-100"
                                    }`}
                            >
                                <Icon size={22} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Content */}
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                    {activeTab === "analytics" && <AnalyticsSection />}
                    {activeTab === "users" && (
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-6">👥 User Management</h2>
                            <UsersSection />
                        </div>
                    )}
                    {activeTab === "guides" && (
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-6">🧭 Guide Management</h2>
                            <GuidesSection />
                        </div>
                    )}
                    {activeTab === "accommodations" && (
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-6">🏨 Accommodations Management</h2>
                            <AccommodationsSection />
                        </div>
                    )}
                    {activeTab === "messages" && (
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-6">💬 Send Messages</h2>
                            <MessagesSection />
                        </div>
                    )}
                    {activeTab === "profile" && (
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-6">👤 My Profile</h2>
                            <AdminProfileSection />
                        </div>
                    )}
                </div>

                {/* Coming Soon Sections */}
                <div className="mt-6">
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-2xl border border-orange-200 max-w-md">
                        <div className="flex items-center gap-3 mb-2">
                            <Calendar className="text-orange-600" size={24} />
                            <h3 className="font-bold text-orange-900">Events</h3>
                        </div>
                        <p className="text-sm text-orange-700">Create and manage events</p>
                        <span className="inline-block mt-3 px-3 py-1 text-xs bg-orange-200 text-orange-800 rounded-full font-semibold">
                            Coming Soon
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
