"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useRef, useState } from "react";
import { apiFetch } from "@/lib/api";
import UpgradeModal from "@/components/UpgradeModal";
import { Mic, Square, Volume2, Loader2, CheckCircle2, RotateCcw, Send } from "lucide-react";

interface ResumeOption {
    id: string;
    title: string;
}

interface ChatMessage {
    role: "interviewer" | "candidate";
    text: string;
    feedback?: string;
}

interface FinalReport {
    overallRating: string;
    summary: string;
    strengths: string[];
    improvements: string[];
}

type Stage = "setup" | "interviewing" | "report";

export default function InterviewPracticePage() {
    const { getToken } = useAuth();

    const [subscriptionTier, setSubscriptionTier] = useState<string>("FREE");
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

    const [resumes, setResumes] = useState<ResumeOption[]>([]);
    const [selectedResumeId, setSelectedResumeId] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [interviewType, setInterviewType] = useState<"technical" | "behavioral" | "mixed">("mixed");
    const [starting, setStarting] = useState(false);

    const [stage, setStage] = useState<Stage>("setup");
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [currentAnswer, setCurrentAnswer] = useState("");
    const [sending, setSending] = useState(false);
    const [interviewComplete, setInterviewComplete] = useState(false);

    const [generatingReport, setGeneratingReport] = useState(false);
    const [report, setReport] = useState<FinalReport | null>(null);

    const [isListening, setIsListening] = useState(false);
    const [voiceSupported, setVoiceSupported] = useState(true);
    const recognitionRef = useRef<any>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function loadInitialData() {
            const token = await getToken();
            try {
                const me = await apiFetch("/api/users/me", token);
                setSubscriptionTier(me.subscriptionTier || "FREE");
            } catch {
                // default to FREE
            }
            try {
                const data = await apiFetch("/api/resumes", token);
                setResumes(data);
                if (data.length > 0) setSelectedResumeId(data[0].id);
            } catch {
                // ignore
            }
        }
        loadInitialData();

        const SpeechRecognitionCtor =
            (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        setVoiceSupported(!!SpeechRecognitionCtor);
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    async function callInterviewApi(history: { role: string; text: string }[]) {
        const token = await getToken();
        return apiFetch("/api/interview/message", token, {
            method: "POST",
            body: JSON.stringify({
                resumeId: selectedResumeId,
                jobDescription: jobDescription.trim() || undefined,
                interviewType,
                history,
            }),
        });
    }

    async function handleStartInterview() {
        if (subscriptionTier !== "PRO") {
            setIsUpgradeModalOpen(true);
            return;
        }
        if (!selectedResumeId) {
            alert("Please select a resume first.");
            return;
        }

        setStarting(true);
        try {
            const data = await callInterviewApi([]);
            setMessages([{ role: "interviewer", text: data.reply }]);
            setInterviewComplete(data.isComplete);
            setReport(null);
            setStage("interviewing");
        } catch (err: any) {
            alert(err.message || "Failed to start interview. Please try again.");
        } finally {
            setStarting(false);
        }
    }

    async function handleSendAnswer() {
        if (!currentAnswer.trim() || sending) return;

        const candidateMessage: ChatMessage = { role: "candidate", text: currentAnswer };
        const updatedMessages = [...messages, candidateMessage];
        setMessages(updatedMessages);
        setCurrentAnswer("");
        setSending(true);

        try {
            const data = await callInterviewApi(
                updatedMessages.map((m) => ({ role: m.role, text: m.text }))
            );

            setMessages((prev) => {
                const updated = [...prev];
                if (data.feedbackOnPrevious) {
                    updated[updated.length - 1] = {
                        ...updated[updated.length - 1],
                        feedback: data.feedbackOnPrevious,
                    };
                }
                updated.push({ role: "interviewer", text: data.reply });
                return updated;
            });

            setInterviewComplete(data.isComplete);

            if (data.isComplete) {
                const finalTranscript = [
                    ...updatedMessages,
                    { role: "interviewer" as const, text: data.reply },
                ];
                await handleGenerateReport(finalTranscript);
            }
        } catch (err: any) {
            alert(err.message || "Something went wrong. Please try again.");
        } finally {
            setSending(false);
        }
    }

    async function handleGenerateReport(fullTranscript: { role: string; text: string }[]) {
        setGeneratingReport(true);
        try {
            const token = await getToken();
            const data = await apiFetch("/api/interview/final-report", token, {
                method: "POST",
                body: JSON.stringify({
                    history: fullTranscript.map((m) => ({ role: m.role, text: m.text })),
                }),
            });
            setReport(data);
            setStage("report");
        } catch (err: any) {
            alert(err.message || "Failed to generate your report. Please try again.");
        } finally {
            setGeneratingReport(false);
        }
    }

    function handleRestart() {
        setStage("setup");
        setMessages([]);
        setCurrentAnswer("");
        setInterviewComplete(false);
        setReport(null);
    }

    // ---- Voice input (speech-to-text) ----
    function toggleListening() {
        if (isListening) {
            recognitionRef.current?.stop();
            return;
        }

        const SpeechRecognitionCtor =
            (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognitionCtor) {
            alert("Voice input isn't supported in this browser. Try Chrome or Edge on desktop/Android.");
            return;
        }

        const recognition = new SpeechRecognitionCtor();
        recognition.lang = "en-US";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event: any) => {
            const spokenText = event.results[0][0].transcript;
            setCurrentAnswer((prev) => (prev ? `${prev} ${spokenText}` : spokenText));
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);

        recognitionRef.current = recognition;
        recognition.start();
        setIsListening(true);
    }

    // ---- Voice output (text-to-speech) ----
    function speakText(text: string) {
        if (!("speechSynthesis" in window)) {
            alert("Voice playback isn't supported in this browser.");
            return;
        }
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1;
        window.speechSynthesis.speak(utterance);
    }

    const ratingColor: Record<string, string> = {
        Excellent: "bg-green-100 text-green-800",
        Strong: "bg-green-100 text-green-800",
        Good: "bg-amber-100 text-amber-800",
        "Needs Practice": "bg-red-100 text-red-800",
    };

    return (
        <div className="p-4 md:p-10 max-w-3xl mx-auto">
            <div className="flex items-center gap-2 mb-1">
                <Mic className="text-primary" size={24} />
                <h1 className="font-heading text-3xl font-bold text-foreground">Interview Practice</h1>
            </div>
            <p className="text-muted-foreground text-sm mb-8">
                A live, conversational mock interview based on your resume — type or speak your answers.
            </p>

            {/* ============== SETUP STAGE ============== */}
            {stage === "setup" && (
                <div className="border border-border bg-card rounded-lg p-6 space-y-5">
                    {subscriptionTier !== "PRO" && (
                        <div className="bg-primary/10 border border-primary/30 rounded-md p-3 text-sm text-foreground flex items-center justify-between gap-3 flex-wrap">
                            <span>🔒 Interview Practice is a Pro feature.</span>
                            <button
                                onClick={() => setIsUpgradeModalOpen(true)}
                                className="text-primary font-medium hover:underline whitespace-nowrap"
                            >
                                Upgrade to unlock
                            </button>
                        </div>
                    )}

                    {!voiceSupported && (
                        <p className="text-xs text-muted-foreground bg-muted rounded-md p-2.5">
                            ℹ️ Voice input works best in Chrome or Edge. In this browser you can still type your
                            answers normally.
                        </p>
                    )}

                    <div>
                        <label className="block text-sm font-medium mb-1.5 text-foreground">
                            Which resume should the interview be based on?
                        </label>
                        {resumes.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                You don't have any resumes yet — create one first from "My Resumes".
                            </p>
                        ) : (
                            <select
                                value={selectedResumeId}
                                onChange={(e) => setSelectedResumeId(e.target.value)}
                                className="w-full border border-border rounded-md px-3 py-2 bg-background"
                            >
                                {resumes.map((r) => (
                                    <option key={r.id} value={r.id}>
                                        {r.title}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1.5 text-foreground">Interview focus</label>
                        <div className="flex flex-col sm:flex-row gap-2">
                            {(["mixed", "technical", "behavioral"] as const).map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setInterviewType(type)}
                                    className={`flex-1 text-sm px-3 py-2 rounded-md border transition capitalize ${interviewType === type
                                        ? "border-primary bg-primary/10 text-foreground font-medium"
                                        : "border-border text-muted-foreground hover:border-primary/50"
                                        }`}
                                >
                                    {type === "mixed" ? "Mixed" : type === "technical" ? "Technical" : "Behavioral (HR)"}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1.5 text-foreground">
                            Target job description (optional)
                        </label>
                        <textarea
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            className="w-full border border-border rounded-md px-3 py-2 h-24 bg-background text-sm"
                            placeholder="Paste a job description to get questions tailored to that specific role..."
                        />
                    </div>

                    <button
                        onClick={handleStartInterview}
                        disabled={starting || resumes.length === 0}
                        className="w-full bg-primary text-primary-foreground font-medium py-3 rounded-md hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {starting ? (
                            <>
                                <Loader2 size={16} className="animate-spin" /> Preparing your interview...
                            </>
                        ) : (
                            "Start Mock Interview"
                        )}
                    </button>
                </div>
            )}

            {/* ============== INTERVIEWING STAGE (chat) ============== */}
            {stage === "interviewing" && (
                <div className="flex flex-col h-[70vh] border border-border bg-card rounded-lg overflow-hidden">
                    {/* Chat transcript */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((msg, i) => (
                            <div key={i}>
                                {msg.role === "interviewer" ? (
                                    <div className="flex items-start gap-2 max-w-[85%]">
                                        <div className="bg-secondary rounded-lg rounded-tl-none px-3.5 py-2.5">
                                            <p className="text-sm text-foreground">{msg.text}</p>
                                        </div>
                                        <button
                                            onClick={() => speakText(msg.text)}
                                            className="text-muted-foreground hover:text-primary transition mt-1 shrink-0"
                                            title="Play aloud"
                                        >
                                            <Volume2 size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-end">
                                        <div className="bg-primary text-primary-foreground rounded-lg rounded-tr-none px-3.5 py-2.5 max-w-[85%]">
                                            <p className="text-sm">{msg.text}</p>
                                        </div>
                                        {msg.feedback && (
                                            <div className="mt-1.5 max-w-[85%] bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
                                                <p className="text-[11px] font-semibold text-amber-800 mb-0.5">
                                                    💬 Coach feedback
                                                </p>
                                                <p className="text-xs text-amber-900">{msg.feedback}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}

                        {sending && (
                            <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                <Loader2 size={14} className="animate-spin" /> Interviewer is thinking...
                            </div>
                        )}

                        {generatingReport && (
                            <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                <Loader2 size={14} className="animate-spin" /> Preparing your final report...
                            </div>
                        )}

                        <div ref={chatEndRef} />
                    </div>

                    {/* Input area */}
                    {!interviewComplete && (
                        <div className="border-t border-border p-3 flex items-end gap-2">
                            <textarea
                                value={currentAnswer}
                                onChange={(e) => setCurrentAnswer(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendAnswer();
                                    }
                                }}
                                placeholder="Type or speak your answer..."
                                className="flex-1 border border-border rounded-md px-3 py-2 h-12 max-h-32 bg-background text-sm resize-none"
                            />
                            <button
                                onClick={toggleListening}
                                disabled={!voiceSupported}
                                className={`p-2.5 rounded-md border transition shrink-0 disabled:opacity-40 ${isListening
                                    ? "bg-destructive/10 border-destructive text-destructive animate-pulse"
                                    : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                                    }`}
                                title={voiceSupported ? "Speak your answer" : "Voice input not supported in this browser"}
                            >
                                {isListening ? <Square size={18} /> : <Mic size={18} />}
                            </button>
                            <button
                                onClick={handleSendAnswer}
                                disabled={sending || !currentAnswer.trim()}
                                className="p-2.5 rounded-md bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 shrink-0"
                                title="Send answer"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* ============== REPORT STAGE ============== */}
            {stage === "report" && report && (
                <div className="space-y-4">
                    <div className="border border-border bg-card rounded-lg p-6 text-center">
                        <p className="text-xs text-muted-foreground mb-2">Your Performance</p>
                        <span
                            className={`inline-block font-heading text-lg font-bold px-4 py-1.5 rounded-full ${ratingColor[report.overallRating] || "bg-muted text-foreground"
                                }`}
                        >
                            {report.overallRating}
                        </span>
                        <p className="text-sm text-foreground mt-4 leading-relaxed">{report.summary}</p>
                    </div>

                    {report.strengths.length > 0 && (
                        <div className="border border-border bg-card rounded-lg p-6">
                            <h3 className="font-heading text-sm font-semibold text-foreground mb-3">
                                ✅ What you did well
                            </h3>
                            <ul className="space-y-1.5">
                                {report.strengths.map((s, i) => (
                                    <li key={i} className="text-sm text-gray-700 flex gap-2">
                                        <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" /> {s}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {report.improvements.length > 0 && (
                        <div className="border border-border bg-card rounded-lg p-6">
                            <h3 className="font-heading text-sm font-semibold text-foreground mb-3">
                                📈 What to improve
                            </h3>
                            <ul className="space-y-1.5">
                                {report.improvements.map((s, i) => (
                                    <li key={i} className="text-sm text-gray-700 flex gap-2">
                                        <span className="text-primary font-bold shrink-0">•</span> {s}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <button
                        onClick={handleRestart}
                        className="w-full border border-border bg-card font-medium py-3 rounded-md hover:bg-muted flex items-center justify-center gap-2"
                    >
                        <RotateCcw size={16} /> Practice Again
                    </button>
                </div>
            )}

            <UpgradeModal
                isOpen={isUpgradeModalOpen}
                onClose={() => setIsUpgradeModalOpen(false)}
                onUpgraded={() => setSubscriptionTier("PRO")}
            />
        </div>
    );
}