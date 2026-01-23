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
import { Line, Bar, Pie, Doughnut } from "react-chartjs-2";
import { Users, TrendingUp, DollarSign, MapPin, UserCheck, Building } from "lucide-react";
import { AnalyticsData } from "./types";
import { CHART_COLORS, TIME_PERIODS, USER_ROLE_LABELS } from "./constants";

// Register Chart.js components
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

/**
 * Analytics dashboard with Chart.js visualizations
 */
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
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    // User Growth Chart Data
    const userGrowthData = {
        labels: analytics.userStats.growth.map(item => item.date),
        datasets: [
            {
                label: "New Users",
                data: analytics.userStats.growth.map(item => item.count),
                borderColor: CHART_COLORS.primary,
                backgroundColor: CHART_COLORS.primaryLight,
                fill: true,
                tension: 0.4,
            },
        ],
    };

    // User Distribution Pie Chart Data
    const userDistributionData = {
        labels: Object.keys(analytics.userStats.byType).map(role => USER_ROLE_LABELS[role] || role),
        datasets: [
            {
                data: Object.values(analytics.userStats.byType),
                backgroundColor: [
                    CHART_COLORS.info,
                    CHART_COLORS.success,
                    CHART_COLORS.warning,
                    CHART_COLORS.danger,
                ],
                borderWidth: 2,
                borderColor: "#fff",
            },
        ],
    };

    // Booking Trends Bar Chart Data
    const bookingTrendsData = {
        labels: analytics.bookingStats.overTime.map(item => item.date),
        datasets: [
            {
                label: "Bookings",
                data: analytics.bookingStats.overTime.map(item => item.count),
                backgroundColor: CHART_COLORS.success,
                borderRadius: 8,
            },
        ],
    };

    // Revenue Trends Line Chart Data
    const revenueTrendsData = {
        labels: analytics.revenueStats.trends.map(item => item.date),
        datasets: [
            {
                label: "Revenue (LKR)",
                data: analytics.revenueStats.trends.map(item => item.amount),
                borderColor: CHART_COLORS.warning,
                backgroundColor: CHART_COLORS.warningLight,
                fill: true,
                tension: 0.4,
            },
        ],
    };

    // Booking Status Doughnut Chart Data
    const bookingStatusData = {
        labels: Object.keys(analytics.bookingStats.byStatus).map(status =>
            status.charAt(0).toUpperCase() + status.slice(1)
        ),
        datasets: [
            {
                data: Object.values(analytics.bookingStats.byStatus),
                backgroundColor: [
                    CHART_COLORS.warning,
                    CHART_COLORS.success,
                    CHART_COLORS.danger,
                ],
                borderWidth: 2,
                borderColor: "#fff",
            },
        ],
    };

    // Popular Destinations Horizontal Bar Chart Data
    const popularDestinationsData = {
        labels: analytics.popularDestinations.map(item => item.location),
        datasets: [
            {
                label: "Bookings",
                data: analytics.popularDestinations.map(item => item.count),
                backgroundColor: CHART_COLORS.secondary,
                borderRadius: 8,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top" as const,
            },
        },
    };

    return (
        <div className="space-y-6">
            {/* Header with Time Period Selector */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">📊 Analytics Overview</h2>
                <div className="flex gap-2">
                    {TIME_PERIODS.map((timePeriod) => (
                        <button
                            key={timePeriod.value}
                            onClick={() => setPeriod(timePeriod.value as "daily" | "weekly")}
                            className={`px-4 py-2 rounded-xl font-semibold transition-all duration-200 ${period === timePeriod.value
                                ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                        >
                            {timePeriod.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-600 font-semibold mb-1">Total Users</p>
                            <p className="text-3xl font-bold text-blue-900">{analytics.userStats.total}</p>
                            <p className="text-sm text-blue-600 mt-2">
                                {Object.entries(analytics.userStats.byType).map(([role, count]) => (
                                    <span key={role} className="mr-3">
                                        {USER_ROLE_LABELS[role]}: {count}
                                    </span>
                                ))}
                            </p>
                        </div>
                        <Users className="text-blue-600" size={40} />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-600 font-semibold mb-1">Total Bookings</p>
                            <p className="text-3xl font-bold text-green-900">{analytics.bookingStats.total}</p>
                            <p className="text-sm text-green-600 mt-2">
                                Conversion: {analytics.bookingStats.conversionRate}%
                            </p>
                        </div>
                        <TrendingUp className="text-green-600" size={40} />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-2xl border border-orange-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-orange-600 font-semibold mb-1">Platform Income</p>
                            <p className="text-3xl font-bold text-orange-900">
                                ${analytics.platformIncome?.toFixed(2) || "0.00"}
                            </p>
                            <p className="text-sm text-orange-600 mt-2">
                                10% fee from confirmed bookings
                            </p>
                        </div>
                        <DollarSign className="text-orange-600" size={40} />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-600 font-semibold mb-1">Active Guides</p>
                            <p className="text-3xl font-bold text-purple-900">{analytics.activeGuides}</p>
                        </div>
                        <UserCheck className="text-purple-600" size={40} />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-6 rounded-2xl border border-pink-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-pink-600 font-semibold mb-1">Active Providers</p>
                            <p className="text-3xl font-bold text-pink-900">{analytics.activeProviders}</p>
                        </div>
                        <Building className="text-pink-600" size={40} />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-6 rounded-2xl border border-teal-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="teal-pink-600 font-semibold mb-1">Total Revenue</p>
                            <p className="text-2xl font-bold text-teal-900">
                                LKR {analytics.revenueStats.total.toLocaleString()}
                            </p>
                        </div>
                        <MapPin className="text-teal-600" size={40} />
                    </div>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* User Growth Chart */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">User Growth</h3>
                    <div style={{ height: "300px" }}>
                        <Line data={userGrowthData} options={chartOptions} />
                    </div>
                </div>

                {/* User Distribution Chart */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">User Distribution</h3>
                    <div style={{ height: "300px" }}>
                        <Pie data={userDistributionData} options={chartOptions} />
                    </div>
                </div>

                {/* Booking Trends Chart */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Booking Trends</h3>
                    <div style={{ height: "300px" }}>
                        <Bar data={bookingTrendsData} options={chartOptions} />
                    </div>
                </div>

                {/* Revenue Trends Chart */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Revenue Trends</h3>
                    <div style={{ height: "300px" }}>
                        <Line data={revenueTrendsData} options={chartOptions} />
                    </div>
                </div>

                {/* Booking Status Chart */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Booking Status</h3>
                    <div style={{ height: "300px" }}>
                        <Doughnut data={bookingStatusData} options={chartOptions} />
                    </div>
                </div>

                {/* Popular Destinations Chart */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Popular Destinations</h3>
                    <div style={{ height: "300px" }}>
                        <Bar
                            data={popularDestinationsData}
                            options={{
                                ...chartOptions,
                                indexAxis: "y" as const,
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
