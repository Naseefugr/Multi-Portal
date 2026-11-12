import React from 'react'
import { motion } from 'motion/react'
import {
  FileSpreadsheet,
  AlertTriangle,
  MessageSquareOff,
  Coins,
  Split,
  Sparkles,
} from 'lucide-react'

export function ProblemSolutionSection() {
  const problems = [
    {
      title: 'Scattered Student Records',
      description: 'Admission details, guardian emergency contacts, and academic history trapped in disconnected spreadsheets.',
      icon: FileSpreadsheet,
    },
    {
      title: 'Manual Attendance Books',
      description: 'Paper roll call books lost across periods, leading to duplicate records and unnotified guardian absences.',
      icon: AlertTriangle,
    },
    {
      title: 'Chaotic Homework Collection',
      description: 'Assignments submitted via messy messaging chats without timestamp verification, rubrics, or formal evaluation.',
      icon: MessageSquareOff,
    },
    {
      title: 'Ledger Leaks & Rounding Discrepancies',
      description: 'Fragmented accounting tools with rounding errors, manual cash books, and no tamper-proof receipt trail.',
      icon: Coins,
    },
    {
      title: 'Siloed Staff Workflows',
      description: 'Administrators, operational supervisors, and classroom teachers juggling five different uncoordinated logins.',
      icon: Split,
    },
  ]

  return (
    <section className="py-24 bg-slate-50 border-b border-slate-200/80 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl space-y-16 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto space-y-4"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200/60 text-rose-700 text-xs font-semibold uppercase tracking-wider">
            The Industry Challenge
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Education management shouldn't be fragmented
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Most institutions operate with an unmaintainable patchwork of spreadsheets, messaging apps, and legacy software. Critical academic records get lost, and operational visibility suffers.
          </p>
        </motion.div>

        {/* Problems Editorial Grid with Staggered Viewport Reveal */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {problems.map((p, idx) => {
            const Icon = p.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.5, delay: idx * 0.08, ease: 'easeOut' }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 leading-snug">{p.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-normal">
                    {p.description}
                  </p>
                </div>
                <div className="pt-2 text-[11px] font-mono font-semibold text-rose-500">
                  Fragmented Tool #{idx + 1}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* The EduCore Connected SaaS Solution Banner with Motion Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl bg-slate-900 text-white p-6 sm:p-8 md:p-10 shadow-xl border border-slate-800 flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden"
        >
          {/* Subtle Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-3 max-w-2xl relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/60 border border-blue-700/60 text-blue-300 text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5 text-blue-400" />
              <span>The EduCore Standard</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              One central cloud platform. All operations in sync.
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              EduCore unifies academic taxonomies, digital homework evaluations, attendance locks, and minor-unit fee ledgers into a single tenant-partitioned database environment with zero cross-tenant leakage.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full lg:w-auto shrink-0 relative">
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/60 space-y-1">
              <div className="text-2xl font-black text-emerald-400">100%</div>
              <div className="text-xs text-slate-400">Connected Workflows</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/60 space-y-1">
              <div className="text-2xl font-black text-blue-400">0</div>
              <div className="text-xs text-slate-400">Rounding Discrepancies</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
