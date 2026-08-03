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
        return <div className="p-10 text-destructive">{error}</div>;
    }

    if (!overview) return <div className="p-10 text-muted-foreground">Loading...</div>;

    const stats = [
        { label: "Total Users", value: overview.totalUsers },
        { label: "Pro Users", value: overview.proUsers },
        { label: "Total Resumes", value: overview.totalResumes },
        { label: "Cover Letters", value: overview.totalCoverLetters },
    ];

    return (
        <div className="p-10 max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-8">
                <h1 className="font-heading text-3xl font-bold text-foreground">Admin Dashboard</h1>
                <Link href="/admin/users" className="text-sm text-primary hover:underline font-medium whitespace-nowrap">
                    Manage Users →
                </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <div key={stat.label} className="border border-border bg-card rounded-lg p-5">
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className="font-heading text-3xl font-bold text-foreground mt-1">{stat.value}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}