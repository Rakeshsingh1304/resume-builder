"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

interface Resume {
    id: string;
    title: string;
    updatedAt: string;
    atsScore: number | null;
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
        <div className="p-4 md:p-10 max-w-3xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
                <div>
                    <h1 className="font-heading text-3xl font-bold text-foreground">My Resumes</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Build, refine, and share your professional story.
                    </p>
                </div>
                <button
                    onClick={handleCreateResume}
                    disabled={creating}
                    className="bg-primary text-primary-foreground px-4 py-2.5 rounded-md text-sm font-medium hover:opacity-90 transition disabled:opacity-50 w-full sm:w-auto"
                >
                    {creating ? "Creating..." : "+ New Resume"}
                </button>
            </div>

            {loading ? (
                <p className="text-muted-foreground text-sm">Loading...</p>
            ) : resumes.length === 0 ? (
                <div className="border border-dashed border-border rounded-lg p-10 text-center">
                    <p className="text-muted-foreground text-sm">
                        No resumes yet. Click "New Resume" to create your first one.
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {resumes.map((resume) => (
                        <Link
                            href={`/resumes/${resume.id}`}
                            key={resume.id}
                            className="border border-border bg-card rounded-lg p-5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 hover:border-primary/50 transition"
                        >
                            <div>
                                <p className="font-heading font-semibold text-foreground">{resume.title}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Last updated: {new Date(resume.updatedAt).toLocaleDateString()}
                                </p>
                            </div>
                            {resume.atsScore !== null && (
                                <div className="text-right">
                                    <p className="text-xs text-muted-foreground">ATS Score</p>
                                    <p className="font-heading font-bold text-primary">{resume.atsScore}/100</p>
                                </div>
                            )}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}