"use client";

import { useState, useEffect } from "react";
import { EventData } from "./types";
import { Calendar, Plus, Eye, Edit, Trash2, Search } from "lucide-react";
import { AddEventModal, EditEventModal, ViewEventModal } from "./modals";

/**
 * EventsSection component for admin dashboard
 * Displays all events with CRUD operations
 */
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
        filterEvents();
    }, [searchTerm, events]);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/admin/events");
            if (response.ok) {
                const data = await response.json();
                setEvents(data.events);
            } else {
                console.error("Failed to fetch events");
            }
        } catch (error) {
            console.error("Error fetching events:", error);
        } finally {
            setLoading(false);
        }
    };

    const filterEvents = () => {
        if (!searchTerm.trim()) {
            setFilteredEvents(events);
            return;
        }

        const filtered = events.filter((event) =>
            event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.location.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredEvents(filtered);
    };

    const handleDelete = async (eventId: string) => {
        if (!confirm("Are you sure you want to delete this event?")) return;

        try {
            const response = await fetch(`/api/admin/events/${eventId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                alert("Event deleted successfully!");
                fetchEvents();
            } else {
                alert("Failed to delete event");
            }
        } catch (error) {
            console.error("Error deleting event:", error);
            alert("Error deleting event");
        }
    };

    const handleView = (event: EventData) => {
        setSelectedEvent(event);
        setShowViewModal(true);
    };

    const handleEdit = (event: EventData) => {
        setSelectedEvent(event);
        setShowEditModal(true);
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-orange-100 to-orange-200 p-3 rounded-xl">
                        <Calendar className="text-orange-600" size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Events Management</h2>
                        <p className="text-sm text-gray-600">Manage all platform events</p>
                    </div>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-700 hover:to-red-700 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
                >
                    <Plus size={20} />
                    Add New Event
                </button>
            </div>

            {/* Search */}
            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search events by title, category, or location..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Events Table */}
            {filteredEvents.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
                    <p className="text-gray-600 text-lg">
                        {searchTerm ? "No events found matching your search" : "No events yet. Create your first event!"}
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Image</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Title</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Category</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Location</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEvents.map((event) => (
                                <tr key={event.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        {event.eventImages && event.eventImages.length > 0 ? (
                                            <img
                                                src={event.eventImages[0]}
                                                alt={event.title}
                                                className="w-16 h-16 object-cover rounded-lg"
                                            />
                                        ) : (
                                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                                <Calendar className="text-gray-400" size={24} />
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-gray-800">{event.title}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                                            {event.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{formatDate(event.date)}</td>
                                    <td className="px-6 py-4 text-gray-600">{event.location}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => handleView(event)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="View"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleEdit(event)}
                                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(event.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete"
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

            {/* Modals */}
            {showAddModal && (
                <AddEventModal
                    onClose={() => setShowAddModal(false)}
                    onSuccess={() => {
                        setShowAddModal(false);
                        fetchEvents();
                    }}
                />
            )}

            {showEditModal && selectedEvent && (
                <EditEventModal
                    event={selectedEvent}
                    onClose={() => {
                        setShowEditModal(false);
                        setSelectedEvent(null);
                    }}
                    onSuccess={() => {
                        setShowEditModal(false);
                        setSelectedEvent(null);
                        fetchEvents();
                    }}
                />
            )}

            {showViewModal && selectedEvent && (
                <ViewEventModal
                    event={selectedEvent}
                    onClose={() => {
                        setShowViewModal(false);
                        setSelectedEvent(null);
                    }}
                />
            )}
        </div>
    );
}
