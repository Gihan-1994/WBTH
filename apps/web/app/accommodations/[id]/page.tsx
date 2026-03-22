"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Home } from "lucide-react";
import { TemplateWrapper } from "@/components/accommodation-templates";
import { AccommodationData } from "@/components/accommodation-templates/types";

export default function AccommodationDetailsPage() {
    const params = useParams();
    const id = params.id as string;
    const [accommodation, setAccommodation] = useState<AccommodationData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAccommodation = async () => {
            try {
                const res = await fetch(`/api/accommodations/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setAccommodation(data);
                }
            } catch (error) {
                console.error("Failed to fetch accommodation", error);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchAccommodation();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-2 border-indigo-600 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading...</p>
                </div>
            </div>
        );
    }

    if (!accommodation) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center px-4">
                <div className="text-center max-w-sm">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Home size={28} className="text-gray-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Accommodation not found</h2>
                    <p className="text-gray-500 mb-6">This accommodation may have been removed or doesn't exist.</p>
                    <Link
                        href="/accommodations"
                        className="inline-flex items-center gap-2 text-indigo-600 font-medium hover:underline"
                    >
                        ← Back to accommodations
                    </Link>
                </div>
            </div>
        );
    }

    return <TemplateWrapper accommodation={accommodation} />;
}
