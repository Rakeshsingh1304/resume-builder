"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import ResumeTemplate from "@/components/ResumeTemplate";

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

interface EducationEntry {
    id: string;
    institution?: string;
    degree?: string;
    fieldOfStudy?: string;
    startDate?: string;
    endDate?: string;
}

interface ResumeContent {
    personalInfo?: PersonalInfo;
    experience?: ExperienceEntry[];
    education?: EducationEntry[];
    skills?: string[];
    summary?: string;
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
    const [education, setEducation] = useState<EducationEntry[]>([]);
    const [skills, setSkills] = useState<string[]>([]);
    const [skillInput, setSkillInput] = useState("");
    const [summary, setSummary] = useState("");
    const [generatingSummary, setGeneratingSummary] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        async function load() {
            const token = await getToken();
            const data = await apiFetch(`/api/resumes/${id}`, token);
            setResume(data);
            setPersonalInfo(data.content?.personalInfo || {});
            setExperience(data.content?.experience || []);
            setEducation(data.content?.education || []);
            setSkills(data.content?.skills || []);
            setSummary(data.content?.summary || "");
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

    function addEducation() {
        setEducation((prev) => [
            ...prev,
            {
                id: crypto.randomUUID(),
                institution: "",
                degree: "",
                fieldOfStudy: "",
                startDate: "",
                endDate: "",
            },
        ]);
    }

    function updateEducation(
        entryId: string,
        field: keyof EducationEntry,
        value: string
    ) {
        setEducation((prev) =>
            prev.map((entry) =>
                entry.id === entryId ? { ...entry, [field]: value } : entry
            )
        );
    }

    function removeEducation(entryId: string) {
        setEducation((prev) => prev.filter((entry) => entry.id !== entryId));
    }

    function addSkill() {
        const trimmed = skillInput.trim();
        if (trimmed && !skills.includes(trimmed)) {
            setSkills((prev) => [...prev, trimmed]);
        }
        setSkillInput("");
    }

    function removeSkill(skillToRemove: string) {
        setSkills((prev) => prev.filter((s) => s !== skillToRemove));
    }

    function handleSkillKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") {
            e.preventDefault();
            addSkill();
        }
    }

    async function handleSave() {
        setSaving(true);
        const token = await getToken();
        const updatedContent = { ...resume?.content, personalInfo, experience, education, skills, summary };
        await apiFetch(`/api/resumes/${id}`, token, {
            method: "PATCH",
            body: JSON.stringify({ content: updatedContent }),
        });
        setSaving(false);
    }

    async function handleGenerateSummary() {
        // Check karo ki user ne pehle Job Title jaisi info di hai ya nahi
        if (experience.length === 0) {
            alert("Please add at least one work experience first, so AI has context to generate a summary.");
            return;
        }

        setGeneratingSummary(true);
        const token = await getToken();

        try {
            const data = await apiFetch("/api/ai/generate-summary", token, {
                method: "POST",
                body: JSON.stringify({
                    jobTitle: experience[0].role || "Professional",
                    yearsOfExperience: experience.length,
                    keySkills: skills,
                }),
            });
            setSummary(data.summary);
        } catch (err: any) {
            alert(err.message || "Failed to generate summary. Please try again.");
        } finally {
            setGeneratingSummary(false);
        }
    }

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="flex gap-6 p-8">
            {/* Left Side: Form */}
            <div className="w-1/2">
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
                        <h2 className="text-lg font-semibold">Professional Summary</h2>
                        <button
                            onClick={handleGenerateSummary}
                            disabled={generatingSummary}
                            className="text-sm bg-purple-600 text-white px-3 py-1.5 rounded hover:bg-purple-700 disabled:opacity-50"
                        >
                            {generatingSummary ? "Generating..." : "✨ Generate with AI"}
                        </button>
                    </div>
                    <textarea
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        className="w-full border rounded px-3 py-2 h-28"
                        placeholder="A brief 2-3 sentence summary highlighting your key strengths and career goals..."
                    />
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

                <div className="space-y-4 border rounded p-6 mt-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold">Education</h2>
                        <button
                            onClick={addEducation}
                            className="text-sm text-blue-600 hover:underline"
                        >
                            + Add Education
                        </button>
                    </div>

                    {education.length === 0 && (
                        <p className="text-gray-500 text-sm">No education added yet.</p>
                    )}

                    {education.map((entry) => (
                        <div key={entry.id} className="border rounded p-4 space-y-3 relative">
                            <button
                                onClick={() => removeEducation(entry.id)}
                                className="absolute top-3 right-3 text-red-500 text-sm hover:underline"
                            >
                                Remove
                            </button>

                            <div>
                                <label className="block text-sm font-medium mb-1">Institution</label>
                                <input
                                    type="text"
                                    value={entry.institution || ""}
                                    onChange={(e) => updateEducation(entry.id, "institution", e.target.value)}
                                    className="w-full border rounded px-3 py-2"
                                    placeholder="Stanford University"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Degree</label>
                                <input
                                    type="text"
                                    value={entry.degree || ""}
                                    onChange={(e) => updateEducation(entry.id, "degree", e.target.value)}
                                    className="w-full border rounded px-3 py-2"
                                    placeholder="Bachelor of Technology"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Field of Study</label>
                                <input
                                    type="text"
                                    value={entry.fieldOfStudy || ""}
                                    onChange={(e) => updateEducation(entry.id, "fieldOfStudy", e.target.value)}
                                    className="w-full border rounded px-3 py-2"
                                    placeholder="Computer Science"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Start Date</label>
                                    <input
                                        type="month"
                                        value={entry.startDate || ""}
                                        onChange={(e) => updateEducation(entry.id, "startDate", e.target.value)}
                                        className="w-full border rounded px-3 py-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">End Date</label>
                                    <input
                                        type="month"
                                        value={entry.endDate || ""}
                                        onChange={(e) => updateEducation(entry.id, "endDate", e.target.value)}
                                        className="w-full border rounded px-3 py-2"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="space-y-4 border rounded p-6 mt-6">
                    <h2 className="text-lg font-semibold">Skills</h2>

                    <div>
                        <input
                            type="text"
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            onKeyDown={handleSkillKeyDown}
                            className="w-full border rounded px-3 py-2"
                            placeholder="Type a skill and press Enter (e.g. React)"
                        />
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {skills.map((skill) => (
                            <span
                                key={skill}
                                className="bg-gray-100 border rounded-full px-3 py-1 text-sm flex items-center gap-2"
                            >
                                {skill}
                                <button
                                    onClick={() => removeSkill(skill)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                </div>

                <div className="flex gap-3 mt-6">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
                    >
                        {saving ? "Saving..." : "Save"}
                    </button>

                    <button
                        onClick={() => window.open(`/resumes/${id}/print`, "_blank")}
                        className="bg-white border border-gray-300 px-4 py-2 rounded hover:bg-gray-50"
                    >
                        📄 Download PDF
                    </button>
                </div>
            </div>

            {/* Right Side: Live Preview */}
            <div className="w-1/2 overflow-auto max-h-screen sticky top-8">
                <div className="scale-[0.7] origin-top">
                    <ResumeTemplate
                        personalInfo={personalInfo}
                        summary={summary}
                        experience={experience}
                        education={education}
                        skills={skills}
                    />
                </div>
            </div>
        </div >
    );
}