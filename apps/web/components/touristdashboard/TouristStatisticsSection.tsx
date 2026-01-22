"use client";

import { TrendingUp, Clock, CheckCircle, XCircle } from "lucide-react";
import { Stats } from "./types";

interface TouristStatisticsSectionProps {
    stats: Stats | null;
}

/**
 * Section showing booking statistics for the tourist
 */
export default function TouristStatisticsSection({ stats }: TouristStatisticsSectionProps) {
    if (!stats) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-200 hover:scale-[1.02]">
                <div className="flex items-center justify-between mb-3">
                    <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-3 rounded-xl">
                        <TrendingUp className="text-blue-600" size={24} />
                    </div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {stats.total}
                    </div>
                </div>
                <div className="text-sm font-semibold text-gray-600">Total Bookings</div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-200 hover:scale-[1.02]">
                <div className="flex items-center justify-between mb-3">
                    <div className="bg-gradient-to-br from-yellow-100 to-orange-100 p-3 rounded-xl">
                        <Clock className="text-yellow-600" size={24} />
                    </div>
                    <div className="text-3xl font-bold text-yellow-600">
                        {stats.pending}
                    </div>
                </div>
                <div className="text-sm font-semibold text-gray-600">Pending</div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-200 hover:scale-[1.02]">
                <div className="flex items-center justify-between mb-3">
                    <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-3 rounded-xl">
                        <CheckCircle className="text-green-600" size={24} />
                    </div>
                    <div className="text-3xl font-bold text-green-600">
                        {stats.confirmed}
                    </div>
                </div>
                <div className="text-sm font-semibold text-gray-600">Confirmed</div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-200 hover:scale-[1.02]">
                <div className="flex items-center justify-between mb-3">
                    <div className="bg-gradient-to-br from-red-100 to-rose-100 p-3 rounded-xl">
                        <XCircle className="text-red-600" size={24} />
                    </div>
                    <div className="text-3xl font-bold text-red-600">
                        {stats.cancelled}
                    </div>
                </div>
                <div className="text-sm font-semibold text-gray-600">Cancelled</div>
            </div>
        </div>
    );
}
