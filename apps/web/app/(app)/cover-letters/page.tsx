"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

interface CoverLetter {
    id: string;
    jobTitle: string;
    companyName: string;
    createdAt: string;
}

export default function CoverLettersPage() {
    const { getToken } = useAuth();
    const [letters, setLetters] = useState<CoverLetter[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [jobTitle, setJobTitle] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [generating, setGenerating] = useState(false);

    async function loadLetters() {
        setLoading(true);
        const token = await getToken();
        const data = await apiFetch("/api/cover-letters", token);
        setLetters(data);
        setLoading(false);
    }

    useEffect(() => {
        loadLetters();
    }, []);

    async function handleGenerate() {
        if (!jobTitle || !companyName) {
            alert("Please fill in both Job Title and Company Name.");
            return;
        }
        setGenerating(true);
        const token = await getToken();
        try {
            await apiFetch("/api/cover-letters/generate", token, {
                method: "POST",
                body: JSON.stringify({ jobTitle, companyName }),
            });
            setJobTitle("");
            setCompanyName("");
            setShowForm(false);
            await loadLetters();
        } catch (err: any) {
            alert(err.message || "Failed to generate cover letter.");
        } finally {
            setGenerating(false);
        }
    }

    return (
        <div className="p-10 max-w-3xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
                <div>
                    <h1 className="font-heading text-3xl font-bold text-foreground">Cover Letters</h1>
                    <p className="text-muted-foreground text-sm mt-1">Tailored letters, generated in seconds.</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-primary text-primary-foreground px-4 py-2.5 rounded-md text-sm font-medium hover:opacity-90 w-full sm:w-auto whitespace-nowrap"
                >
                    + New Cover Letter
                </button>
            </div>

            {showForm && (
                <div className="border border-border bg-card rounded-lg p-6 mb-6 space-y-3">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-foreground">Job Title</label>
                        <input
                            type="text"
                            value={jobTitle}
                            onChange={(e) => setJobTitle(e.target.value)}
                            className="w-full border border-border rounded-md px-3 py-2 bg-background"
                            placeholder="Frontend Developer"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-foreground">Company Name</label>
                        <input
                            type="text"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            className="w-full border border-border rounded-md px-3 py-2 bg-background"
                            placeholder="Google"
                        />
                    </div>
                    <button
                        onClick={handleGenerate}
                        disabled={generating}
                        className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 disabled:opacity-50"
                    >
                        {generating ? "Generating..." : "✨ Generate with AI"}
                    </button>
                </div>
            )}

            {loading ? (
                <p className="text-muted-foreground text-sm">Loading...</p>
            ) : letters.length === 0 ? (
                <div className="border border-dashed border-border rounded-lg p-10 text-center">
                    <p className="text-muted-foreground text-sm">No cover letters yet.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {letters.map((letter) => (
                        <Link
                            href={`/cover-letters/${letter.id}`}
                            key={letter.id}
                            className="border border-border bg-card rounded-lg p-5 flex justify-between items-center hover:border-primary/50 transition block"
                        >
                            <div>
                                <p className="font-heading font-semibold text-foreground">
                                    {letter.jobTitle} at {letter.companyName}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Created: {new Date(letter.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}