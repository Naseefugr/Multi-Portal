import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Globe,
  Lock,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react'

interface InstitutionDemo {
  id: string
  name: string
  subdomain: string
  type: string
  badgeText: string
  colorTheme: {
    primary: string
    accent: string
    bgLight: string
    border: string
    text: string
  }
  tagline: string
  metrics: {
    students: string
    faculty: string
    batches: string
    rating: string
  }
  recentNotice: string
  activeProgram: string
}

const INSTITUTIONS: InstitutionDemo[] = [
  {
    id: 'bright',
    name: 'Bright Future Academy',
    subdomain: 'bright.educore.com',
    type: 'STEM & K-12 Academy',
    badgeText: 'K-12 STEM Excellence',
    colorTheme: {
      primary: 'bg-blue-600',
      accent: 'text-blue-600',
      bgLight: 'bg-blue-50/60',
      border: 'border-blue-200',
      text: 'text-blue-900',
    },
    tagline: 'Fostering future innovators through rigorous science and robotics.',
    metrics: {
      students: '1,248',
      faculty: '84',
      batches: '32 Sections',
      rating: '99.4% Attendance',
    },
    recentNotice: 'Annual Robotics Olympiad Registrations Close Tomorrow at 5:00 PM',
    activeProgram: 'AP Physics & Advanced Mathematics Track',
  },
  {
    id: 'alnoor',
    name: 'Al Noor International Institute',
    subdomain: 'alnoor.educore.com',
    type: 'Comprehensive Islamic & Modern Curriculum',
    badgeText: 'Dual Academic Curriculum',
    colorTheme: {
      primary: 'bg-emerald-600',
      accent: 'text-emerald-600',
      bgLight: 'bg-emerald-50/60',
      border: 'border-emerald-200',
      text: 'text-emerald-900',
    },
    tagline: 'Harmonising traditional Islamic scholarly values with contemporary STEM curricula.',
    metrics: {
      students: '860',
      faculty: '52',
      batches: '24 Batches',
      rating: '98.9% Attendance',
    },
    recentNotice: 'Ramadan Academic Schedule & Quran Recitation Term Examination Timetable',
    activeProgram: 'Hifz Integration & Cambridge IGCSE Dual Stream',
  },
  {
    id: 'greenvalley',
    name: 'Green Valley Public School',
    subdomain: 'greenvalley.educore.com',
    type: 'CBSE / ICSE Senior Secondary School',
    badgeText: 'CBSE Affiliated #84201',
    colorTheme: {
      primary: 'bg-violet-600',
      accent: 'text-violet-600',
      bgLight: 'bg-violet-50/60',
      border: 'border-violet-200',
      text: 'text-violet-900',
    },
    tagline: 'Decades of heritage cultivating leadership, athletics, and academic distinction.',
    metrics: {
      students: '2,450',
      faculty: '142',
      batches: '58 Sections',
      rating: '97.2% Attendance',
    },
    recentNotice: 'Inter-House Sports Meet & Term 2 Pre-Board Examination Guidelines',
    activeProgram: 'Senior Secondary Commerce, Arts & Science Streams',
  },
]

