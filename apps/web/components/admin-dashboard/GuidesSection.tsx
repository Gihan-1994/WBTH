"use client";

import { useState, useEffect } from "react";
import { Search, Eye, UserCheck, UserX, X, Star, Trash2, ExternalLink, Ban, CheckCircle } from "lucide-react";
import { GuideData } from "./types";
import ConfirmationModal from "@/components/provider-dashboard/modals/ConfirmationModal";
import { useToast } from "@/components/Toast";

export default function GuidesSection() {
    const [guides, setGuides] = useState<GuideData[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filteredGuides, setFilteredGuides] = useState<GuideData[]>([]);
    const [selectedGuide, setSelectedGuide] = useState<GuideData | null>(null);
    const toast = useToast();
    const [confirmation, setConfirmation] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => Promise<void>;
        variant?: "danger" | "warning" | "info" | "success";
        confirmLabel?: string;
    }>({
        isOpen: false,
        title: "",
        message: "",
        onConfirm: async () => {},
    });

    useEffect(() => {
        fetchGuides();
    }, []);

    useEffect(() => {
        const filtered = search
            ? guides.filter(g =>
                g.user.name.toLowerCase().includes(search.toLowerCase()) ||
                g.user.email.toLowerCase().includes(search.toLowerCase()) ||
                g.city?.toLowerCase().includes(search.toLowerCase())
            )
            : guides;
        setFilteredGuides(filtered);
    }, [search, guides]);

    const fetchGuides = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/admin/guides");
            if (response.ok) {
                const data = await response.json();
                setGuides(data.guides);
                setFilteredGuides(data.guides);
            }
        } catch (error) {
            console.error("Error fetching guides:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteGuide = (guideId: string, guideName: string) => {
        setConfirmation({
            isOpen: true,
            title: "Delete Guide",
            message: `Are you sure you want to delete guide "${guideName}"? This will also delete their user account and all associated bookings.`,
            variant: "danger",
            confirmLabel: "Delete",
            onConfirm: async () => {
                const res = await fetch(`/api/admin/guides/${guideId}`, {
                    method: "DELETE",
                });
                if (res.ok) {
                    toast.success("Guide deleted successfully");
                    fetchGuides();
                } else {
                    const data = await res.json();
                    toast.error(data.error || "Failed to delete guide");
                }
            }
        });
    };

    const handleToggleAvailability = async (guideId: string, currentStatus: boolean) => {
        try {
            const res = await fetch(`/api/admin/guides/${guideId}/availability`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ availability: !currentStatus }),
            });
            if (res.ok) {
                toast.success("Availability updated");
                fetchGuides();
            } else {
                const data = await res.json();
                toast.error(data.error || "Failed to update availability");
            }
        } catch (error) {
            console.error("Error updating availability:", error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-32">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-indigo-600 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Total", value: guides.length },
                    { label: "Available", value: guides.filter(g => g.availability).length },
                    { label: "Rated", value: guides.filter(g => g.rating).length },
                    { label: "Bookings", value: guides.reduce((s, g) => s + g._count.bookings, 0) },
                ].map((s, i) => (
                    <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                        <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                        <p className="text-sm text-gray-500">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Search guides..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-100">
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Guide</th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Location</th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Languages</th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Rating</th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Price</th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Status</th>
                            <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredGuides.map((guide) => (
                            <tr key={guide.user_id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <p className="font-medium text-gray-900">{guide.user.name}</p>
                                    <p className="text-sm text-gray-500">{guide.user.email}</p>
                                </td>
                                <td className="px-6 py-4 text-gray-600">
                                    {guide.city || guide.province || "—"}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-1 flex-wrap">
                                        {guide.languages.slice(0, 2).map((l, i) => (
                                            <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                                                {l}
                                            </span>
                                        ))}
                                        {guide.languages.length > 2 && (
                                            <span className="text-xs text-gray-400">+{guide.languages.length - 2}</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {guide.rating ? (
                                        <span className="flex items-center gap-1 text-gray-900">
                                            <Star size={14} className="text-amber-500 fill-amber-500" />
                                            {guide.rating.toFixed(1)}
                                        </span>
                                    ) : (
                                        <span className="text-gray-400">—</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-gray-900">
                                    {guide.price ? `LKR ${guide.price.toLocaleString()}` : "—"}
                                </td>
                                <td className="px-6 py-4">
                                    {guide.availability ? (
                                        <span className="flex items-center gap-1.5 text-emerald-600 text-sm">
                                            <UserCheck size={14} /> Available
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1.5 text-gray-400 text-sm">
                                            <UserX size={14} /> Unavailable
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <button
                                            onClick={() => setSelectedGuide(guide)}
                                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                            title="View Details"
                                        >
                                            <Eye size={18} />
                                        </button>
                                        <a
                                            href={`/guides/${guide.user_id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="View on Site"
                                        >
                                            <ExternalLink size={18} />
                                        </a>
                                        <button
                                            onClick={() => handleToggleAvailability(guide.user_id, guide.availability)}
                                            className={`p-2 rounded-lg transition-colors ${
                                                guide.availability
                                                    ? "text-gray-400 hover:text-amber-600 hover:bg-amber-50"
                                                    : "text-gray-400 hover:text-emerald-600 hover:bg-emerald-50"
                                            }`}
                                            title={guide.availability ? "Suspend" : "Activate"}
                                        >
                                            {guide.availability ? <Ban size={18} /> : <CheckCircle size={18} />}
                                        </button>
                                        <button
                                            onClick={() => handleDeleteGuide(guide.user_id, guide.user.name)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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

                {filteredGuides.length === 0 && (
                    <div className="py-16 text-center text-gray-500">No guides found</div>
                )}
            </div>

            {/* Modal */}
            {selectedGuide && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedGuide(null)}>
                    <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900">Guide Details</h3>
                            <button onClick={() => setSelectedGuide(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Name</p>
                                <p className="font-medium">{selectedGuide.user.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Email</p>
                                <p>{selectedGuide.user.email}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">City</p>
                                    <p>{selectedGuide.city || "—"}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Province</p>
                                    <p>{selectedGuide.province || "—"}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-2">Languages</p>
                                <div className="flex gap-2 flex-wrap">
                                    {selectedGuide.languages.map((l, i) => (
                                        <span key={i} className="px-3 py-1 bg-gray-100 rounded-full text-sm">{l}</span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-2">Expertise</p>
                                <div className="flex gap-2 flex-wrap">
                                    {selectedGuide.expertise.map((e, i) => (
                                        <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm">{e}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                                <div>
                                    <p className="text-sm text-gray-500">Price/Day</p>
                                    <p className="font-semibold">{selectedGuide.price ? `LKR ${selectedGuide.price.toLocaleString()}` : "—"}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Rating</p>
                                    <p className="font-semibold">{selectedGuide.rating?.toFixed(1) || "—"}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Bookings</p>
                                    <p className="font-semibold">{selectedGuide._count.bookings}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmationModal
                isOpen={confirmation.isOpen}
                onClose={() => setConfirmation(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmation.onConfirm}
                title={confirmation.title}
                message={confirmation.message}
                variant={confirmation.variant}
                confirmLabel={confirmation.confirmLabel}
            />
        </div>
    );
}
