"use client";

import { useState, useEffect } from "react";
import { EventData } from "./types";
import { Calendar, Plus, Eye, Edit, Trash2, Search, MapPin } from "lucide-react";
import { AddEventModal, EditEventModal, ViewEventModal } from "./modals";

export default function EventsSection() {
    const [events, setEvents] = useState<EventData[]>([]);
    const [filteredEvents, setFilteredEvents] = useState<EventData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);

    useEffect(() => {
        fetchEvents();
    }, []);

    useEffect(() => {
        const filtered = searchTerm
            ? events.filter(e =>
                e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                e.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                e.location.toLowerCase().includes(searchTerm.toLowerCase())
            )
            : events;
        setFilteredEvents(filtered);
    }, [searchTerm, events]);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/admin/events");
            if (response.ok) {
                const data = await response.json();
                setEvents(data.events);
                setFilteredEvents(data.events);
            }
        } catch (error) {
            console.error("Error fetching events:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (eventId: string) => {
        if (!confirm("Are you sure you want to delete this event?")) return;
        try {
            const response = await fetch(`/api/admin/events/${eventId}`, { method: "DELETE" });
            if (response.ok) {
                alert("Event deleted successfully!");
                fetchEvents();
            } else {
                alert("Failed to delete event");
            }
        } catch (error) {
            console.error("Error deleting event:", error);
        }
    };

    const formatDate = (date: Date) => new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

    if (loading) {
        return (
            <div className="flex items-center justify-center py-32">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-indigo-600 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search events..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-5 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
                >
                    <Plus size={20} />
                    Add Event
                </button>
            </div>

            {/* Table */}
            {filteredEvents.length === 0 ? (
                <div className="py-16 text-center bg-white rounded-2xl shadow-sm border border-gray-100">
                    <Calendar className="mx-auto text-gray-300 mb-4" size={40} />
                    <p className="text-gray-500">{searchTerm ? "No events found" : "No events yet"}</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Event</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Category</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Date</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Location</th>
                                <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredEvents.map((event) => (
                                <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {event.eventImages && event.eventImages[0] ? (
                                                <img src={event.eventImages[0]} alt="" className="w-12 h-12 rounded-lg object-cover" />
                                            ) : (
                                                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                                    <Calendar className="text-gray-400" size={20} />
                                                </div>
                                            )}
                                            <span className="font-medium text-gray-900">{event.title}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                                            {event.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{formatDate(event.date)}</td>
                                    <td className="px-6 py-4 text-gray-600">
                                        <span className="flex items-center gap-1">
                                            <MapPin size={14} className="text-gray-400" />
                                            {event.location}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button
                                                onClick={() => { setSelectedEvent(event); setShowViewModal(true); }}
                                                className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                onClick={() => { setSelectedEvent(event); setShowEditModal(true); }}
                                                className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(event.id)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showAddModal && (
                <AddEventModal onClose={() => setShowAddModal(false)} onSuccess={() => { setShowAddModal(false); fetchEvents(); }} />
            )}
            {showEditModal && selectedEvent && (
                <EditEventModal event={selectedEvent} onClose={() => { setShowEditModal(false); setSelectedEvent(null); }} onSuccess={() => { setShowEditModal(false); setSelectedEvent(null); fetchEvents(); }} />
            )}
            {showViewModal && selectedEvent && (
                <ViewEventModal event={selectedEvent} onClose={() => { setShowViewModal(false); setSelectedEvent(null); }} />
            )}
        </div>
    );
}
