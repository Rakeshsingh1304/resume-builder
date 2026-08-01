"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/api";

interface PersonalInfo {
    fullName?: string;
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
}

interface ResumeContent {
    personalInfo?: PersonalInfo;
}

interface Resume {
    id: string;
    title: string;
    content: ResumeContent;
}

export default function ResumeBuilderPage() {
    const { id } = useParams<{ id: string }>();
    const { getToken } = useAuth();
    const [resume, setResume] = useState<Resume | null>(null);
    const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        async function load() {
            const token = await getToken();
            const data = await apiFetch(`/api/resumes/${id}`, token);
            setResume(data);
            setPersonalInfo(data.content?.personalInfo || {});
            setLoading(false);
        }
        load();
    }, [id]);

    function updateField(field: keyof PersonalInfo, value: string) {
        setPersonalInfo((prev) => ({ ...prev, [field]: value }));
    }

    async function handleSave() {
        setSaving(true);
        const token = await getToken();
        const updatedContent = { ...resume?.content, personalInfo };
        await apiFetch(`/api/resumes/${id}`, token, {
            method: "PATCH",
            body: JSON.stringify({ content: updatedContent }),
        });
        setSaving(false);
    }

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">{resume?.title}</h1>

            <div className="space-y-4 border rounded p-6">
                <h2 className="text-lg font-semibold">Personal Information</h2>

                <div>
                    <label className="block text-sm font-medium mb-1">Full Name</label>
                    <input
                        type="text"
                        value={personalInfo.fullName || ""}
                        onChange={(e) => updateField("fullName", e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        placeholder="John Doe"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                        type="email"
                        value={personalInfo.email || ""}
                        onChange={(e) => updateField("email", e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        placeholder="john@example.com"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Phone</label>
                    <input
                        type="text"
                        value={personalInfo.phone || ""}
                        onChange={(e) => updateField("phone", e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        placeholder="+91 98765 43210"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Location</label>
                    <input
                        type="text"
                        value={personalInfo.location || ""}
                        onChange={(e) => updateField("location", e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        placeholder="Surat, India"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">LinkedIn</label>
                    <input
                        type="text"
                        value={personalInfo.linkedin || ""}
                        onChange={(e) => updateField("linkedin", e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        placeholder="linkedin.com/in/johndoe"
                    />
                </div>

                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
                >
                    {saving ? "Saving..." : "Save"}
                </button>
            </div>
        </div>
    );
}