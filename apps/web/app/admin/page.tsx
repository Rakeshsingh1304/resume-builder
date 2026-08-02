"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

interface Overview {
    totalUsers: number;
    proUsers: number;
    totalResumes: number;
    totalCoverLetters: number;
}

export default function AdminOverviewPage() {
    const { getToken } = useAuth();
    const [overview, setOverview] = useState<Overview | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        async function load() {
            const token = await getToken();
            try {
                const data = await apiFetch("/api/admin/overview", token);
                setOverview(data);
            } catch (err: any) {
                setError(err.message || "Access denied.");
            }
        }
        load();
    }, []);

    if (error) {
        return <div className="p-8 text-red-600">{error}</div>;
    }

    if (!overview) return <div className="p-8">Loading...</div>;

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <Link href="/admin/users" className="text-sm text-blue-600 hover:underline">
                    Manage Users →
                </Link>
            </div>

            <div className="grid grid-cols-4 gap-4">
                <div className="border rounded p-4">
                    <p className="text-sm text-gray-500">Total Users</p>
                    <p className="text-2xl font-bold">{overview.totalUsers}</p>
                </div>
                <div className="border rounded p-4">
                    <p className="text-sm text-gray-500">Pro Users</p>
                    <p className="text-2xl font-bold">{overview.proUsers}</p>
                </div>
                <div className="border rounded p-4">
                    <p className="text-sm text-gray-500">Total Resumes</p>
                    <p className="text-2xl font-bold">{overview.totalResumes}</p>
                </div>
                <div className="border rounded p-4">
                    <p className="text-sm text-gray-500">Cover Letters</p>
                    <p className="text-2xl font-bold">{overview.totalCoverLetters}</p>
                </div>
            </div>
        </div>
    );
}