import { Phone, Mail, MapPin, Globe, Link } from "lucide-react";
import InitialsAvatar from "./InitialsAvatar";
import { ResumeTemplateProps, formatDate } from "./types";

const BLUE = "#3B82F6";

function Heading({ children }: { children: React.ReactNode }) {
    return (
        <h2 className="text-[13px] font-bold uppercase tracking-wider text-[#1E3A8A] border-b-2 pb-1.5 mb-3" style={{ borderColor: BLUE }}>
            {children}
        </h2>
    );
}

export default function Template8Fresher({
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
            <div className="flex justify-between items-start mb-6 pb-5 border-b-2" style={{ borderColor: BLUE, breakInside: "avoid" }}>
                <div>
                    <h1 className="text-[28px] font-bold tracking-tight text-black">
                        {personalInfo.fullName || "Your Name"}
                    </h1>
                    {personalInfo.title && (
                        <p className="text-[14px] font-medium mt-1" style={{ color: BLUE }}>
                            {personalInfo.title}
                        </p>
                    )}
                    <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 text-[11.5px] text-gray-600">
                        {personalInfo.phone && (
                            <span className="flex items-center gap-1.5">
                                <Phone size={11} style={{ color: BLUE }} /> {personalInfo.phone}
                            </span>
                        )}
                        {personalInfo.email && (
                            <span className="flex items-center gap-1.5">
                                <Mail size={11} style={{ color: BLUE }} /> {personalInfo.email}
                            </span>
                        )}
                        {personalInfo.location && (
                            <span className="flex items-center gap-1.5">
                                <MapPin size={11} style={{ color: BLUE }} /> {personalInfo.location}
                            </span>
                        )}
                        {personalInfo.linkedin && (
                            <span className="flex items-center gap-1.5">
                                <Link size={11} style={{ color: BLUE }} /> {personalInfo.linkedin}
                            </span>
                        )}
                        {personalInfo.github && (
                            <span className="flex items-center gap-1.5">
                                <Link size={11} style={{ color: BLUE }} /> {personalInfo.github}
                            </span>
                        )}
                        {personalInfo.website && (
                            <span className="flex items-center gap-1.5">
                                <Globe size={11} style={{ color: BLUE }} /> {personalInfo.website}
                            </span>
                        )}
                    </div>
                </div>
                <InitialsAvatar fullName={personalInfo.fullName} size={60} bgColor={BLUE} textColor="#FFFFFF" />
            </div>

            {summary && (
                <div className="mb-5" style={{ breakInside: "avoid" }}>
                    <Heading>Summary</Heading>
                    <p className="text-[12.5px] leading-relaxed text-gray-700">{summary}</p>
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
                                    <p className="text-[11px] whitespace-nowrap ml-3" style={{ color: BLUE }}>
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
                            <p className="text-[12.5px] mb-1" style={{ color: BLUE }}>{exp.company}</p>
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
                                style={{ backgroundColor: "#DBEAFE", color: "#1E3A8A" }}
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
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

            {achievements.length > 0 && (
                <div className="mb-5" style={{ breakInside: "avoid" }}>
                    <Heading>Achievements</Heading>
                    <ul className="space-y-1">
                        {achievements.map((item, i) => (
                            <li key={i} className="text-[12px] text-gray-700 flex gap-1.5">
                                <span style={{ color: BLUE }} className="font-bold">•</span> {item}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {languages.length > 0 && (
                <div style={{ breakInside: "avoid" }}>
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
        </div>
    );
}