import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, ClipboardList, GitBranch, Layers3, ShieldCheck, Users } from "lucide-react";
import { ProductPreview } from "@/components/custom/screen/landing/ProductPreview";

export const metadata: Metadata = {
  title: "Laker Logs | Progress, documented.",
  description: "Explore Laker Logs, a student-built weekly work log platform for SUNY Oswego. Discover the student and instructor experience, workflows, and architecture.",
};

const repository = "https://github.com/sonephyo/lakerlogs-v2";
const linkStyle = "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-500";
const features = [
  { icon: ClipboardList, number: "01", title: "Weekly work logs", description: "Turn tasks, goals, and reflections into a consistent weekly record. Save a draft and come back when you're ready." },
  { icon: GitBranch, number: "02", title: "Submission history", description: "Keep earlier submissions when work changes. Students can revisit their progress and instructors can follow each version." },
  { icon: Users, number: "03", title: "Instructor reviews", description: "Bring teams, deadlines, and submission status into one instructor workspace, with filters that help surface the work to review." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#fafbf7] text-[#1E4B35] selection:bg-amber-200">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:rounded-lg focus:bg-white focus:p-4">Skip to content</a>
      <header className="border-b border-[#1E4B35]/10 bg-[#fafbf7]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-5 lg:px-10">
          <Link href="/" aria-label="Laker Logs home" className="flex items-center gap-3">
            <Image src="/lakerlog.svg" alt="" width={38} height={38} priority />
            <span className="text-xl font-bold tracking-tight">Laker<span className="font-normal">Logs</span><span className="text-amber-600">.</span></span>
          </Link>
          <nav aria-label="Main navigation" className="flex items-center gap-4 text-sm sm:gap-7">
            <a href="#experience" className="hidden hover:underline sm:inline">Preview</a>
            <a href="#project" className="hover:underline">About</a>
            <Link href="/signup" className={`${linkStyle} border border-[#1E4B35]/20 bg-white hover:bg-[#edf2e9]`}>Course sign-in <ArrowUpRight size={15} aria-hidden="true" /></Link>
          </nav>
        </div>
      </header>

      <main id="main">
        <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 pb-16 pt-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14 lg:px-10 lg:pb-24 lg:pt-24">
          <div>
            <h1 className="max-w-xl text-5xl font-semibold leading-[1.06] tracking-[-0.055em] sm:text-6xl xl:text-7xl">Track your work.<br /><span className="text-[#6c8065]">Review your progress.</span></h1>
            <p className="mt-7 max-w-md text-lg leading-8 text-[#536251]">Students document tasks, goals, and reflections in weekly work logs. Instructors track submissions and review progress.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/demo?role=student" className={`${linkStyle} bg-[#1E4B35] text-white hover:bg-[#163b29]`}>Try student demo <ArrowRight size={16} aria-hidden="true" /></Link>
              <Link href="/demo?role=instructor" className={`${linkStyle} border border-[#1E4B35]/20 hover:bg-white`}>Try instructor demo <ArrowRight size={16} aria-hidden="true" /></Link>
              <a href={repository} target="_blank" rel="noreferrer" className={`${linkStyle} border border-[#1E4B35]/20 hover:bg-white`}>View source <ArrowUpRight size={16} aria-hidden="true" /></a>
            </div>
            <p className="mt-5 text-xs text-[#536251]">No account needed for the demo. Changes stay in your browser.</p>
          </div>
          <div id="experience" className="scroll-mt-8"><ProductPreview /></div>
        </section>

        <section id="features" className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <h2 className="max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">Features</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">{features.map(({ icon: Icon, number, title, description }) => (
            <article key={number} className="rounded-2xl border border-[#1E4B35]/10 bg-white p-7">
              <div className="mb-8 flex items-center justify-between"><span className="rounded-xl bg-[#edf2e9] p-3"><Icon size={23} aria-hidden="true" /></span><span className="text-xs font-medium text-[#6c8065]">/{number}</span></div>
              <h3 className="text-xl font-semibold leading-7 tracking-tight">{title}</h3><p className="mt-4 text-sm leading-7 text-[#536251]">{description}</p>
            </article>
          ))}</div>
        </section>

        <section id="project" className="mx-auto max-w-7xl scroll-mt-8 px-6 pb-20 lg:px-10">
          <div className="grid gap-10 rounded-3xl bg-[#1E4B35] p-8 text-white sm:p-12 lg:grid-cols-2 lg:gap-16">
            <div><h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">About Laker Logs</h2><p className="mt-6 leading-7 text-white/75">Built for Software Design at SUNY Oswego, Laker Logs gives weekly progress reports a consistent format and instructors a dedicated place to review them.</p><p className="mt-4 leading-7 text-white/75">The application connects a React interface with four Java services for authentication, work logs, tasks, and notifications, backed by MongoDB.</p><a href={repository} target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-2 font-medium text-amber-300 underline-offset-4 hover:underline">Explore the repository <ArrowUpRight size={17} aria-hidden="true" /></a></div>
            <div className="rounded-2xl border border-white/15 bg-white/5 p-6">
              <h3 className="mb-6 flex items-center gap-2 text-sm font-medium"><Layers3 size={18} aria-hidden="true" /> Architecture</h3>
              <div className="space-y-3">{[{ label: "Interface", detail: "Next.js · React · TypeScript" }, { label: "Services", detail: "Java · Jakarta EE · Open Liberty" }, { label: "Data", detail: "MongoDB · Submission history" }, { label: "Infrastructure", detail: "Docker · Caddy · Terraform" }].map(({ label, detail }) => <div key={label} className="rounded-xl border border-white/10 bg-[#173d2b] px-4 py-3"><p className="text-[10px] font-semibold uppercase tracking-widest text-amber-300">{label}</p><p className="mt-1 text-sm text-white/90">{detail}</p></div>)}</div>
              <p className="mt-5 flex items-start gap-2 text-xs leading-5 text-white/65"><ShieldCheck size={16} className="mt-0.5 shrink-0" aria-hidden="true" />The course application uses Google sign-in and role-based access for students and instructors.</p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-6 pb-20 text-center"><h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Access your class</h2><p className="mx-auto mt-4 max-w-lg leading-7 text-[#536251]">Sign in with your Oswego account to view your class and work logs.</p><Link href="/signup" className={`${linkStyle} mt-7 bg-[#1E4B35] text-white hover:bg-[#163b29]`}>Go to course sign-in <ArrowRight size={16} aria-hidden="true" /></Link></section>
      </main>
      <footer className="border-t border-[#1E4B35]/10 px-6 py-7"><div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 text-xs text-[#536251] lg:px-4"><span className="font-semibold text-[#1E4B35]">Laker Logs · SUNY Oswego</span><a href={repository} target="_blank" rel="noreferrer" className="hover:underline">Source code ↗</a></div></footer>
    </div>
  );
}
