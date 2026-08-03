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

    if (loading) return <div className="p-10 text-muted-foreground">Loading...</div>;

    return (
        <div className="p-10 max-w-2xl mx-auto">
            <h1 className="font-heading text-2xl font-bold text-foreground mb-1">
                {jobTitle} at {companyName}
            </h1>
            <p className="text-muted-foreground text-sm mb-6">Edit your cover letter below</p>

            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full border border-border rounded-lg px-4 py-3 h-96 font-serif bg-card"
            />

            <div className="flex gap-3 mt-4">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-primary text-primary-foreground px-4 py-2.5 rounded-md text-sm font-medium hover:opacity-90 disabled:opacity-50"
                >
                    {saving ? "Saving..." : "Save"}
                </button>
                <button
                    onClick={handleCopy}
                    className="bg-card border border-border px-4 py-2.5 rounded-md text-sm font-medium hover:bg-muted"
                >
                    📋 Copy to Clipboard
                </button>
            </div>
        </div>
    );
}