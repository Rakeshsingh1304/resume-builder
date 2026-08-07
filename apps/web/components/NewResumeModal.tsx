"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { FilePlus2, UploadCloud, X, ArrowLeft, Loader2, FileText } from "lucide-react";

type Step = "choose" | "manual" | "upload";

interface NewResumeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreated: () => void; // called after a resume is successfully created (e.g. to refresh the list)
}

export default function NewResumeModal({ isOpen, onClose, onCreated }: NewResumeModalProps) {
    const { getToken } = useAuth();
    const router = useRouter();

    const [step, setStep] = useState<Step>("choose");
    const [manualName, setManualName] = useState("");
    const [creating, setCreating] = useState(false);

    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    if (!isOpen) return null;

    function resetAndClose() {
        setStep("choose");
        setManualName("");
        setUploadFile(null);
        setUploadError(null);
        onClose();
    }

    function goBackToChoose() {
        setStep("choose");
        setUploadFile(null);
        setUploadError(null);
    }

    async function handleCreateManual() {
        const title = manualName.trim() || "Untitled Resume";
        setCreating(true);
        try {
            const token = await getToken();
            const created = await apiFetch("/api/resumes", token, {
                method: "POST",
                body: JSON.stringify({ title }),
            });
            onCreated();
            resetAndClose();
            // Jump straight into the builder so the user can start filling the form
            router.push(`/resumes/${created.id}`);
        } catch (err: any) {
            alert(err.message || "Failed to create resume. Please try again.");
        } finally {
            setCreating(false);
        }
    }

    async function handleUploadSubmit() {
        if (!uploadFile) return;
        setUploading(true);
        setUploadError(null);
        try {
            const token = await getToken();

            // NOTE: This calls a backend endpoint that needs to be built:
            // POST /api/resumes/import  (multipart/form-data, field name "file")
            // It should: extract text from the PDF/DOCX, send it to Gemini to
            // structure it into the Resume.content JSON shape, then create
            // and return a new Resume record.
            const formData = new FormData();
            formData.append("file", uploadFile);

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/resumes/import`,
                {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}` },
                    body: formData,
                }
            );

            if (!res.ok) {
                throw new Error("Could not read your resume. Please try again or fill it manually.");
            }

            const created = await res.json();
            onCreated();
            resetAndClose();
            router.push(`/resumes/${created.id}`);
        } catch (err: any) {
            setUploadError(err.message || "Something went wrong while analyzing your resume.");
        } finally {
            setUploading(false);
        }
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={resetAndClose}
        >
            <div
                className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-lg p-6 sm:p-8 relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={resetAndClose}
                    className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition"
                    title="Close"
                >
                    <X size={20} />
                </button>

                {/* ---------- Step 1: Choose ---------- */}
                {step === "choose" && (
                    <>
                        <h2 className="font-heading text-xl font-bold text-foreground mb-1">
                            Create a New Resume
                        </h2>
                        <p className="text-sm text-muted-foreground mb-6">
                            Choose how you'd like to get started
                        </p>

                        <div className="space-y-3">
                            <button
                                onClick={() => setStep("manual")}
                                className="w-full text-left border border-border rounded-lg p-4 flex items-start gap-4 hover:border-primary hover:bg-primary/5 transition group"
                            >
                                <div className="bg-primary/10 text-primary rounded-full p-2.5 shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition">
                                    <FilePlus2 size={20} />
                                </div>
                                <div>
                                    <p className="font-heading font-semibold text-foreground">
                                        Create My Resume
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-0.5">
                                        Build it step-by-step with our guided form
                                    </p>
                                </div>
                            </button>

                            <button
                                onClick={() => setStep("upload")}
                                className="w-full text-left border border-border rounded-lg p-4 flex items-start gap-4 hover:border-primary hover:bg-primary/5 transition group"
                            >
                                <div className="bg-primary/10 text-primary rounded-full p-2.5 shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition">
                                    <UploadCloud size={20} />
                                </div>
                                <div>
                                    <p className="font-heading font-semibold text-foreground">
                                        Upload My Resume
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-0.5">
                                        Already have a resume? Upload it and AI will fill the form for you
                                    </p>
                                </div>
                            </button>
                        </div>
                    </>
                )}

                {/* ---------- Step 2a: Manual name ---------- */}
                {step === "manual" && (
                    <>
                        <button
                            onClick={goBackToChoose}
                            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
                        >
                            <ArrowLeft size={16} /> Back
                        </button>
                        <h2 className="font-heading text-xl font-bold text-foreground mb-1">
                            Name Your Resume
                        </h2>
                        <p className="text-sm text-muted-foreground mb-4">
                            e.g. "Software Engineer Resume" or "Marketing CV"
                        </p>
                        <input
                            autoFocus
                            type="text"
                            value={manualName}
                            onChange={(e) => setManualName(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleCreateManual()}
                            placeholder="Untitled Resume"
                            className="w-full border border-border rounded-md px-3 py-2.5 bg-background mb-4"
                        />
                        <button
                            onClick={handleCreateManual}
                            disabled={creating}
                            className="w-full bg-primary text-primary-foreground py-2.5 rounded-md text-sm font-medium hover:opacity-90 disabled:opacity-50"
                        >
                            {creating ? "Creating..." : "Create Resume"}
                        </button>
                    </>
                )}

                {/* ---------- Step 2b: Upload ---------- */}
                {step === "upload" && (
                    <>
                        <button
                            onClick={goBackToChoose}
                            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
                        >
                            <ArrowLeft size={16} /> Back
                        </button>
                        <h2 className="font-heading text-xl font-bold text-foreground mb-1">
                            Upload Your Resume
                        </h2>
                        <p className="text-sm text-muted-foreground mb-4">
                            PDF or Word (.docx) files work best. Our AI will read it and fill in your
                            details automatically.
                        </p>

                        {!uploadFile ? (
                            <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border rounded-lg p-8 cursor-pointer hover:border-primary hover:bg-primary/5 transition">
                                <UploadCloud size={28} className="text-muted-foreground" />
                                <span className="text-sm text-foreground font-medium">
                                    Click to browse or drag a file here
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    PDF or DOCX, up to 5MB
                                </span>
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    className="hidden"
                                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                                />
                            </label>
                        ) : (
                            <div className="border border-border rounded-lg p-4 flex items-center gap-3 mb-2">
                                <FileText size={20} className="text-primary shrink-0" />
                                <span className="text-sm text-foreground truncate flex-1">
                                    {uploadFile.name}
                                </span>
                                <button
                                    onClick={() => setUploadFile(null)}
                                    className="text-muted-foreground hover:text-destructive shrink-0"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        )}

                        {uploadError && (
                            <p className="text-sm text-destructive mt-2">{uploadError}</p>
                        )}

                        <button
                            onClick={handleUploadSubmit}
                            disabled={!uploadFile || uploading}
                            className="w-full bg-primary text-primary-foreground py-2.5 rounded-md text-sm font-medium hover:opacity-90 disabled:opacity-50 mt-4 flex items-center justify-center gap-2"
                        >
                            {uploading ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" /> Analyzing your resume...
                                </>
                            ) : (
                                "Analyze & Create Resume"
                            )}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}