"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import ScaledResumePreview from "@/components/ScaledResumePreview";

export default function PrintResumePage() {
    const { id } = useParams<{ id: string }>();
    const { getToken } = useAuth();
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        async function load() {
            const token = await getToken();
            const resume = await apiFetch(`/api/resumes/${id}`, token);
            setData(resume.content || {});
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
                />
            </div>
        </div>
    );
}