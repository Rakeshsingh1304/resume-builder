export interface PersonalInfo {
    fullName?: string;
    title?: string;
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    linkedinUsername?: string;
    github?: string;
    githubUsername?: string;
    website?: string;
    websiteUsername?: string;
    photoUrl?: string;
    Behance?: string;
    BehanceUsername?: string;
    twitterUsername?: string;
    twitter?: string;
    facebookUsername?: string;
    facebook?: string;
    instagramUsername?: string;
    instagram?: string;
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
    customSections?: CustomSection[];
}

export function formatDate(dateStr?: string) {
    if (!dateStr) return "";
    const [year, month] = dateStr.split("-");
    const date = new Date(Number(year), Number(month) - 1);
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

// Ensures a URL always has a protocol so it actually navigates when clicked
// (e.g. a user typing "linkedin.com/in/x" without "https://" would
// otherwise be treated as a broken relative link on the current site).
export function normalizeUrl(url?: string): string {
    if (!url) return "#";
    const trimmed = url.trim();
    if (/^https?:\/\//i.test(trimmed) || /^mailto:/i.test(trimmed) || /^tel:/i.test(trimmed)) {
        return trimmed;
    }
    return `https://${trimmed}`;
}

export interface CustomSectionEntry {
    id: string;
    heading?: string;
    subheading?: string;
    description?: string;
}

export interface CustomSection {
    id: string;
    title: string;
    entries: CustomSectionEntry[];
}