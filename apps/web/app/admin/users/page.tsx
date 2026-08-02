"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

interface AdminUser {
    id: string;
    email: string;
    fullName: string;
    role: string;
    subscriptionTier: string;
    createdAt: string;
}

export default function AdminUsersPage() {
    const { getToken } = useAuth();
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);

    async function loadUsers() {
        setLoading(true);
        const token = await getToken();
        const data = await apiFetch("/api/admin/users", token);
        setUsers(data);
        setLoading(false);
    }

    useEffect(() => {
        loadUsers();
    }, []);

    async function handleToggleTier(userId: string, currentTier: string) {
        const newTier = currentTier === "PRO" ? "FREE" : "PRO";
        const token = await getToken();
        await apiFetch(`/api/admin/users/${userId}/tier`, token, {
            method: "PATCH",
            body: JSON.stringify({ tier: newTier }),
        });
        await loadUsers();
    }

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Manage Users</h1>

            <table className="w-full border-collapse">
                <thead>
                    <tr className="border-b text-left text-sm text-gray-500">
                        <th className="pb-2">Name</th>
                        <th className="pb-2">Email</th>
                        <th className="pb-2">Role</th>
                        <th className="pb-2">Plan</th>
                        <th className="pb-2">Joined</th>
                        <th className="pb-2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id} className="border-b text-sm">
                            <td className="py-2">{user.fullName}</td>
                            <td className="py-2">{user.email}</td>
                            <td className="py-2">{user.role}</td>
                            <td className="py-2">
                                <span
                                    className={`px-2 py-0.5 rounded text-xs ${user.subscriptionTier === "PRO"
                                            ? "bg-purple-100 text-purple-700"
                                            : "bg-gray-100 text-gray-700"
                                        }`}
                                >
                                    {user.subscriptionTier}
                                </span>
                            </td>
                            <td className="py-2">{new Date(user.createdAt).toLocaleDateString()}</td>
                            <td className="py-2">
                                <button
                                    onClick={() => handleToggleTier(user.id, user.subscriptionTier)}
                                    className="text-blue-600 hover:underline text-xs"
                                >
                                    {user.subscriptionTier === "PRO" ? "Downgrade to Free" : "Upgrade to Pro"}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
