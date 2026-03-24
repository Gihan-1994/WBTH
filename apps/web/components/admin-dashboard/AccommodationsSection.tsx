"use client";

import { useState, useEffect } from "react";
import { Search, Eye, ChevronDown, ChevronRight, X, Star, MapPin, Trash2, ExternalLink } from "lucide-react";
import { ProviderData, AccommodationData } from "./types";
import ConfirmationModal from "@/components/provider-dashboard/modals/ConfirmationModal";
import { useToast } from "@/components/Toast";

export default function AccommodationsSection() {
    const [providers, setProviders] = useState<ProviderData[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filteredProviders, setFilteredProviders] = useState<ProviderData[]>([]);
    const [expandedProviders, setExpandedProviders] = useState<Set<string>>(new Set());
    const [selectedAccommodation, setSelectedAccommodation] = useState<AccommodationData | null>(null);
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
        fetchAccommodations();
    }, []);

    useEffect(() => {
        const filtered = search
            ? providers.filter(p =>
                p.company_name.toLowerCase().includes(search.toLowerCase()) ||
                p.user.name.toLowerCase().includes(search.toLowerCase()) ||
                p.accommodations.some(a => a.name.toLowerCase().includes(search.toLowerCase()))
            )
            : providers;
        setFilteredProviders(filtered);
    }, [search, providers]);

    const fetchAccommodations = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/admin/accommodations");
            if (response.ok) {
                const data = await response.json();
                setProviders(data.providers);
                setFilteredProviders(data.providers);
                setExpandedProviders(new Set(data.providers.map((p: ProviderData) => p.provider_id)));
            }
        } catch (error) {
            console.error("Error fetching accommodations:", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleProvider = (id: string) => {
        const next = new Set(expandedProviders);
        next.has(id) ? next.delete(id) : next.add(id);
        setExpandedProviders(next);
    };

    const totalAccommodations = providers.reduce((s, p) => s + p.accommodations.length, 0);
    const totalBookings = providers.reduce((s, p) => s + p.accommodations.reduce((a, acc) => a + acc._count.bookings, 0), 0);

    const handleDeleteAccommodation = (accId: string, accName: string) => {
        setConfirmation({
            isOpen: true,
            title: "Delete Accommodation",
            message: `Are you sure you want to delete "${accName}"? This will also delete all associated bookings and cannot be undone.`,
            variant: "danger",
            confirmLabel: "Delete",
            onConfirm: async () => {
                const res = await fetch(`/api/admin/accommodations/${accId}`, {
                    method: "DELETE",
                });
                if (res.ok) {
                    toast.success("Accommodation deleted successfully");
                    fetchAccommodations();
                } else {
                    const data = await res.json();
                    toast.error(data.error || "Failed to delete accommodation");
                }
            }
        });
    };

    const handleDeleteProvider = (providerId: string, companyName: string) => {
        setConfirmation({
            isOpen: true,
            title: "Delete Provider",
            message: `Are you sure you want to delete provider "${companyName}" and ALL their accommodations? This action cannot be undone.`,
            variant: "danger",
            confirmLabel: "Delete Provider",
            onConfirm: async () => {
                const res = await fetch(`/api/admin/providers/${providerId}`, {
                    method: "DELETE",
                });
                if (res.ok) {
                    toast.success("Provider deleted successfully");
                    fetchAccommodations();
                } else {
                    const data = await res.json();
                    toast.error(data.error || "Failed to delete provider");
                }
            }
        });
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
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: "Providers", value: providers.length },
                    { label: "Accommodations", value: totalAccommodations },
                    { label: "Total Bookings", value: totalBookings },
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
                    placeholder="Search providers or accommodations..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>

            {/* Providers */}
            <div className="space-y-4">
                {filteredProviders.map((provider) => (
                    <div key={provider.provider_id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <button
                            onClick={() => toggleProvider(provider.provider_id)}
                            className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold">
                                    {provider.company_name.charAt(0)}
                                </div>
                                <div className="text-left">
                                    <p className="font-semibold text-gray-900">{provider.company_name}</p>
                                    <p className="text-sm text-gray-500">{provider.user.name} • {provider.accommodations.length} listings</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteProvider(provider.provider_id, provider.company_name);
                                    }}
                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete Provider"
                                >
                                    <Trash2 size={18} />
                                </button>
                                {expandedProviders.has(provider.provider_id) ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                            </div>
                        </button>

                        {expandedProviders.has(provider.provider_id) && provider.accommodations.length > 0 && (
                            <div className="border-t border-gray-100">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="px-5 py-3 text-left text-sm font-medium text-gray-500">Name</th>
                                            <th className="px-5 py-3 text-left text-sm font-medium text-gray-500">Location</th>
                                            <th className="px-5 py-3 text-left text-sm font-medium text-gray-500">Price</th>
                                            <th className="px-5 py-3 text-left text-sm font-medium text-gray-500">Rating</th>
                                            <th className="px-5 py-3 text-right text-sm font-medium text-gray-500">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {provider.accommodations.map((acc) => (
                                            <tr key={acc.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-5 py-3 font-medium text-gray-900">{acc.name}</td>
                                                <td className="px-5 py-3 text-gray-600 flex items-center gap-1">
                                                    <MapPin size={14} className="text-gray-400" />
                                                    {acc.district}
                                                </td>
                                                <td className="px-5 py-3 text-gray-600">
                                                    {acc.price_range_min && acc.price_range_max
                                                        ? `LKR ${acc.price_range_min.toLocaleString()} - ${acc.price_range_max.toLocaleString()}`
                                                        : "—"}
                                                </td>
                                                <td className="px-5 py-3">
                                                    {acc.rating ? (
                                                        <span className="flex items-center gap-1">
                                                            <Star size={14} className="text-amber-500 fill-amber-500" />
                                                            {acc.rating.toFixed(1)}
                                                        </span>
                                                    ) : "—"}
                                                </td>
                                                <td className="px-5 py-3 text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <button
                                                            onClick={() => setSelectedAccommodation(acc)}
                                                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                            title="View Details"
                                                        >
                                                            <Eye size={18} />
                                                        </button>
                                                        <a
                                                            href={`/accommodations/${acc.id}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="View on Site"
                                                        >
                                                            <ExternalLink size={18} />
                                                        </a>
                                                        <button
                                                            onClick={() => handleDeleteAccommodation(acc.id, acc.name)}
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
                            </div>
                        )}
                    </div>
                ))}

                {filteredProviders.length === 0 && (
                    <div className="py-16 text-center text-gray-500 bg-white rounded-2xl shadow-sm border border-gray-100">
                        No providers found
                    </div>
                )}
            </div>

            {/* Modal */}
            {selectedAccommodation && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedAccommodation(null)}>
                    <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900">{selectedAccommodation.name}</h3>
                            <button onClick={() => setSelectedAccommodation(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center gap-2 text-gray-600">
                                <MapPin size={16} />
                                {selectedAccommodation.district}
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-2">Types</p>
                                <div className="flex gap-2 flex-wrap">
                                    {selectedAccommodation.type.map((t, i) => (
                                        <span key={i} className="px-3 py-1 bg-gray-100 rounded-full text-sm">{t}</span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-2">Amenities</p>
                                <div className="flex gap-2 flex-wrap">
                                    {selectedAccommodation.amenities.map((a, i) => (
                                        <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm">{a}</span>
                                    ))}
                                </div>
                            </div>
                            {selectedAccommodation.images.length > 0 && (
                                <div className="grid grid-cols-3 gap-2">
                                    {selectedAccommodation.images.slice(0, 6).map((img, i) => (
                                        <img key={i} src={img} alt="" className="w-full h-20 object-cover rounded-lg" />
                                    ))}
                                </div>
                            )}
                            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                                <div>
                                    <p className="text-sm text-gray-500">Price Range</p>
                                    <p className="font-semibold text-sm">
                                        {selectedAccommodation.price_range_min && selectedAccommodation.price_range_max
                                            ? `LKR ${selectedAccommodation.price_range_min.toLocaleString()} - ${selectedAccommodation.price_range_max.toLocaleString()}`
                                            : "—"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Rating</p>
                                    <p className="font-semibold">{selectedAccommodation.rating?.toFixed(1) || "—"}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Bookings</p>
                                    <p className="font-semibold">{selectedAccommodation._count.bookings}</p>
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
