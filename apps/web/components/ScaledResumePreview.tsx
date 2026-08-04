"use client";

import { useEffect, useRef, useState } from "react";
import ResumeTemplate from "./ResumeTemplate";

const A4_WIDTH = 794; // px, roughly 210mm at 96 DPI
const A4_HEIGHT = 1123; // px, roughly 297mm at 96 DPI

interface Props {
    personalInfo: any;
    summary: string;
    experience: any[];
    education: any[];
    skills: string[];
    projects?: any[];
}

export default function ScaledResumePreview(props: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);

    useEffect(() => {
        function updateScale() {
            if (!containerRef.current) return;
            const availableWidth = containerRef.current.offsetWidth;
            const newScale = availableWidth / A4_WIDTH;
            setScale(newScale);
        }

        updateScale();
        window.addEventListener("resize", updateScale);
        return () => window.removeEventListener("resize", updateScale);
    }, []);

    return (
        <div ref={containerRef} className="w-full" style={{ height: A4_HEIGHT * scale }}>
            <div
                style={{
                    width: A4_WIDTH,
                    height: A4_HEIGHT,
                    transform: `scale(${scale})`,
                    transformOrigin: "top left",
                }}
            >
                <ResumeTemplate {...props} />
            </div>
        </div>
    );
}