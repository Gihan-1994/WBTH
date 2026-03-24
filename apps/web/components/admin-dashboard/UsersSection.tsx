"use client";

import { useState, useEffect } from "react";
import { Search, Trash2, Users } from "lucide-react";
import { UserData } from "./types";
import { USER_ROLE_LABELS, USER_ROLE_COLORS } from "./constants";
import { useToast } from "@/components/Toast";

export default function UsersSection() {
    const toast = useToast();
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("");

    useEffect(() => {
        fetchUsers();
    }, [roleFilter]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (roleFilter) params.append("role", roleFilter);
            if (search) params.append("search", search);

            const response = await fetch(`/api/admin/users?${params}`);
            if (response.ok) {
                const data = await response.json();
                setUsers(data.users);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => fetchUsers();

    const handleDelete = async (userId: string) => {
        if (!confirm("Are you sure you want to delete this user?")) return;
        try {
            const response = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
            if (response.ok) {
                toast.success("User deleted successfully");
                fetchUsers();
            } else {
                const data = await response.json();
                toast.error(data.error || "Failed to delete user");
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            toast.error("Failed to delete user");
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
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                </div>
                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <option value="">All Roles</option>
                    {Object.entries(USER_ROLE_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                    ))}
                </select>
                <button
                    onClick={handleSearch}
                    className="px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
                >
                    Search
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-100">
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Name</th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Email</th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Role</th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Contact</th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Joined</th>
                            <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                                <td className="px-6 py-4 text-gray-600">{user.email}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${USER_ROLE_COLORS[user.role]}`}>
                                        {USER_ROLE_LABELS[user.role]}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-600">{user.contact_no || "—"}</td>
                                <td className="px-6 py-4 text-gray-600">{new Date(user.created_at).toLocaleDateString()}</td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => handleDelete(user.id)}
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {users.length === 0 && (
                    <div className="py-16 text-center">
                        <Users className="mx-auto text-gray-300 mb-4" size={40} />
                        <p className="text-gray-500">No users found</p>
                    </div>
                )}
            </div>
        </div>
    );
}
