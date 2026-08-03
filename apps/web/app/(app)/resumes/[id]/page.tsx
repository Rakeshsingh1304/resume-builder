"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import ResumeTemplate from "@/components/ResumeTemplate";
import ScaledResumePreview from "@/components/ScaledResumePreview";

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
    isPublic: boolean;
    publicSlug: string | null;
}

interface AtsBreakdownItem {
    category: string;
    score: number;
    maxScore: number;
    feedback: string;
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
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [generatingSummary, setGeneratingSummary] = useState(false);
    const [atsScore, setAtsScore] = useState<number | null>(null);
    const [atsBreakdown, setAtsBreakdown] = useState<AtsBreakdownItem[]>([]);
    const [checkingAts, setCheckingAts] = useState(false);

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

    function updateExperience(entryId: string, field: keyof ExperienceEntry, value: string | boolean) {
        setExperience((prev) =>
            prev.map((entry) => (entry.id === entryId ? { ...entry, [field]: value } : entry))
        );
    }

    function removeExperience(entryId: string) {
        setExperience((prev) => prev.filter((entry) => entry.id !== entryId));
    }

    function addEducation() {
        setEducation((prev) => [
            ...prev,
            { id: crypto.randomUUID(), institution: "", degree: "", fieldOfStudy: "", startDate: "", endDate: "" },
        ]);
    }

