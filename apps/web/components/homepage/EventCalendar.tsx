"use client";

import { useState, useEffect } from "react";
import { Calendar, Loader2 } from "lucide-react";
import EventCard from "./EventCard";

interface Event {
    id: string;
    title: string;
    category: string;
    date: Date;
    location: string;
    description: string[];
    eventImages: string[];
}

interface GroupedEvents {
    [date: string]: Event[];
}

/**
 * EventCalendar component for displaying upcoming events
 * Shows events grouped by date in a calendar-style view
 */
export default function EventCalendar() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        fetchUpcomingEvents();
    }, []);

    const fetchUpcomingEvents = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/events/upcoming");
            if (response.ok) {
                const data = await response.json();
                // Filter to next 1 year
                const oneYearFromNow = new Date();
                oneYearFromNow.setDate(oneYearFromNow.getDate() + 365);

                const filteredEvents = data.events.filter((event: Event) => {
                    const eventDate = new Date(event.date);
                    return eventDate <= oneYearFromNow;
                });

                setEvents(filteredEvents);
            } else {
                setError(true);
            }
        } catch (err) {
            console.error("Error fetching events:", err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    const groupEventsByDate = (): GroupedEvents => {
        const grouped: GroupedEvents = {};

        events.forEach((event) => {
            const dateKey = new Date(event.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });

            if (!grouped[dateKey]) {
                grouped[dateKey] = [];
            }
            grouped[dateKey].push(event);
        });

        return grouped;
    };

    const formatDayOfWeek = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", { weekday: "long" });
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-indigo-600 border-t-transparent mb-4"></div>
                <p className="text-gray-500">Loading upcoming events...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-20 bg-red-50 rounded-xl border border-red-100">
                <p className="text-red-600 font-medium mb-4">Failed to load events</p>
                <button
                    onClick={fetchUpcomingEvents}
                    className="px-6 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (events.length === 0) {
        return (
            <div className="text-center py-20">
                <Calendar className="mx-auto text-gray-300 mb-4" size={64} />
                <p className="text-xl text-gray-600 font-medium mb-2">No upcoming events</p>
                <p className="text-gray-500">Check back soon for exciting events!</p>
            </div>
        );
    }

    const groupedEvents = groupEventsByDate();

    return (
        <div className="space-y-10">
            {Object.entries(groupedEvents).map(([dateString, dateEvents]) => (
                <div key={dateString} className="space-y-5">
                    {/* Date Header */}
                    <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white px-5 py-3 rounded-xl shadow-md">
                            <div className="text-center">
                                <div className="text-2xl font-bold">
                                    {new Date(dateEvents[0].date).getDate()}
                                </div>
                                <div className="text-xs uppercase tracking-wide opacity-90">
                                    {new Date(dateEvents[0].date).toLocaleDateString("en-US", { month: "short" })}
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">{dateString}</h3>
                            <p className="text-sm text-gray-500">{formatDayOfWeek(dateEvents[0].date.toString())}</p>
                        </div>
                    </div>

                    {/* Events for this date */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pl-0 md:pl-[88px]">
                        {dateEvents.map((event) => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
