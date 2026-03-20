"use client";

import Link from "next/link";
import { Calendar, Home } from "lucide-react";
import EventCalendar from "@/components/homepage/EventCalendar";

/**
 * Dedicated page for upcoming events
 */
export default function EventsPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Banner */}
            <div
                className="relative h-[320px] bg-cover bg-center"
                style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')"
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/90 via-purple-900/80 to-indigo-900/90" />
                <div className="relative z-10 h-full flex flex-col justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-sm text-white/70 mb-4">
                        <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
                            <Home size={14} />
                            Home
                        </Link>
                        <span>/</span>
                        <span className="text-white">Events</span>
                    </nav>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/20">
                            <Calendar className="text-white" size={32} />
                        </div>
                        <h1 className="font-display text-5xl md:text-6xl font-bold text-white tracking-tight">
                            Upcoming Events
                        </h1>
                    </div>
                    <p className="text-xl text-white/80 max-w-2xl">
                        Discover festivals, cultural celebrations, and exciting happenings across Sri Lanka
                    </p>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10">
                    <EventCalendar />
                </div>
            </div>
        </div>
    );
}
