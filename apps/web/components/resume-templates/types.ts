export interface PersonalInfo {
    fullName?: string;
    title?: string;
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    github?: string;
    website?: string;
}

export interface ExperienceEntry {
    id: string;
    company?: string;
    role?: string;
    startDate?: string;
    endDate?: string;
    currentlyWorking?: boolean;
    description?: string;
}

export interface EducationEntry {
    id: string;
    institution?: string;
    degree?: string;
    fieldOfStudy?: string;
    startDate?: string;
    endDate?: string;
}

export interface ProjectEntry {
    id: string;
    title?: string;
    techStack?: string;
    link?: string;
    description?: string;
}

export interface CertificationEntry {
    id: string;
    name?: string;
    issuer?: string;
    date?: string;
}

export interface LanguageEntry {
    id: string;
    name?: string;
    proficiency?: string;
}

// Every template component receives exactly these props — this is what
// makes templates swappable. When adding a new template, its props MUST
// match this shape.
export interface ResumeTemplateProps {
    personalInfo: PersonalInfo;
    summary: string;
    experience: ExperienceEntry[];
    education: EducationEntry[];
    skills: string[];
    projects?: ProjectEntry[];
    certifications?: CertificationEntry[];
    languages?: LanguageEntry[];
    achievements?: string[];
}

export function formatDate(dateStr?: string) {
    if (!dateStr) return "";
    const [year, month] = dateStr.split("-");
    const date = new Date(Number(year), Number(month) - 1);
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}