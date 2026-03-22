"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Plane, Compass, Building2, ChevronDown, Check } from "lucide-react";

interface Profile {
    id: string;
    label: string;
    icon: React.ElementType;
    href: string;
    roles: string[];
}

const profiles: Profile[] = [
    {
        id: "tourist",
        label: "Tourist",
        icon: Plane,
        href: "/dashboard/tourist",
        roles: ["tourist", "guide", "accommodation_provider", "admin"],
    },
    {
        id: "guide",
        label: "Guide",
        icon: Compass,
        href: "/dashboard/guide",
        roles: ["guide"],
    },
    {
        id: "provider",
        label: "Provider",
        icon: Building2,
        href: "/dashboard/provider",
        roles: ["accommodation_provider"],
    },
];

interface ProfileSwitcherProps {
    currentProfile: "tourist" | "guide" | "provider";
}

export default function ProfileSwitcher({ currentProfile }: ProfileSwitcherProps) {
    const router = useRouter();
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);

    const userRole = (session?.user as any)?.role || "tourist";

    const availableProfiles = profiles.filter((p) =>
        p.roles.includes(userRole)
    );

    // Don't show switcher if only one profile available
    if (availableProfiles.length <= 1) {
        return null;
    }

    const current = profiles.find((p) => p.id === currentProfile);
    const CurrentIcon = current?.icon || Plane;

    const handleSwitch = (profile: Profile) => {
        setIsOpen(false);
        if (profile.id !== currentProfile) {
            router.push(profile.href);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
                <CurrentIcon size={16} />
                <span className="hidden sm:inline">{current?.label}</span>
                <ChevronDown size={14} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                        <div className="px-3 py-2 border-b border-gray-100">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Switch Profile
                            </p>
                        </div>
                        {availableProfiles.map((profile) => {
                            const Icon = profile.icon;
                            const isActive = profile.id === currentProfile;
                            return (
                                <button
                                    key={profile.id}
                                    onClick={() => handleSwitch(profile)}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-colors ${
                                        isActive
                                            ? "bg-blue-50 text-blue-700"
                                            : "text-gray-700 hover:bg-gray-50"
                                    }`}
                                >
                                    <Icon size={18} />
                                    <span className="flex-1 text-left font-medium">{profile.label}</span>
                                    {isActive && <Check size={16} className="text-blue-600" />}
                                </button>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}
