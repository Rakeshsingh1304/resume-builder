"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { Pencil, Check, X, Trash2, Loader2 } from "lucide-react";
import NewResumeModal from "@/components/NewResumeModal";

interface Resume {
    id: string;
    title: string;
    updatedAt: string;
    atsScore: number | null;
}

export default function DashboardPage() {
    const { getToken } = useAuth();
    const router = useRouter();
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [loading, setLoading] = useState(true);

    // "+ New Resume" modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Inline rename state
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState("");
    const [savingTitle, setSavingTitle] = useState(false);

    // Delete state
    const [deletingId, setDeletingId] = useState<string | null>(null);

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

    function startEditing(resume: Resume) {
        setEditingId(resume.id);
        setEditValue(resume.title);
    }

    function cancelEditing() {
        setEditingId(null);
        setEditValue("");
    }

    async function saveTitle(resumeId: string) {
        const trimmed = editValue.trim();
        if (!trimmed) {
            alert("Resume name cannot be empty.");
            return;
        }
        setSavingTitle(true);
        try {
            const token = await getToken();
            await apiFetch(`/api/resumes/${resumeId}`, token, {
                method: "PATCH",
                body: JSON.stringify({ title: trimmed }),
            });
            setEditingId(null);
            await loadResumes();
        } catch (err: any) {
            alert(err.message || "Failed to rename resume. Please try again.");
        } finally {
            setSavingTitle(false);
        }
    }

    async function handleDelete(resumeId: string) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this resume? This action cannot be undone."
        );
        if (!confirmed) return;

        setDeletingId(resumeId);
        try {
            const token = await getToken();
            await apiFetch(`/api/resumes/${resumeId}`, token, { method: "DELETE" });
            await loadResumes();
        } catch (err: any) {
            alert(err.message || "Failed to delete resume. Please try again.");
        } finally {
            setDeletingId(null);
        }
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
                    onClick={() => setIsModalOpen(true)}
                    className="bg-primary text-primary-foreground px-4 py-2.5 rounded-md text-sm font-medium hover:opacity-90 transition w-full sm:w-auto whitespace-nowrap"
                >
                    + New Resume
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
                    {resumes.map((resume) => {
                        const isEditing = editingId === resume.id;
                        const isDeleting = deletingId === resume.id;

                        return (
                            <div
                                key={resume.id}
                                className="border border-border bg-card rounded-lg p-5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 hover:border-primary/50 transition"
                            >
                                {/* Clickable area -> navigates to the resume builder, unless currently editing the title */}
                                <div
                                    onClick={() => {
                                        if (!isEditing) router.push(`/resumes/${resume.id}`);
                                    }}
                                    className={`flex-1 min-w-0 ${isEditing ? "" : "cursor-pointer"}`}
                                >
                                    {isEditing ? (
                                        <div
                                            className="flex items-center gap-2"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <input
                                                autoFocus
                                                type="text"
                                                value={editValue}
                                                onChange={(e) => setEditValue(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") saveTitle(resume.id);
                                                    if (e.key === "Escape") cancelEditing();
                                                }}
                                                className="flex-1 min-w-0 border border-border rounded-md px-2 py-1.5 text-sm bg-background font-heading font-semibold"
                                            />
                                            <button
                                                onClick={() => saveTitle(resume.id)}
                                                disabled={savingTitle}
                                                className="text-primary hover:opacity-70 disabled:opacity-50 shrink-0"
                                                title="Save name"
                                            >
                                                {savingTitle ? (
                                                    <Loader2 size={18} className="animate-spin" />
                                                ) : (
                                                    <Check size={18} />
                                                )}
                                            </button>
                                            <button
                                                onClick={cancelEditing}
                                                disabled={savingTitle}
                                                className="text-muted-foreground hover:opacity-70 disabled:opacity-50 shrink-0"
                                                title="Cancel"
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 group/title">
                                            <p className="font-heading font-semibold text-foreground truncate">
                                                {resume.title}
                                            </p>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    startEditing(resume);
                                                }}
                                                className="text-muted-foreground hover:text-primary transition shrink-0 opacity-60 sm:opacity-0 sm:group-hover/title:opacity-100"
                                                title="Rename resume"
                                            >
                                                <Pencil size={14} />
                                            </button>
                                        </div>
                                    )}
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Last updated: {new Date(resume.updatedAt).toLocaleDateString()}
                                    </p>
                                </div>

                                {/* Right side: ATS score + delete button */}
                                <div className="flex items-center gap-4 shrink-0 self-end sm:self-center">
                                    {resume.atsScore !== null && (
                                        <div className="text-right">
                                            <p className="text-xs text-muted-foreground">ATS Score</p>
                                            <p className="font-heading font-bold text-primary">
                                                {resume.atsScore}/100
                                            </p>
                                        </div>
                                    )}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(resume.id);
                                        }}
                                        disabled={isDeleting}
                                        className="text-destructive hover:bg-destructive/10 p-2 rounded-md transition disabled:opacity-50 shrink-0"
                                        title="Delete resume"
                                    >
                                        {isDeleting ? (
                                            <Loader2 size={18} className="animate-spin" />
                                        ) : (
                                            <Trash2 size={18} />
                                        )}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <NewResumeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreated={loadResumes}
            />
        </div>
    );
}