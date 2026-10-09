"use client";

import { useState } from "react";
import { Check, ChevronRight, ClipboardList, LayoutDashboard, Users } from "lucide-react";

export function ProductPreview() {
  const [role, setRole] = useState<"student" | "instructor">("student");
  const student = role === "student";

  return (
    <section aria-label="Sample product preview" className="rounded-2xl border border-[#1E4B35]/15 bg-white p-2 shadow-[0_24px_70px_-25px_rgba(30,75,53,0.25)] sm:p-3">
      <div className="flex flex-wrap items-center justify-between gap-3 px-3 py-3">
        <span className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-[#536251]"><span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Sample workspace</span>
        <div role="group" aria-label="Choose preview perspective" className="flex rounded-lg bg-[#edf2e9] p-1">{(["student", "instructor"] as const).map((value) => <button key={value} type="button" aria-pressed={role === value} onClick={() => setRole(value)} className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 ${role === value ? "bg-[#1E4B35] text-white shadow-sm" : "text-[#536251] hover:bg-white"}`}>{value}</button>)}</div>
      </div>
      <div className="flex min-h-[365px] overflow-hidden rounded-xl border border-[#1E4B35]/10">
        <div aria-hidden="true" className="hidden w-12 shrink-0 flex-col items-center gap-6 bg-[#1E4B35] py-5 sm:flex"><ClipboardList size={20} className="text-amber-300" /><LayoutDashboard size={17} className="text-white/80" /><Users size={17} className="text-white/50" /></div>
        <div className="min-w-0 flex-1 bg-[#f7f9f4] p-5 sm:p-6" aria-live="polite">
          <div className="flex items-center justify-between gap-3"><p className="text-[10px] font-medium uppercase tracking-wider text-[#6c8065]">CSC 480 · Sample class</p><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#e1e9d9] text-[10px] font-bold">{student ? "AR" : "MC"}</span></div>
          <h2 className="mt-5 text-xl font-semibold tracking-tight">{student ? "Student dashboard" : "Instructor dashboard"}</h2>
          <div className="mt-5 grid grid-cols-3 gap-2">{(student ? [{ value: "06", label: "Current week" }, { value: "05", label: "Logs submitted" }, { value: "02", label: "Active tasks" }] : [{ value: "12", label: "Students" }, { value: "09", label: "Submitted" }, { value: "03", label: "To review" }]).map(({ value, label }) => <div key={label} className="rounded-lg border border-[#1E4B35]/10 bg-white px-3 py-3"><p className="text-xl font-semibold">{value}</p><p className="mt-1 text-[10px] text-[#536251]">{label}</p></div>)}</div>
          <div className="mt-4 rounded-xl border border-[#1E4B35]/10 bg-white p-4">
            <div className="flex items-center justify-between gap-2"><h3 className="text-xs font-semibold">{student ? "Week 6 work log" : "Recent submissions"}</h3><span className="rounded-full bg-amber-100 px-2 py-1 text-[9px] font-medium text-amber-900">{student ? "Draft saved" : "Week 6"}</span></div>
            <div className="mt-3 space-y-3">{(student ? [{ title: "Build the roster search", detail: "Frontend · In progress" }, { title: "Review the API responses", detail: "Backend · Completed" }] : [{ title: "Alex Rivera", detail: "Full-stack team · Submitted" }, { title: "Jamie Park", detail: "Design team · Reviewed" }]).map(({ title, detail }, index) => <div key={title} className="flex items-center gap-3 border-t border-[#1E4B35]/5 pt-3"><span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${index === 1 ? "bg-[#edf2e9]" : "bg-amber-50"}`}>{index === 1 ? <Check size={14} aria-hidden="true" /> : <ClipboardList size={14} aria-hidden="true" />}</span><div className="min-w-0 flex-1"><p className="text-[11px] font-medium">{title}</p><p className="mt-0.5 text-[10px] text-[#6c8065]">{detail}</p></div><ChevronRight size={13} className="shrink-0 text-[#6c8065]" aria-hidden="true" /></div>)}</div>
          </div>
        </div>
      </div>
      <p className="px-3 pb-2 pt-4 text-[10px] leading-5 text-[#6c8065]">Sample preview. Open the demo to edit work logs, submit, and review using the full application screens.</p>
    </section>
  );
}
