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

interface ResumeTemplateProps {
    personalInfo: PersonalInfo;
    summary: string;
    experience: ExperienceEntry[];
    education: EducationEntry[];
    skills: string[];
}

function formatDate(dateStr?: string) {
    if (!dateStr) return "";
    const [year, month] = dateStr.split("-");
    const date = new Date(Number(year), Number(month) - 1);
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export default function ResumeTemplate({
    personalInfo,
    summary,
    experience,
    education,
    skills,
}: ResumeTemplateProps) {
    return (
        <div className="bg-white text-black p-10 shadow-lg" style={{ width: "210mm", minHeight: "297mm" }}>
            {/* Header */}
            <div className="border-b-2 border-gray-800 pb-4 mb-4">
                <h1 className="text-3xl font-bold">{personalInfo.fullName || "Your Name"}</h1>
                <div className="flex gap-3 text-sm text-gray-600 mt-1 flex-wrap">
                    {personalInfo.email && <span>{personalInfo.email}</span>}
                    {personalInfo.phone && <span>• {personalInfo.phone}</span>}
                    {personalInfo.location && <span>• {personalInfo.location}</span>}
                    {personalInfo.linkedin && <span>• {personalInfo.linkedin}</span>}
                </div>
            </div>

            {/* Summary */}
            {summary && (
                <div className="mb-4">
                    <h2 className="text-sm font-bold uppercase tracking-wide text-gray-700 mb-1">
                        Professional Summary
                    </h2>
                    <p className="text-sm text-gray-800">{summary}</p>
                </div>
            )}

            {/* Experience */}
            {experience.length > 0 && (
                <div className="mb-4">
                    <h2 className="text-sm font-bold uppercase tracking-wide text-gray-700 mb-2">
                        Work Experience
                    </h2>
                    {experience.map((exp) => (
                        <div key={exp.id} className="mb-3">
                            <div className="flex justify-between items-baseline">
                                <p className="font-semibold text-sm">{exp.role}</p>
                                <p className="text-xs text-gray-500">
                                    {formatDate(exp.startDate)} — {exp.currentlyWorking ? "Present" : formatDate(exp.endDate)}
                                </p>
                            </div>
                            <p className="text-sm text-gray-600 italic">{exp.company}</p>
                            <p className="text-sm text-gray-800 mt-1 whitespace-pre-line">{exp.description}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Education */}
            {education.length > 0 && (
                <div className="mb-4">
                    <h2 className="text-sm font-bold uppercase tracking-wide text-gray-700 mb-2">
                        Education
                    </h2>
                    {education.map((edu) => (
                        <div key={edu.id} className="mb-2">
                            <div className="flex justify-between items-baseline">
                                <p className="font-semibold text-sm">
                                    {edu.degree}{edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ""}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {formatDate(edu.startDate)} — {formatDate(edu.endDate)}
                                </p>
                            </div>
                            <p className="text-sm text-gray-600 italic">{edu.institution}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Skills */}
            {skills.length > 0 && (
                <div>
                    <h2 className="text-sm font-bold uppercase tracking-wide text-gray-700 mb-2">
                        Skills
                    </h2>
                    <p className="text-sm text-gray-800">{skills.join(" • ")}</p>
                </div>
            )}
        </div>
    );
}