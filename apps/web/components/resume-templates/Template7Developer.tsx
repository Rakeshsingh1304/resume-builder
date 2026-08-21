import { Phone, Mail, MapPin, Globe, Link, Code2 } from "lucide-react";
import { ResumeTemplateProps, formatDate } from "./types";

const TEAL = "#14B8A6";

function Heading({ children }: { children: React.ReactNode }) {
    return (
        <h2 className="text-[13px] font-bold uppercase tracking-wider text-[#0D1117] border-b-2 pb-1.5 mb-3" style={{ borderColor: TEAL }}>
            {children}
        </h2>
    );
}

export default function Template7Developer({
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
            className="bg-white flex"
            style={{ width: "794px", minHeight: "1123px", fontFamily: "Arial, sans-serif" }}
        >
            {/* Sidebar */}
            <div className="w-[270px] shrink-0 bg-[#0D1117] text-white p-7" style={{ breakInside: "avoid" }}>
                <div
                    className="w-14 h-14 rounded-lg flex items-center justify-center font-mono font-bold text-[20px]"
                    style={{ backgroundColor: TEAL, color: "#0D1117" }}
                >
                    <Code2 size={26} />
                </div>
                <h1 className="text-[21px] font-bold mt-4 leading-tight font-mono">
                    {personalInfo.fullName || "Your Name"}
                </h1>
                {personalInfo.title && (
                    <p className="text-[12.5px] mt-1 font-mono" style={{ color: TEAL }}>
                        {personalInfo.title}
                    </p>
                )}

                <div className="mt-7">
                    <h2 className="text-[11px] font-bold uppercase tracking-wider mb-2.5 font-mono" style={{ color: TEAL }}>
                        Contact
                    </h2>
                    <div className="space-y-2 text-[11.5px] text-gray-300">
                        {personalInfo.phone && (
                            <div className="flex items-center gap-2">
                                <Phone size={12} style={{ color: TEAL }} className="shrink-0" />
                                <span className="break-all">{personalInfo.phone}</span>
                            </div>
                        )}
                        {personalInfo.email && (
                            <div className="flex items-center gap-2">
                                <Mail size={12} style={{ color: TEAL }} className="shrink-0" />
                                <span className="break-all">{personalInfo.email}</span>
                            </div>
                        )}
                        {personalInfo.location && (
                            <div className="flex items-center gap-2">
                                <MapPin size={12} style={{ color: TEAL }} className="shrink-0" />
                                <span className="break-all">{personalInfo.location}</span>
                            </div>
                        )}
                        {personalInfo.website && (
                            <div className="flex items-center gap-2">
                                <Globe size={12} style={{ color: TEAL }} className="shrink-0" />
                                <span className="break-all">{personalInfo.website}</span>
                            </div>
                        )}
                        {personalInfo.linkedin && (
                            <div className="flex items-center gap-2">
                                <Link size={12} style={{ color: TEAL }} className="shrink-0" />
                                <span className="break-all">{personalInfo.linkedin}</span>
                            </div>
                        )}
                        {personalInfo.github && (
                            <div className="flex items-center gap-2">
                                <Link size={12} style={{ color: TEAL }} className="shrink-0" />
                                <span className="break-all">{personalInfo.github}</span>
                            </div>
                        )}
                    </div>
                </div>

                {skills.length > 0 && (
                    <div className="mt-7">
                        <h2 className="text-[11px] font-bold uppercase tracking-wider mb-2.5 font-mono" style={{ color: TEAL }}>
                            Tech Stack
                        </h2>
                        <div className="flex flex-wrap gap-1.5">
                            {skills.map((skill) => (
                                <span
                                    key={skill}
                                    className="text-[10.5px] font-mono px-2 py-1 rounded"
                                    style={{ backgroundColor: "rgba(20,184,166,0.15)", color: TEAL }}
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {languages.length > 0 && (
                    <div className="mt-7">
                        <h2 className="text-[11px] font-bold uppercase tracking-wider mb-2.5 font-mono" style={{ color: TEAL }}>
                            Languages
                        </h2>
                        <ul className="space-y-1.5 text-[11.5px] text-gray-300">
                            {languages.map((lang) => (
                                <li key={lang.id}>
                                    {lang.name} <span className="text-gray-500">({lang.proficiency})</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {certifications.length > 0 && (
                    <div className="mt-7">
                        <h2 className="text-[11px] font-bold uppercase tracking-wider mb-2.5 font-mono" style={{ color: TEAL }}>
                            Certifications
                        </h2>
                        <ul className="space-y-2 text-[11px] text-gray-300">
                            {certifications.map((cert) => (
                                <li key={cert.id}>
                                    <p className="font-medium text-white">{cert.name}</p>
                                    {cert.issuer && <p className="text-gray-500">{cert.issuer}</p>}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* Main content */}
            <div className="flex-1 p-7">
                {summary && (
                    <div className="mb-5" style={{ breakInside: "avoid" }}>
                        <Heading>Summary</Heading>
                        <p className="text-[12.5px] leading-relaxed text-gray-700">{summary}</p>
                    </div>
                )}

                {experience.length > 0 && (
                    <div className="mb-5">
                        <Heading>Experience</Heading>
                        {experience.map((exp) => (
                            <div key={exp.id} className="mb-4 last:mb-0" style={{ breakInside: "avoid" }}>
                                <div className="flex justify-between items-baseline">
                                    <p className="font-bold text-[13.5px] text-[#0D1117]">
                                        {exp.role}{" "}
                                        {exp.company && <span className="font-normal text-gray-600">| {exp.company}</span>}
                                    </p>
                                    <p className="text-[11px] text-gray-500 whitespace-nowrap ml-3 font-mono">
                                        {formatDate(exp.startDate)} — {exp.currentlyWorking ? "Present" : formatDate(exp.endDate)}
                                    </p>
                                </div>
                                {exp.description && (
                                    <ul className="mt-1.5 space-y-1">
                                        {exp.description.split("\n").filter(Boolean).map((line, i) => (
                                            <li key={i} className="text-[12px] text-gray-700 flex gap-1.5 leading-relaxed">
                                                <span style={{ color: TEAL }} className="font-mono">›</span> {line}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {projects.length > 0 && (
                    <div className="mb-5">
                        <Heading>Projects</Heading>
                        {projects.map((proj) => (
                            <div key={proj.id} className="mb-3.5 last:mb-0" style={{ breakInside: "avoid" }}>
                                <div className="flex justify-between items-baseline">
                                    <p className="font-bold text-[13px] text-[#0D1117]">{proj.title}</p>
                                    {proj.link && (
                                        <p className="text-[11px] font-mono whitespace-nowrap ml-3" style={{ color: TEAL }}>
                                            {proj.link}
                                        </p>
                                    )}
                                </div>
                                {proj.techStack && (
                                    <p className="text-[11px] text-gray-500 font-mono mb-1">{proj.techStack}</p>
                                )}
                                <p className="text-[12px] text-gray-700 leading-relaxed">{proj.description}</p>
                            </div>
                        ))}
                    </div>
                )}

                {education.length > 0 && (
                    <div className="mb-5" style={{ breakInside: "avoid" }}>
                        <Heading>Education</Heading>
                        {education.map((edu) => (
                            <div key={edu.id} className="mb-2.5 last:mb-0">
                                <div className="flex justify-between items-baseline">
                                    <p className="font-bold text-[13px] text-[#0D1117]">
                                        {edu.degree}
                                        {edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ""}
                                    </p>
                                    <p className="text-[11px] text-gray-500 whitespace-nowrap ml-3 font-mono">
                                        {formatDate(edu.startDate)} — {formatDate(edu.endDate)}
                                    </p>
                                </div>
                                <p className="text-[12px] text-gray-600">{edu.institution}</p>
                            </div>
                        ))}
                    </div>
                )}

                {achievements.length > 0 && (
                    <div style={{ breakInside: "avoid" }}>
                        <Heading>Achievements</Heading>
                        <ul className="space-y-1">
                            {achievements.map((item, i) => (
                                <li key={i} className="text-[12px] text-gray-700 flex gap-1.5">
                                    <span style={{ color: TEAL }} className="font-mono">›</span> {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}