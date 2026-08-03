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

    if (loading) return <div className="p-10 text-muted-foreground">Loading...</div>;

    return (
        <div className="p-10 max-w-4xl mx-auto">
            <h1 className="font-heading text-2xl font-bold text-foreground mb-6">Manage Users</h1>

            <div className="border border-border bg-card rounded-lg overflow-x-auto">
                <table className="w-full border-collapse min-w-[600px]">
                    <thead>
                        <tr className="border-b border-border text-left text-sm text-muted-foreground bg-muted/50">
                            <th className="p-3 font-medium">Name</th>
                            <th className="p-3 font-medium">Email</th>
                            <th className="p-3 font-medium">Role</th>
                            <th className="p-3 font-medium">Plan</th>
                            <th className="p-3 font-medium">Joined</th>
                            <th className="p-3 font-medium">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="border-b border-border last:border-0 text-sm">
                                <td className="p-3 text-foreground">{user.fullName}</td>
                                <td className="p-3 text-foreground">{user.email}</td>
                                <td className="p-3 text-foreground">{user.role}</td>
                                <td className="p-3">
                                    <span
                                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${user.subscriptionTier === "PRO"
                                            ? "bg-primary/15 text-primary"
                                            : "bg-muted text-muted-foreground"
                                            }`}
                                    >
                                        {user.subscriptionTier}
                                    </span>
                                </td>
                                <td className="p-3 text-muted-foreground">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </td>
                                <td className="p-3">
                                    <button
                                        onClick={() => handleToggleTier(user.id, user.subscriptionTier)}
                                        className="text-primary hover:underline text-xs font-medium"
                                    >
                                        {user.subscriptionTier === "PRO" ? "Downgrade to Free" : "Upgrade to Pro"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}