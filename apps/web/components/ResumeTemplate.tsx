import { Phone, Mail, MapPin, Globe, Link } from "lucide-react";

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

interface ResumeTemplateProps {
    personalInfo: PersonalInfo;
    summary: string;
    experience: ExperienceEntry[];
    education: EducationEntry[];
    skills: string[];
    projects?: ProjectEntry[];
    certifications?: CertificationEntry[];
    languages?: LanguageEntry[];
    achievements?: string[];
}

// Applied to anything that should NEVER be split across two printed pages
// (a whole short section, or a single entry inside a longer section).
const avoidBreak: React.CSSProperties = {
    breakInside: "avoid",
    // @ts-ignore -- older browsers look for the vendor/legacy property name
    WebkitColumnBreakInside: "avoid",
    pageBreakInside: "avoid",
};

function formatDate(dateStr?: string) {
    if (!dateStr) return "";
    const [year, month] = dateStr.split("-");
    const date = new Date(Number(year), Number(month) - 1);
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function SectionHeading({ children }: { children: React.ReactNode }) {
    return (
        <div className="mb-3">
            <h2 className="text-[13px] font-bold uppercase tracking-wider text-[#14213D]">
                {children}
            </h2>
            <div className="w-8 h-[3px] bg-[#E3A008] mt-1 rounded-full" />
        </div>
    );
}

function SectionDivider() {
    return <div className="border-b border-gray-200 mt-4 mb-5" />;
}

export default function ResumeTemplate({
    personalInfo,
    summary,
    experience,
    education,
    skills,
    projects = [],
    certifications = [],
    languages = [],
    achievements = [],
}: ResumeTemplateProps) {
    return (
        <div
            className="bg-white text-[#1A1A1A] p-12"
            style={{ width: "794px", minHeight: "1123px", fontFamily: "Arial, sans-serif" }}
        >
            {/* Header */}
            <div className="mb-6" style={avoidBreak}>
                <h1 className="text-[32px] font-bold tracking-tight text-[#14213D]">
                    {personalInfo.fullName || "Your Name"}
                </h1>

                {personalInfo.title && (
                    <p className="text-[15px] font-medium text-[#E3A008] mt-1 tracking-wide">
                        {personalInfo.title}
                    </p>
                )}

                <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-3 text-[13px] text-gray-700">
                    {personalInfo.phone && (
                        <span className="flex items-center gap-1.5">
                            <Phone size={13} className="text-[#E3A008]" /> {personalInfo.phone}
                        </span>
                    )}
                    {personalInfo.email && (
                        <span className="flex items-center gap-1.5">
                            <Mail size={13} className="text-[#E3A008]" /> {personalInfo.email}
                        </span>
                    )}
                    {personalInfo.location && (
                        <span className="flex items-center gap-1.5">
                            <MapPin size={13} className="text-[#E3A008]" /> {personalInfo.location}
                        </span>
                    )}
                    {personalInfo.website && (
                        <span className="flex items-center gap-1.5">
                            <Globe size={13} className="text-[#E3A008]" /> {personalInfo.website}
                        </span>
                    )}
                </div>

                {(personalInfo.linkedin || personalInfo.github) && (
                    <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-1.5 text-[13px] text-gray-700">
                        {personalInfo.linkedin && (
                            <span className="flex items-center gap-1.5">
                                <Link size={13} className="text-[#E3A008]" /> {personalInfo.linkedin}
                            </span>
                        )}
                        {personalInfo.github && (
                            <span className="flex items-center gap-1.5">
                                <Link size={13} className="text-[#E3A008]" /> {personalInfo.github}
                            </span>
                        )}
                    </div>
                )}

                <div className="border-b-2 border-[#14213D] mt-4" />
            </div>

            {/* Summary — short section, keep heading + text together */}
            {summary && (
                <div style={avoidBreak}>
                    <SectionHeading>Professional Summary</SectionHeading>
                    <p className="text-[13px] leading-relaxed text-gray-800">{summary}</p>
                    <SectionDivider />
                </div>
            )}

            {/* Experience — can be long, so only individual entries are
                protected from splitting (the section itself can flow
                across pages if there are many entries) */}
            {experience.length > 0 && (
                <div>
                    <SectionHeading>Experience</SectionHeading>
                    {experience.map((exp) => (
                        <div key={exp.id} className="mb-3.5 last:mb-0" style={avoidBreak}>
                            <div className="flex justify-between items-baseline">
                                <p className="font-bold text-[14px] text-[#14213D]">{exp.role}</p>
                                <p className="text-[12px] text-gray-500 whitespace-nowrap ml-3">
                                    {formatDate(exp.startDate)} — {exp.currentlyWorking ? "Present" : formatDate(exp.endDate)}
                                </p>
                            </div>
                            <p className="text-[13px] text-gray-600 italic mb-1">{exp.company}</p>
                            <p className="text-[13px] text-gray-800 whitespace-pre-line leading-relaxed">{exp.description}</p>
                        </div>
                    ))}
                    <SectionDivider />
                </div>
            )}

            {/* Projects — same approach as Experience */}
            {projects.length > 0 && (
                <div>
                    <SectionHeading>Projects</SectionHeading>
                    {projects.map((proj) => (
                        <div key={proj.id} className="mb-3.5 last:mb-0" style={avoidBreak}>
                            <div className="flex justify-between items-baseline">
                                <p className="font-bold text-[14px] text-[#14213D]">{proj.title}</p>
                                {proj.link && <p className="text-[12px] text-[#E3A008] whitespace-nowrap ml-3">{proj.link}</p>}
                            </div>
                            {proj.techStack && (
                                <p className="text-[12px] text-gray-600 italic mb-1">{proj.techStack}</p>
                            )}
                            <p className="text-[13px] text-gray-800 leading-relaxed">{proj.description}</p>
                        </div>
                    ))}
                    <SectionDivider />
                </div>
            )}

            {/* Education — usually short, keep whole section together;
                each entry is also protected individually as a backup */}
            {education.length > 0 && (
                <div style={avoidBreak}>
                    <SectionHeading>Education</SectionHeading>
                    {education.map((edu) => (
                        <div key={edu.id} className="mb-2.5 last:mb-0" style={avoidBreak}>
                            <div className="flex justify-between items-baseline">
                                <p className="font-bold text-[14px] text-[#14213D]">
                                    {edu.degree}{edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ""}
                                </p>
                                <p className="text-[12px] text-gray-500 whitespace-nowrap ml-3">
                                    {formatDate(edu.startDate)} — {formatDate(edu.endDate)}
                                </p>
                            </div>
                            <p className="text-[13px] text-gray-600 italic">{edu.institution}</p>
                        </div>
                    ))}
                    <SectionDivider />
                </div>
            )}

            {/* Certifications — this is the section from your screenshot;
                keeping the whole block together fixes the orphaned heading */}
            {certifications.length > 0 && (
                <div style={avoidBreak}>
                    <SectionHeading>Certifications</SectionHeading>
                    {certifications.map((cert) => (
                        <div
                            key={cert.id}
                            className="flex justify-between items-baseline mb-1 last:mb-0"
                            style={avoidBreak}
                        >
                            <p className="text-[13px] text-gray-800">
                                <span className="font-semibold text-[#14213D]">{cert.name}</span>
                                {cert.issuer && <span className="text-gray-600"> — {cert.issuer}</span>}
                            </p>
                            <p className="text-[12px] text-gray-500 whitespace-nowrap ml-3">{formatDate(cert.date)}</p>
                        </div>
                    ))}
                    <SectionDivider />
                </div>
            )}

            {/* Skills */}
            {skills.length > 0 && (
                <div style={avoidBreak}>
                    <SectionHeading>Skills</SectionHeading>
                    <div className="flex flex-wrap gap-2">
                        {skills.map((skill) => (
                            <span
                                key={skill}
                                className="text-[12px] bg-[#F0EFEA] text-[#14213D] px-2.5 py-1 rounded-full font-medium"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                    <SectionDivider />
                </div>
            )}

            {/* Languages */}
            {languages.length > 0 && (
                <div style={avoidBreak}>
                    <SectionHeading>Languages</SectionHeading>
                    <div className="flex flex-wrap gap-x-6 gap-y-1 text-[13px] text-gray-800">
                        {languages.map((lang) => (
                            <span key={lang.id}>
                                <span className="font-semibold text-[#14213D]">{lang.name}</span>
                                <span className="text-gray-500"> ({lang.proficiency})</span>
                            </span>
                        ))}
                    </div>
                    <SectionDivider />
                </div>
            )}

            {/* Achievements */}
            {achievements.length > 0 && (
                <div style={avoidBreak}>
                    <SectionHeading>Achievements</SectionHeading>
                    <ul className="text-[13px] text-gray-800 space-y-1">
                        {achievements.map((item, index) => (
                            <li key={index} className="flex gap-2" style={avoidBreak}>
                                <span className="text-[#E3A008] font-bold">•</span> {item}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}