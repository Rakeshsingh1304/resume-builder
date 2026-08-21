"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import ResumeTemplate from "@/components/ResumeTemplate";
import ScaledResumePreview from "@/components/ScaledResumePreview";
import { TEMPLATES } from "@/components/resume-templates/TemplateRenderer";

interface PersonalInfo {
    fullName?: string;
    title?: string;
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    github?: string;
    website?: string;
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

interface ProjectEntry {
    id: string;
    title?: string;
    techStack?: string;
    link?: string;
    description?: string;
}

interface CertificationEntry {
    id: string;
    name?: string;
    issuer?: string;
    date?: string;
}

interface LanguageEntry {
    id: string;
    name?: string;
    proficiency?: string;
}

interface ResumeContent {
    personalInfo?: PersonalInfo;
    experience?: ExperienceEntry[];
    education?: EducationEntry[];
    skills?: string[];
    summary?: string;
    projects?: ProjectEntry[];
    certifications?: CertificationEntry[];
    languages?: LanguageEntry[];
    achievements?: string[];
}

interface Resume {
    id: string;
    title: string;
    content: ResumeContent;
    isPublic: boolean;
    publicSlug: string | null;
    templateId?: string;
}

interface AtsBreakdownItem {
    category: string;
    score: number;
    maxScore: number;
    feedback: string;
}

// ---- Wizard steps configuration ----
// Summary is LAST on purpose: by the time the user reaches it, all their
// other data is filled in, so the "Generate with AI" button can use
// everything (experience, education, projects, skills, achievements) to
// write a much better summary.
const STEPS = [
    { key: "personal", label: "Personal Info" },
    { key: "experience", label: "Experience" },
    { key: "education", label: "Education" },
    { key: "projects", label: "Projects" },
    { key: "certifications", label: "Certifications" },
    { key: "languages", label: "Languages" },
    { key: "achievements", label: "Achievements" },
    { key: "skills", label: "Skills" },
    { key: "summary", label: "Summary" },
] as const;

export default function ResumeBuilderPage() {
    const { id } = useParams<{ id: string }>();
    const { getToken } = useAuth();
    const [resume, setResume] = useState<Resume | null>(null);
    const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({});
    const [experience, setExperience] = useState<ExperienceEntry[]>([]);
    const [education, setEducation] = useState<EducationEntry[]>([]);
    const [skills, setSkills] = useState<string[]>([]);
    const [skillInput, setSkillInput] = useState("");
    const [projects, setProjects] = useState<ProjectEntry[]>([]);
    const [certifications, setCertifications] = useState<CertificationEntry[]>([]);
    const [languages, setLanguages] = useState<LanguageEntry[]>([]);
    const [achievements, setAchievements] = useState<string[]>([]);
    const [achievementInput, setAchievementInput] = useState("");
    const [summary, setSummary] = useState("");
    const [templateId, setTemplateId] = useState("classic");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [generatingSummary, setGeneratingSummary] = useState(false);
    const [generatingExperienceId, setGeneratingExperienceId] = useState<string | null>(null);
    const [generatingProjectId, setGeneratingProjectId] = useState<string | null>(null);
    const [atsScore, setAtsScore] = useState<number | null>(null);
    const [atsBreakdown, setAtsBreakdown] = useState<AtsBreakdownItem[]>([]);
    const [checkingAts, setCheckingAts] = useState(false);
    const [jobDescription, setJobDescription] = useState("");
    const [checkingJobMatch, setCheckingJobMatch] = useState(false);
    const [jobMatchResult, setJobMatchResult] = useState<{
        matchPercentage: number;
        matchedKeywords: string[];
        missingKeywords: string[];
        suggestions: string;
    } | null>(null);
    const [checkingWritingQuality, setCheckingWritingQuality] = useState(false);
    const [writingQualityResult, setWritingQualityResult] = useState<{
        overallQuality: string;
        strengths: string[];
        improvements: string[];
    } | null>(null);
    const [applyingImprovements, setApplyingImprovements] = useState(false);

    // ---- Wizard state ----
    const [currentStep, setCurrentStep] = useState(0);
    const formTopRef = useRef<HTMLDivElement | null>(null);
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        formTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, [currentStep]);

