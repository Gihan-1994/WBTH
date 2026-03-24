"use client";

import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, CalendarX, Calendar, Loader2 } from "lucide-react";
import { useToast } from "@/components/Toast";

interface BlockedDatesModalProps {
    accommodationId: string;
    accommodationName: string;
    onClose: () => void;
}

export default function BlockedDatesModal({
    accommodationId,
    accommodationName,
    onClose,
}: BlockedDatesModalProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [blockedDates, setBlockedDates] = useState<Set<string>>(new Set());
    const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const toast = useToast();

    // Fetch existing blocked dates
    useEffect(() => {
        const fetchBlockedDates = async () => {
            try {
                const res = await fetch(
                    `/api/accommodation-provider/accommodations/${accommodationId}/blocked-dates`
                );
                if (res.ok) {
                    const data = await res.json();
                    const dates = new Set<string>(
                        data.blockedDates.map((d: { date: string }) =>
                            new Date(d.date).toISOString().split("T")[0]
                        )
                    );
                    setBlockedDates(dates);
                }
            } catch (error) {
                console.error("Error fetching blocked dates:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBlockedDates();
    }, [accommodationId]);

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();

        const days: (number | null)[] = [];
        for (let i = 0; i < startingDay; i++) {
            days.push(null);
        }
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i);
        }
        return days;
    };

    const formatDateKey = (day: number) => {
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, "0");
        const dayStr = String(day).padStart(2, "0");
        return `${year}-${month}-${dayStr}`;
    };

    const isBlocked = (day: number) => {
        return blockedDates.has(formatDateKey(day));
    };

    const isSelected = (day: number) => {
        return selectedDates.has(formatDateKey(day));
    };

    const isPast = (day: number) => {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    };

    const toggleDate = (day: number) => {
        if (isPast(day)) return;

        const dateKey = formatDateKey(day);
        const newSelected = new Set(selectedDates);

        if (newSelected.has(dateKey)) {
            newSelected.delete(dateKey);
        } else {
            newSelected.add(dateKey);
        }
        setSelectedDates(newSelected);
    };

    const handleBlockDates = async () => {
        const datesToBlock = Array.from(selectedDates).filter(
            (d) => !blockedDates.has(d)
        );

        if (datesToBlock.length === 0) return;

        setSaving(true);
        try {
            const res = await fetch(
                `/api/accommodation-provider/accommodations/${accommodationId}/blocked-dates`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        dates: datesToBlock,
                        reason: "Fully booked",
                    }),
                }
            );

            if (res.ok) {
                const newBlocked = new Set(blockedDates);
                datesToBlock.forEach((d) => newBlocked.add(d));
                setBlockedDates(newBlocked);
                setSelectedDates(new Set());
                toast.success("Dates marked as fully booked!");
            } else {
                toast.error("Failed to block dates");
            }
        } catch (error) {
            console.error("Error blocking dates:", error);
            toast.error("Error blocking dates");
        } finally {
            setSaving(false);
        }
    };

    const handleUnblockDates = async () => {
        const datesToUnblock = Array.from(selectedDates).filter((d) =>
            blockedDates.has(d)
        );

        if (datesToUnblock.length === 0) return;

        setSaving(true);
        try {
            const res = await fetch(
                `/api/accommodation-provider/accommodations/${accommodationId}/blocked-dates`,
                {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ dates: datesToUnblock }),
                }
            );

            if (res.ok) {
                const newBlocked = new Set(blockedDates);
                datesToUnblock.forEach((d) => newBlocked.delete(d));
                setBlockedDates(newBlocked);
                setSelectedDates(new Set());
                toast.success("Dates unblocked!");
            } else {
                toast.error("Failed to unblock dates");
            }
        } catch (error) {
            console.error("Error unblocking dates:", error);
            toast.error("Error unblocking dates");
        } finally {
            setSaving(false);
        }
    };

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const days = getDaysInMonth(currentDate);
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const selectedToBlock = Array.from(selectedDates).filter((d) => !blockedDates.has(d)).length;
    const selectedToUnblock = Array.from(selectedDates).filter((d) => blockedDates.has(d)).length;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 transition-opacity"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                Manage Availability
                            </h2>
                            <p className="text-sm text-gray-500">{accommodationName}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                        </div>
                    ) : (
                        <>
                            {/* Legend */}
                            <div className="flex items-center gap-4 mb-6 text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                                    <span className="text-gray-600">Fully Booked</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-emerald-500 rounded"></div>
                                    <span className="text-gray-600">Available</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                                    <span className="text-gray-600">Selected</span>
                                </div>
                            </div>

                            {/* Calendar Header */}
                            <div className="flex items-center justify-between mb-4">
                                <button
                                    onClick={prevMonth}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {currentDate.toLocaleDateString("en-US", {
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </h3>
                                <button
                                    onClick={nextMonth}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>

                            {/* Calendar Grid */}
                            <div className="bg-gray-50 rounded-xl p-4 mb-6">
                                {/* Week Days */}
                                <div className="grid grid-cols-7 gap-1 mb-2">
                                    {weekDays.map((day) => (
                                        <div
                                            key={day}
                                            className="text-center text-xs font-medium text-gray-500 py-2"
                                        >
                                            {day}
                                        </div>
                                    ))}
                                </div>

                                {/* Days */}
                                <div className="grid grid-cols-7 gap-1">
                                    {days.map((day, index) => {
                                        if (day === null) {
                                            return <div key={`empty-${index}`} />;
                                        }

                                        const past = isPast(day);
                                        const blocked = isBlocked(day);
                                        const selected = isSelected(day);

                                        return (
                                            <button
                                                key={day}
                                                onClick={() => toggleDate(day)}
                                                disabled={past}
                                                className={`
                                                    aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all
                                                    ${past
                                                        ? "text-gray-300 cursor-not-allowed"
                                                        : selected
                                                            ? "bg-blue-500 text-white ring-2 ring-blue-300"
                                                            : blocked
                                                                ? "bg-red-500 text-white hover:bg-red-600"
                                                                : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                                                    }
                                                `}
                                            >
                                                {day}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Selection Info */}
                            {selectedDates.size > 0 && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                    <p className="text-sm text-blue-700 font-medium mb-2">
                                        {selectedDates.size} date(s) selected
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {Array.from(selectedDates)
                                            .sort()
                                            .slice(0, 10)
                                            .map((date) => (
                                                <span
                                                    key={date}
                                                    className={`px-2 py-1 rounded text-xs font-medium ${
                                                        blockedDates.has(date)
                                                            ? "bg-red-100 text-red-700"
                                                            : "bg-emerald-100 text-emerald-700"
                                                    }`}
                                                >
                                                    {new Date(date).toLocaleDateString("en-US", {
                                                        month: "short",
                                                        day: "numeric",
                                                    })}
                                                </span>
                                            ))}
                                        {selectedDates.size > 10 && (
                                            <span className="text-xs text-blue-600">
                                                +{selectedDates.size - 10} more
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Instructions */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                                    <Calendar size={16} />
                                    How to use
                                </h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>• Click on dates to select them</li>
                                    <li>• Green dates are available for booking</li>
                                    <li>• Red dates are marked as fully booked</li>
                                    <li>• Use the buttons below to block or unblock selected dates</li>
                                </ul>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition-colors"
                        >
                            Close
                        </button>
                        {selectedToUnblock > 0 && (
                            <button
                                type="button"
                                onClick={handleUnblockDates}
                                disabled={saving}
                                className="flex-1 px-4 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {saving ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Calendar size={16} />
                                )}
                                Unblock ({selectedToUnblock})
                            </button>
                        )}
                        {selectedToBlock > 0 && (
                            <button
                                type="button"
                                onClick={handleBlockDates}
                                disabled={saving}
                                className="flex-1 px-4 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {saving ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <CalendarX size={16} />
                                )}
                                Block ({selectedToBlock})
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
