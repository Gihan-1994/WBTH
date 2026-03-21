"use client";

import { Stats } from "./types";

interface StatisticsCardProps {
    stats: Stats | null;
}

export default function StatisticsCard({ stats }: StatisticsCardProps) {
    if (!stats) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                <p className="text-gray-500">No statistics available yet</p>
            </div>
        );
    }

    const total = stats.total || 1;
    const confirmedPercent = Math.round((stats.confirmed / total) * 100);
    const pendingPercent = Math.round((stats.pending / total) * 100);
    const cancelledPercent = Math.round((stats.cancelled / total) * 100);

    return (
        <div className="space-y-6">
            {/* Top Row - Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Income */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <p className="text-sm font-medium text-gray-500 mb-1">Total Revenue</p>
                    <p className="text-3xl font-bold text-gray-900">Rs {stats.income.toLocaleString()}</p>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">From {stats.confirmed} confirmed bookings</span>
                        </div>
                    </div>
                </div>

                {/* Total Bookings */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <p className="text-sm font-medium text-gray-500 mb-1">Total Bookings</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">All time bookings received</span>
                        </div>
                    </div>
                </div>

                {/* Conversion Rate */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <p className="text-sm font-medium text-gray-500 mb-1">Confirmation Rate</p>
                    <p className="text-3xl font-bold text-gray-900">{confirmedPercent}%</p>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">{stats.confirmed} of {stats.total} bookings confirmed</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Row - Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Booking Status Breakdown */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-base font-semibold text-gray-900 mb-6">Booking Status</h3>

                    {/* Progress Bar */}
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden flex mb-6">
                        {confirmedPercent > 0 && (
                            <div
                                className="bg-emerald-500 h-full"
                                style={{ width: `${confirmedPercent}%` }}
                            />
                        )}
                        {pendingPercent > 0 && (
                            <div
                                className="bg-amber-500 h-full"
                                style={{ width: `${pendingPercent}%` }}
                            />
                        )}
                        {cancelledPercent > 0 && (
                            <div
                                className="bg-red-500 h-full"
                                style={{ width: `${cancelledPercent}%` }}
                            />
                        )}
                    </div>

                    {/* Legend */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                                <span className="text-gray-600">Confirmed</span>
                            </div>
                            <div className="text-right">
                                <span className="font-semibold text-gray-900">{stats.confirmed}</span>
                                <span className="text-gray-400 ml-2">({confirmedPercent}%)</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                                <span className="text-gray-600">Pending</span>
                            </div>
                            <div className="text-right">
                                <span className="font-semibold text-gray-900">{stats.pending}</span>
                                <span className="text-gray-400 ml-2">({pendingPercent}%)</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <span className="text-gray-600">Cancelled</span>
                            </div>
                            <div className="text-right">
                                <span className="font-semibold text-gray-900">{stats.cancelled}</span>
                                <span className="text-gray-400 ml-2">({cancelledPercent}%)</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-base font-semibold text-gray-900 mb-6">Overview</h3>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <span className="text-gray-600">Average Booking Value</span>
                            <span className="font-semibold text-gray-900">
                                Rs {stats.confirmed > 0 ? Math.round(stats.income / stats.confirmed).toLocaleString() : 0}
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <span className="text-gray-600">Pending Bookings</span>
                            <span className="font-semibold text-amber-600">{stats.pending}</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <span className="text-gray-600">Cancellation Rate</span>
                            <span className="font-semibold text-gray-900">{cancelledPercent}%</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg">
                            <span className="text-emerald-700">Success Rate</span>
                            <span className="font-semibold text-emerald-700">{confirmedPercent}%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
