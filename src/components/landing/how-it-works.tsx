import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Building2,
  FolderTree,
  UserPlus,
  Rocket,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Calendar,
  Layers,
  Users2,
  CreditCard,
  FileCheck2,
} from 'lucide-react'

interface Step {
  id: string
  number: string
  title: string
  headline: string
  description: string
  icon: React.ElementType
  badge: string
  previewType: 'setup' | 'academic' | 'members' | 'operations'
  bullets: string[]
  metrics?: { label: string; value: string }[]
}

const STEPS: Step[] = [
  {
    id: 'institution-setup',
    number: '01',
    title: 'Create Your Institution',
    headline: 'Claim your dedicated portal in under 60 seconds',
    description:
      'Enter your institution name, choose an exclusive subdomain (e.g., bright.educore.com), and select your institution category. Your secure multi-tenant environment is provisioned instantly.',
    icon: Building2,
    badge: 'Step 1 • Instant Provisioning',
    previewType: 'setup',
    bullets: [
      'Unique subdomain with instant SSL certificate provisioning',
      'Configurable school, tuition, coaching, or academy profiles',
      'Automated root tenant schema isolation & encryption keys',
    ],
    metrics: [
      { label: 'Provisioning time', value: '< 60s' },
      { label: 'Subdomain isolation', value: '100%' },
    ],
  },
  {
    id: 'academic-structure',
    number: '02',
    title: 'Define Academic Structure',
    headline: 'Configure terms, grades, batches, and curricula',
    description:
      'Structure your educational delivery your way. Build academic years, terms, grade levels, sections, and map subjects to credit requirements with zero rigid constraints.',
    icon: FolderTree,
    badge: 'Step 2 • Flexible Taxonomy',
    previewType: 'academic',
    bullets: [
      'Multi-term academic calendar with auto-promotions',
      'Sections and batches tailored for both K-12 and coaching batches',
      'Subject syllabus mapping and credit allocation',
    ],
    metrics: [
      { label: 'Hierarchy depth', value: 'Unlimited' },
      { label: 'Class types', value: 'Hybrid & In-person' },
    ],
  },
  {
    id: 'invite-members',
    number: '03',
    title: 'Invite & Organise People',
    headline: 'Role-tailored access for staff, students, and parents',
    description:
      'Onboard teachers, assign them to classes and subjects, enroll students in their respective batches, and link parents to secure individual student progress visibility.',
    icon: UserPlus,
    badge: 'Step 3 • Granular Onboarding',
    previewType: 'members',
    bullets: [
      'Delegated manager accounts with granular module-level permissions',
      'Bulk CSV student enrollment with automated parent relationship links',
      'Faculty assignment matrix mapping teachers to specific subject sections',
    ],
    metrics: [
      { label: 'Role archetypes', value: '6 distinct' },
      { label: 'Parent-Student link', value: 'Verified' },
    ],
  },
  {
    id: 'run-scale',
    number: '04',
    title: 'Run & Scale Operations',
    headline: 'Unified command over academic, financial, and classroom life',
    description:
      'Publish announcements, collect digital fee payments, conduct examinations with auto-rank generation, track attendance, and launch interactive live classes seamlessly.',
    icon: Rocket,
    badge: 'Step 4 • Production Operations',
    previewType: 'operations',
    bullets: [
      'Double-entry minor-unit fee ledger with automated receipt generation',
      'Biometric & manual attendance with instant guardian SMS alerts',
      'End-to-end examination engine with term report card generation',
    ],
    metrics: [
      { label: 'Uptime guarantee', value: '99.98%' },
      { label: 'Daily operations', value: 'Automated' },
    ],
  },
]

