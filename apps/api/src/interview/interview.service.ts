import { Injectable, BadRequestException } from '@nestjs/common';
import { GeminiProvider } from '../ai/providers/gemini.provider';

export interface ChatTurn {
    role: 'interviewer' | 'candidate';
    text: string;
}

@Injectable()
export class InterviewService {
    constructor(private geminiProvider: GeminiProvider) { }

    /**
     * Continues the live mock-interview conversation. Given everything said
     * so far, the AI decides whether to:
     *   - ask a follow-up question (if the candidate's last answer was
     *     vague/incomplete), staying on the same topic until it's clear, OR
     *   - move on to a new topic, OR
     *   - wrap up the interview (isComplete: true) once enough ground has
     *     been covered.
     */
    async continueConversation(
        resumeContent: any,
        jobDescription: string | undefined,
        interviewType: 'technical' | 'behavioral' | 'mixed',
        history: ChatTurn[],
    ) {
        const { personalInfo = {}, experience = [], projects = [], skills = [] } = resumeContent || {};

        const experienceText =
            (experience || [])
                .map((e: any) => `- ${e.role || ''} at ${e.company || ''}: ${e.description || ''}`)
                .join('\n') || 'None';

        const projectsText =
            (projects || [])
                .map((p: any) => `- ${p.title || ''} (${p.techStack || ''}): ${p.description || ''}`)
                .join('\n') || 'None';

        const focusInstruction =
            interviewType === 'technical'
                ? 'Focus mostly on technical questions about their skills, projects, and experience.'
                : interviewType === 'behavioral'
                    ? 'Focus mostly on behavioral/HR-style questions (teamwork, challenges, motivation, conflict resolution).'
                    : 'Mix technical and behavioral questions roughly evenly.';

        const jobContext = jobDescription
            ? `The candidate is preparing for this specific job posting:\n"""\n${jobDescription.slice(0, 4000)}\n"""\n`
            : '';

        const transcriptText =
            history.length === 0
                ? '(No conversation yet — this is the very first message.)'
                : history
                    .map((t) => `${t.role === 'interviewer' ? 'Interviewer' : 'Candidate'}: ${t.text}`)
                    .join('\n');

        const exchangeCount = history.filter((t) => t.role === 'candidate').length;

        const prompt = `You are an experienced, friendly but rigorous interviewer conducting a LIVE mock interview with a candidate. This is a natural back-and-forth conversation, not a fixed script.

${jobContext}Candidate title: ${personalInfo.title || 'Not specified'}
Skills: ${skills.join(', ') || 'None listed'}
Experience:
${experienceText}
Projects:
${projectsText}

${focusInstruction}

Conversation so far:
${transcriptText}

The candidate has answered ${exchangeCount} question(s) so far.

Instructions:
- If the candidate's most recent answer was vague, incomplete, or you genuinely want to dig deeper, ask a natural, SPECIFIC follow-up question on the SAME topic — don't just accept a shallow answer.
- If they answered thoroughly and well, briefly acknowledge it and move to a NEW relevant topic (a different skill, project, experience entry, or a behavioral scenario) based on their resume.
- Vary your phrasing naturally like a real interviewer would — don't repeat the same structure every time.
- Once the conversation has reasonably covered their key skills, experience, and (if behavioral/mixed) some behavioral aspects — roughly after 8 to 12 total candidate answers — wrap up warmly (thank them, mention next steps) instead of asking a new question, and set "isComplete" to true.
- If this is the very first message (no conversation yet), just ask a warm opening/icebreaker question and leave "feedbackOnPrevious" as an empty string.

Return ONLY a JSON object (no markdown fences, no extra text) in this EXACT shape:
{
  "feedbackOnPrevious": "brief 1-2 sentence coaching feedback on their most recent answer, or empty string if there isn't one yet",
  "reply": "your next message to the candidate",
  "isComplete": false
}`;

        const raw = await this.geminiProvider.generateText(prompt);
        const parsed = this.parseJsonObject(raw);

        return {
            feedbackOnPrevious: typeof parsed.feedbackOnPrevious === 'string' ? parsed.feedbackOnPrevious : '',
            reply: typeof parsed.reply === 'string' ? parsed.reply : '',
            isComplete: Boolean(parsed.isComplete),
        };
    }

    async generateFinalReport(history: ChatTurn[]) {
        const transcript = history
            .map((t) => `${t.role === 'interviewer' ? 'Interviewer' : 'Candidate'}: ${t.text}`)
            .join('\n');

        const prompt = `You are an interview coach reviewing a full mock interview transcript. Based on the conversation below, return ONLY a JSON object (no markdown fences, no explanation) in this EXACT shape:

{
  "overallRating": "Strong",
  "summary": "2-3 sentence overall summary of how they did.",
  "strengths": ["short bullet 1", "short bullet 2"],
  "improvements": ["short specific actionable bullet 1", "short specific actionable bullet 2"]
}

Rules:
- "overallRating" must be EXACTLY one of: "Excellent", "Strong", "Good", "Needs Practice".
- "strengths": 2-4 short bullets (under 15 words each).
- "improvements": 2-4 short, specific, actionable bullets (under 20 words each) — reference their actual answers where possible.

Transcript:
${transcript}`;

        const raw = await this.geminiProvider.generateText(prompt);
        const parsed = this.parseJsonObject(raw);

        return {
            overallRating: ['Excellent', 'Strong', 'Good', 'Needs Practice'].includes(parsed.overallRating)
                ? parsed.overallRating
                : 'Good',
            summary: parsed.summary || '',
            strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
            improvements: Array.isArray(parsed.improvements) ? parsed.improvements : [],
        };
    }

    private stripFences(raw: string): string {
        return raw
            .trim()
            .replace(/^```json/i, '')
            .replace(/^```/, '')
            .replace(/```$/, '')
            .trim();
    }

    private parseJsonObject(raw: string): any {
        try {
            return JSON.parse(this.stripFences(raw));
        } catch {
            throw new BadRequestException(
                'Something went wrong understanding the interview response. Please try again.',
            );
        }
    }
}