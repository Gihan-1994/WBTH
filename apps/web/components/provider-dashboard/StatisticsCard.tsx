"use client";

import { Stats } from "./types";
import { TrendingUp, Clock, CheckCircle, XCircle, DollarSign } from "lucide-react";

interface StatisticsCardProps {
    stats: Stats | null;
}

export default function StatisticsCard({ stats }: StatisticsCardProps) {
    if (!stats) return null;

    const statItems = [
        {
            label: "Total Bookings",
            value: stats.total,
            icon: TrendingUp,
            color: "text-blue-600",
            bg: "bg-blue-50",
        },
        {
            label: "Pending",
            value: stats.pending,
            icon: Clock,
            color: "text-amber-600",
            bg: "bg-amber-50",
        },
        {
            label: "Confirmed",
            value: stats.confirmed,
            icon: CheckCircle,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
        },
        {
            label: "Cancelled",
            value: stats.cancelled,
            icon: XCircle,
            color: "text-red-600",
            bg: "bg-red-50",
        },
    ];

    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {statItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <div
                            key={item.label}
                            className="bg-white rounded-xl border border-gray-200 p-5"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className={`w-10 h-10 ${item.bg} rounded-lg flex items-center justify-center`}>
                                    <Icon size={20} className={item.color} />
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                            <p className="text-sm text-gray-500 mt-1">{item.label}</p>
                        </div>
                    );
                })}
            </div>

            {/* Income Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Total Income</p>
                        <p className="text-3xl font-bold text-gray-900">
                            Rs {stats.income.toLocaleString()}
                        </p>
                    </div>
                    <div className="w-14 h-14 bg-emerald-50 rounded-xl flex items-center justify-center">
                        <DollarSign size={28} className="text-emerald-600" />
                    </div>
                </div>
            </div>
        </div>
    );
}
