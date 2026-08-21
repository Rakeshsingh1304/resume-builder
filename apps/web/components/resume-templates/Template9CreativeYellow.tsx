import { Phone, Mail, MapPin, Globe, Link } from "lucide-react";
import InitialsAvatar from "./InitialsAvatar";
import { ResumeTemplateProps, formatDate } from "./types";

const YELLOW = "#EAB308";

function Heading({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex items-center gap-2 mb-2.5">
            <span className="w-2.5 h-2.5 rounded-sm rotate-45 shrink-0" style={{ backgroundColor: YELLOW }} />
            <h2 className="text-[13px] font-bold uppercase tracking-wider text-[#1A1A1A]">{children}</h2>
        </div>
    );
}

export default function Template9CreativeYellow({
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
            className="bg-white text-[#1A1A1A] p-11"
            style={{ width: "794px", minHeight: "1123px", fontFamily: "Arial, sans-serif" }}
        >
            {/* Header */}
            <div className="flex justify-between items-start mb-7" style={{ breakInside: "avoid" }}>
                <div>
                    <h1 className="text-[30px] font-bold tracking-tight text-black">
                        {personalInfo.fullName || "Your Name"}
                    </h1>
                    {personalInfo.title && (
                        <p className="text-[14px] font-semibold mt-1" style={{ color: "#A16207" }}>
                            {personalInfo.title}
                        </p>
                    )}
                    <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 text-[11.5px] text-gray-600">
                        {personalInfo.phone && (
                            <span className="flex items-center gap-1.5">
                                <Phone size={11} style={{ color: "#A16207" }} /> {personalInfo.phone}
                            </span>
                        )}
                        {personalInfo.email && (
                            <span className="flex items-center gap-1.5">
                                <Mail size={11} style={{ color: "#A16207" }} /> {personalInfo.email}
                            </span>
                        )}
                        {personalInfo.location && (
                            <span className="flex items-center gap-1.5">
                                <MapPin size={11} style={{ color: "#A16207" }} /> {personalInfo.location}
                            </span>
                        )}
                        {personalInfo.linkedin && (
                            <span className="flex items-center gap-1.5">
                                <Link size={11} style={{ color: "#A16207" }} /> {personalInfo.linkedin}
                            </span>
                        )}
                        {personalInfo.github && (
                            <span className="flex items-center gap-1.5">
                                <Link size={11} style={{ color: "#A16207" }} /> {personalInfo.github}
                            </span>
                        )}
                        {personalInfo.website && (
                            <span className="flex items-center gap-1.5">
                                <Globe size={11} style={{ color: "#A16207" }} /> {personalInfo.website}
                            </span>
                        )}
                    </div>
                </div>
                <div className="relative shrink-0">
                    <div
                        className="absolute -top-3 -right-3 w-16 h-16 rounded-full opacity-25"
                        style={{ backgroundColor: YELLOW }}
                    />
                    <div className="relative">
                        <InitialsAvatar fullName={personalInfo.fullName} size={60} bgColor={YELLOW} textColor="#1A1A1A" />
                    </div>
                </div>
            </div>

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
                        <div key={exp.id} className="mb-3.5 last:mb-0" style={{ breakInside: "avoid" }}>
                            <div className="flex justify-between items-baseline">
                                <p className="font-bold text-[13.5px] text-black">{exp.role}</p>
                                <p className="text-[11px] text-gray-500 whitespace-nowrap ml-3">
                                    {formatDate(exp.startDate)} — {exp.currentlyWorking ? "Present" : formatDate(exp.endDate)}
                                </p>
                            </div>
                            <p className="text-[12.5px] font-medium mb-1" style={{ color: "#A16207" }}>{exp.company}</p>
                            <p className="text-[12px] text-gray-700 whitespace-pre-line leading-relaxed">{exp.description}</p>
                        </div>
                    ))}
                </div>
            )}

            {skills.length > 0 && (
                <div className="mb-5" style={{ breakInside: "avoid" }}>
                    <Heading>Skills</Heading>
                    <div className="flex flex-wrap gap-2">
                        {skills.map((skill) => (
                            <span
                                key={skill}
                                className="text-[11.5px] px-2.5 py-1 rounded-full font-medium"
                                style={{ backgroundColor: "#FEF9C3", color: "#854D0E" }}
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {education.length > 0 && (
                <div className="mb-5" style={{ breakInside: "avoid" }}>
                    <Heading>Education</Heading>
                    {education.map((edu) => (
                        <div key={edu.id} className="mb-2.5 last:mb-0">
                            <div className="flex justify-between items-baseline">
                                <p className="font-bold text-[13px] text-black">
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

            {projects.length > 0 && (
                <div className="mb-5">
                    <Heading>Projects</Heading>
                    {projects.map((proj) => (
                        <div key={proj.id} className="mb-3.5 last:mb-0" style={{ breakInside: "avoid" }}>
                            <div className="flex justify-between items-baseline">
                                <p className="font-bold text-[13px] text-black">{proj.title}</p>
                                {proj.link && (
                                    <p className="text-[11px] whitespace-nowrap ml-3" style={{ color: "#A16207" }}>
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
                            <p className="text-[12.5px] text-gray-800">
                                <span className="font-semibold text-black">{cert.name}</span>
                                {cert.issuer && <span className="text-gray-500"> — {cert.issuer}</span>}
                            </p>
                            <p className="text-[11px] text-gray-500 whitespace-nowrap ml-3">{formatDate(cert.date)}</p>
                        </div>
                    ))}
                </div>
            )}

            {languages.length > 0 && (
                <div className="mb-5" style={{ breakInside: "avoid" }}>
                    <Heading>Languages</Heading>
                    <div className="flex flex-wrap gap-x-6 gap-y-1 text-[12.5px] text-gray-800">
                        {languages.map((lang) => (
                            <span key={lang.id}>
                                <span className="font-semibold text-black">{lang.name}</span>
                                <span className="text-gray-500"> ({lang.proficiency})</span>
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {achievements.length > 0 && (
                <div style={{ breakInside: "avoid" }}>
                    <Heading>Achievements</Heading>
                    <ul className="space-y-1">
                        {achievements.map((item, i) => (
                            <li key={i} className="text-[12px] text-gray-700 flex gap-1.5">
                                <span style={{ color: "#A16207" }} className="font-bold">•</span> {item}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}