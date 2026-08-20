import ResumeTemplate from "../ResumeTemplate"; // the original default template
import Template1ModernBlue from "./Template1ModernBlue";
import Template2MinimalBlack from "./Template2MinimalBlack";
import Template3ProfessionalDark from "./Template3ProfessionalDark";
import Template4CreativePurple from "./Template4CreativePurple";
import Template5CorporateGreen from "./Template5CorporateGreen";
import { ResumeTemplateProps } from "./types";

// The registry — every template gets an entry here. The picker UI reads
// this list to render the gallery. When a new template is added, add it
// to BOTH this array AND the switch statement below.
export const TEMPLATES = [
    { id: "classic", name: "Classic Navy", accentColor: "#E3A008" },
    { id: "template-1", name: "Modern Blue", accentColor: "#2563EB" },
    { id: "template-2", name: "Minimal Black", accentColor: "#000000" },
    { id: "template-3", name: "Professional Dark", accentColor: "#0B0F19" },
    { id: "template-4", name: "Creative Purple", accentColor: "#9333EA" },
    { id: "template-5", name: "Corporate Green", accentColor: "#16A34A" },
    // Templates 6-10 will be added here one at a time
] as const;

export type TemplateId = (typeof TEMPLATES)[number]["id"];

interface TemplateRendererProps extends ResumeTemplateProps {
    templateId?: string;
}

export default function TemplateRenderer({ templateId = "classic", ...props }: TemplateRendererProps) {
    switch (templateId) {
        case "template-1":
            return <Template1ModernBlue {...props} />;
        case "template-2":
            return <Template2MinimalBlack {...props} />;
        case "template-3":
            return <Template3ProfessionalDark {...props} />;
        case "template-4":
            return <Template4CreativePurple {...props} />;
        case "template-5":
            return <Template5CorporateGreen {...props} />;
        case "classic":
        default:
            return <ResumeTemplate {...props} />;
    }
}