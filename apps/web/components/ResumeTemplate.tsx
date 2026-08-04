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

interface ResumeTemplateProps {
    personalInfo: PersonalInfo;
    summary: string;
    experience: ExperienceEntry[];
    education: EducationEntry[];
    skills: string[];
    projects?: ProjectEntry[];
    certifications?: CertificationEntry[];
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
    projects = [],
    certifications = [],
}: ResumeTemplateProps) {
    return (
        <div className="bg-white text-black p-10 shadow-lg" style={{ width: "794px", minHeight: "1123px" }}>
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

            {/* Projects */}
            {projects.length > 0 && (
                <div className="mb-4">
                    <h2 className="text-sm font-bold uppercase tracking-wide text-gray-700 mb-2">
                        Projects
                    </h2>
                    {projects.map((proj) => (
                        <div key={proj.id} className="mb-3">
                            <div className="flex justify-between items-baseline">
                                <p className="font-semibold text-sm">{proj.title}</p>
                                {proj.link && <p className="text-xs text-gray-500">{proj.link}</p>}
                            </div>
                            {proj.techStack && <p className="text-xs text-gray-600 italic">{proj.techStack}</p>}
                            <p className="text-sm text-gray-800 mt-1">{proj.description}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Certifications */}
            {certifications.length > 0 && (
                <div className="mb-4">
                    <h2 className="text-sm font-bold uppercase tracking-wide text-gray-700 mb-2">
                        Certifications
                    </h2>
                    {certifications.map((cert) => (
                        <div key={cert.id} className="flex justify-between items-baseline mb-1">
                            <p className="text-sm">
                                <span className="font-semibold">{cert.name}</span>
                                {cert.issuer && <span className="text-gray-600"> — {cert.issuer}</span>}
                            </p>
                            <p className="text-xs text-gray-500">{formatDate(cert.date)}</p>
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