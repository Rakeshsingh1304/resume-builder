"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import ScaledResumePreview from "@/components/ScaledResumePreview";
import UpgradeModal from "@/components/UpgradeModal";

export default function PrintResumePage() {
    const { id } = useParams<{ id: string }>();
    const { getToken } = useAuth();
    const [data, setData] = useState<any>(null);
    const [templateId, setTemplateId] = useState<string>("classic");
    const [subscriptionTier, setSubscriptionTier] = useState<string | null>(null);
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

    useEffect(() => {
        async function load() {
            const token = await getToken();

            const me = await apiFetch("/api/users/me", token);
            setSubscriptionTier(me.subscriptionTier || "FREE");

            if (me.subscriptionTier !== "PRO") {
                setIsUpgradeModalOpen(true);
                return;
            }

            const resume = await apiFetch(`/api/resumes/${id}`, token);
            setData(resume.content || {});
            setTemplateId(resume.templateId || "classic");
        }
        load();
    }, [id]);

    useEffect(() => {
        if (data) {
            // Data load hote hi thoda wait karke print dialog kholo
            const timer = setTimeout(() => window.print(), 500);
            return () => clearTimeout(timer);
        }
    }, [data]);

    function handleUpgraded() {
        setSubscriptionTier("PRO");
        // Reload the page so it fetches the resume and proceeds to print now that the user is Pro
        window.location.reload();
    }

    if (subscriptionTier === null) return <div className="p-8">Loading...</div>;

    if (subscriptionTier !== "PRO") {
        return (
            <div className="min-h-screen flex items-center justify-center p-8 bg-background">
                <div className="text-center max-w-sm">
                    <p className="text-lg font-heading font-semibold text-foreground mb-2">
                        🔒 Pro feature
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                        Downloading and printing your resume requires a Pro subscription.
                    </p>
                </div>
                <UpgradeModal
                    isOpen={isUpgradeModalOpen}
                    onClose={() => window.close()}
                    onUpgraded={handleUpgraded}
                />
            </div>
        );
    }

    if (!data) return <div className="p-8">Loading...</div>;

    return (
        <div className="p-4 flex justify-center print:p-0">
            <div className="w-full max-w-[794px] print:max-w-none">
                <ScaledResumePreview
                    personalInfo={data.personalInfo || {}}
                    summary={data.summary || ""}
                    experience={data.experience || []}
                    education={data.education || []}
                    skills={data.skills || []}
                    projects={data.projects || []}
                    certifications={data.certifications || []}
                    languages={data.languages || []}
                    achievements={data.achievements || []}
                    templateId={templateId}
                />
            </div>
        </div>
    );
}