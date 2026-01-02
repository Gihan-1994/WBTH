"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";

/**
 * One-time admin registration page
 */
export default function AdminRegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [checkingAdmin, setCheckingAdmin] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        contact_no: "",
    });

    useEffect(() => {
        checkAdminExists();
    }, []);

    const checkAdminExists = async () => {
        try {
            const response = await fetch("/api/admin/check-exists");
            if (response.ok) {
                const data = await response.json();
                if (data.exists) {
                    alert("Admin already exists. Redirecting to login...");
                    router.push("/login");
                }
            }
        } catch (error) {
            console.error("Error checking admin existence:", error);
        } finally {
            setCheckingAdmin(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        if (formData.password.length < 6) {
            alert("Password must be at least 6 characters");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch("/api/admin/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    contact_no: formData.contact_no || null,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert("Admin registered successfully! Logging you in...");

                // Auto-login
                const result = await signIn("credentials", {
                    email: formData.email,
                    password: formData.password,
                    redirect: false,
                });

                if (result?.ok) {
                    router.push("/dashboard/admin");
                } else {
                    alert("Registration successful but login failed. Please login manually.");
                    router.push("/login");
                }
            } else {
                alert(data.error || "Failed to register admin");
            }
        } catch (error) {
            console.error("Error registering admin:", error);
            alert("Failed to register admin");
        } finally {
            setLoading(false);
        }
    };

    if (checkingAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-pink-50 to-purple-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-pink-50 to-purple-50 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
                <div className="flex items-center justify-center mb-6">
                    <div className="bg-gradient-to-r from-red-500 to-pink-600 p-4 rounded-2xl">
                        <Shield className="text-white" size={40} />
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                    Admin Registration
                </h1>
                <p className="text-center text-gray-600 mb-6">
                    One-time setup for system administrator
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Full Name *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                            placeholder="Enter your name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Email *
                        </label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                            placeholder="admin@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Contact Number
                        </label>
                        <input
                            type="tel"
                            value={formData.contact_no}
                            onChange={(e) => setFormData({ ...formData, contact_no: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                            placeholder="0771234567"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Password *
                        </label>
                        <input
                            type="password"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                            placeholder="Minimum 6 characters"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Confirm Password *
                        </label>
                        <input
                            type="password"
                            required
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                            placeholder="Re-enter password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:from-red-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Registering..." : "Register as Admin"}
                    </button>
                </form>

                <Link
                    href="/"
                    className="mt-6 flex items-center justify-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                    <ArrowLeft size={18} />
                    Back to Home
                </Link>
            </div>
        </div>
    );
}
