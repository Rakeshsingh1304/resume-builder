import { Phone, Mail, MapPin, Globe, Link } from "lucide-react";
import InitialsAvatar from "./InitialsAvatar";
import { ResumeTemplateProps, formatDate } from "./types";

function Heading({ children }: { children: React.ReactNode }) {
    return (
        <h2 className="text-[13px] font-bold uppercase tracking-wider text-[#1A1A1A] border-b-2 border-[#94A3B8] pb-1.5 mb-3">
            {children}
        </h2>
    );
}

export default function Template3ProfessionalDark({
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
            <div className="w-[270px] shrink-0 bg-[#0B0F19] text-white p-7 text-center" style={{ breakInside: "avoid" }}>
                <div className="flex justify-center">
                    <InitialsAvatar fullName={personalInfo.fullName} size={72} bgColor="#94A3B8" textColor="#0B0F19" />
                </div>
                <h1 className="text-[21px] font-bold mt-4 leading-tight">
                    {personalInfo.fullName || "Your Name"}
                </h1>
                {personalInfo.title && (
                    <p className="text-[12.5px] text-[#94A3B8] mt-1">{personalInfo.title}</p>
                )}

                <div className="mt-7 text-left">
                    <h2 className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] mb-2.5 border-b border-white/10 pb-1.5">
                        Contact
                    </h2>
                    <div className="space-y-2 text-[11.5px] text-gray-300">
                        {personalInfo.phone && (
                            <div className="flex items-center gap-2">
                                <Phone size={12} className="text-[#94A3B8] shrink-0" />
                                <span className="break-all">{personalInfo.phone}</span>
                            </div>
                        )}
                        {personalInfo.email && (
                            <div className="flex items-center gap-2">
                                <Mail size={12} className="text-[#94A3B8] shrink-0" />
                                <span className="break-all">{personalInfo.email}</span>
                            </div>
                        )}
                        {personalInfo.location && (
                            <div className="flex items-center gap-2">
                                <MapPin size={12} className="text-[#94A3B8] shrink-0" />
                                <span className="break-all">{personalInfo.location}</span>
                            </div>
                        )}
                        {personalInfo.website && (
                            <div className="flex items-center gap-2">
                                <Globe size={12} className="text-[#94A3B8] shrink-0" />
                                <span className="break-all">{personalInfo.website}</span>
                            </div>
                        )}
                        {personalInfo.linkedin && (
                            <div className="flex items-center gap-2">
                                <Link size={12} className="text-[#94A3B8] shrink-0" />
                                <span className="break-all">{personalInfo.linkedin}</span>
                            </div>
                        )}
                        {personalInfo.github && (
                            <div className="flex items-center gap-2">
                                <Link size={12} className="text-[#94A3B8] shrink-0" />
                                <span className="break-all">{personalInfo.github}</span>
                            </div>
                        )}
                    </div>
                </div>

                {skills.length > 0 && (
                    <div className="mt-7 text-left">
                        <h2 className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] mb-2.5 border-b border-white/10 pb-1.5">
                            Skills
                        </h2>
                        <div className="flex flex-wrap gap-1.5">
                            {skills.map((skill) => (
                                <span
                                    key={skill}
                                    className="text-[10.5px] bg-white/10 text-gray-100 px-2 py-1 rounded"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {languages.length > 0 && (
                    <div className="mt-7 text-left">
                        <h2 className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] mb-2.5 border-b border-white/10 pb-1.5">
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
                    <div className="mt-7 text-left">
                        <h2 className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] mb-2.5 border-b border-white/10 pb-1.5">
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
                                    <p className="font-bold text-[13.5px] text-[#0B0F19]">
                                        {exp.role}{" "}
                                        {exp.company && <span className="font-normal text-gray-600">| {exp.company}</span>}
                                    </p>
                                    <p className="text-[11px] text-gray-500 whitespace-nowrap ml-3">
                                        {formatDate(exp.startDate)} — {exp.currentlyWorking ? "Present" : formatDate(exp.endDate)}
                                    </p>
                                </div>
                                {exp.description && (
                                    <ul className="mt-1.5 space-y-1">
                                        {exp.description.split("\n").filter(Boolean).map((line, i) => (
                                            <li key={i} className="text-[12px] text-gray-700 flex gap-1.5 leading-relaxed">
                                                <span className="text-[#94A3B8]">•</span> {line}
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
                                    <p className="font-bold text-[13px] text-[#0B0F19]">{proj.title}</p>
                                    {proj.link && (
                                        <p className="text-[11px] text-gray-500 whitespace-nowrap ml-3">{proj.link}</p>
                                    )}
                                </div>
                                {proj.techStack && (
                                    <p className="text-[11px] text-gray-500 italic mb-1">{proj.techStack}</p>
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
                                    <p className="font-bold text-[13px] text-[#0B0F19]">
                                        {edu.degree}
                                        {edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ""}
                                    </p>
                                    <p className="text-[11px] text-gray-500 whitespace-nowrap ml-3">
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
                                    <span className="text-[#94A3B8]">•</span> {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}