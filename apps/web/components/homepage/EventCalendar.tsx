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
                // Filter to next 30 days
                const thirtyDaysFromNow = new Date();
                thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

                const filteredEvents = data.events.filter((event: Event) => {
                    const eventDate = new Date(event.date);
                    return eventDate <= thirtyDaysFromNow;
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
            <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="animate-spin text-orange-600 mb-4" size={48} />
                <p className="text-gray-600">Loading upcoming events...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12 bg-red-50 rounded-xl border border-red-200">
                <p className="text-red-600 font-semibold">Failed to load events</p>
                <button
                    onClick={fetchUpcomingEvents}
                    className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (events.length === 0) {
        return (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
                <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-600 text-lg">No upcoming events at the moment</p>
                <p className="text-gray-500 text-sm mt-2">Check back soon for exciting events!</p>
            </div>
        );
    }

    const groupedEvents = groupEventsByDate();

    return (
        <div className="space-y-8">
            {Object.entries(groupedEvents).map(([dateString, dateEvents]) => (
                <div key={dateString} className="space-y-4">
                    {/* Date Header */}
                    <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-xl shadow-lg">
                            <div className="text-center">
                                <div className="text-2xl font-bold">
                                    {new Date(dateEvents[0].date).getDate()}
                                </div>
                                <div className="text-xs uppercase tracking-wide">
                                    {new Date(dateEvents[0].date).toLocaleDateString("en-US", { month: "short" })}
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">{dateString}</h3>
                            <p className="text-sm text-gray-600">{formatDayOfWeek(dateEvents[0].date.toString())}</p>
                        </div>
                    </div>

                    {/* Events for this date */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ml-0 md:ml-20">
                        {dateEvents.map((event) => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