    function updateEducation(entryId: string, field: keyof EducationEntry, value: string) {
        setEducation((prev) =>
            prev.map((entry) => (entry.id === entryId ? { ...entry, [field]: value } : entry))
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

    async function handleCheckAtsScore() {
        setCheckingAts(true);
        const token = await getToken();
        try {
            const updatedContent = { ...resume?.content, personalInfo, experience, education, skills, summary };
            await apiFetch(`/api/resumes/${id}`, token, {
                method: "PATCH",
                body: JSON.stringify({ content: updatedContent }),
            });
            const data = await apiFetch(`/api/resumes/${id}/ats-score`, token, { method: "POST" });
            setAtsScore(data.score);
            setAtsBreakdown(data.breakdown);
        } catch (err: any) {
            alert(err.message || "Failed to check ATS score.");
        } finally {
            setCheckingAts(false);
        }
    }

    async function handleTogglePublic() {
        const token = await getToken();
        const updated = await apiFetch(`/api/resumes/${id}/toggle-public`, token, { method: "POST" });
        setResume((prev) => (prev ? { ...prev, isPublic: updated.isPublic, publicSlug: updated.publicSlug } : prev));
    }

    function handleCopyPublicLink() {
        const url = `${window.location.origin}/r/${resume?.publicSlug}`;
        navigator.clipboard.writeText(url);
        alert("Link copied to clipboard!");
    }

    if (loading) return <div className="p-10 text-muted-foreground">Loading...</div>;

    return (
        <div className="flex flex-col lg:flex-row gap-6 p-4 lg:p-8">
            {/* Left Side: Form */}
            <div className="w-full lg:w-1/2">
                <h1 className="font-heading text-2xl font-bold text-foreground mb-6">{resume?.title}</h1>

                {/* ATS Score */}
                <div className="border border-border bg-card rounded-lg p-6 mb-5">
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="font-heading text-lg font-semibold text-foreground">ATS Score</h2>
                        <button
                            onClick={handleCheckAtsScore}
                            disabled={checkingAts}
                            className="text-sm bg-[#2E7D32] text-white px-3 py-1.5 rounded-md hover:opacity-90 disabled:opacity-50"
                        >
                            {checkingAts ? "Checking..." : "🎯 Check ATS Score"}
                        </button>
                    </div>

                    {atsScore !== null && (
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="font-heading text-3xl font-bold text-foreground">{atsScore}/100</div>
                                <div className="text-sm text-muted-foreground">
                                    {atsScore >= 80 ? "Excellent!" : atsScore >= 60 ? "Good, room to improve" : "Needs work"}
                                </div>
                            </div>
                            <div className="space-y-2">
                                {atsBreakdown.map((item) => (
                                    <div key={item.category} className="text-sm">
                                        <div className="flex justify-between">
                                            <span className="font-medium text-foreground">{item.category}</span>
                                            <span className="text-muted-foreground">{item.score}/{item.maxScore}</span>
                                        </div>
                                        <p className="text-muted-foreground text-xs">{item.feedback}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Public Sharing */}
                <div className="border border-border bg-card rounded-lg p-6 mb-5">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="font-heading text-lg font-semibold text-foreground">Public Sharing</h2>
                            <p className="text-sm text-muted-foreground">
                                {resume?.isPublic ? "Anyone with the link can view this resume" : "This resume is currently private"}
                            </p>
                        </div>
                        <button
                            onClick={handleTogglePublic}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition ${resume?.isPublic
                                ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
                                : "bg-primary text-primary-foreground hover:opacity-90"
                                }`}
                        >
                            {resume?.isPublic ? "Make Private" : "Make Public"}
                        </button>
                    </div>

                    {resume?.isPublic && (
                        <div className="mt-3 flex items-center gap-2">
                            <input
                                type="text"
                                readOnly
                                value={`${typeof window !== "undefined" ? window.location.origin : ""}/r/${resume.publicSlug}`}
                                className="flex-1 border border-border rounded-md px-3 py-2 text-sm bg-muted"
                            />
                            <button
                                onClick={handleCopyPublicLink}
                                className="bg-card border border-border px-3 py-2 rounded-md text-sm hover:bg-muted"
                            >
                                📋 Copy
                            </button>
                        </div>
                    )}
                </div>

                {/* Personal Info */}
                <div className="space-y-4 border border-border bg-card rounded-lg p-6 mb-5">
                    <h2 className="font-heading text-lg font-semibold text-foreground">Personal Information</h2>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-foreground">Full Name</label>
                        <input
                            type="text"
                            value={personalInfo.fullName || ""}
                            onChange={(e) => updateField("fullName", e.target.value)}
                            className="w-full border border-border rounded-md px-3 py-2 bg-background"
                            placeholder="John Doe"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-foreground">Email</label>
                        <input
                            type="email"
                            value={personalInfo.email || ""}
                            onChange={(e) => updateField("email", e.target.value)}
                            className="w-full border border-border rounded-md px-3 py-2 bg-background"
                            placeholder="john@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-foreground">Phone</label>
                        <input
                            type="text"
                            value={personalInfo.phone || ""}
                            onChange={(e) => updateField("phone", e.target.value)}
                            className="w-full border border-border rounded-md px-3 py-2 bg-background"
                            placeholder="+91 98765 43210"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-foreground">Location</label>
                        <input
                            type="text"
                            value={personalInfo.location || ""}
                            onChange={(e) => updateField("location", e.target.value)}
                            className="w-full border border-border rounded-md px-3 py-2 bg-background"
                            placeholder="Surat, India"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-foreground">LinkedIn</label>
                        <input
                            type="text"
                            value={personalInfo.linkedin || ""}
                            onChange={(e) => updateField("linkedin", e.target.value)}
                            className="w-full border border-border rounded-md px-3 py-2 bg-background"
                            placeholder="linkedin.com/in/johndoe"
                        />
                    </div>
                </div>

                {/* Summary */}
                <div className="space-y-4 border border-border bg-card rounded-lg p-6 mb-5">
                    <div className="flex justify-between items-center">
                        <h2 className="font-heading text-lg font-semibold text-foreground">Professional Summary</h2>
                        <button
                            onClick={handleGenerateSummary}
                            disabled={generatingSummary}
                            className="text-sm bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:opacity-90 disabled:opacity-50"
                        >
                            {generatingSummary ? "Generating..." : "✨ Generate with AI"}
                        </button>
                    </div>
                    <textarea
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        className="w-full border border-border rounded-md px-3 py-2 h-28 bg-background"
                        placeholder="A brief 2-3 sentence summary highlighting your key strengths and career goals..."
                    />
                </div>

                {/* Experience */}
                <div className="space-y-4 border border-border bg-card rounded-lg p-6 mb-5">
                    <div className="flex justify-between items-center">
                        <h2 className="font-heading text-lg font-semibold text-foreground">Work Experience</h2>
                        <button onClick={addExperience} className="text-sm text-primary hover:underline font-medium">
                            + Add Experience
                        </button>
                    </div>

                    {experience.length === 0 && (
                        <p className="text-muted-foreground text-sm">No experience added yet.</p>
                    )}

                    {experience.map((entry) => (
                        <div key={entry.id} className="border border-border rounded-md p-4 space-y-3 relative bg-background">
                            <button
                                onClick={() => removeExperience(entry.id)}
                                className="absolute top-3 right-3 text-destructive text-sm hover:underline"
                            >
                                Remove
                            </button>

                            <div>
                                <label className="block text-sm font-medium mb-1 text-foreground">Company</label>
                                <input
                                    type="text"
                                    value={entry.company || ""}
                                    onChange={(e) => updateExperience(entry.id, "company", e.target.value)}
                                    className="w-full border border-border rounded-md px-3 py-2 bg-card"
                                    placeholder="Google"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 text-foreground">Job Title</label>
                                <input
                                    type="text"
                                    value={entry.role || ""}
                                    onChange={(e) => updateExperience(entry.id, "role", e.target.value)}
                                    className="w-full border border-border rounded-md px-3 py-2 bg-card"
                                    placeholder="Software Engineer"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-foreground">Start Date</label>
                                    <input
                                        type="month"
                                        value={entry.startDate || ""}
                                        onChange={(e) => updateExperience(entry.id, "startDate", e.target.value)}
                                        className="w-full border border-border rounded-md px-3 py-2 bg-card"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-foreground">End Date</label>
                                    <input
                                        type="month"
                                        value={entry.endDate || ""}
                                        disabled={entry.currentlyWorking}
                                        onChange={(e) => updateExperience(entry.id, "endDate", e.target.value)}
                                        className="w-full border border-border rounded-md px-3 py-2 bg-card disabled:bg-muted"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={entry.currentlyWorking || false}
                                    onChange={(e) => updateExperience(entry.id, "currentlyWorking", e.target.checked)}
                                />
                                <label className="text-sm text-foreground">I currently work here</label>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 text-foreground">Description</label>
                                <textarea
                                    value={entry.description || ""}
                                    onChange={(e) => updateExperience(entry.id, "description", e.target.value)}
                                    className="w-full border border-border rounded-md px-3 py-2 h-24 bg-card"
                                    placeholder="Describe your responsibilities and achievements..."
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Education */}
                <div className="space-y-4 border border-border bg-card rounded-lg p-6 mb-5">
                    <div className="flex justify-between items-center">
                        <h2 className="font-heading text-lg font-semibold text-foreground">Education</h2>
                        <button onClick={addEducation} className="text-sm text-primary hover:underline font-medium">
                            + Add Education
                        </button>
                    </div>

                    {education.length === 0 && (
                        <p className="text-muted-foreground text-sm">No education added yet.</p>
                    )}

                    {education.map((entry) => (
                        <div key={entry.id} className="border border-border rounded-md p-4 space-y-3 relative bg-background">
                            <button
                                onClick={() => removeEducation(entry.id)}
                                className="absolute top-3 right-3 text-destructive text-sm hover:underline"
                            >
                                Remove
                            </button>

                            <div>
                                <label className="block text-sm font-medium mb-1 text-foreground">Institution</label>
                                <input
                                    type="text"
                                    value={entry.institution || ""}
                                    onChange={(e) => updateEducation(entry.id, "institution", e.target.value)}
                                    className="w-full border border-border rounded-md px-3 py-2 bg-card"
                                    placeholder="Stanford University"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 text-foreground">Degree</label>
                                <input
                                    type="text"
                                    value={entry.degree || ""}
                                    onChange={(e) => updateEducation(entry.id, "degree", e.target.value)}
                                    className="w-full border border-border rounded-md px-3 py-2 bg-card"
                                    placeholder="Bachelor of Technology"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 text-foreground">Field of Study</label>
                                <input
                                    type="text"
                                    value={entry.fieldOfStudy || ""}
                                    onChange={(e) => updateEducation(entry.id, "fieldOfStudy", e.target.value)}
                                    className="w-full border border-border rounded-md px-3 py-2 bg-card"
                                    placeholder="Computer Science"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-foreground">Start Date</label>
                                    <input
                                        type="month"
                                        value={entry.startDate || ""}
                                        onChange={(e) => updateEducation(entry.id, "startDate", e.target.value)}
                                        className="w-full border border-border rounded-md px-3 py-2 bg-card"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-foreground">End Date</label>
                                    <input
                                        type="month"
                                        value={entry.endDate || ""}
                                        onChange={(e) => updateEducation(entry.id, "endDate", e.target.value)}
                                        className="w-full border border-border rounded-md px-3 py-2 bg-card"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Skills */}
                <div className="space-y-4 border border-border bg-card rounded-lg p-6 mb-5">
                    <h2 className="font-heading text-lg font-semibold text-foreground">Skills</h2>

                    <input
                        type="text"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={handleSkillKeyDown}
                        className="w-full border border-border rounded-md px-3 py-2 bg-background"
                        placeholder="Type a skill and press Enter (e.g. React)"
                    />

                    <div className="flex flex-wrap gap-2">
                        {skills.map((skill) => (
                            <span
                                key={skill}
                                className="bg-muted border border-border rounded-full px-3 py-1 text-sm flex items-center gap-2 text-foreground"
                            >
                                {skill}
                                <button onClick={() => removeSkill(skill)} className="text-destructive hover:opacity-70">
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-primary text-primary-foreground px-4 py-2.5 rounded-md text-sm font-medium hover:opacity-90 disabled:opacity-50"
                    >
                        {saving ? "Saving..." : "Save"}
                    </button>
                    <button
                        onClick={() => window.open(`/resumes/${id}/print`, "_blank")}
                        className="bg-card border border-border px-4 py-2.5 rounded-md text-sm font-medium hover:bg-muted"
                    >
                        📄 Download PDF
                    </button>
                </div>
            </div>

            {/* Right Side: Live Preview */}
            <div className="w-full lg:w-1/2 lg:sticky lg:top-8 lg:self-start max-w-[556px] mx-auto lg:mx-0">
                <ScaledResumePreview
                    personalInfo={personalInfo}
                    summary={summary}
                    experience={experience}
                    education={education}
                    skills={skills}
                />
            </div>
        </div>
    );
}