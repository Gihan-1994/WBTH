"use client";

import { Stats } from "./types";

interface StatisticsCardProps {
    stats: Stats | null;
}

export default function StatisticsCard({ stats }: StatisticsCardProps) {
    if (!stats) return null;

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 Statistics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
                    <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
                        {stats.total}
                    </div>
                    <div className="text-xs font-semibold text-gray-600">📈 Total</div>
                </div>

                <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
                    <div className="text-2xl font-bold text-yellow-600 mb-1">
                        {stats.pending}
                    </div>
                    <div className="text-xs font-semibold text-gray-600">⏳ Pending</div>
                </div>

                <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                        {stats.confirmed}
                    </div>
                    <div className="text-xs font-semibold text-gray-600">✅ Confirmed</div>
                </div>

                <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
                    <div className="text-2xl font-bold text-red-600 mb-1">
                        {stats.cancelled}
                    </div>
                    <div className="text-xs font-semibold text-gray-600">❌ Cancelled</div>
                </div>

                <div className="col-span-2 md:col-span-4 bg-white rounded-xl shadow-md border border-gray-100 p-4 hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
                    <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1">
                        ${stats.income}
                    </div>
                    <div className="text-xs font-semibold text-gray-600">💰 Total Income</div>
                </div>
            </div>
        </div>
    );
}
