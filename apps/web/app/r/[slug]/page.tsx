"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import TemplateRenderer from "@/components/resume-templates/TemplateRenderer";

export default function PublicResumePage() {
    const { slug } = useParams<{ slug: string }>();
    const [data, setData] = useState<any>(null);
    const [templateId, setTemplateId] = useState<string>("classic");
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        async function load() {
            try {
                const res = await fetch(`http://localhost:3001/api/public/resumes/${slug}`);
                if (!res.ok) {
                    setNotFound(true);
                    return;
                }
                const resume = await res.json();
                setData(resume.content || {});
                setTemplateId(resume.templateId || "classic");
            } catch {
                setNotFound(true);
            }
        }
        load();
    }, [slug]);

    if (notFound) {
        return (
            <div className="p-8 text-center">
                <h1 className="text-xl font-semibold">Resume not found</h1>
                <p className="text-gray-500">This resume may be private or no longer exists.</p>
            </div>
        );
    }

    if (!data) return <div className="p-8">Loading...</div>;

    return (
        <div className="flex justify-center p-8 bg-gray-100 min-h-screen">
            <TemplateRenderer
                templateId={templateId}
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
    );
}