"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import ResumeTemplate from "@/components/ResumeTemplate";

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
        <ResumeTemplate
            personalInfo={data.personalInfo || {}}
            summary={data.summary || ""}
            experience={data.experience || []}
            education={data.education || []}
            skills={data.skills || []}
            projects={data.projects || []}
        />
    );
}