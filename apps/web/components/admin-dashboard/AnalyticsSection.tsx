"use client";

import { useState, useEffect } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import { Users, TrendingUp, DollarSign, MapPin, UserCheck, Building } from "lucide-react";
import { AnalyticsData } from "./types";
import { CHART_COLORS, TIME_PERIODS, USER_ROLE_LABELS } from "./constants";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

interface AnalyticsSectionProps {
    initialPeriod?: "daily" | "weekly";
}

export default function AnalyticsSection({ initialPeriod = "daily" }: AnalyticsSectionProps) {
    const [period, setPeriod] = useState<"daily" | "weekly">(initialPeriod);
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, [period]);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/admin/analytics?period=${period}`);
            if (response.ok) {
                const data = await response.json();
                setAnalytics(data);
            }
        } catch (error) {
            console.error("Error fetching analytics:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading || !analytics) {
        return (
            <div className="flex items-center justify-center py-32">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-indigo-600 border-t-transparent"></div>
            </div>
        );
    }

    const userGrowthData = {
        labels: analytics.userStats.growth.map(item => item.date),
        datasets: [{
            label: "New Users",
            data: analytics.userStats.growth.map(item => item.count),
            borderColor: CHART_COLORS.primary,
            backgroundColor: CHART_COLORS.primaryLight,
            fill: true,
            tension: 0.4,
        }],
    };

    const bookingTrendsData = {
        labels: analytics.bookingStats.overTime.map(item => item.date),
        datasets: [{
            label: "Bookings",
            data: analytics.bookingStats.overTime.map(item => item.count),
            backgroundColor: CHART_COLORS.secondary,
            borderRadius: 6,
        }],
    };

    const bookingStatusData = {
        labels: Object.keys(analytics.bookingStats.byStatus).map(s => s.charAt(0).toUpperCase() + s.slice(1)),
        datasets: [{
            data: Object.values(analytics.bookingStats.byStatus),
            backgroundColor: [CHART_COLORS.warning, CHART_COLORS.success, CHART_COLORS.danger],
            borderWidth: 0,
        }],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            x: { grid: { display: false } },
            y: { grid: { color: "rgba(0,0,0,0.05)" } },
        },
    };

    const stats = [
        { label: "Total Users", value: analytics.userStats.total, icon: Users, color: "indigo" },
        { label: "Total Bookings", value: analytics.bookingStats.total, icon: TrendingUp, color: "emerald" },
        { label: "Platform Income", value: `$${analytics.platformIncome?.toFixed(0) || 0}`, icon: DollarSign, color: "amber" },
        { label: "Active Guides", value: analytics.activeGuides, icon: UserCheck, color: "purple" },
        { label: "Providers", value: analytics.activeProviders, icon: Building, color: "cyan" },
        { label: "Revenue", value: `LKR ${(analytics.revenueStats.total / 1000).toFixed(0)}K`, icon: MapPin, color: "rose" },
    ];

    return (
        <div className="space-y-8">
            {/* Period Toggle */}
            <div className="flex justify-end">
                <div className="inline-flex bg-gray-100 rounded-full p-1">
                    {TIME_PERIODS.map((p) => (
                        <button
                            key={p.value}
                            onClick={() => setPeriod(p.value as "daily" | "weekly")}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                period === p.value
                                    ? "bg-white text-gray-900 shadow-sm"
                                    : "text-gray-600 hover:text-gray-900"
                            }`}
                        >
                            {p.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <stat.icon className="text-gray-400 mb-3" size={22} />
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-sm text-gray-500">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* User Growth */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">User Growth</h3>
                    <div style={{ height: "280px" }}>
                        <Line data={userGrowthData} options={chartOptions} />
                    </div>
                </div>

                {/* Booking Status */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Booking Status</h3>
                    <div style={{ height: "280px" }} className="flex items-center justify-center">
                        <Doughnut
                            data={bookingStatusData}
                            options={{
                                ...chartOptions,
                                cutout: "70%",
                                plugins: { legend: { display: true, position: "bottom" } }
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Booking Trends */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Booking Trends</h3>
                <div style={{ height: "280px" }}>
                    <Bar data={bookingTrendsData} options={chartOptions} />
                </div>
            </div>

            {/* Popular Destinations */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Popular Destinations</h3>
                <div className="space-y-4">
                    {analytics.popularDestinations.slice(0, 5).map((dest, i) => (
                        <div key={i} className="flex items-center gap-4">
                            <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-600">
                                {i + 1}
                            </span>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-medium text-gray-900">{dest.location}</span>
                                    <span className="text-sm text-gray-500">{dest.count} bookings</span>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                                        style={{ width: `${(dest.count / analytics.popularDestinations[0].count) * 100}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