export function HowItWorksSection() {
  const [activeStepIndex, setActiveStepIndex] = useState(0)
  const activeStep = STEPS[activeStepIndex]

  return (
    <section id="how-it-works" className="py-24 bg-slate-50 border-t border-b border-slate-200/80 relative overflow-hidden">
      {/* Background soft pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Simple 4-Step Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            How EduCore powers your institution
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Transitioning an entire school or coaching academy to EduCore requires zero infrastructure engineers. 
            From initial registration to daily digital operations in four intuitive phases.
          </p>
        </motion.div>

        {/* Stepper Navigation Pills */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto mb-12">
          {STEPS.map((step, idx) => {
            const Icon = step.icon
            const isActive = idx === activeStepIndex
            return (
              <motion.button
                key={step.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveStepIndex(idx)}
                className={`relative p-4 rounded-xl text-left transition-all duration-200 border flex flex-col gap-2 ${
                  isActive
                    ? 'bg-white border-blue-600 shadow-md ring-2 ring-blue-500/20'
                    : 'bg-white/60 border-slate-200 hover:bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold tracking-wider px-2 py-0.5 rounded ${
                      isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    STEP {step.number}
                  </span>
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                </div>
                <div className="text-sm font-bold text-slate-900 line-clamp-1">{step.title}</div>
                {isActive && (
                  <motion.div
                    layoutId="stepper-indicator"
                    className="absolute -bottom-1 left-4 right-4 h-0.5 bg-blue-600 rounded-full"
                  />
                )}
              </motion.button>
            )
          })}
        </div>

        {/* Step Detail Content & Interactive Preview Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-3xl border border-slate-200/90 shadow-xl p-6 sm:p-8 md:p-12">
          {/* Left: Step Explanations & Action Items */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
              {activeStep.badge}
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
              {activeStep.headline}
            </h3>

            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              {activeStep.description}
            </p>

            {/* Feature Bullets */}
            <div className="space-y-3 pt-2">
              {activeStep.bullets.map((b, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">{b}</span>
                </div>
              ))}
            </div>

            {/* Metrics Ribbon */}
            {activeStep.metrics && (
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                {activeStep.metrics.map((m, idx) => (
                  <div key={idx} className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <div className="text-xl sm:text-2xl font-extrabold text-slate-900">{m.value}</div>
                    <div className="text-xs text-slate-500 font-medium">{m.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Next / Prev Controls */}
            <div className="flex items-center gap-3 pt-4">
              {activeStepIndex > 0 && (
                <button
                  onClick={() => setActiveStepIndex((prev) => prev - 1)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  ← Back to Step {STEPS[activeStepIndex - 1].number}
                </button>
              )}
              {activeStepIndex < STEPS.length - 1 ? (
                <button
                  onClick={() => setActiveStepIndex((prev) => prev + 1)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-all"
                >
                  Next: {STEPS[activeStepIndex + 1].title}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <a
                  href="#register-dialog"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all"
                >
                  Get Started Now
                  <Rocket className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>

          {/* Right: Rich Interactive Simulated Visual Mockup */}
          <div className="lg:col-span-7 bg-slate-900 rounded-2xl p-4 sm:p-6 text-slate-200 shadow-2xl border border-slate-800 relative overflow-hidden">
            {/* Top Bar simulating browser/terminal header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-5">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-xs font-mono text-slate-400">
                  educore-provisioning://{activeStep.id}
                </span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
                STAGE {activeStep.number} ACTIVE
              </span>
            </div>

            {/* Dynamic Step Visualization */}
            <AnimatePresence mode="wait">
              {activeStep.previewType === 'setup' && (
                <motion.div
                  key="setup"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-4">
                    <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Subdomain Registration Terminal
                    </div>
                    <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-xs text-blue-400">
                      <span className="text-slate-500">https://</span>
                      <span className="text-white font-bold bg-blue-600/30 px-1.5 py-0.5 rounded border border-blue-500/40">
                        bright
                      </span>
                      <span className="text-slate-400">.educore.com</span>
                      <span className="ml-auto text-[10px] text-emerald-400 font-sans font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Available
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3">
                      <div className="text-[11px] text-slate-400">Tenant Identifier</div>
                      <div className="font-mono text-xs text-slate-200 mt-1">inst_bf491a27e</div>
                    </div>
                    <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3">
                      <div className="text-[11px] text-slate-400">Database Schema</div>
                      <div className="font-mono text-xs text-emerald-400 mt-1">isolated_tenant_rls</div>
                    </div>
                  </div>

                  <div className="bg-blue-950/40 border border-blue-800/50 rounded-xl p-3.5 flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0" />
                    <div className="text-xs text-slate-300">
                      Row Level Security auto-activated for all future student, teacher, and ledger entries.
                    </div>
                  </div>
                </motion.div>
              )}

              {activeStep.previewType === 'academic' && (
                <motion.div
                  key="academic"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-3 font-mono text-xs"
                >
                  <div className="flex items-center justify-between text-slate-400 text-[11px] uppercase pb-1 border-b border-slate-800">
                    <span>Taxonomy Hierarchy</span>
                    <span>Configuration State</span>
                  </div>

                  <div className="space-y-2">
                    <div className="bg-slate-800/70 p-2.5 rounded-lg border border-slate-700 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-amber-400" />
                        <span className="text-slate-200 font-semibold font-sans">Academic Year 2026–2027</span>
                      </div>
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                        Active Term 1
                      </span>
                    </div>

                    <div className="ml-4 pl-3 border-l-2 border-slate-700 space-y-2">
                      <div className="bg-slate-800/50 p-2 rounded-lg border border-slate-700/60 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Layers className="w-3.5 h-3.5 text-blue-400" />
                          <span className="text-slate-300 font-sans text-xs">Grade 10 — Advanced STEM</span>
                        </div>
                        <span className="text-[10px] text-slate-400">Sections A, B, C</span>
                      </div>

                      <div className="bg-slate-800/50 p-2 rounded-lg border border-slate-700/60 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Layers className="w-3.5 h-3.5 text-blue-400" />
                          <span className="text-slate-300 font-sans text-xs">Grade 12 — Medical NEET Prep</span>
                        </div>
                        <span className="text-[10px] text-slate-400">Batches M1, M2</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-400 pt-2 flex items-center gap-1.5 font-sans">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Automatic grading curves & syllabus tracking initialized.
                  </div>
                </motion.div>
              )}

              {activeStep.previewType === 'members' && (
                <motion.div
                  key="members"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-3"
                >
                  <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Delegated Membership Directory
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold text-xs">
                          RM
                        </div>
                        <div>
                          <div className="text-white font-semibold">Robert Miller</div>
                          <div className="text-slate-400 text-[11px]">Operations Manager</div>
                        </div>
                      </div>
                      <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30">
                        Fees & Attendance Only
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center font-bold text-xs">
                          SC
                        </div>
                        <div>
                          <div className="text-white font-semibold">Dr. Sarah Chen</div>
                          <div className="text-slate-400 text-[11px]">Senior Physics Faculty</div>
                        </div>
                      </div>
                      <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30">
                        Class 10A, 12M1
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-xs">
                          AK
                        </div>
                        <div>
                          <div className="text-white font-semibold">Ayaan Khan (Student)</div>
                          <div className="text-slate-400 text-[11px]">Parent: Z. Khan (Verified Link)</div>
                        </div>
                      </div>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                        Enrolled
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeStep.previewType === 'operations' && (
                <motion.div
                  key="operations"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-3"
                >
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                        Today's Collections
                      </div>
                      <div className="text-xl font-bold text-white">$14,850.00</div>
                      <div className="text-[10px] text-emerald-400">100% matched to double-entry ledger</div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                        <Users2 className="w-3.5 h-3.5 text-blue-400" />
                        Daily Attendance
                      </div>
                      <div className="text-xl font-bold text-white">97.8%</div>
                      <div className="text-[10px] text-blue-300">1,221 / 1,248 students marked</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <FileCheck2 className="w-4 h-4 text-purple-400" />
                      <span className="text-slate-200">Term 1 Examination Report Cards</span>
                    </div>
                    <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30">
                      Generated & Published
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
