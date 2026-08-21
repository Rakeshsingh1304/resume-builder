import { Phone, Mail, MapPin, Globe, Link } from "lucide-react";
import InitialsAvatar from "./InitialsAvatar";
import { ResumeTemplateProps, formatDate } from "./types";

const GOLD = "#D4AF37";

function Heading({ children }: { children: React.ReactNode }) {
    return (
        <h2
            className="text-[13px] font-bold uppercase tracking-[0.12em] pb-1.5 mb-3 border-b-2"
            style={{ color: "#1A1A1A", borderColor: GOLD, fontFamily: "Georgia, serif" }}
        >
            {children}
        </h2>
    );
}

export default function Template10Executive({
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
            <div className="w-[270px] shrink-0 bg-black text-white p-7" style={{ breakInside: "avoid" }}>
                <InitialsAvatar fullName={personalInfo.fullName} size={64} bgColor={GOLD} textColor="#000000" />
                <h1
                    className="text-[22px] font-bold mt-4 leading-tight"
                    style={{ color: GOLD, fontFamily: "Georgia, serif" }}
                >
                    {personalInfo.fullName || "Your Name"}
                </h1>
                {personalInfo.title && (
                    <p className="text-[12.5px] text-gray-300 mt-1 tracking-wide">{personalInfo.title}</p>
                )}

                <div className="mt-7">
                    <h2
                        className="text-[11px] font-bold uppercase tracking-[0.12em] mb-2.5 border-b pb-1.5"
                        style={{ color: GOLD, borderColor: "rgba(212,175,55,0.3)" }}
                    >
                        Contact
                    </h2>
                    <div className="space-y-2 text-[11.5px] text-gray-300">
                        {personalInfo.phone && (
                            <div className="flex items-center gap-2">
                                <Phone size={12} style={{ color: GOLD }} className="shrink-0" />
                                <span className="break-all">{personalInfo.phone}</span>
                            </div>
                        )}
                        {personalInfo.email && (
                            <div className="flex items-center gap-2">
                                <Mail size={12} style={{ color: GOLD }} className="shrink-0" />
                                <span className="break-all">{personalInfo.email}</span>
                            </div>
                        )}
                        {personalInfo.location && (
                            <div className="flex items-center gap-2">
                                <MapPin size={12} style={{ color: GOLD }} className="shrink-0" />
                                <span className="break-all">{personalInfo.location}</span>
                            </div>
                        )}
                        {personalInfo.website && (
                            <div className="flex items-center gap-2">
                                <Globe size={12} style={{ color: GOLD }} className="shrink-0" />
                                <span className="break-all">{personalInfo.website}</span>
                            </div>
                        )}
                        {personalInfo.linkedin && (
                            <div className="flex items-center gap-2">
                                <Link size={12} style={{ color: GOLD }} className="shrink-0" />
                                <span className="break-all">{personalInfo.linkedin}</span>
                            </div>
                        )}
                        {personalInfo.github && (
                            <div className="flex items-center gap-2">
                                <Link size={12} style={{ color: GOLD }} className="shrink-0" />
                                <span className="break-all">{personalInfo.github}</span>
                            </div>
                        )}
                    </div>
                </div>

                {skills.length > 0 && (
                    <div className="mt-7">
                        <h2
                            className="text-[11px] font-bold uppercase tracking-[0.12em] mb-2.5 border-b pb-1.5"
                            style={{ color: GOLD, borderColor: "rgba(212,175,55,0.3)" }}
                        >
                            Skills
                        </h2>
                        <ul className="space-y-1.5 text-[11.5px] text-gray-300">
                            {skills.map((skill) => (
                                <li key={skill} className="flex items-center gap-2">
                                    <span className="w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: GOLD }} />
                                    {skill}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {languages.length > 0 && (
                    <div className="mt-7">
                        <h2
                            className="text-[11px] font-bold uppercase tracking-[0.12em] mb-2.5 border-b pb-1.5"
                            style={{ color: GOLD, borderColor: "rgba(212,175,55,0.3)" }}
                        >
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
                        <h2
                            className="text-[11px] font-bold uppercase tracking-[0.12em] mb-2.5 border-b pb-1.5"
                            style={{ color: GOLD, borderColor: "rgba(212,175,55,0.3)" }}
                        >
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
                                    <p className="font-bold text-[13.5px] text-black">
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
                                                <span style={{ color: GOLD }}>•</span> {line}
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
                    <div style={{ breakInside: "avoid" }}>
                        <Heading>Achievements</Heading>
                        <ul className="space-y-1">
                            {achievements.map((item, i) => (
                                <li key={i} className="text-[12px] text-gray-700 flex gap-1.5">
                                    <span style={{ color: GOLD }}>•</span> {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}