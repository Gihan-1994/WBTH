"use client";

import Link from "next/link";
import { Home, LogOut, Waves } from "lucide-react";
import { signOut } from "next-auth/react";

interface AdminHeaderProps {
    adminName: string;
}

export default function AdminHeader({ adminName }: AdminHeaderProps) {
    const handleLogout = async () => {
        await signOut({ callbackUrl: "/" });
    };

    return (
        <header
            className="relative"
            style={{
                backgroundImage:
                    "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/95 via-purple-900/90 to-indigo-900/95" />

            <div className="relative z-10">
                {/* Top Bar */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
                                <Waves className="text-white" size={20} />
                            </div>
                            <span className="text-white font-bold text-lg">
                                Tourism Hub
                                <span className="ml-2 text-xs bg-white/20 px-2 py-0.5 rounded-full">
                                    Admin
                                </span>
                            </span>
                        </Link>

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                            <Link
                                href="/"
                                className="flex items-center gap-2 text-white/80 hover:text-white px-4 py-2 rounded-full hover:bg-white/10 transition-all"
                            >
                                <Home size={18} />
                                <span className="hidden sm:inline">Home</span>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-4 py-2 rounded-full hover:bg-white/20 transition-all"
                            >
                                <LogOut size={18} />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Welcome Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <p className="text-indigo-300 text-sm uppercase tracking-widest mb-2">
                        Welcome back
                    </p>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        {adminName}
                    </h1>
                    <p className="text-white/70 text-lg max-w-xl">
                        Manage your platform, monitor analytics, and keep everything running smoothly.
                    </p>
                </div>
            </div>
        </header>
    );
}
