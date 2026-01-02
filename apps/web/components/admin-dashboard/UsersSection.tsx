"use client";

import { useState, useEffect } from "react";
import { Search, UserPlus, Edit, Trash2 } from "lucide-react";
import { UserData } from "./types";
import { USER_ROLE_LABELS, USER_ROLE_COLORS } from "./constants";

/**
 * User management section with table, search, and CRUD operations
 */
export default function UsersSection() {
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

    const handleSearch = () => {
        fetchUsers();
    };

    const handleDelete = async (userId: string) => {
        if (!confirm("Are you sure you want to delete this user?")) return;

        try {
            const response = await fetch(`/api/admin/users/${userId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                alert("User deleted successfully");
                fetchUsers();
            } else {
                const data = await response.json();
                alert(data.error || "Failed to delete user");
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            alert("Failed to delete user");
        }
    };

    if (loading) {
        return <div className="text-center py-10">Loading users...</div>;
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 flex-1">
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                        className="flex-1 px-4 py-3 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                        onClick={handleSearch}
                        className="bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition-colors"
                    >
                        <Search size={20} />
                    </button>
                </div>
                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="px-4 py-3 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                    <option value="">All Roles</option>
                    {Object.entries(USER_ROLE_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                    ))}
                </select>
            </div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-purple-50 to-blue-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-base font-semibold text-gray-700">Name</th>
                                <th className="px-6 py-4 text-left text-base font-semibold text-gray-700">Email</th>
                                <th className="px-6 py-4 text-left text-base font-semibold text-gray-700">Role</th>
                                <th className="px-6 py-4 text-left text-base font-semibold text-gray-700">Contact</th>
                                <th className="px-6 py-4 text-left text-base font-semibold text-gray-700">Joined</th>
                                <th className="px-6 py-4 text-center text-base font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-base text-gray-900">{user.name}</td>
                                    <td className="px-6 py-4 text-base text-gray-600">{user.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${USER_ROLE_COLORS[user.role]}`}>
                                            {USER_ROLE_LABELS[user.role]}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-base text-gray-600">{user.contact_no || "N/A"}</td>
                                    <td className="px-6 py-4 text-base text-gray-600">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="text-red-600 hover:text-red-800 transition-colors p-2 hover:bg-red-50 rounded-lg"
                                                title="Delete user"
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
                {users.length === 0 && (
                    <div className="text-center py-10 text-gray-500">
                        No users found
                    </div>
                )}
            </div>
        </div>
    );
}
