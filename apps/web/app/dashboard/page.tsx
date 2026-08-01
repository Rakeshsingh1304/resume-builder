"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

interface Resume {
    id: string;
    title: string;
    updatedAt: string;
}

export default function DashboardPage() {
    const { getToken } = useAuth();
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);

    async function loadResumes() {
        setLoading(true);
        const token = await getToken();
        const data = await apiFetch("/api/resumes", token);
        setResumes(data);
        setLoading(false);
    }

    useEffect(() => {
        loadResumes();
    }, []);

    async function handleCreateResume() {
        setCreating(true);
        const token = await getToken();
        await apiFetch("/api/resumes", token, {
            method: "POST",
            body: JSON.stringify({ title: "Untitled Resume" }),
        });
        await loadResumes();
        setCreating(false);
    }

    return (
        <div className="p-8 max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">My Resumes</h1>
                <button
                    onClick={handleCreateResume}
                    disabled={creating}
                    className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
                >
                    {creating ? "Creating..." : "+ New Resume"}
                </button>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : resumes.length === 0 ? (
                <p className="text-gray-500">
                    No resumes yet. Click "New Resume" to create your first one.
                </p>
            ) : (
                <div className="space-y-3">
                    {resumes.map((resume) => (
                        <div
                            key={resume.id}
                            className="border rounded p-4 flex justify-between items-center"
                        >
                            <div>
                                <p className="font-medium">{resume.title}</p>
                                <p className="text-sm text-gray-500">
                                    Last updated: {new Date(resume.updatedAt).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}