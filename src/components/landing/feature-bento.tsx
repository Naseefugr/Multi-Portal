import React from 'react'
import { motion } from 'motion/react'
import {
  Users,
  Layers,
  BookOpen,
  FileCheck,
  CalendarCheck,
  Award,
  CreditCard,
  Video,
  Bell,
  BarChart3,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function FeatureBentoSection() {
  return (
    <section id="features" className="py-24 bg-white border-b border-slate-200/80 relative">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl space-y-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto space-y-4"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-semibold uppercase tracking-wider">
            Platform Capabilities
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Ten essential modules. Built into one unified foundation.
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Every feature is architected as an interconnected service inside your virtual institution portal—fenced by PostgreSQL Row Level Security.
          </p>
        </motion.div>

        {/* Bento Grid Composition with Viewport Stagger */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Student Information System (Large Hero Bento) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.5, delay: 0.05 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="lg:col-span-2 p-6 sm:p-8 rounded-3xl border border-slate-200/90 bg-slate-50/70 flex flex-col justify-between shadow-2xs group hover:border-blue-300 hover:shadow-lg transition-all"
          >
            <div className="space-y-4 max-w-xl">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <Users className="h-5 w-5" />
              </div>
              <Badge variant="outline" className="text-xs font-mono text-blue-700 bg-blue-50/80">
                01. Student Information System (SIS)
              </Badge>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                Comprehensive admissions, student records, and anti-IDOR guardian linking.
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Issue automatic admission numbers (<code className="font-mono text-xs">BVIS-2026-0104</code>), track enrollment lifecycles (enrolled, promoted, transferred), and bind verified parent relationships that prevent unauthorized record scraping.
              </p>
            </div>

            {/* Interactive Preview Representation */}
            <div className="mt-6 pt-4 border-t border-slate-200/80 grid grid-cols-3 gap-2 text-xs">
              <div className="p-3 bg-white rounded-xl border border-slate-200/70 shadow-2xs">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Admission Format</span>
                <strong className="text-blue-600 font-mono">INST-YYYY-XXXX</strong>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200/70 shadow-2xs">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Guardian Verification</span>
                <strong className="text-emerald-600">Anti-IDOR Verified</strong>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200/70 shadow-2xs">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Status State</span>
                <strong className="text-slate-800">Enrolled & Active</strong>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Academic Structure */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="p-6 sm:p-8 rounded-3xl border border-slate-200/90 bg-white flex flex-col justify-between shadow-2xs group hover:border-indigo-300 hover:shadow-lg transition-all"
          >
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <Layers className="h-5 w-5" />
              </div>
              <Badge variant="outline" className="text-xs font-mono text-indigo-700 bg-indigo-50/80">
                02. Academic Taxonomy
              </Badge>
              <h3 className="text-lg font-bold text-slate-900">
                Hierarchical Academic Structure
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Academic Years &rarr; Terms &rarr; Classes &rarr; Batches & Sections &rarr; Subjects. Define strict teacher-to-batch subject allocations.
              </p>
            </div>
            <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono text-slate-600">
              Grade 10 &rarr; Section A &bull; 35 Students
            </div>
          </motion.div>

          {/* Card 3: Class Stream Posts */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.5, delay: 0.15 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="p-6 sm:p-8 rounded-3xl border border-slate-200/90 bg-white flex flex-col justify-between shadow-2xs group hover:border-blue-300 hover:shadow-lg transition-all"
          >
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <BookOpen className="h-5 w-5" />
              </div>
              <Badge variant="outline" className="text-xs font-mono text-blue-700 bg-blue-50/80">
                03. Class Feed & Resources
              </Badge>
              <h3 className="text-lg font-bold text-slate-900">
                Interactive Class Stream
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Course material feeds with syllabus links, syllabus file attachments, and pinned study notices per batch.
              </p>
            </div>
            <div className="mt-4 p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-xs font-medium text-blue-800">
              📎 Chapter_4_Optics_Notes.pdf
            </div>
          </motion.div>

          {/* Card 4: Assignments & Submissions */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="p-6 sm:p-8 rounded-3xl border border-slate-200/90 bg-white flex flex-col justify-between shadow-2xs group hover:border-emerald-300 hover:shadow-lg transition-all"
          >
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <FileCheck className="h-5 w-5" />
              </div>
              <Badge variant="outline" className="text-xs font-mono text-emerald-700 bg-emerald-50/80">
                04. Digital Homework
              </Badge>
              <h3 className="text-lg font-bold text-slate-900">
                Online Submissions & Evaluation
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Set deadlines, submission rubrics, accept student attachments, and evaluate with numerical marks and teacher feedback.
              </p>
            </div>
            <div className="mt-4 p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 text-xs text-emerald-700 flex items-center justify-between">
              <span>Aarav Patel</span>
              <strong>94 / 100 (A+)</strong>
            </div>
          </motion.div>

          {/* Card 5: Attendance Module */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.5, delay: 0.25 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="p-6 sm:p-8 rounded-3xl border border-slate-200/90 bg-white flex flex-col justify-between shadow-2xs group hover:border-cyan-300 hover:shadow-lg transition-all"
          >
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center">
                <CalendarCheck className="h-5 w-5" />
              </div>
              <Badge variant="outline" className="text-xs font-mono text-cyan-700 bg-cyan-50/80">
                05. Roll Call & Verification
              </Badge>
              <h3 className="text-lg font-bold text-slate-900">
                Daily & Session Attendance
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Instant Present / Absent / Late recording per session. Immediate guardian absence alerts and monthly percentage computation.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-emerald-600">96.4% Roll Call Locked</span>
            </div>
          </motion.div>

          {/* Card 6: Examinations & Gradebooks */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="p-6 sm:p-8 rounded-3xl border border-slate-200/90 bg-white flex flex-col justify-between shadow-2xs group hover:border-amber-300 hover:shadow-lg transition-all"
          >
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                <Award className="h-5 w-5" />
              </div>
              <Badge variant="outline" className="text-xs font-mono text-amber-700 bg-amber-50/80">
                06. Exam Engine
              </Badge>
              <h3 className="text-lg font-bold text-slate-900">
                Automated Rank Calculation
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Schedule exams, enter subject marks, compute cohort ranks automatically, and generate exportable report cards.
              </p>
            </div>
            <div className="mt-4 p-3 bg-amber-50/60 rounded-xl border border-amber-100 text-xs font-semibold text-amber-800">
              Rank #1 in Class 10 Cohort
            </div>
          </motion.div>

          {/* Card 7: Minor-Unit Double-Entry Fee Ledger (Featured Bento) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.5, delay: 0.35 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="lg:col-span-2 p-6 sm:p-8 rounded-3xl border border-slate-200/90 bg-slate-900 text-white flex flex-col justify-between shadow-xl group hover:border-amber-400/60 transition-all"
          >
            <div className="space-y-4 max-w-xl">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <CreditCard className="h-5 w-5" />
              </div>
              <Badge variant="outline" className="text-xs font-mono text-amber-400 border-amber-400/40 bg-amber-950/40">
                07. Financial Core
              </Badge>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Minor-Unit Double-Entry Fee Ledger
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                All currency stored as exact integer minor units (paise / cents). Zero floating-point drift. Reconciles paid fees, pending dues, concession waivers, and auto-generates official receipts.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 grid grid-cols-3 gap-2 text-xs">
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Total Reconciled</span>
                <strong className="text-xl font-bold text-white">₹42.8L</strong>
              </div>
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Precision Standard</span>
                <strong className="text-amber-400 font-mono">BIGINT Minor Units</strong>
              </div>
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Audit Guarantee</span>
                <strong className="text-emerald-400">100% Balanced</strong>
              </div>
            </div>
          </motion.div>

          {/* Card 8: Live Virtual Classes */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="p-6 sm:p-8 rounded-3xl border border-slate-200/90 bg-white flex flex-col justify-between shadow-2xs group hover:border-emerald-300 hover:shadow-lg transition-all"
          >
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Video className="h-5 w-5" />
              </div>
              <Badge variant="outline" className="text-xs font-mono text-emerald-700 bg-emerald-50/80">
                08. Live Classrooms
              </Badge>
              <h3 className="text-lg font-bold text-slate-900">
                Integrated Live Bridge
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Launch secure live video lectures with one tap. Attendance duration logged automatically upon student joining.
              </p>
            </div>
            <div className="mt-4 p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-xs font-semibold text-emerald-700 flex items-center justify-between">
              <span>Active Lecture</span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Live Now
              </span>
            </div>
          </motion.div>

          {/* Card 9: Multi-Channel Communication */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.5, delay: 0.45 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="p-6 sm:p-8 rounded-3xl border border-slate-200/90 bg-white flex flex-col justify-between shadow-2xs group hover:border-blue-300 hover:shadow-lg transition-all"
          >
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <Bell className="h-5 w-5" />
              </div>
              <Badge variant="outline" className="text-xs font-mono text-blue-700 bg-blue-50/80">
                09. Announcements
              </Badge>
              <h3 className="text-lg font-bold text-slate-900">
                Multi-Channel Notices
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Target broadcasts by audience: all institution, specific classes, or faculty only. Push, SMS, and portal feeds.
              </p>
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-100 text-xs font-semibold text-blue-700">
              📢 Inter-School Science Fair Registrations
            </div>
          </motion.div>

          {/* Card 10: Executive Analytics */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.5, delay: 0.5 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="p-6 sm:p-8 rounded-3xl border border-slate-200/90 bg-white flex flex-col justify-between shadow-2xs group hover:border-violet-300 hover:shadow-lg transition-all"
          >
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center">
                <BarChart3 className="h-5 w-5" />
              </div>
              <Badge variant="outline" className="text-xs font-mono text-violet-700 bg-violet-50/80">
                10. Platform Telemetry
              </Badge>
              <h3 className="text-lg font-bold text-slate-900">
                Real-Time Institution KPI Pulse
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Monitor attendance trajectories, fee collection aging, class sizes, and faculty distribution from a central executive pulse.
              </p>
            </div>
            <div className="mt-4 p-3 bg-violet-50 rounded-xl border border-violet-100 text-xs font-semibold text-violet-700">
              Cohort Retention: 98.4%
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
