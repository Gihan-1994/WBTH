"use client";

import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";
import EventCalendar from "@/components/homepage/EventCalendar";

/**
 * Dedicated page for upcoming events
 */
export default function EventsPage() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/20 to-red-50/20 pt-10 pb-20">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header & Back Button */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-br from-orange-100 to-orange-200 p-4 rounded-2xl shadow-sm">
                            <Calendar className="text-orange-600" size={32} />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Upcoming Events</h1>
                            <p className="text-gray-600 text-lg">Discover and join exciting events around you</p>
                        </div>
                    </div>

                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm hover:shadow-md group w-fit"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        Return to Home
                    </Link>
                </div>

                {/* Main Content Area */}
                <div className="bg-white p-6 md:p-10 rounded-3xl shadow-xl border border-orange-100/50">
                    <EventCalendar />
                </div>
            </div>
        </main>
    );
}