export function MultiTenantPortalsSection() {
  const [selectedInstId, setSelectedInstId] = useState<string>('bright')
  const activeInst = INSTITUTIONS.find((i) => i.id === selectedInstId) || INSTITUTIONS[0]

  return (
    <section id="portals" className="py-24 bg-white border-b border-slate-200/80 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/60 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-4">
            <Globe className="w-3.5 h-3.5" />
            Independent Branded Portals
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Your institution deserves its own digital identity
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            EduCore does not trap your school inside a shared generic directory. Every customer receives a 
            dedicated, branded subdomain with independent themes, isolated student databases, and custom domain support.
          </p>
        </motion.div>

        {/* Institution Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          {INSTITUTIONS.map((inst) => {
            const isSelected = inst.id === selectedInstId
            return (
              <motion.button
                key={inst.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedInstId(inst.id)}
                className={`flex items-center gap-3 px-5 py-3 rounded-2xl border text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900/10'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full ${
                    isSelected ? 'bg-emerald-400 animate-pulse' : 'bg-slate-300'
                  }`}
                />
                <span>{inst.name}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-md font-mono ${
                    isSelected ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {inst.subdomain}
                </span>
              </motion.button>
            )
          })}
        </div>

        {/* Dynamic Browser Mockup Frame */}
        <div className="max-w-5xl mx-auto rounded-3xl border border-slate-300/80 shadow-2xl bg-slate-900 overflow-hidden">
          {/* Browser Address Bar Header */}
          <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 text-xs text-slate-400 font-mono hidden sm:inline">
                EduCore Multi-Tenant Router
              </span>
            </div>

            {/* URL bar */}
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 font-mono w-full sm:w-auto sm:min-w-[340px]">
              <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
              <span className="text-slate-500">https://</span>
              <span className="text-white font-bold">{activeInst.subdomain}</span>
              <span className="text-slate-600">/dashboard</span>
              <span className="ml-auto text-[10px] text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800/50">
                SSL ACTIVE
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="hidden md:inline font-mono text-[11px] text-slate-500">
                Tenant ID: {activeInst.id}_tenant_core
              </span>
            </div>
          </div>

          {/* Browser Inner Body */}
          <div className="bg-slate-50 p-6 sm:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeInst.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Institution Portal Brand Bar */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-2xl ${activeInst.colorTheme.primary} text-white flex items-center justify-center font-bold text-xl shadow-sm`}
                    >
                      {activeInst.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-slate-900">{activeInst.name}</h3>
                        <span
                          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${activeInst.colorTheme.bgLight} ${activeInst.colorTheme.accent} ${activeInst.colorTheme.border}`}
                        >
                          {activeInst.badgeText}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{activeInst.tagline}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <span className="text-xs font-mono text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                      Academic Year 2026–2027
                    </span>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
                    <div className="text-xs text-slate-500 font-medium">Enrolled Students</div>
                    <div className="text-2xl font-extrabold text-slate-900 mt-1">
                      {activeInst.metrics.students}
                    </div>
                    <div className="text-[11px] text-emerald-600 font-medium mt-0.5">● 100% Verified Profiles</div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
                    <div className="text-xs text-slate-500 font-medium">Faculty & Staff</div>
                    <div className="text-2xl font-extrabold text-slate-900 mt-1">
                      {activeInst.metrics.faculty}
                    </div>
                    <div className="text-[11px] text-blue-600 font-medium mt-0.5">Active Teaching Staff</div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
                    <div className="text-xs text-slate-500 font-medium">Class Taxonomy</div>
                    <div className="text-2xl font-extrabold text-slate-900 mt-1">
                      {activeInst.metrics.batches}
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium mt-0.5">Assigned to Timetable</div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
                    <div className="text-xs text-slate-500 font-medium">Institution Attendance</div>
                    <div className="text-2xl font-extrabold text-slate-900 mt-1">
                      {activeInst.metrics.rating}
                    </div>
                    <div className="text-[11px] text-emerald-600 font-medium mt-0.5">Current Term Average</div>
                  </div>
                </div>

                {/* Dual operational widgets */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-7 bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm space-y-2">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Broadcasted Notice to Students & Parents
                    </div>
                    <div className="text-sm font-semibold text-slate-900">{activeInst.recentNotice}</div>
                    <div className="text-xs text-slate-500">
                      Dispatched across Mobile App, Web Portal, and SMS Gateways.
                    </div>
                  </div>

                  <div className="md:col-span-5 bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm space-y-2">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Key Academic Focus
                    </div>
                    <div className="text-sm font-semibold text-slate-900">{activeInst.activeProgram}</div>
                    <div className="text-xs text-emerald-600 font-medium flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Live curriculum mapped to EduCore
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Architectural Isolation Guarantee Callout */}
        <div className="mt-12 max-w-4xl mx-auto bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">Database-Level Tenant Isolation Guarantee</div>
              <div className="text-xs text-slate-600">
                Data for Bright Future, Al Noor, and Green Valley never mix. PostgreSQL Row Level Security enforces strict tenant segregation on every SQL statement.
              </div>
            </div>
          </div>
          <a
            href="#security"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 shrink-0 flex items-center gap-1"
          >
            Review Security Architecture →
          </a>
        </div>
      </div>
    </section>
  )
}