    function goNext() {
        setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1));
    }

    function goBack() {
        setCurrentStep((s) => Math.max(s - 1, 0));
    }

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
            setProjects(data.content?.projects || []);
            setCertifications(data.content?.certifications || []);
            setLanguages(data.content?.languages || []);
            setAchievements(data.content?.achievements || []);
            setTemplateId(data.templateId || "classic");
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

    function addProject() {
        setProjects((prev) => [
            ...prev,
            { id: crypto.randomUUID(), title: "", techStack: "", link: "", description: "" },
        ]);
    }

    function updateProject(entryId: string, field: keyof ProjectEntry, value: string) {
        setProjects((prev) =>
            prev.map((entry) => (entry.id === entryId ? { ...entry, [field]: value } : entry))
        );
    }

    function removeProject(entryId: string) {
        setProjects((prev) => prev.filter((entry) => entry.id !== entryId));
    }

    function addCertification() {
        setCertifications((prev) => [
            ...prev,
            { id: crypto.randomUUID(), name: "", issuer: "", date: "" },
        ]);
    }

    function updateCertification(entryId: string, field: keyof CertificationEntry, value: string) {
        setCertifications((prev) =>
            prev.map((entry) => (entry.id === entryId ? { ...entry, [field]: value } : entry))
        );
    }

    function removeCertification(entryId: string) {
        setCertifications((prev) => prev.filter((entry) => entry.id !== entryId));
    }

    function addLanguage() {
        setLanguages((prev) => [...prev, { id: crypto.randomUUID(), name: "", proficiency: "Conversational" }]);
    }

    function updateLanguage(entryId: string, field: keyof LanguageEntry, value: string) {
        setLanguages((prev) =>
            prev.map((entry) => (entry.id === entryId ? { ...entry, [field]: value } : entry))
        );
    }

    function removeLanguage(entryId: string) {
        setLanguages((prev) => prev.filter((entry) => entry.id !== entryId));
    }

    function addAchievement() {
        const trimmed = achievementInput.trim();
        if (trimmed) {
            setAchievements((prev) => [...prev, trimmed]);
        }
        setAchievementInput("");
    }

    function removeAchievement(index: number) {
        setAchievements((prev) => prev.filter((_, i) => i !== index));
    }

    function handleAchievementKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") {
            e.preventDefault();
            addAchievement();
        }
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

    async function handleSelectTemplate(newTemplateId: string) {
        setTemplateId(newTemplateId);
        const token = await getToken();
        try {
            await apiFetch(`/api/resumes/${id}`, token, {
                method: "PATCH",
                body: JSON.stringify({ templateId: newTemplateId }),
            });
        } catch (err: any) {
            // TEMPORARY: showing the error so we can debug why the save is failing
            alert("Template save failed: " + (err.message || "Unknown error"));
        }
    }

    async function handleSave() {
        setSaving(true);
        const token = await getToken();
        const updatedContent = { ...resume?.content, personalInfo, experience, education, skills, summary, projects, certifications, languages, achievements };
        await apiFetch(`/api/resumes/${id}`, token, {
            method: "PATCH",
            body: JSON.stringify({ content: updatedContent }),
        });
        setSaving(false);
    }

    async function handleGenerateSummary() {
        const hasAnyData =
            (personalInfo.title && personalInfo.title.trim().length > 0) ||
            experience.length > 0 ||
            skills.length > 0 ||
            projects.length > 0;

        if (!hasAnyData) {
            alert("Please fill in your title, experience, projects, or skills first, so AI has something to work with.");
            return;
        }

        setGeneratingSummary(true);
        const token = await getToken();
        try {
            const data = await apiFetch("/api/ai/generate-summary", token, {
                method: "POST",
                body: JSON.stringify({
                    personalInfo,
                    experience,
                    education,
                    skills,
                    projects,
                    achievements,
                }),
            });
            setSummary(data.summary);
        } catch (err: any) {
            alert(err.message || "Failed to generate summary. Please try again.");
        } finally {
            setGeneratingSummary(false);
        }
    }

    async function handleGenerateExperienceDescription(entry: ExperienceEntry) {
        if (!entry.company || !entry.role) {
            alert("Please fill in the Company and Job Title first, so AI has context to write a description.");
            return;
        }

        setGeneratingExperienceId(entry.id);
        const token = await getToken();
        try {
            const data = await apiFetch("/api/ai/generate-experience-description", token, {
                method: "POST",
                body: JSON.stringify({
                    company: entry.company,
                    role: entry.role,
                    startDate: entry.startDate,
                    endDate: entry.endDate,
                    currentlyWorking: entry.currentlyWorking,
                }),
            });
            updateExperience(entry.id, "description", data.description);
        } catch (err: any) {
            alert(err.message || "Failed to generate description. Please try again.");
        } finally {
            setGeneratingExperienceId(null);
        }
    }

    async function handleGenerateProjectDescription(entry: ProjectEntry) {
        if (!entry.title) {
            alert("Please fill in the Project Title first, so AI has context to write a description.");
            return;
        }

        setGeneratingProjectId(entry.id);
        const token = await getToken();
        try {
            const data = await apiFetch("/api/ai/generate-project-description", token, {
                method: "POST",
                body: JSON.stringify({
                    title: entry.title,
                    techStack: entry.techStack,
                }),
            });
            updateProject(entry.id, "description", data.description);
        } catch (err: any) {
            alert(err.message || "Failed to generate description. Please try again.");
        } finally {
            setGeneratingProjectId(null);
        }
    }

    async function handleCheckAtsScore() {
        setCheckingAts(true);
        const token = await getToken();
        try {
            const updatedContent = { ...resume?.content, personalInfo, experience, education, skills, summary, projects, certifications, languages, achievements };
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

    async function handleCheckJobMatch() {
        if (!jobDescription.trim()) {
            alert("Please paste a job description first.");
            return;
        }
        setCheckingJobMatch(true);
        const token = await getToken();
        try {
            const data = await apiFetch(`/api/resumes/${id}/job-match`, token, {
                method: "POST",
                body: JSON.stringify({ jobDescription }),
            });
            setJobMatchResult(data);
        } catch (err: any) {
            alert(err.message || "Failed to check job match. Please try again.");
        } finally {
            setCheckingJobMatch(false);
        }
    }

    async function handleCheckWritingQuality() {
        setCheckingWritingQuality(true);
        const token = await getToken();
        try {
            const data = await apiFetch(`/api/resumes/${id}/writing-quality`, token, {
                method: "POST",
            });
            setWritingQualityResult(data);
        } catch (err: any) {
            alert(err.message || "Failed to analyze writing quality. Please try again.");
        } finally {
            setCheckingWritingQuality(false);
        }
    }

    async function handleApplyImprovements() {
        if (!writingQualityResult || writingQualityResult.improvements.length === 0) return;

        const confirmed = window.confirm(
            "This will rewrite your Summary and Experience/Project descriptions using AI to address the suggestions above. Your current text will be replaced. Continue?"
        );
        if (!confirmed) return;

        setApplyingImprovements(true);
        const token = await getToken();
        try {
            const data = await apiFetch("/api/ai/improve-resume", token, {
                method: "POST",
                body: JSON.stringify({
                    summary,
                    experience,
                    projects,
                    improvements: writingQualityResult.improvements,
                }),
            });

            setSummary(data.summary);

            setExperience((prev) =>
                prev.map((entry, i) => {
                    const match = data.experience.find((e: any) => e.index === i);
                    return match ? { ...entry, description: match.description } : entry;
                })
            );

            setProjects((prev) =>
                prev.map((entry, i) => {
                    const match = data.projects.find((p: any) => p.index === i);
                    return match ? { ...entry, description: match.description } : entry;
                })
            );

            alert("Your resume has been updated! Review the changes, then click Save.");
        } catch (err: any) {
            alert(err.message || "Failed to apply improvements. Please try again.");
        } finally {
            setApplyingImprovements(false);
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

    const isLastStep = currentStep === STEPS.length - 1;

    return (
        <div className="flex flex-col lg:flex-row gap-6 p-4 lg:p-8">
            {/* Left Side: Form */}
            <div className="w-full lg:w-1/2">
                <h1 className="font-heading text-2xl font-bold text-foreground mb-6">{resume?.title}</h1>

                {/* ATS Score */}
                <div className="border border-border bg-card rounded-lg p-6 mb-5">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3">
                        <h2 className="font-heading text-lg font-semibold text-foreground">ATS Score</h2>
                        <button
                            onClick={handleCheckAtsScore}
                            disabled={checkingAts}
                            className="text-sm bg-[#2E7D32] text-white px-3 py-1.5 rounded-md hover:opacity-90 disabled:opacity-50 whitespace-nowrap w-full sm:w-auto"
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

                    {/* Job Description Matching */}
                    <div className="mt-5 pt-5 border-t border-border">
                        <h3 className="font-heading text-sm font-semibold text-foreground mb-2">
                            🎯 Match Against a Job Description (optional)
                        </h3>
                        <textarea
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            className="w-full border border-border rounded-md px-3 py-2 h-24 bg-background text-sm"
                            placeholder="Paste the job description you're applying for..."
                        />
                        <button
                            onClick={handleCheckJobMatch}
                            disabled={checkingJobMatch}
                            className="mt-2 text-sm bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:opacity-90 disabled:opacity-50 w-full sm:w-auto whitespace-nowrap"
                        >
                            {checkingJobMatch ? "Analyzing..." : "Check Job Match"}
                        </button>

                        {jobMatchResult && (
                            <div className="mt-4">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="font-heading text-2xl font-bold text-foreground">
                                        {jobMatchResult.matchPercentage}%
                                    </div>
                                    <div className="text-sm text-muted-foreground">match with this job</div>
                                </div>

                                {jobMatchResult.matchedKeywords.length > 0 && (
                                    <div className="mb-3">
                                        <p className="text-xs font-medium text-muted-foreground mb-1.5">
                                            ✅ Found in your resume
                                        </p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {jobMatchResult.matchedKeywords.map((kw) => (
                                                <span
                                                    key={kw}
                                                    className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full"
                                                >
                                                    {kw}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {jobMatchResult.missingKeywords.filter((kw) => !skills.includes(kw)).length > 0 && (
                                    <div className="mb-3">
                                        <p className="text-xs font-medium text-muted-foreground mb-1.5">
                                            ⚠️ Missing — click to add to your Skills
                                        </p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {jobMatchResult.missingKeywords
                                                .filter((kw) => !skills.includes(kw))
                                                .map((kw) => (
                                                    <button
                                                        key={kw}
                                                        onClick={() => setSkills((prev) => [...prev, kw])}
                                                        title="Click to add to Skills"
                                                        className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full hover:bg-amber-200 transition"
                                                    >
                                                        + {kw}
                                                    </button>
                                                ))}
                                        </div>
                                    </div>
                                )}

                                {jobMatchResult.suggestions && (
                                    <p className="text-xs text-muted-foreground mt-2">{jobMatchResult.suggestions}</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Writing Quality Check */}
                    <div className="mt-5 pt-5 border-t border-border">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-1">
                            <h3 className="font-heading text-sm font-semibold text-foreground">
                                🔍 Writing Quality Check
                            </h3>
                            <button
                                onClick={handleCheckWritingQuality}
                                disabled={checkingWritingQuality}
                                className="text-sm bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:opacity-90 disabled:opacity-50 whitespace-nowrap w-full sm:w-auto"
                            >
                                {checkingWritingQuality ? "Analyzing..." : "Analyze Writing"}
                            </button>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                            AI reviews your summary and descriptions for weak phrases, missing results, and clarity.
                        </p>

                        {writingQualityResult && (
                            <div className="mt-3">
                                <span
                                    className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full mb-3 ${writingQualityResult.overallQuality === "Strong"
                                        ? "bg-green-100 text-green-800"
                                        : writingQualityResult.overallQuality === "Good"
                                            ? "bg-amber-100 text-amber-800"
                                            : "bg-red-100 text-red-800"
                                        }`}
                                >
                                    {writingQualityResult.overallQuality}
                                </span>

                                {writingQualityResult.strengths.length > 0 && (
                                    <div className="mb-3">
                                        <p className="text-xs font-medium text-muted-foreground mb-1.5">✅ Strengths</p>
                                        <ul className="space-y-1">
                                            {writingQualityResult.strengths.map((item, i) => (
                                                <li key={i} className="text-xs text-gray-700 flex gap-1.5">
                                                    <span>•</span> {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {writingQualityResult.improvements.length > 0 && (
                                    <div>
                                        <p className="text-xs font-medium text-muted-foreground mb-1.5">
                                            ⚠️ Suggested Improvements
                                        </p>
                                        <ul className="space-y-1 mb-3">
                                            {writingQualityResult.improvements.map((item, i) => (
                                                <li key={i} className="text-xs text-gray-700 flex gap-1.5">
                                                    <span>•</span> {item}
                                                </li>
                                            ))}
                                        </ul>
                                        <button
                                            onClick={handleApplyImprovements}
                                            disabled={applyingImprovements}
                                            className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:opacity-90 disabled:opacity-50 w-full sm:w-auto whitespace-nowrap"
                                        >
                                            {applyingImprovements ? "Applying..." : "✨ Apply These Improvements"}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Public Sharing */}
                <div className="border border-border bg-card rounded-lg p-6 mb-5">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                        <div>
                            <h2 className="font-heading text-lg font-semibold text-foreground">Public Sharing</h2>
                            <p className="text-sm text-muted-foreground">
                                {resume?.isPublic ? "Anyone with the link can view this resume" : "This resume is currently private"}
                            </p>
                        </div>
                        <button
                            onClick={handleTogglePublic}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition whitespace-nowrap w-full sm:w-auto ${resume?.isPublic
                                ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
                                : "bg-primary text-primary-foreground hover:opacity-90"
                                }`}
                        >
                            {resume?.isPublic ? "Make Private" : "Make Public"}
                        </button>
                    </div>

                    {resume?.isPublic && (
                        <div className="mt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                            <input
                                type="text"
                                readOnly
                                value={`${typeof window !== "undefined" ? window.location.origin : ""}/r/${resume.publicSlug}`}
                                className="flex-1 border border-border rounded-md px-3 py-2 text-sm bg-muted min-w-0"
                            />
                            <button
                                onClick={handleCopyPublicLink}
                                className="bg-card border border-border px-3 py-2 rounded-md text-sm hover:bg-muted whitespace-nowrap"
                            >
                                📋 Copy
                            </button>
                        </div>
                    )}
                </div>

                {/* ============== WIZARD: step progress + tabs ============== */}
                <div ref={formTopRef} className="mb-4 scroll-mt-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">
                            Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep].label}
                        </span>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {Math.round(((currentStep + 1) / STEPS.length) * 100)}% complete
                        </span>
                    </div>

                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary transition-all duration-300"
                            style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
                        />
                    </div>

                    <div className="flex gap-2 mt-3 overflow-x-auto pb-1 -mx-1 px-1">
                        {STEPS.map((step, idx) => (
                            <button
                                key={step.key}
                                onClick={() => setCurrentStep(idx)}
                                className={`shrink-0 text-xs px-3 py-1.5 rounded-full whitespace-nowrap border transition ${idx === currentStep
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : idx < currentStep
                                        ? "bg-muted text-foreground border-border"
                                        : "bg-background text-muted-foreground border-border"
                                    }`}
                            >
                                {idx + 1}. {step.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ============== STEP: Personal Info ============== */}
                {currentStep === 0 && (
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
                            <label className="block text-sm font-medium mb-1 text-foreground">Professional Title</label>
                            <input
                                type="text"
                                value={personalInfo.title || ""}
                                onChange={(e) => updateField("title", e.target.value)}
                                className="w-full border border-border rounded-md px-3 py-2 bg-background"
                                placeholder="Full Stack Developer | React Expert"
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
                        <div>
                            <label className="block text-sm font-medium mb-1 text-foreground">GitHub</label>
                            <input
                                type="text"
                                value={personalInfo.github || ""}
                                onChange={(e) => updateField("github", e.target.value)}
                                className="w-full border border-border rounded-md px-3 py-2 bg-background"
                                placeholder="github.com/johndoe"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-foreground">Portfolio Website</label>
                            <input
                                type="text"
                                value={personalInfo.website || ""}
                                onChange={(e) => updateField("website", e.target.value)}
                                className="w-full border border-border rounded-md px-3 py-2 bg-background"
                                placeholder="johndoe.com"
                            />
                        </div>
                    </div>
                )}

                {/* ============== STEP: Experience ============== */}
                {currentStep === 1 && (
                    <div className="space-y-4 border border-border bg-card rounded-lg p-6 mb-5">
                        <div className="flex justify-between items-center gap-2">
                            <h2 className="font-heading text-lg font-semibold text-foreground">Work Experience</h2>
                            <button onClick={addExperience} className="text-sm text-primary hover:underline font-medium whitespace-nowrap">
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
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="block text-sm font-medium text-foreground">Description</label>
                                        <button
                                            onClick={() => handleGenerateExperienceDescription(entry)}
                                            disabled={generatingExperienceId === entry.id}
                                            className="text-xs bg-primary text-primary-foreground px-2.5 py-1 rounded-md hover:opacity-90 disabled:opacity-50 whitespace-nowrap"
                                        >
                                            {generatingExperienceId === entry.id ? "Generating..." : "✨ Generate with AI"}
                                        </button>
                                    </div>
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
                )}

                {/* ============== STEP: Education ============== */}
                {currentStep === 2 && (
                    <div className="space-y-4 border border-border bg-card rounded-lg p-6 mb-5">
                        <div className="flex justify-between items-center gap-2">
                            <h2 className="font-heading text-lg font-semibold text-foreground">Education</h2>
                            <button onClick={addEducation} className="text-sm text-primary hover:underline font-medium whitespace-nowrap">
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

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                )}

                {/* ============== STEP: Projects ============== */}
                {currentStep === 3 && (
                    <div className="space-y-4 border border-border bg-card rounded-lg p-6 mb-5">
                        <div className="flex justify-between items-center gap-2">
                            <h2 className="font-heading text-lg font-semibold text-foreground">Projects</h2>
                            <button onClick={addProject} className="text-sm text-primary hover:underline font-medium whitespace-nowrap">
                                + Add Project
                            </button>
                        </div>

                        {projects.length === 0 && (
                            <p className="text-muted-foreground text-sm">No projects added yet.</p>
                        )}

                        {projects.map((entry) => (
                            <div key={entry.id} className="border border-border rounded-md p-4 space-y-3 relative bg-background">
                                <button
                                    onClick={() => removeProject(entry.id)}
                                    className="absolute top-3 right-3 text-destructive text-sm hover:underline"
                                >
                                    Remove
                                </button>

                                <div>
                                    <label className="block text-sm font-medium mb-1 text-foreground">Project Title</label>
                                    <input
                                        type="text"
                                        value={entry.title || ""}
                                        onChange={(e) => updateProject(entry.id, "title", e.target.value)}
                                        className="w-full border border-border rounded-md px-3 py-2 bg-card"
                                        placeholder="E-commerce Website"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1 text-foreground">Tech Stack</label>
                                    <input
                                        type="text"
                                        value={entry.techStack || ""}
                                        onChange={(e) => updateProject(entry.id, "techStack", e.target.value)}
                                        className="w-full border border-border rounded-md px-3 py-2 bg-card"
                                        placeholder="React, Node.js, MongoDB"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1 text-foreground">Project Link (optional)</label>
                                    <input
                                        type="text"
                                        value={entry.link || ""}
                                        onChange={(e) => updateProject(entry.id, "link", e.target.value)}
                                        className="w-full border border-border rounded-md px-3 py-2 bg-card"
                                        placeholder="github.com/username/project"
                                    />
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="block text-sm font-medium text-foreground">Description</label>
                                        <button
                                            onClick={() => handleGenerateProjectDescription(entry)}
                                            disabled={generatingProjectId === entry.id}
                                            className="text-xs bg-primary text-primary-foreground px-2.5 py-1 rounded-md hover:opacity-90 disabled:opacity-50 whitespace-nowrap"
                                        >
                                            {generatingProjectId === entry.id ? "Generating..." : "✨ Generate with AI"}
                                        </button>
                                    </div>
                                    <textarea
                                        value={entry.description || ""}
                                        onChange={(e) => updateProject(entry.id, "description", e.target.value)}
                                        className="w-full border border-border rounded-md px-3 py-2 h-20 bg-card"
                                        placeholder="What did you build and what problem did it solve?"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* ============== STEP: Certifications ============== */}
                {currentStep === 4 && (
                    <div className="space-y-4 border border-border bg-card rounded-lg p-6 mb-5">
                        <div className="flex justify-between items-center gap-2">
                            <h2 className="font-heading text-lg font-semibold text-foreground">Certifications</h2>
                            <button onClick={addCertification} className="text-sm text-primary hover:underline font-medium whitespace-nowrap">
                                + Add Certification
                            </button>
                        </div>

                        {certifications.length === 0 && (
                            <p className="text-muted-foreground text-sm">No certifications added yet.</p>
                        )}

                        {certifications.map((entry) => (
                            <div key={entry.id} className="border border-border rounded-md p-4 space-y-3 relative bg-background">
                                <button
                                    onClick={() => removeCertification(entry.id)}
                                    className="absolute top-3 right-3 text-destructive text-sm hover:underline"
                                >
                                    Remove
                                </button>

                                <div>
                                    <label className="block text-sm font-medium mb-1 text-foreground">Certification Name</label>
                                    <input
                                        type="text"
                                        value={entry.name || ""}
                                        onChange={(e) => updateCertification(entry.id, "name", e.target.value)}
                                        className="w-full border border-border rounded-md px-3 py-2 bg-card"
                                        placeholder="AWS Certified Developer"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1 text-foreground">Issuer</label>
                                    <input
                                        type="text"
                                        value={entry.issuer || ""}
                                        onChange={(e) => updateCertification(entry.id, "issuer", e.target.value)}
                                        className="w-full border border-border rounded-md px-3 py-2 bg-card"
                                        placeholder="Amazon Web Services"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1 text-foreground">Date</label>
                                    <input
                                        type="month"
                                        value={entry.date || ""}
                                        onChange={(e) => updateCertification(entry.id, "date", e.target.value)}
                                        className="w-full border border-border rounded-md px-3 py-2 bg-card"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* ============== STEP: Languages ============== */}
                {currentStep === 5 && (
                    <div className="space-y-4 border border-border bg-card rounded-lg p-6 mb-5">
                        <div className="flex justify-between items-center gap-2">
                            <h2 className="font-heading text-lg font-semibold text-foreground">Languages</h2>
                            <button onClick={addLanguage} className="text-sm text-primary hover:underline font-medium whitespace-nowrap">
                                + Add Language
                            </button>
                        </div>

                        {languages.length === 0 && (
                            <p className="text-muted-foreground text-sm">No languages added yet.</p>
                        )}

                        {languages.map((entry) => (
                            <div key={entry.id} className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
                                <input
                                    type="text"
                                    value={entry.name || ""}
                                    onChange={(e) => updateLanguage(entry.id, "name", e.target.value)}
                                    className="flex-1 border border-border rounded-md px-3 py-2 bg-background"
                                    placeholder="English"
                                />
                                <select
                                    value={entry.proficiency || "Conversational"}
                                    onChange={(e) => updateLanguage(entry.id, "proficiency", e.target.value)}
                                    className="border border-border rounded-md px-3 py-2 bg-background"
                                >
                                    <option>Native</option>
                                    <option>Fluent</option>
                                    <option>Conversational</option>
                                    <option>Basic</option>
                                </select>
                                <button
                                    onClick={() => removeLanguage(entry.id)}
                                    className="text-destructive text-sm hover:underline whitespace-nowrap"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* ============== STEP: Achievements ============== */}
                {currentStep === 6 && (
                    <div className="space-y-4 border border-border bg-card rounded-lg p-6 mb-5">
                        <h2 className="font-heading text-lg font-semibold text-foreground">Achievements</h2>

                        <input
                            type="text"
                            value={achievementInput}
                            onChange={(e) => setAchievementInput(e.target.value)}
                            onKeyDown={handleAchievementKeyDown}
                            className="w-full border border-border rounded-md px-3 py-2 bg-background"
                            placeholder="Type an achievement and press Enter (e.g. Winner - Smart India Hackathon 2025)"
                        />

                        <div className="space-y-1">
                            {achievements.map((item, index) => (
                                <div key={index} className="flex justify-between items-center text-sm bg-muted rounded-md px-3 py-2">
                                    <span className="text-foreground">{item}</span>
                                    <button onClick={() => removeAchievement(index)} className="text-destructive hover:opacity-70">
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ============== STEP: Skills ============== */}
                {currentStep === 7 && (
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
                )}

                {/* ============== STEP: Summary (LAST) ============== */}
                {currentStep === 8 && (
                    <div className="space-y-4 border border-border bg-card rounded-lg p-6 mb-5">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                            <div>
                                <h2 className="font-heading text-lg font-semibold text-foreground">Professional Summary</h2>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    Since you've filled everything else, AI can now write a summary based on your whole resume.
                                </p>
                            </div>
                            <button
                                onClick={handleGenerateSummary}
                                disabled={generatingSummary}
                                className="text-sm bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:opacity-90 disabled:opacity-50 whitespace-nowrap w-full sm:w-auto"
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
                )}

                {/* ============== WIZARD NAV: Back / Next ============== */}
                <div className="flex items-center justify-between gap-3 mb-6">
                    <button
                        onClick={goBack}
                        disabled={currentStep === 0}
                        className="px-4 py-2.5 rounded-md text-sm font-medium border border-border bg-card hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                        ← Back
                    </button>

                    {!isLastStep ? (
                        <button
                            onClick={goNext}
                            className="px-4 py-2.5 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 whitespace-nowrap"
                        >
                            Next →
                        </button>
                    ) : (
                        <span className="text-xs sm:text-sm text-muted-foreground text-right">
                            Last section — Save your resume below ↓
                        </span>
                    )}
                </div>

                {/* Save / Download — always visible regardless of step */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-primary text-primary-foreground px-4 py-2.5 rounded-md text-sm font-medium hover:opacity-90 disabled:opacity-50 whitespace-nowrap"
                    >
                        {saving ? "Saving..." : "Save"}
                    </button>
                    <button
                        onClick={() => window.open(`/print/${id}`, "_blank")}
                        className="bg-card border border-border px-4 py-2.5 rounded-md text-sm font-medium hover:bg-muted whitespace-nowrap"
                    >
                        📄 Download PDF
                    </button>
                </div>
            </div>

            {/* Right Side: Live Preview */}
            <div className="w-full lg:w-1/2 lg:sticky lg:top-8 lg:self-start max-w-[556px] mx-auto lg:mx-0">
                <div className="mb-3 flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground shrink-0">🎨 Template:</span>
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
                        {TEMPLATES.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => handleSelectTemplate(t.id)}
                                className={`shrink-0 text-xs px-3 py-1.5 rounded-full whitespace-nowrap border transition flex items-center gap-1.5 ${templateId === t.id
                                    ? "border-primary bg-primary/10 text-foreground font-medium"
                                    : "border-border text-muted-foreground hover:border-primary/50"
                                    }`}
                            >
                                <span
                                    className="w-2.5 h-2.5 rounded-full shrink-0"
                                    style={{ backgroundColor: t.accentColor }}
                                />
                                {t.name}
                            </button>
                        ))}
                    </div>
                </div>
                <ScaledResumePreview
                    personalInfo={personalInfo}
                    summary={summary}
                    experience={experience}
                    education={education}
                    skills={skills}
                    projects={projects}
                    certifications={certifications}
                    languages={languages}
                    achievements={achievements}
                    templateId={templateId}
                />
            </div>
        </div>
    );
}