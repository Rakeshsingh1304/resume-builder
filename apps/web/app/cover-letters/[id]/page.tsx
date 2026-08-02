"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function CoverLetterDetailPage() {
    const { id } = useParams<{ id: string }>();
    const { getToken } = useAuth();
    const [jobTitle, setJobTitle] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        async function load() {
            const token = await getToken();
            const data = await apiFetch(`/api/cover-letters/${id}`, token);
            setJobTitle(data.jobTitle);
            setCompanyName(data.companyName);
            setContent(data.content);
            setLoading(false);
        }
        load();
    }, [id]);

    async function handleSave() {
        setSaving(true);
        const token = await getToken();
        await apiFetch(`/api/cover-letters/${id}`, token, {
            method: "PATCH",
            body: JSON.stringify({ content }),
        });
        setSaving(false);
    }

    function handleCopy() {
        navigator.clipboard.writeText(content);
        alert("Copied to clipboard!");
    }

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-1">
                {jobTitle} at {companyName}
            </h1>
            <p className="text-gray-500 text-sm mb-6">Edit your cover letter below</p>

            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full border rounded px-4 py-3 h-96 font-serif"
            />

            <div className="flex gap-3 mt-4">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
                >
                    {saving ? "Saving..." : "Save"}
                </button>
                <button
                    onClick={handleCopy}
                    className="bg-white border border-gray-300 px-4 py-2 rounded hover:bg-gray-50"
                >
                    📋 Copy to Clipboard
                </button>
            </div>
        </div>
    );
}