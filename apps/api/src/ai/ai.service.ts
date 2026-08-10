import { Injectable, ForbiddenException, BadRequestException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { GeminiProvider } from './providers/gemini.provider';
import { PrismaService } from '../prisma/prisma.service';

const FREE_MONTHLY_LIMIT = 10;

type AiFeature = 'SUMMARY_GEN' | 'EXPERIENCE_GEN' | 'ATS_CHECK' | 'COVER_LETTER_GEN' | 'RESUME_IMPORT' | 'PROJECT_GEN';

interface SummaryContext {
    personalInfo?: { title?: string;[key: string]: any };
    experience?: any[];
    education?: any[];
    skills?: string[];
    projects?: any[];
    achievements?: string[];
}

@Injectable()
export class AiService {
    constructor(
        private geminiProvider: GeminiProvider,
        private prisma: PrismaService,
    ) { }

    // Sirf CHECK karta hai ki user limit se neeche hai ya nahi — koi credit
    // record NAHI karta. Har AI call se PEHLE call karna hai.
    private async checkLimit(clerkId: string) {
        const user = await this.prisma.user.findUnique({ where: { clerkId } });
        if (!user) throw new ForbiddenException('User not found');

        // Pro users ke liye koi limit nahi
        if (user.subscriptionTier === 'PRO') return user;

        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const usageCount = await this.prisma.aICreditUsage.count({
            where: {
                userId: user.id,
                createdAt: { gte: startOfMonth },
            },
        });

        if (usageCount >= FREE_MONTHLY_LIMIT) {
            throw new ForbiddenException(
                `You've reached your free plan limit of ${FREE_MONTHLY_LIMIT} AI generations this month. Upgrade to Pro for unlimited access.`,
            );
        }

        return user;
    }

    // Sirf RECORD karta hai ki ek credit use hui — AI call SUCCESSFUL hone ke
    // BAAD hi call karna hai, taaki failed/retried attempts credit na khaayein.
    private async recordUsage(userId: string, feature: AiFeature) {
        await this.prisma.aICreditUsage.create({
            data: { userId, featureUsed: feature },
        });
    }

    /**
     * Generates a professional summary using EVERYTHING the user has filled
     * in so far (title, experience, education, projects, skills,
     * achievements) — meant to be called as the LAST step of the wizard,
     * once the rest of the resume is complete.
     */
    async generateSummary(clerkId: string, content: SummaryContext) {
        const user = await this.checkLimit(clerkId);

        const {
            personalInfo = {},
            experience = [],
            education = [],
            skills = [],
            projects = [],
            achievements = [],
        } = content;

        const experienceText =
            experience
                .map((e: any) => `- ${e.role || 'Role'} at ${e.company || 'Company'}: ${e.description || 'No description provided'}`)
                .join('\n') || 'None provided';

        const educationText =
            education
                .map((e: any) => `- ${e.degree || ''} in ${e.fieldOfStudy || ''} from ${e.institution || ''}`)
                .join('\n') || 'None provided';

        const projectsText =
            projects
                .map((p: any) => `- ${p.title || 'Project'} (${p.techStack || 'N/A'}): ${p.description || 'No description provided'}`)
                .join('\n') || 'None provided';

        const prompt = `Write a professional 2-3 sentence resume summary for the candidate described below. Use ONLY the information given — do not invent facts, companies, or numbers that aren't mentioned. Keep it concise, achievement-oriented, and in third person implied (no "I" statements). Return only the summary text, no extra commentary.

Title/Role: ${personalInfo.title || 'Not specified'}

Work Experience:
${experienceText}

Education:
${educationText}

Projects:
${projectsText}

Skills: ${skills.length > 0 ? skills.join(', ') : 'None provided'}

Achievements: ${achievements.length > 0 ? achievements.join(', ') : 'None provided'}`;

        const summary = await this.geminiProvider.generateText(prompt);
        await this.recordUsage(user.id, 'SUMMARY_GEN');
        return summary;
    }

    /**
     * Generates a bullet-style description for ONE work experience entry,
     * using the company, role, and dates as context. Used by the
     * "✨ Generate with AI" button next to each experience entry.
     */
    async generateExperienceDescription(
        clerkId: string,
        company: string,
        role: string,
        startDate?: string,
        endDate?: string,
        currentlyWorking?: boolean,
    ) {
        const user = await this.checkLimit(clerkId);

        const duration = currentlyWorking
            ? `${startDate || 'unknown start'} to Present`
            : `${startDate || 'unknown start'} to ${endDate || 'unknown end'}`;

        const prompt = `Write 3 concise, achievement-oriented resume bullet points for the following work experience. Each bullet should start with a strong action verb, and should describe realistic, plausible responsibilities and impact for this role — do not invent specific numbers or company names beyond what's given. Separate bullets with a newline character. Do not use markdown bullet symbols (no "-" or "*"), just plain lines of text. Return ONLY the bullet points, no extra commentary.

Role: ${role}
Company: ${company}
Duration: ${duration}`;

        const description = await this.geminiProvider.generateText(prompt);
        await this.recordUsage(user.id, 'EXPERIENCE_GEN');
        return description.trim();
    }

    /**
     * Generates a description for ONE project entry, using the project
     * title and tech stack as context. Used by the "✨ Generate with AI"
     * button next to each project entry.
     */
    async generateProjectDescription(clerkId: string, title: string, techStack?: string) {
        const user = await this.checkLimit(clerkId);

        const prompt = `Write a concise, achievement-oriented 2-3 sentence description for a resume project entry. Focus on what the project does, the problem it solves, and the candidate's role in building it. Do not invent specific metrics or claims beyond what's implied by the title and tech stack. Return ONLY the description text, no extra commentary, no markdown.

Project Title: ${title}
Tech Stack: ${techStack || 'Not specified'}`;

        const description = await this.geminiProvider.generateText(prompt);
        await this.recordUsage(user.id, 'PROJECT_GEN');
        return description.trim();
    }

    /**
     * Compares the resume's content against a pasted job description and
     * returns a match percentage, matched/missing keywords, and a short
     * suggestion. Used by the "Check Job Match" feature inside ATS Score.
     */
    async matchJobDescription(clerkId: string, resumeContent: any, jobDescription: string) {
        const user = await this.checkLimit(clerkId);

        const { summary = '', skills = [], experience = [], projects = [] } = resumeContent || {};

        const experienceText =
            (experience || [])
                .map((e: any) => `- ${e.role || ''} at ${e.company || ''}: ${e.description || ''}`)
                .join('\n') || 'None';

        const projectsText =
            (projects || [])
                .map((p: any) => `- ${p.title || ''} (${p.techStack || ''}): ${p.description || ''}`)
                .join('\n') || 'None';

        const prompt = `Compare the resume below against the target job description and return ONLY a JSON object (no markdown fences, no explanation) in this exact shape:

{
  "matchPercentage": 0,
  "matchedKeywords": [],
  "missingKeywords": [],
  "suggestions": ""
}

Rules:
- "matchPercentage" is a whole number from 0 to 100 estimating how well the resume aligns with the job description's requirements.
- "matchedKeywords": important skills/technologies/qualifications mentioned in the job description that ARE found somewhere in the resume (max 10, most important first).
- "missingKeywords": important skills/technologies/qualifications from the job description that are NOT found in the resume (max 10, most important first).
- "suggestions": 1-2 concise sentences of concrete advice on what the candidate should add or emphasize to better match this job.

Resume Summary: ${summary || 'Not provided'}
Resume Skills: ${skills.length > 0 ? skills.join(', ') : 'None listed'}
Resume Experience:
${experienceText}
Resume Projects:
${projectsText}

Job Description:
"""
${jobDescription.slice(0, 6000)}
"""`;

        const rawResponse = await this.geminiProvider.generateText(prompt);
        const parsed = this.parseJsonResponse(rawResponse);

        await this.recordUsage(user.id, 'ATS_CHECK');

        return {
            matchPercentage: typeof parsed.matchPercentage === 'number' ? parsed.matchPercentage : 0,
            matchedKeywords: Array.isArray(parsed.matchedKeywords) ? parsed.matchedKeywords : [],
            missingKeywords: Array.isArray(parsed.missingKeywords) ? parsed.missingKeywords : [],
            suggestions: parsed.suggestions || '',
        };
    }

    /**
     * Reviews the resume's summary and experience/project descriptions for
     * writing quality — weak phrases, missing quantifiable results, action
     * verb usage — and returns specific, actionable feedback.
     */
    async analyzeWritingQuality(clerkId: string, resumeContent: any) {
        const user = await this.checkLimit(clerkId);

        const { summary = '', experience = [], projects = [] } = resumeContent || {};

        const experienceText =
            (experience || [])
                .map((e: any) => `- ${e.role || ''} at ${e.company || ''}: ${e.description || 'No description'}`)
                .join('\n') || 'None provided';

        const projectsText =
            (projects || [])
                .map((p: any) => `- ${p.title || ''}: ${p.description || 'No description'}`)
                .join('\n') || 'None provided';

        const prompt = `Analyze the writing quality of this resume's summary and experience/project descriptions from an ATS and recruiter perspective. Return ONLY a JSON object (no markdown fences, no explanation) in this exact shape:

{
  "overallQuality": "Needs Improvement",
  "strengths": [],
  "improvements": []
}

Rules:
- "overallQuality" must be EXACTLY one of these three strings: "Strong", "Good", "Needs Improvement".
- "strengths": 2-4 short bullet points (each under 15 words) about what the writing does well (e.g. action verbs, quantifiable results, clarity).
- "improvements": 2-5 short, specific, actionable bullet points (each under 20 words). Call out weak phrases actually found in the text below (e.g. "Responsible for" should become an action verb), missing numbers/metrics, vague wording, or repetition.
- Be specific to THIS resume's actual content — do not give generic advice that doesn't reference something in the text below.
- If there isn't enough content to analyze, say so honestly in "improvements".

Resume Summary: ${summary || 'Not provided'}

Experience Descriptions:
${experienceText}

Project Descriptions:
${projectsText}`;

        const rawResponse = await this.geminiProvider.generateText(prompt);
        const parsed = this.parseJsonResponse(rawResponse);

        await this.recordUsage(user.id, 'ATS_CHECK');

        return {
            overallQuality: ['Strong', 'Good', 'Needs Improvement'].includes(parsed.overallQuality)
                ? parsed.overallQuality
                : 'Needs Improvement',
            strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
            improvements: Array.isArray(parsed.improvements) ? parsed.improvements : [],
        };
    }

    /**
     * Rewrites the summary and experience/project descriptions to address
     * specific feedback (from the Writing Quality Check), without inventing
     * new facts, companies, or fabricated numbers.
     */
    async improveResumeContent(
        clerkId: string,
        content: { summary?: string; experience?: any[]; projects?: any[] },
        improvements: string[],
    ) {
        const user = await this.checkLimit(clerkId);

        const { summary = '', experience = [], projects = [] } = content;

        const experienceInput = experience.map((e: any, i: number) => ({
            index: i,
            role: e.role || '',
            company: e.company || '',
            description: e.description || '',
        }));

        const projectsInput = projects.map((p: any, i: number) => ({
            index: i,
            title: p.title || '',
            techStack: p.techStack || '',
            description: p.description || '',
        }));

        const prompt = `You are improving a resume based on specific feedback. Rewrite the summary and the "description" field of each experience and project entry below so they address the feedback — stronger action verbs, clearer impact, less repetition.

CRITICAL RULES:
- NEVER invent new facts: do not add companies, technologies, degrees, or specific achievements that weren't already implied by the original text.
- If a suggestion asks for measurable results (numbers/%) and none exist in the original text, insert a clearly marked placeholder like "[add a specific number here]" instead of making one up.
- Keep each experience/project description roughly the same length as the original (do not pad with fluff).
- Preserve the meaning and factual content — only improve the WRITING.

Feedback to address:
${improvements.map((s) => `- ${s}`).join('\n')}

Original Summary:
"${summary || 'None provided'}"

Original Experience Entries:
${JSON.stringify(experienceInput, null, 2)}

Original Project Entries:
${JSON.stringify(projectsInput, null, 2)}

Return ONLY a JSON object (no markdown fences, no explanation) in this EXACT shape:
{
  "summary": "improved summary text here",
  "experience": [ { "index": 0, "description": "improved description" } ],
  "projects": [ { "index": 0, "description": "improved description" } ]
}

Include one object per input entry, using the same "index" values given above.`;

        const rawResponse = await this.geminiProvider.generateText(prompt);
        const parsed = this.parseJsonResponse(rawResponse);

        await this.recordUsage(user.id, 'ATS_CHECK');

        return {
            summary: typeof parsed.summary === 'string' ? parsed.summary : summary,
            experience: Array.isArray(parsed.experience) ? parsed.experience : [],
            projects: Array.isArray(parsed.projects) ? parsed.projects : [],
        };
    }

    /**
     * Takes raw text extracted from an uploaded resume (PDF/DOCX) and asks
     * Gemini to structure it into the exact JSON shape our Resume.content
     * field expects. Used by the "Upload My Resume" feature.
     */
    async generateResumeFromText(clerkId: string, rawText: string) {
        const user = await this.checkLimit(clerkId);

        const prompt = `You are a resume-parsing assistant. Read the raw resume text below and convert it into a JSON object that STRICTLY follows this exact shape (use empty strings/arrays for anything you cannot find — never invent information that isn't in the text):

{
  "personalInfo": { "fullName": "", "title": "", "email": "", "phone": "", "location": "", "linkedin": "", "github": "", "website": "" },
  "summary": "",
  "experience": [ { "company": "", "role": "", "startDate": "YYYY-MM", "endDate": "YYYY-MM", "currentlyWorking": false, "description": "" } ],
  "education": [ { "institution": "", "degree": "", "fieldOfStudy": "", "startDate": "YYYY-MM", "endDate": "YYYY-MM" } ],
  "projects": [ { "title": "", "techStack": "", "link": "", "description": "" } ],
  "certifications": [ { "name": "", "issuer": "", "date": "YYYY-MM" } ],
  "languages": [ { "name": "", "proficiency": "Conversational" } ],
  "skills": [],
  "achievements": []
}

Rules:
- Return ONLY the raw JSON object. No markdown code fences, no explanation, no extra text before or after.
- Dates should be formatted as "YYYY-MM" where possible; if only a year is available, use "YYYY-01".
- "proficiency" for languages must be one of: Native, Fluent, Conversational, Basic.
- If the resume text is empty or unreadable, return the shape above with all fields left empty.

Resume text:
"""
${rawText.slice(0, 12000)}
"""`;

        const rawResponse = await this.geminiProvider.generateText(prompt);
        const parsed = this.parseJsonResponse(rawResponse);
        const content = this.addEntryIds(parsed);

        // Yahan tak pahunch gaye matlab call successful thi AND JSON valid tha — ab credit record karo
        await this.recordUsage(user.id, 'RESUME_IMPORT');

        return content;
    }

    private parseJsonResponse(rawResponse: string) {
        // Gemini sometimes wraps JSON in ```json ... ``` fences — strip them if present
        const cleaned = rawResponse
            .trim()
            .replace(/^```json/i, '')
            .replace(/^```/, '')
            .replace(/```$/, '')
            .trim();

        try {
            return JSON.parse(cleaned);
        } catch {
            throw new BadRequestException(
                'Could not understand the resume content. Please try a different file or fill the form manually.',
            );
        }
    }

    // Our frontend expects each list entry (experience, education, etc.) to
    // have a unique "id" field — Gemini won't reliably generate these, so we
    // add them ourselves after parsing.
    private addEntryIds(content: any) {
        const withIds = (arr: any[]) =>
            Array.isArray(arr) ? arr.map((item) => ({ id: randomUUID(), ...item })) : [];

        return {
            personalInfo: content.personalInfo || {},
            summary: content.summary || '',
            skills: Array.isArray(content.skills) ? content.skills : [],
            achievements: Array.isArray(content.achievements) ? content.achievements : [],
            experience: withIds(content.experience),
            education: withIds(content.education),
            projects: withIds(content.projects),
            certifications: withIds(content.certifications),
            languages: withIds(content.languages),
        };
    }
}