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
        <div className="p-8 max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Cover Letters</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-black text-white px-4 py-2 rounded"
                >
                    + New Cover Letter
                </button>
            </div>

            {showForm && (
                <div className="border rounded p-4 mb-6 space-y-3">
                    <div>
                        <label className="block text-sm font-medium mb-1">Job Title</label>
                        <input
                            type="text"
                            value={jobTitle}
                            onChange={(e) => setJobTitle(e.target.value)}
                            className="w-full border rounded px-3 py-2"
                            placeholder="Frontend Developer"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Company Name</label>
                        <input
                            type="text"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            className="w-full border rounded px-3 py-2"
                            placeholder="Google"
                        />
                    </div>
                    <button
                        onClick={handleGenerate}
                        disabled={generating}
                        className="bg-purple-600 text-white px-4 py-2 rounded disabled:opacity-50"
                    >
                        {generating ? "Generating..." : "✨ Generate with AI"}
                    </button>
                </div>
            )}

            {loading ? (
                <p>Loading...</p>
            ) : letters.length === 0 ? (
                <p className="text-gray-500">No cover letters yet.</p>
            ) : (
                <div className="space-y-3">
                    {letters.map((letter) => (
                        <Link
                            href={`/cover-letters/${letter.id}`}
                            key={letter.id}
                            className="border rounded p-4 flex justify-between items-center hover:bg-gray-50 block"
                        >
                            <div>
                                <p className="font-medium">
                                    {letter.jobTitle} at {letter.companyName}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Created: {new Date(letter.createdAt).toLocaleString()}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}