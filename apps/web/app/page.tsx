"use client";

import Link from "next/link";
import { useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  Sparkles,
  FileText,
  Target,
  Upload,
  Share2,
  CheckCircle2,
  LayoutTemplate,
  ArrowRight,
  Menu,
  X,
  ChevronDown,
  Star,
  Zap,
  Brain,
  ScanSearch,
  Download,
  ShieldCheck,
  BriefcaseBusiness,
  WandSparkles,
  BarChart3,
  CircleCheck,
  Quote,
  Search,
  PenLine,
  Rocket,
  Users,
  TrendingUp,
  Award,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                                   DATA                                     */
/* -------------------------------------------------------------------------- */

const navLinks = [
  { name: "How it works", href: "#how-it-works" },
  { name: "Features", href: "#features" },
  { name: "Templates", href: "#templates" },
  { name: "Pricing", href: "#pricing" },
];

const marqueeItems = [
  "AI Resume Writing",
  "ATS Score",
  "Job Match",
  "Smart Keywords",
  "Resume Templates",
  "PDF Export",
  "Shareable Links",
  "AI Suggestions",
];

const features = [
  {
    icon: Sparkles,
    title: "AI Writing Assistant",
    desc: "Turn simple details into strong professional summaries and achievement-focused bullet points.",
  },
  {
    icon: Target,
    title: "ATS Score Checker",
    desc: "Understand how your resume performs and discover exactly what needs improvement.",
  },
  {
    icon: ScanSearch,
    title: "Job Match Analysis",
    desc: "Paste a job description and instantly discover missing skills and important keywords.",
  },
  {
    icon: LayoutTemplate,
    title: "Modern Templates",
    desc: "Choose a clean professional design and switch your resume style anytime.",
  },
  {
    icon: Upload,
    title: "Upload & Autofill",
    desc: "Already have a resume? Upload it and let ResumeAI organize your information.",
  },
  {
    icon: Share2,
    title: "Public Resume Link",
    desc: "Create a clean shareable link for recruiters, LinkedIn, email, and applications.",
  },
];

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Software Developer",
    text: "I rebuilt my resume in one evening. The AI suggestions helped me explain my projects much better.",
    initials: "PS",
  },
  {
    name: "Arjun Mehta",
    role: "Marketing Associate",
    text: "The job match feature made it much easier to understand what recruiters were actually looking for.",
    initials: "AM",
  },
  {
    name: "Rahul Verma",
    role: "Final Year Student",
    text: "Before this, I had no idea how to structure a professional resume. The guided builder made everything simple.",
    initials: "RV",
  },
];

const faqs = [
  {
    question: "Is ResumeAI free to use?",
    answer:
      "Yes. You can start building your resume for free and explore the core builder features before upgrading.",
  },
  {
    question: "What is an ATS score?",
    answer:
      "An ATS score helps you understand how well your resume is structured for applicant tracking systems and how closely it matches relevant job requirements.",
  },
  {
    question: "Can I upload my existing resume?",
    answer:
      "Yes. Upload your existing resume and use it as a starting point instead of filling everything from scratch.",
  },
  {
    question: "Can I download my resume as a PDF?",
    answer:
      "Yes. You can export your completed resume as a clean, professional PDF.",
  },
  {
    question: "Who is ResumeAI built for?",
    answer:
      "ResumeAI is designed for students, freshers, early-career professionals, and anyone who wants help creating a clearer, stronger resume.",
  },
];

/* -------------------------------------------------------------------------- */
/*                              REUSABLE COMPONENTS                            */
/* -------------------------------------------------------------------------- */

