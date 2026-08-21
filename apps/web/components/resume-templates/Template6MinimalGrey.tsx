import { Phone, Mail, MapPin, Globe, Link } from "lucide-react";
import { ResumeTemplateProps, formatDate } from "./types";

const GREY = "#6B7280";

function Heading({ children }: { children: React.ReactNode }) {
    return (
        <h2 className="text-[12px] font-bold uppercase tracking-wider text-[#374151] border-b border-gray-300 pb-1.5 mb-3">
            {children}
        </h2>
    );
}

export default function Template6MinimalGrey({
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
            className="bg-white text-[#1F2937] p-12"
            style={{ width: "794px", minHeight: "1123px", fontFamily: "Arial, sans-serif" }}
        >
            {/* Header */}
            <div className="mb-6" style={{ breakInside: "avoid" }}>
                <h1 className="text-[30px] font-bold tracking-tight text-[#111827]">
                    {personalInfo.fullName || "Your Name"}
                </h1>
                {personalInfo.title && (
                    <p className="text-[14px] mt-1" style={{ color: GREY }}>
                        {personalInfo.title}
                    </p>
                )}

                <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-3 text-[12px] text-gray-600">
                    {personalInfo.phone && (
                        <span className="flex items-center gap-1.5">
                            <Phone size={12} style={{ color: GREY }} /> {personalInfo.phone}
                        </span>
                    )}
                    {personalInfo.email && (
                        <span className="flex items-center gap-1.5">
                            <Mail size={12} style={{ color: GREY }} /> {personalInfo.email}
                        </span>
                    )}
                    {personalInfo.location && (
                        <span className="flex items-center gap-1.5">
                            <MapPin size={12} style={{ color: GREY }} /> {personalInfo.location}
                        </span>
                    )}
                    {personalInfo.website && (
                        <span className="flex items-center gap-1.5">
                            <Globe size={12} style={{ color: GREY }} /> {personalInfo.website}
                        </span>
                    )}
                </div>
                {(personalInfo.linkedin || personalInfo.github) && (
                    <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-1.5 text-[12px] text-gray-600">
                        {personalInfo.linkedin && (
                            <span className="flex items-center gap-1.5">
                                <Link size={12} style={{ color: GREY }} /> {personalInfo.linkedin}
                            </span>
                        )}
                        {personalInfo.github && (
                            <span className="flex items-center gap-1.5">
                                <Link size={12} style={{ color: GREY }} /> {personalInfo.github}
                            </span>
                        )}
                    </div>
                )}
                <div className="border-b border-gray-300 mt-4" />
            </div>

            {/* Summary */}
            {summary && (
                <div className="mb-5" style={{ breakInside: "avoid" }}>
                    <Heading>Summary</Heading>
                    <p className="text-[12.5px] leading-relaxed text-gray-700">{summary}</p>
                </div>
            )}

            {/* Experience */}
            {experience.length > 0 && (
                <div className="mb-5">
                    <Heading>Experience</Heading>
                    {experience.map((exp) => (
                        <div key={exp.id} className="mb-3.5 last:mb-0" style={{ breakInside: "avoid" }}>
                            <div className="flex justify-between items-baseline">
                                <p className="font-bold text-[13.5px] text-[#111827]">{exp.role}</p>
                                <p className="text-[11.5px] text-gray-500 whitespace-nowrap ml-3">
                                    {formatDate(exp.startDate)} — {exp.currentlyWorking ? "Present" : formatDate(exp.endDate)}
                                </p>
                            </div>
                            <p className="text-[12.5px] text-gray-500 italic mb-1">{exp.company}</p>
                            <p className="text-[12.5px] text-gray-700 whitespace-pre-line leading-relaxed">
                                {exp.description}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* Projects */}
            {projects.length > 0 && (
                <div className="mb-5">
                    <Heading>Projects</Heading>
                    {projects.map((proj) => (
                        <div key={proj.id} className="mb-3.5 last:mb-0" style={{ breakInside: "avoid" }}>
                            <div className="flex justify-between items-baseline">
                                <p className="font-bold text-[13px] text-[#111827]">{proj.title}</p>
                                {proj.link && (
                                    <p className="text-[11px] text-gray-500 whitespace-nowrap ml-3">{proj.link}</p>
                                )}
                            </div>
                            {proj.techStack && (
                                <p className="text-[11.5px] text-gray-500 italic mb-1">{proj.techStack}</p>
                            )}
                            <p className="text-[12.5px] text-gray-700 leading-relaxed">{proj.description}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Skills */}
            {skills.length > 0 && (
                <div className="mb-5" style={{ breakInside: "avoid" }}>
                    <Heading>Skills</Heading>
                    <div className="flex flex-wrap gap-2">
                        {skills.map((skill) => (
                            <span
                                key={skill}
                                className="text-[11.5px] bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Education */}
            {education.length > 0 && (
                <div className="mb-5" style={{ breakInside: "avoid" }}>
                    <Heading>Education</Heading>
                    {education.map((edu) => (
                        <div key={edu.id} className="mb-2.5 last:mb-0">
                            <div className="flex justify-between items-baseline">
                                <p className="font-bold text-[13px] text-[#111827]">
                                    {edu.degree}
                                    {edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ""}
                                </p>
                                <p className="text-[11.5px] text-gray-500 whitespace-nowrap ml-3">
                                    {formatDate(edu.startDate)} — {formatDate(edu.endDate)}
                                </p>
                            </div>
                            <p className="text-[12.5px] text-gray-600">{edu.institution}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Certifications */}
            {certifications.length > 0 && (
                <div className="mb-5" style={{ breakInside: "avoid" }}>
                    <Heading>Certifications</Heading>
                    {certifications.map((cert) => (
                        <div key={cert.id} className="flex justify-between items-baseline mb-1 last:mb-0">
                            <p className="text-[12.5px] text-gray-700">
                                <span className="font-semibold text-[#111827]">{cert.name}</span>
                                {cert.issuer && <span className="text-gray-500"> — {cert.issuer}</span>}
                            </p>
                            <p className="text-[11.5px] text-gray-500 whitespace-nowrap ml-3">{formatDate(cert.date)}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Languages */}
            {languages.length > 0 && (
                <div className="mb-5" style={{ breakInside: "avoid" }}>
                    <Heading>Languages</Heading>
                    <div className="flex flex-wrap gap-x-6 gap-y-1 text-[12.5px] text-gray-700">
                        {languages.map((lang) => (
                            <span key={lang.id}>
                                <span className="font-semibold text-[#111827]">{lang.name}</span>
                                <span className="text-gray-500"> ({lang.proficiency})</span>
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Achievements */}
            {achievements.length > 0 && (
                <div style={{ breakInside: "avoid" }}>
                    <Heading>Achievements</Heading>
                    <ul className="text-[12.5px] text-gray-700 space-y-1">
                        {achievements.map((item, index) => (
                            <li key={index} className="flex gap-2">
                                <span style={{ color: GREY }}>•</span> {item}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}