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

interface ExperienceEntry {
    id: string;
    company?: string;
    role?: string;
    startDate?: string;
    endDate?: string;
    currentlyWorking?: boolean;
    description?: string;
}

interface ResumeContent {
    personalInfo?: PersonalInfo;
    experience?: ExperienceEntry[];
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
    const [experience, setExperience] = useState<ExperienceEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        async function load() {
            const token = await getToken();
            const data = await apiFetch(`/api/resumes/${id}`, token);
            setResume(data);
            setPersonalInfo(data.content?.personalInfo || {});
            setExperience(data.content?.experience || []);
            setLoading(false);
        }
        load();
    }, [id]);

    function updateField(field: keyof PersonalInfo, value: string) {
        setPersonalInfo((prev) => ({ ...prev, [field]: value }));
    }

    function addExperience() {
        setExperience((prev) => [
            ...prev,
            {
                id: crypto.randomUUID(),
                company: "",
                role: "",
                startDate: "",
                endDate: "",
                currentlyWorking: false,
                description: "",
            },
        ]);
    }

    function updateExperience(
        entryId: string,
        field: keyof ExperienceEntry,
        value: string | boolean
    ) {
        setExperience((prev) =>
            prev.map((entry) =>
                entry.id === entryId ? { ...entry, [field]: value } : entry
            )
        );
    }

    function removeExperience(entryId: string) {
        setExperience((prev) => prev.filter((entry) => entry.id !== entryId));
    }

    async function handleSave() {
        setSaving(true);
        const token = await getToken();
        const updatedContent = { ...resume?.content, personalInfo, experience };
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

            </div>

            <div className="space-y-4 border rounded p-6 mt-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Work Experience</h2>
                    <button
                        onClick={addExperience}
                        className="text-sm text-blue-600 hover:underline"
                    >
                        + Add Experience
                    </button>
                </div>

                {experience.length === 0 && (
                    <p className="text-gray-500 text-sm">No experience added yet.</p>
                )}

                {experience.map((entry) => (
                    <div key={entry.id} className="border rounded p-4 space-y-3 relative">
                        <button
                            onClick={() => removeExperience(entry.id)}
                            className="absolute top-3 right-3 text-red-500 text-sm hover:underline"
                        >
                            Remove
                        </button>

                        <div>
                            <label className="block text-sm font-medium mb-1">Company</label>
                            <input
                                type="text"
                                value={entry.company || ""}
                                onChange={(e) => updateExperience(entry.id, "company", e.target.value)}
                                className="w-full border rounded px-3 py-2"
                                placeholder="Google"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Job Title</label>
                            <input
                                type="text"
                                value={entry.role || ""}
                                onChange={(e) => updateExperience(entry.id, "role", e.target.value)}
                                className="w-full border rounded px-3 py-2"
                                placeholder="Software Engineer"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium mb-1">Start Date</label>
                                <input
                                    type="month"
                                    value={entry.startDate || ""}
                                    onChange={(e) => updateExperience(entry.id, "startDate", e.target.value)}
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">End Date</label>
                                <input
                                    type="month"
                                    value={entry.endDate || ""}
                                    disabled={entry.currentlyWorking}
                                    onChange={(e) => updateExperience(entry.id, "endDate", e.target.value)}
                                    className="w-full border rounded px-3 py-2 disabled:bg-gray-100"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={entry.currentlyWorking || false}
                                onChange={(e) =>
                                    updateExperience(entry.id, "currentlyWorking", e.target.checked)
                                }
                            />
                            <label className="text-sm">I currently work here</label>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <textarea
                                value={entry.description || ""}
                                onChange={(e) => updateExperience(entry.id, "description", e.target.value)}
                                className="w-full border rounded px-3 py-2 h-24"
                                placeholder="Describe your responsibilities and achievements..."
                            />
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={handleSave}
                disabled={saving}
                className="bg-black text-white px-4 py-2 rounded disabled:opacity-50 mt-6"
            >
                {saving ? "Saving..." : "Save"}
            </button>
        </div>
    );
}