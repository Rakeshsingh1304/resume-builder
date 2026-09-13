import { CustomSection } from "./types";
import React from "react";

interface Props {
    customSections?: CustomSection[];
    // Each template passes ITS OWN heading component here, so custom
    // sections always look pixel-identical to that template's real
    // section headings — no guessing colors/styles separately.
    renderHeading: (title: string) => React.ReactNode;
    textColor?: string;
}

// Shared by EVERY template — renders any user-defined custom sections
// (e.g. "Volunteer Experience", "Publications", "Hobbies").
export default function CustomSectionsRenderer({
    customSections = [],
    renderHeading,
    textColor = "#14213D",
}: Props) {
    if (!customSections || customSections.length === 0) return null;

    return (
        <>
            {customSections.map((section) => (
                <div key={section.id} className="mb-5">
                    {renderHeading(section.title || "Additional Section")}
                    {section.entries.map((entry) => (
                        <div key={entry.id} className="mb-3 last:mb-0" style={{ breakInside: "avoid" }}>
                            {(entry.heading || entry.subheading) && (
                                <div className="flex justify-between items-baseline">
                                    {entry.heading && (
                                        <p className="font-bold text-[13px]" style={{ color: textColor }}>
                                            {entry.heading}
                                        </p>
                                    )}
                                    {entry.subheading && (
                                        <p className="text-[11px] text-gray-500 whitespace-nowrap ml-3">
                                            {entry.subheading}
                                        </p>
                                    )}
                                </div>
                            )}
                            {entry.description && (
                                <p className="text-[12px] text-gray-700 leading-relaxed mt-0.5">
                                    {entry.description}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            ))}
        </>
    );
}