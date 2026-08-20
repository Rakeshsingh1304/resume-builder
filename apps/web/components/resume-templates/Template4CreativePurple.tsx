import { Phone, Mail, MapPin, Globe, Link } from "lucide-react";
import InitialsAvatar from "./InitialsAvatar";
import { ResumeTemplateProps, formatDate } from "./types";

const PURPLE = "#9333EA";

function Heading({ children }: { children: React.ReactNode }) {
    return (
        <h2 className="text-[12px] font-bold uppercase tracking-wider mb-2.5" style={{ color: PURPLE }}>
            {children}
        </h2>
    );
}

export default function Template4CreativePurple({
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
            className="bg-white text-[#1A1A1A] p-10"
            style={{ width: "794px", minHeight: "1123px", fontFamily: "Arial, sans-serif" }}
        >
            {/* Header */}
            <div className="flex justify-between items-start mb-8" style={{ breakInside: "avoid" }}>
                <div>
                    <h1 className="text-[30px] font-bold tracking-tight text-black">
                        {personalInfo.fullName || "Your Name"}
                    </h1>
                    {personalInfo.title && (
                        <p className="text-[14px] font-semibold mt-1" style={{ color: PURPLE }}>
                            {personalInfo.title}
                        </p>
                    )}
                </div>
                <div className="relative shrink-0">
                    <div
                        className="absolute -inset-2 rounded-full border-2 border-dashed opacity-40"
                        style={{ borderColor: PURPLE }}
                    />
                    <InitialsAvatar fullName={personalInfo.fullName} size={64} bgColor={PURPLE} textColor="#FFFFFF" />
                </div>
            </div>

            <div className="flex gap-8">
                {/* Left column: facts */}
                <div className="w-[220px] shrink-0">
                    <div className="mb-6" style={{ breakInside: "avoid" }}>
                        <Heading>Contact</Heading>
                        <div className="space-y-2 text-[11.5px] text-gray-700">
                            {personalInfo.phone && (
                                <div className="flex items-center gap-2">
                                    <Phone size={12} style={{ color: PURPLE }} className="shrink-0" />
                                    <span className="break-all">{personalInfo.phone}</span>
                                </div>
                            )}
                            {personalInfo.email && (
                                <div className="flex items-center gap-2">
                                    <Mail size={12} style={{ color: PURPLE }} className="shrink-0" />
                                    <span className="break-all">{personalInfo.email}</span>
                                </div>
                            )}
                            {personalInfo.location && (
                                <div className="flex items-center gap-2">
                                    <MapPin size={12} style={{ color: PURPLE }} className="shrink-0" />
                                    <span className="break-all">{personalInfo.location}</span>
                                </div>
                            )}
                            {personalInfo.website && (
                                <div className="flex items-center gap-2">
                                    <Globe size={12} style={{ color: PURPLE }} className="shrink-0" />
                                    <span className="break-all">{personalInfo.website}</span>
                                </div>
                            )}
                            {personalInfo.linkedin && (
                                <div className="flex items-center gap-2">
                                    <Link size={12} style={{ color: PURPLE }} className="shrink-0" />
                                    <span className="break-all">{personalInfo.linkedin}</span>
                                </div>
                            )}
                            {personalInfo.github && (
                                <div className="flex items-center gap-2">
                                    <Link size={12} style={{ color: PURPLE }} className="shrink-0" />
                                    <span className="break-all">{personalInfo.github}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {skills.length > 0 && (
                        <div className="mb-6" style={{ breakInside: "avoid" }}>
                            <Heading>Skills</Heading>
                            <ul className="space-y-1.5 text-[11.5px] text-gray-700">
                                {skills.map((skill) => (
                                    <li key={skill} className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: PURPLE }} />
                                        {skill}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {education.length > 0 && (
                        <div className="mb-6" style={{ breakInside: "avoid" }}>
                            <Heading>Education</Heading>
                            {education.map((edu) => (
                                <div key={edu.id} className="mb-3 last:mb-0">
                                    <p className="font-bold text-[12px] text-black leading-snug">
                                        {edu.degree}
                                        {edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ""}
                                    </p>
                                    <p className="text-[11px] text-gray-600">{edu.institution}</p>
                                    <p className="text-[10.5px] text-gray-500">
                                        {formatDate(edu.startDate)} — {formatDate(edu.endDate)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}

                    {languages.length > 0 && (
                        <div className="mb-6" style={{ breakInside: "avoid" }}>
                            <Heading>Languages</Heading>
                            <ul className="space-y-1.5 text-[11.5px] text-gray-700">
                                {languages.map((lang) => (
                                    <li key={lang.id}>
                                        {lang.name} <span className="text-gray-500">({lang.proficiency})</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Right column: story */}
                <div className="flex-1">
                    {summary && (
                        <div className="mb-5" style={{ breakInside: "avoid" }}>
                            <Heading>Summary</Heading>
                            <p className="text-[12.5px] leading-relaxed text-gray-800">{summary}</p>
                        </div>
                    )}

                    {experience.length > 0 && (
                        <div className="mb-5">
                            <Heading>Experience</Heading>
                            {experience.map((exp) => (
                                <div key={exp.id} className="mb-4 last:mb-0" style={{ breakInside: "avoid" }}>
                                    <div className="flex justify-between items-baseline">
                                        <p className="font-bold text-[13.5px] text-black">{exp.role}</p>
                                        <p className="text-[11px] text-gray-500 whitespace-nowrap ml-3">
                                            {formatDate(exp.startDate)} — {exp.currentlyWorking ? "Present" : formatDate(exp.endDate)}
                                        </p>
                                    </div>
                                    <p className="text-[12px] font-medium mb-1" style={{ color: PURPLE }}>
                                        {exp.company}
                                    </p>
                                    <p className="text-[12px] text-gray-700 whitespace-pre-line leading-relaxed">
                                        {exp.description}
                                    </p>
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
                                        <p className="font-bold text-[13px] text-black">{proj.title}</p>
                                        {proj.link && (
                                            <p className="text-[11px] whitespace-nowrap ml-3" style={{ color: PURPLE }}>
                                                {proj.link}
                                            </p>
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

                    {certifications.length > 0 && (
                        <div className="mb-5" style={{ breakInside: "avoid" }}>
                            <Heading>Certifications</Heading>
                            {certifications.map((cert) => (
                                <div key={cert.id} className="flex justify-between items-baseline mb-1 last:mb-0">
                                    <p className="text-[12px] text-gray-800">
                                        <span className="font-semibold text-black">{cert.name}</span>
                                        {cert.issuer && <span className="text-gray-500"> — {cert.issuer}</span>}
                                    </p>
                                    <p className="text-[11px] text-gray-500 whitespace-nowrap ml-3">{formatDate(cert.date)}</p>
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
                                        <span style={{ color: PURPLE }}>•</span> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}