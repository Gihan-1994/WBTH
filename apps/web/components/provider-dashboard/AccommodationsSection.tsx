"use client";

import { Accommodation } from "./types";

interface AccommodationsSectionProps {
    accommodations: Accommodation[];
    onAdd: () => void;
    onEdit: (acc: Accommodation) => void;
    onDelete: (id: string) => void;
    onManageImages: (acc: Accommodation) => void;
}

export default function AccommodationsSection({
    accommodations,
    onAdd,
    onEdit,
    onDelete,
    onManageImages
}: AccommodationsSectionProps) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">🏨 My Accommodations</h2>
                <button
                    onClick={onAdd}
                    className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 rounded-xl font-semibold hover:from-green-700 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg text-sm flex items-center gap-1"
                >
                    ➕ Add New
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="text-left border-b-2 border-gray-200">
                            <th className="pb-4 font-semibold text-gray-700">Name</th>
                            <th className="pb-4 font-semibold text-gray-700">District</th>
                            <th className="pb-4 font-semibold text-gray-700">Price Range</th>
                            <th className="pb-4 font-semibold text-gray-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {accommodations.map((acc) => (
                            <tr key={acc.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                                <td className="py-3 font-medium">{acc.name}</td>
                                <td className="py-3">{acc.district}</td>
                                <td className="py-3">
                                    <span className="font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                                        ${acc.price_range_min} - ${acc.price_range_max}
                                    </span>
                                </td>
                                <td className="py-3">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => onManageImages(acc)}
                                            className="text-purple-600 hover:text-purple-800 font-medium text-sm transition-colors"
                                        >
                                            🖼️ Images
                                        </button>
                                        <button
                                            onClick={() => onEdit(acc)}
                                            className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                                        >
                                            ✏️ Edit
                                        </button>
                                        <button
                                            onClick={() => onDelete(acc.id)}
                                            className="text-red-600 hover:text-red-800 font-medium text-sm transition-colors"
                                        >
                                            🗑️ Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {accommodations.length === 0 && (
                            <tr>
                                <td colSpan={4} className="py-12 text-center">
                                    <div className="text-6xl mb-4">🏨</div>
                                    <p className="text-xl text-gray-600 font-medium mb-2">No accommodations yet</p>
                                    <p className="text-gray-500">Add your first accommodation to get started!</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
