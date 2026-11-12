import React from 'react'
import { motion } from 'motion/react'
import {
  Sparkles,
  Database,
  Coins,
  HeartHandshake,
  School,
  GraduationCap,
  Building2,
  BookOpen,
  CheckCircle2,
  Cpu,
} from 'lucide-react'

export function AboutSection() {

  const pillars = [
    {
      icon: Database,
      title: 'Kernel-Level Data Isolation',
      desc: 'PostgreSQL Row-Level Security (RLS) guarantees complete tenant isolation. No institution can ever query or cross-contaminate another school’s records.',
      badge: 'Zero Data Leaks',
      color: 'text-blue-600 bg-blue-50 border-blue-200/80',
    },
    {
      icon: Coins,
      title: 'Minor-Unit Financial Ledger',
      desc: 'All fees and receipts are computed strictly in integer minor units (paise/cents). Floating-point arithmetic errors are mathematically eliminated.',
      badge: 'Double-Entry Balanced',
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200/80',
    },
    {
      icon: HeartHandshake,
      title: 'Anti-IDOR Guardian Verification',
      desc: 'Verified parent-to-student relationship graphs prevent IDOR unauthorized record scraping, keeping minor student profiles completely protected.',
      badge: 'Child Privacy First',
      color: 'text-violet-600 bg-violet-50 border-violet-200/80',
    },
    {
      icon: Cpu,
      title: 'Instant Cloud Provisioning',
      desc: 'Launch a fully configured, dedicated subdomain (e.g. bright.educore.com) with automated SSL and isolated schemas in under 60 seconds.',
      badge: '< 60s Deployment',
      color: 'text-amber-600 bg-amber-50 border-amber-200/80',
    },
  ]

  const institutionsServed = [
    {
      type: 'K-12 & Secondary Schools',
      icon: School,
      detail: 'Multi-term academic calendars, homeroom classes, auto-ranked term gradebooks, and report cards.',
    },
    {
      type: 'Coaching & Entrance Institutes',
      icon: GraduationCap,
      detail: 'High-intensity NEET/JEE competitive batches, percentile tracking, mock examination pipelines.',
    },
    {
      type: 'Tuition Centres & Academies',
      icon: BookOpen,
      detail: 'Flexible evening/weekend micro-cohorts, subject syllabus mapping, and monthly installment collections.',
    },
    {
      type: 'Multi-Campus Foundations',
      icon: Building2,
      detail: 'Central platform oversight and consolidated telemetry with complete operational autonomy for each branch.',
    },
  ]

  return (
    <section id="about" className="py-16 sm:py-20 bg-slate-50/70 border-b border-slate-200/80 relative overflow-hidden">
      {/* Background soft grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] opacity-50 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10 space-y-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto space-y-3"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/80 text-blue-700 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            About EduCore
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            The multi-tenant operating system for modern education
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            EduCore was created to eliminate the chaotic sprawl of disconnected spreadsheets, paper roll-call registers, and insecure chat apps. We engineered a single, unified cloud platform that gives every institution its own dedicated digital campus.
          </p>
        </motion.div>

        {/* Story & Philosophy 2-Column Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl bg-white border border-slate-200/90 shadow-lg p-6 sm:p-8 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
        >
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 font-mono">
              Why EduCore Exists
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
              Democratizing world-class educational technology for every institution.
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed font-normal">
              For decades, elite enterprise school management software was only accessible to massive international school chains with six-figure IT budgets. Tuition centres, coaching institutes, and independent schools were left behind with fragile spreadsheets or clunky legacy software.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed font-normal">
              EduCore levels the playing field. Whether you run a 40-student boutique mathematics academy or a 4,000-student K-12 school district, EduCore provisions an enterprise-grade portal in seconds—complete with automated gradebooks, double-entry ledgers, and interactive live classes.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>100% Subdomain Isolation</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Zero Software Installation</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>COPPA & FERPA Privacy Standards</span>
              </div>
            </div>
          </div>

          {/* Right Metrics Callout Box */}
          <div className="lg:col-span-5 bg-slate-900 rounded-2xl p-6 text-white space-y-4 shadow-inner border border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono text-slate-400">ARCHITECTURAL METRICS</span>
              <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded font-mono border border-emerald-800/60">
                VERIFIED LIVE
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                <div className="text-2xl font-black text-white">&lt; 60s</div>
                <div className="text-[11px] text-slate-400">Portal Provisioning</div>
              </div>
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                <div className="text-2xl font-black text-emerald-400">100%</div>
                <div className="text-[11px] text-slate-400">PostgreSQL RLS Fencing</div>
              </div>
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                <div className="text-2xl font-black text-blue-400">0.00%</div>
                <div className="text-[11px] text-slate-400">Minor-Unit Rounding Drift</div>
              </div>
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                <div className="text-2xl font-black text-amber-400">99.98%</div>
                <div className="text-[11px] text-slate-400">Target Cloud SLA</div>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 italic pt-1 leading-normal">
              Engineered with modern cloud standards: Vite, React, PostgreSQL Row-Level Security, and TanStack.
            </p>
          </div>
        </motion.div>

        {/* Four Architectural Pillars Grid */}
        <div className="space-y-4">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
              The Four Engineering Pillars
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-20px' }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${pillar.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono">
                        {pillar.badge}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-slate-900 leading-snug">{pillar.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-normal">
                      {pillar.desc}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Institutions We Power */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Configurable for Every Educational Institution</h3>
              <p className="text-xs text-slate-500">
                EduCore adapts seamlessly to different educational models without modifying core software.
              </p>
            </div>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 shrink-0 self-start sm:self-center">
              Multi-Curriculum Support
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {institutionsServed.map((inst, idx) => {
              const Icon = inst.icon
              return (
                <div key={idx} className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/70 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-slate-800">
                    <Icon className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{inst.type}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    {inst.detail}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