function SectionHeading({
  badge,
  title,
  description,
}: {
  badge?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mx-auto mb-14 max-w-3xl text-center">
      {badge && (
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-bold tracking-wider text-primary">
          <Sparkles size={14} />
          {badge}
        </div>
      )}

      <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
        {title}
      </h2>

      {description && (
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}

function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.65, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              RESUME PREVIEW                                */
/* -------------------------------------------------------------------------- */

function ResumePreview() {
  return (
    <div className="relative mx-auto w-full max-w-[460px]">
      {/* Glow */}
      <div className="absolute inset-0 scale-90 rounded-full bg-primary/20 blur-3xl" />

      {/* Floating card top */}
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute -right-4 -top-5 z-20 hidden rounded-2xl border border-border bg-card p-4 shadow-xl sm:block"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10 text-green-600">
            <TrendingUp size={20} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Resume Score</p>
            <p className="font-heading text-lg font-bold">+24%</p>
          </div>
        </div>
      </motion.div>

      {/* Main resume */}
      <motion.div
        initial={{ opacity: 0, rotate: 6, y: 40 }}
        animate={{ opacity: 1, rotate: 0, y: 0 }}
        transition={{ duration: 0.9, delay: 0.3 }}
        className="relative z-10 rounded-2xl border border-border bg-card p-6 shadow-2xl sm:p-8"
      >
        <div className="mb-6 border-b-2 border-[#14213D] pb-5">
          <div className="mb-3 flex items-start justify-between">
            <div>
              <div className="h-4 w-44 rounded bg-[#14213D]" />
              <div className="mt-2 h-2.5 w-28 rounded bg-primary" />
            </div>

            <div className="h-10 w-10 rounded-full bg-secondary" />
          </div>

          <div className="mt-3 flex gap-3">
            <div className="h-2 w-16 rounded bg-muted" />
            <div className="h-2 w-20 rounded bg-muted" />
            <div className="h-2 w-14 rounded bg-muted" />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <div className="mb-3 h-2.5 w-24 rounded bg-[#14213D]/80" />
            <div className="space-y-2">
              <div className="h-2 w-full rounded bg-muted" />
              <div className="h-2 w-11/12 rounded bg-muted" />
              <div className="h-2 w-9/12 rounded bg-muted" />
            </div>
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <div className="h-2.5 w-20 rounded bg-[#14213D]/80" />
              <div className="h-2 w-14 rounded bg-primary/50" />
            </div>

            <div className="space-y-2">
              <div className="h-2 w-full rounded bg-muted" />
              <div className="h-2 w-10/12 rounded bg-muted" />
              <div className="h-2 w-8/12 rounded bg-muted" />
            </div>
          </div>

          <div>
            <div className="mb-3 h-2.5 w-16 rounded bg-[#14213D]/80" />

            <div className="flex flex-wrap gap-2">
              {["React", "Node.js", "TypeScript", "AWS"].map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-secondary px-3 py-1 text-[10px] font-semibold text-[#14213D]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ATS floating card */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 4.5, repeat: Infinity }}
        className="absolute -bottom-8 -left-3 z-20 rounded-2xl bg-[#14213D] p-5 text-white shadow-2xl sm:-left-10"
      >
        <div className="flex items-center gap-4">
          <div className="relative flex h-14 w-14 items-center justify-center rounded-full border-[5px] border-primary">
            <span className="font-heading text-sm font-bold">92%</span>
          </div>

          <div>
            <p className="text-xs text-white/60">ATS Compatibility</p>
            <p className="font-heading text-lg font-bold">Excellent</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                FAQ ITEM                                    */
/* -------------------------------------------------------------------------- */

function FAQItem({
  question,
  answer,
  open,
  onClick,
}: {
  question: string;
  answer: string;
  open: boolean;
  onClick: () => void;
}) {
  return (
    <div className="border-b border-border">
      <button
        onClick={onClick}
        className="flex w-full items-center justify-between gap-5 py-6 text-left"
      >
        <span className="font-heading text-base font-semibold text-foreground sm:text-lg">
          {question}
        </span>

        <ChevronDown
          className={`shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""
            }`}
          size={20}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="max-w-2xl pb-6 leading-relaxed text-muted-foreground">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                               MAIN PAGE                                    */
/* -------------------------------------------------------------------------- */

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);

  const { scrollYProgress } = useScroll();
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.96]);

  return (
    <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
      {/* ================================================================== */}
      {/* NAVBAR */}
      {/* ================================================================== */}

      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#14213D] text-primary">
              <FileText size={18} />
            </div>

            <span className="font-heading text-xl font-bold tracking-tight">
              Resume<span className="text-primary">AI</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {navLinks.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
              >
                {item.name}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 sm:flex">
            <Link
              href="/sign-in"
              className="px-4 py-2 text-sm font-semibold transition hover:text-primary"
            >
              Log in
            </Link>

            <Link
              href="/sign-up"
              className="group flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/20"
            >
              Get Started Free
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border sm:hidden"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden border-t border-border bg-background sm:hidden"
            >
              <div className="space-y-1 px-6 py-5">
                {navLinks.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-lg px-3 py-3 text-sm font-medium hover:bg-secondary"
                  >
                    {item.name}
                  </a>
                ))}

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Link
                    href="/sign-in"
                    className="rounded-lg border border-border px-4 py-3 text-center text-sm font-semibold"
                  >
                    Log in
                  </Link>

                  <Link
                    href="/sign-up"
                    className="rounded-lg bg-primary px-4 py-3 text-center text-sm font-bold"
                  >
                    Start Free
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ================================================================== */}
      {/* HERO */}
      {/* ================================================================== */}

      <section className="relative">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -left-32 top-40 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        </div>

        <motion.div
          style={{ scale: heroScale }}
          className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 pb-28 pt-20 lg:grid-cols-2 lg:pb-36 lg:pt-28"
        >
          <div>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-bold tracking-wider text-primary"
            >
              <Sparkles size={14} />
              AI-POWERED CAREER TOOL
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.1 }}
              className="mt-6 font-heading text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl"
            >
              Build a resume that{" "}
              <span className="relative text-primary">
                gets noticed.
                <svg
                  className="absolute -bottom-3 left-0 w-full"
                  viewBox="0 0 300 20"
                  fill="none"
                >
                  <path
                    d="M4 15C70 2 160 2 296 10"
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.2 }}
              className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl"
            >
              Create, improve, and tailor your resume with AI. Get smarter
              suggestions, understand your ATS compatibility, and match your
              resume to the jobs you actually want.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.3 }}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <Link
                href="/sign-up"
                className="group flex items-center justify-center gap-2 rounded-xl bg-primary px-7 py-4 font-bold text-primary-foreground transition hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/20"
              >
                Build My Resume Free
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <a
                href="#how-it-works"
                className="flex items-center justify-center rounded-xl border border-border bg-card px-7 py-4 font-semibold transition hover:bg-secondary"
              >
                See how it works
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground"
            >
              <span className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-primary" />
                No credit card required
              </span>

              <span className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-primary" />
                Start in minutes
              </span>

              <span className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-primary" />
                Built for job seekers
              </span>
            </motion.div>
          </div>

          <div className="pt-10 lg:pt-0">
            <ResumePreview />
          </div>
        </motion.div>
      </section>

      {/* ================================================================== */}
      {/* MARQUEE */}
      {/* ================================================================== */}

      <section className="border-y border-border bg-secondary/50 py-5">
        <div className="overflow-hidden">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              duration: 28,
              repeat: Infinity,
              ease: "linear",
            }}
            className="flex w-max gap-10"
          >
            {[...marqueeItems, ...marqueeItems].map((item, index) => (
              <div
                key={`${item}-${index}`}
                className="flex items-center gap-3 whitespace-nowrap text-sm font-semibold text-[#14213D]"
              >
                <span className="h-2 w-2 rounded-full bg-primary" />
                {item}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* STATS */}
      {/* ================================================================== */}

      <section className="border-b border-border">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y border-x border-border sm:grid-cols-4 sm:divide-y-0">
          {[
            ["AI-powered", "Writing help"],
            ["ATS-focused", "Resume insights"],
            ["10+", "Resume templates"],
            ["PDF", "Ready to export"],
          ].map(([number, label]) => (
            <div key={label} className="p-7 text-center sm:p-10">
              <p className="font-heading text-2xl font-bold text-[#14213D] sm:text-3xl">
                {number}
              </p>
              <p className="mt-2 text-xs text-muted-foreground sm:text-sm">
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================================================================== */}
      {/* HOW IT WORKS */}
      {/* ================================================================== */}

      <section id="how-it-works" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            badge="SIMPLE PROCESS"
            title="From blank page to job-ready resume"
            description="No complicated setup. ResumeAI guides you through the important steps."
          />

          <div className="relative grid gap-6 md:grid-cols-3">
            <div className="absolute left-[16%] right-[16%] top-16 hidden h-px bg-border md:block" />

            {[
              {
                step: "01",
                icon: PenLine,
                title: "Tell us about yourself",
                desc: "Add your education, skills, experience, projects, and achievements — or upload an existing resume.",
              },
              {
                step: "02",
                icon: Brain,
                title: "Let AI improve the writing",
                desc: "Get clearer summaries, stronger bullet points, and suggestions that make your experience easier to understand.",
              },
              {
                step: "03",
                icon: Rocket,
                title: "Review and apply",
                desc: "Check your resume, tailor it to a job, choose a template, and export when you are ready.",
              },
            ].map((item, index) => {
              const Icon = item.icon;

              return (
                <FadeIn key={item.step} delay={index * 0.12}>
                  <div className="relative rounded-2xl border border-border bg-card p-8 transition duration-300 hover:-translate-y-2 hover:shadow-xl">
                    <div className="relative z-10 mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#14213D] text-primary shadow-lg">
                      <Icon size={27} />
                    </div>

                    <span className="absolute right-7 top-7 font-heading text-sm font-bold text-primary">
                      {item.step}
                    </span>

                    <h3 className="font-heading text-xl font-bold">
                      {item.title}
                    </h3>

                    <p className="mt-3 leading-relaxed text-muted-foreground">
                      {item.desc}
                    </p>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* PRODUCT SHOWCASE */}
      {/* ================================================================== */}

      <section className="bg-[#14213D] py-24 text-white sm:py-32">
        <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2">
          <FadeIn>
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold tracking-wider text-primary">
                <WandSparkles size={14} />
                AI WRITING ASSISTANT
              </div>

              <h2 className="mt-6 font-heading text-4xl font-bold leading-tight sm:text-5xl">
                Stuck on what to write?
                <br />
                <span className="text-primary">Start with your experience.</span>
              </h2>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/65">
                You do not need to be a professional writer. Describe your
                experience, projects, or responsibilities and use AI to help
                turn them into clearer resume content.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  "Professional summaries",
                  "Achievement-focused bullet points",
                  "Project descriptions",
                  "Skills and keyword suggestions",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[#14213D]">
                      <CheckCircle2 size={15} />
                    </div>
                    <span className="text-sm text-white/85">{item}</span>
                  </div>
                ))}
              </div>

              <Link
                href="/sign-up"
                className="mt-10 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-bold text-[#14213D] transition hover:-translate-y-1"
              >
                Try the AI builder
                <ArrowRight size={18} />
              </Link>
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 shadow-2xl backdrop-blur">
              <div className="rounded-2xl border border-white/10 bg-[#10203A] p-6 sm:p-8">
                <div className="flex items-center gap-3 border-b border-white/10 pb-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                    <Sparkles size={20} />
                  </div>

                  <div>
                    <p className="font-semibold">AI Writing Assistant</p>
                    <p className="text-xs text-white/50">
                      Improve your resume content
                    </p>
                  </div>
                </div>

                <div className="mt-7 rounded-xl border border-white/10 bg-white/5 p-5">
                  <p className="text-xs font-semibold text-primary">
                    YOUR INPUT
                  </p>

                  <p className="mt-3 text-sm leading-relaxed text-white/65">
                    I built a website for a local business using React and
                    improved the website speed.
                  </p>
                </div>

                <div className="my-4 flex justify-center">
                  <div className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-[#14213D]">
                    AI improves it
                  </div>
                </div>

                <div className="rounded-xl border border-primary/20 bg-primary/10 p-5">
                  <p className="text-xs font-semibold text-primary">
                    SUGGESTED VERSION
                  </p>

                  <p className="mt-3 text-sm leading-relaxed text-white/90">
                    Developed and optimized a responsive business website,
                    improving performance and creating a smoother user
                    experience.
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ================================================================== */}
      {/* FEATURES */}
      {/* ================================================================== */}

      <section id="features" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            badge="BUILT FOR JOB SEEKERS"
            title="Everything you need. Nothing you don't."
            description="Useful tools designed around the actual resume-building process."
          />

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <FadeIn key={feature.title} delay={index * 0.06}>
                  <div className="group h-full rounded-2xl border border-border bg-card p-7 transition duration-300 hover:-translate-y-2 hover:border-primary/40 hover:shadow-xl">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:scale-110 group-hover:bg-primary group-hover:text-[#14213D]">
                      <Icon size={22} />
                    </div>

                    <h3 className="mt-6 font-heading text-lg font-bold">
                      {feature.title}
                    </h3>

                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {feature.desc}
                    </p>

                    <div className="mt-6 flex items-center gap-2 text-sm font-bold text-[#14213D] opacity-0 transition group-hover:opacity-100">
                      Learn more
                      <ArrowRight size={15} />
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* ATS SCORE */}
      {/* ================================================================== */}

      <section className="border-y border-border bg-secondary/50 py-24 sm:py-32">
        <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2">
          <FadeIn>
            <div className="rounded-3xl border border-border bg-card p-6 shadow-xl sm:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-heading text-lg font-bold">
                    Resume Analysis
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    See where your resume can improve
                  </p>
                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-full border-[6px] border-primary">
                  <span className="font-heading text-sm font-bold">82</span>
                </div>
              </div>

              <div className="mt-8 space-y-6">
                {[
                  ["Content clarity", "92%"],
                  ["Skills relevance", "84%"],
                  ["Keyword coverage", "78%"],
                  ["Resume structure", "88%"],
                ].map(([label, score], index) => (
                  <div key={label}>
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="font-medium">{label}</span>
                      <span className="font-bold text-primary">{score}</span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-secondary">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{
                          width: ["92%", "84%", "78%", "88%"][index],
                        }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: index * 0.15 }}
                        className="h-full rounded-full bg-primary"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-xl border border-green-500/20 bg-green-500/5 p-4">
                <div className="flex gap-3">
                  <CircleCheck
                    className="mt-0.5 text-green-600"
                    size={18}
                  />
                  <p className="text-sm text-muted-foreground">
                    Your resume has a strong structure. Consider adding more
                    relevant keywords for the target role.
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-xs font-bold tracking-wider text-primary">
                <BarChart3 size={14} />
                SMARTER FEEDBACK
              </div>

              <h2 className="mt-6 font-heading text-4xl font-bold leading-tight sm:text-5xl">
                Know what is working.
                <br />
                <span className="text-primary">Fix what isn't.</span>
              </h2>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
                Instead of guessing whether your resume is good enough, review
                key areas and get practical feedback on what you can improve.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  {
                    icon: Search,
                    text: "Find missing keywords",
                  },
                  {
                    icon: Target,
                    text: "Understand job relevance",
                  },
                  {
                    icon: FileText,
                    text: "Review structure",
                  },
                  {
                    icon: TrendingUp,
                    text: "Track improvements",
                  },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.text}
                      className="flex items-center gap-3 rounded-xl border border-border bg-card p-4"
                    >
                      <div className="text-primary">
                        <Icon size={20} />
                      </div>
                      <span className="text-sm font-semibold">{item.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ================================================================== */}
      {/* JOB MATCH */}
      {/* ================================================================== */}

      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <FadeIn>
            <div className="overflow-hidden rounded-3xl border border-border bg-card">
              <div className="grid lg:grid-cols-[1fr_1.2fr]">
                <div className="bg-[#14213D] p-8 text-white sm:p-12">
                  <BriefcaseBusiness className="text-primary" size={34} />

                  <h2 className="mt-6 font-heading text-3xl font-bold sm:text-4xl">
                    Tailor your resume to the job you want.
                  </h2>

                  <p className="mt-5 leading-relaxed text-white/60">
                    Paste a job description and compare it with your resume.
                    Understand important skills, keywords, and areas you may
                    want to review.
                  </p>

                  <div className="mt-8 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-[#14213D]">
                      <Target size={20} />
                    </div>

                    <div>
                      <p className="text-xs text-white/50">Example match</p>
                      <p className="font-heading text-lg font-bold">
                        84% relevance
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-8 sm:p-12">
                  <p className="text-xs font-bold tracking-wider text-muted-foreground">
                    JOB REQUIREMENTS
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {[
                      "React",
                      "TypeScript",
                      "REST APIs",
                      "Git",
                      "Teamwork",
                      "Problem solving",
                    ].map((tag, index) => (
                      <span
                        key={tag}
                        className={`rounded-full px-3 py-2 text-xs font-semibold ${index < 4
                          ? "bg-green-500/10 text-green-700"
                          : "bg-primary/10 text-[#14213D]"
                          }`}
                      >
                        {index < 4 ? "✓ " : "+ "}
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-8 rounded-2xl bg-secondary p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary">
                        <Zap size={18} />
                      </div>

                      <div>
                        <p className="font-semibold">Smart suggestion</p>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          Your resume already covers several important
                          requirements. Review the remaining skills and add
                          relevant experience where appropriate.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ================================================================== */}
      {/* TEMPLATES */}
      {/* ================================================================== */}

      <section id="templates" className="bg-secondary/50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            badge="FLEXIBLE DESIGN"
            title="One resume. Multiple professional looks."
            description="Choose a template that matches your style and switch designs whenever you want."
          />

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                name: "Minimal",
                color: "#FFFFFF",
                accent: "#14213D",
              },
              {
                name: "Modern",
                color: "#14213D",
                accent: "#E3A008",
              },
              {
                name: "Professional",
                color: "#FFFFFF",
                accent: "#E3A008",
              },
            ].map((template, index) => (
              <FadeIn key={template.name} delay={index * 0.1}>
                <div className="group rounded-2xl border border-border bg-card p-5 transition duration-300 hover:-translate-y-2 hover:shadow-2xl">
                  <div
                    className="aspect-[3/4] overflow-hidden rounded-xl border border-border p-6 transition duration-500 group-hover:scale-[1.02]"
                    style={{ backgroundColor: template.color }}
                  >
                    <div
                      className="h-3 w-1/2 rounded"
                      style={{ backgroundColor: template.accent }}
                    />

                    <div
                      className="mt-3 h-2 w-1/3 rounded"
                      style={{
                        backgroundColor:
                          template.color === "#14213D"
                            ? "#FFFFFF55"
                            : "#E3A008",
                      }}
                    />

                    <div className="mt-8 space-y-3">
                      {[100, 85, 92, 70].map((width, i) => (
                        <div
                          key={i}
                          className="h-2 rounded"
                          style={{
                            width: `${width}%`,
                            backgroundColor:
                              template.color === "#14213D"
                                ? "#FFFFFF22"
                                : "#E5E4DE",
                          }}
                        />
                      ))}
                    </div>

                    <div
                      className="mt-8 h-2 w-24 rounded"
                      style={{ backgroundColor: template.accent }}
                    />

                    <div className="mt-4 space-y-3">
                      {[90, 100, 75, 85, 60].map((width, i) => (
                        <div
                          key={i}
                          className="h-2 rounded"
                          style={{
                            width: `${width}%`,
                            backgroundColor:
                              template.color === "#14213D"
                                ? "#FFFFFF22"
                                : "#E5E4DE",
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-5">
                    <div>
                      <p className="font-heading font-bold">{template.name}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Professional layout
                      </p>
                    </div>

                    <LayoutTemplate
                      size={18}
                      className="text-muted-foreground transition group-hover:text-primary"
                    />
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3 font-semibold transition hover:bg-secondary"
            >
              Explore templates
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* TESTIMONIALS */}
      {/* ================================================================== */}

      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            badge="BUILT TO MAKE THE PROCESS EASIER"
            title="A simpler way to build your next resume"
            description="Designed to help job seekers organize their experience and present it clearly."
          />

          <div className="grid gap-6 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <FadeIn key={testimonial.name} delay={index * 0.1}>
                <div className="relative h-full rounded-2xl border border-border bg-card p-7">
                  <Quote className="text-primary/30" size={42} />

                  <p className="mt-5 leading-relaxed text-muted-foreground">
                    “{testimonial.text}”
                  </p>

                  <div className="mt-8 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#14213D] text-xs font-bold text-primary">
                      {testimonial.initials}
                    </div>

                    <div>
                      <p className="text-sm font-bold">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>

                  <div className="absolute right-7 top-7 flex gap-1 text-primary">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={13} fill="currentColor" />
                    ))}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* PRICING */}
      {/* ================================================================== */}

      <section id="pricing" className="border-y border-border bg-secondary/50 py-24 sm:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <SectionHeading
            badge="SIMPLE PRICING"
            title="Start free. Upgrade when you need more."
            description="Build your resume first and choose a plan when you're ready."
          />

          <div className="grid gap-6 md:grid-cols-2">
            <FadeIn>
              <div className="h-full rounded-3xl border border-border bg-card p-8">
                <h3 className="font-heading text-2xl font-bold">Free</h3>

                <p className="mt-2 text-muted-foreground">
                  Start building your professional resume.
                </p>

                <div className="mt-7">
                  <span className="font-heading text-5xl font-bold">₹0</span>
                  <span className="ml-2 text-muted-foreground">to start</span>
                </div>

                <div className="my-8 h-px bg-border" />

                <div className="space-y-4">
                  {[
                    "Guided resume builder",
                    "Resume templates",
                    "ATS insights",
                    "Job match analysis",
                    "AI credits included",
                    "Public resume link",
                  ].map((item) => (
                    <div key={item} className="flex gap-3">
                      <CheckCircle2
                        size={19}
                        className="shrink-0 text-primary"
                      />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href="/sign-up"
                  className="mt-9 block rounded-xl border border-border py-3.5 text-center font-bold transition hover:bg-secondary"
                >
                  Start for free
                </Link>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="relative h-full rounded-3xl border-2 border-primary bg-card p-8 shadow-2xl">
                <div className="absolute -top-3 left-8 rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-[#14213D]">
                  MOST POPULAR
                </div>

                <h3 className="font-heading text-2xl font-bold">Pro</h3>

                <p className="mt-2 text-muted-foreground">
                  For serious job applications and unlimited access.
                </p>

                <div className="mt-7">
                  <span className="font-heading text-5xl font-bold">₹149</span>
                  <span className="ml-2 text-muted-foreground">/ month</span>
                </div>

                <div className="my-8 h-px bg-border" />

                <div className="space-y-4">
                  {[
                    "Everything in Free",
                    "Unlimited AI assistance",
                    "Unlimited PDF downloads",
                    "All resume templates",
                    "Advanced job matching",
                    "Cancel anytime",
                  ].map((item) => (
                    <div key={item} className="flex gap-3">
                      <CheckCircle2
                        size={19}
                        className="shrink-0 text-primary"
                      />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href="/sign-up"
                  className="mt-9 block rounded-xl bg-primary py-3.5 text-center font-bold text-[#14213D] transition hover:-translate-y-1 hover:shadow-lg"
                >
                  Get started
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* FAQ */}
      {/* ================================================================== */}

      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-3xl px-6">
          <SectionHeading
            badge="QUESTIONS"
            title="Frequently asked questions"
            description="Everything you need to know before getting started."
          />

          <div className="rounded-2xl border border-border bg-card px-6 sm:px-8">
            {faqs.map((faq, index) => (
              <FAQItem
                key={faq.question}
                question={faq.question}
                answer={faq.answer}
                open={openFAQ === index}
                onClick={() =>
                  setOpenFAQ(openFAQ === index ? null : index)
                }
              />
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* FINAL CTA */}
      {/* ================================================================== */}

      <section className="px-6 pb-24 sm:pb-32">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#14213D] px-6 py-20 text-center text-white sm:px-12 sm:py-24">
          <div className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />

          <div className="relative mx-auto max-w-3xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-[#14213D]">
              <Rocket size={26} />
            </div>

            <h2 className="mt-7 font-heading text-4xl font-bold leading-tight sm:text-5xl">
              Your next opportunity starts with a stronger resume.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-white/65">
              Start building for free and turn your experience into a resume
              that is clear, professional, and ready to share.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/sign-up"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-7 py-4 font-bold text-[#14213D] transition hover:-translate-y-1 hover:shadow-xl"
              >
                Build My Resume Free
                <ArrowRight
                  size={18}
                  className="transition group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/sign-in"
                className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-7 py-4 font-semibold text-white transition hover:bg-white/10"
              >
                I already have an account
              </Link>
            </div>

            <p className="mt-6 text-xs text-white/40">
              No credit card required to get started.
            </p>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* FOOTER */}
      {/* ================================================================== */}

      <footer className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
            <div>
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#14213D] text-primary">
                  <FileText size={18} />
                </div>

                <span className="font-heading text-xl font-bold">
                  Resume<span className="text-primary">AI</span>
                </span>
              </Link>

              <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
                AI-powered tools designed to make resume building simpler for
                students and job seekers.
              </p>
            </div>

            <div>
              <p className="font-heading text-sm font-bold">Product</p>

              <div className="mt-4 space-y-3">
                {navLinks.slice(0, 3).map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block text-sm text-muted-foreground transition hover:text-primary"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <p className="font-heading text-sm font-bold">Account</p>

              <div className="mt-4 space-y-3">
                <Link
                  href="/sign-in"
                  className="block text-sm text-muted-foreground transition hover:text-primary"
                >
                  Log in
                </Link>

                <Link
                  href="/sign-up"
                  className="block text-sm text-muted-foreground transition hover:text-primary"
                >
                  Create account
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-3 border-t border-border pt-7 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} ResumeAI. All rights reserved.</p>

            <div className="flex gap-5">
              <span>Built for job seekers</span>
              <span>•</span>
              <span>Made with AI</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}