"use client";

import { Accommodation } from "./types";
import { Plus, ImageIcon, Pencil, Trash2, Star, AlertCircle, CalendarX } from "lucide-react";

interface AccommodationsSectionProps {
    accommodations: Accommodation[];
    onAdd: () => void;
    onEdit: (acc: Accommodation) => void;
    onDelete: (id: string) => void;
    onManageImages: (acc: Accommodation) => void;
    onManageAvailability: (acc: Accommodation) => void;
}

export default function AccommodationsSection({
    accommodations,
    onAdd,
    onEdit,
    onDelete,
    onManageImages,
    onManageAvailability
}: AccommodationsSectionProps) {
    return (
        <div className="bg-white rounded-xl border border-gray-200">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">My Accommodations</h2>
                <button
                    onClick={onAdd}
                    className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
                >
                    <Plus size={16} />
                    Add New
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200 bg-gray-50">
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">District</th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Price Range</th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Booking Price</th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                            <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {accommodations.map((acc) => (
                            <tr key={acc.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <span className="font-medium text-gray-900">{acc.name}</span>
                                </td>
                                <td className="px-6 py-4 text-gray-600">{acc.district}</td>
                                <td className="px-6 py-4">
                                    <span className="text-gray-900">
                                        Rs {acc.price_range_min.toLocaleString()} - Rs {acc.price_range_max.toLocaleString()}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {acc.booking_price ? (
                                        <span className="font-medium text-emerald-600">
                                            Rs {acc.booking_price.toLocaleString()}
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1 text-amber-600 text-sm">
                                            <AlertCircle size={14} />
                                            Not set
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    {acc.rating && acc.rating > 0 ? (
                                        <div className="flex items-center gap-1">
                                            <Star size={14} className="text-amber-400 fill-amber-400" />
                                            <span className="font-medium text-gray-900">{acc.rating.toFixed(1)}</span>
                                        </div>
                                    ) : (
                                        <span className="text-gray-400 text-sm">No ratings</span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => onManageAvailability(acc)}
                                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Manage Availability"
                                        >
                                            <CalendarX size={16} />
                                        </button>
                                        <button
                                            onClick={() => onManageImages(acc)}
                                            className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                            title="Manage Images"
                                        >
                                            <ImageIcon size={16} />
                                        </button>
                                        <button
                                            onClick={() => onEdit(acc)}
                                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <button
                                            onClick={() => onDelete(acc.id)}
                                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {accommodations.length === 0 && (
                    <div className="py-16 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ImageIcon size={24} className="text-gray-400" />
                        </div>
                        <p className="text-gray-900 font-medium mb-1">No accommodations yet</p>
                        <p className="text-gray-500 text-sm">Add your first accommodation to get started</p>
                    </div>
                )}
            </div>
        </div>
    );
}
