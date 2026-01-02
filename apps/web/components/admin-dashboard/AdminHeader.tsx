"use client";

import Link from "next/link";
import { Home, LogOut, Shield } from "lucide-react";
import { signOut } from "next-auth/react";

interface AdminHeaderProps {
    adminName: string;
}

/**
 * Admin dashboard header with welcome message and navigation
 */
export default function AdminHeader({ adminName }: AdminHeaderProps) {
    const handleLogout = async () => {
        await signOut({ callbackUrl: "/" });
    };

    return (
        <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white p-6 rounded-2xl shadow-lg mb-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                        <Shield size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                        <p className="text-white/90 mt-1">
                            Welcome back, <span className="font-semibold">{adminName}</span>!
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/"
                        className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-xl transition-all duration-200 flex items-center gap-2 border border-white/30"
                    >
                        <Home size={18} />
                        Home
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-xl transition-all duration-200 flex items-center gap-2 border border-white/30"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}
