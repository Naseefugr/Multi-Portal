import React from 'react'
import { motion } from 'motion/react'
import {
  Users,
  GraduationCap,
  CalendarCheck,
  CreditCard,
  Video,
  FileCheck2,
  ShieldCheck,
  Lock,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react'

export function HeroDashboardFrame() {
  const attendanceBars = [
    { day: 'M', height: 86 },
    { day: 'T', height: 96 },
    { day: 'W', height: 94 },
    { day: 'T', height: 98 },
    { day: 'F', height: 95 },
    { day: 'S', height: 80 },
    { day: 'S', height: 88 },
  ]

  return (
    <div className="relative mx-auto max-w-5xl w-full px-2 sm:px-4 py-2 sm:py-3">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[85%] bg-gradient-to-r from-blue-500/15 via-indigo-500/10 to-blue-400/15 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Main Browser Frame */}
      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white shadow-[0_20px_60px_-15px_rgba(15,23,42,0.08)] overflow-hidden"
      >
        {/* Top Browser Header / Window Controls */}
        <div className="h-12 bg-white border-b border-slate-100 px-4 sm:px-6 flex items-center justify-between select-none">
          {/* Mac-style Window Controls */}
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#FF5F56] inline-block shadow-2xs" />
            <span className="w-3 h-3 rounded-full bg-[#FFBD2E] inline-block shadow-2xs" />
            <span className="w-3 h-3 rounded-full bg-[#27C93F] inline-block shadow-2xs" />
          </div>

          {/* Browser Address Bar */}
          <div className="flex items-center gap-2 bg-slate-50/80 px-4 py-1.5 rounded-full border border-slate-200/70 text-xs font-mono text-slate-600 shadow-2xs w-full max-w-[260px] sm:max-w-xs justify-center">
            <Lock className="w-3 h-3 text-emerald-500 shrink-0" />
            <span className="text-slate-400 font-sans">https://</span>
            <strong className="text-blue-600 font-bold">bright</strong>
            <span className="text-slate-500">.educore.com</span>
          </div>

          {/* Right subtle spacer */}
          <div className="w-10 sm:w-16" />
        </div>

        {/* Inner Dashboard Body */}
        <div className="p-5 sm:p-7 md:p-8 space-y-6 bg-white">
          {/* Institution Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
            <div className="flex items-center gap-3.5">
              {/* Institution Avatar */}
              <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xl shadow-sm shrink-0">
                B
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="font-bold text-base sm:text-lg text-slate-900 tracking-tight">
                    Bright Valley International School
                  </h3>
                  <span className="bg-[#10B981] text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full tracking-wider shadow-2xs">
                    ACTIVE TENANT
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5 font-normal">
                  Academic Session 2026–2027 • Bangalore Campus
                </p>
              </div>
            </div>

            {/* Role Badge */}
            <div className="flex items-center gap-2 self-start sm:self-center">
              <span className="text-xs text-slate-400 font-medium">Role:</span>
              <div className="bg-slate-50/90 border border-slate-200/80 text-xs font-semibold px-3 py-1 rounded-lg text-slate-700 flex items-center gap-1.5 shadow-2xs">
                <span>👑</span>
                <span>Institution Admin</span>
              </div>
            </div>
          </div>

          {/* Top 4 KPI Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
            {/* Card 1: Enrolled Students */}
            <div className="p-4 rounded-xl border border-slate-200/80 bg-white shadow-2xs hover:border-slate-300 transition-all">
              <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                <span>Enrolled Students</span>
                <Users className="w-4 h-4 text-blue-500" />
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
                1,248
              </p>
              <div className="text-[11px] text-emerald-500 font-semibold mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 stroke-[2.5]" />
                <span>+12% this academic term</span>
              </div>
            </div>

            {/* Card 2: Faculty Members */}
            <div className="p-4 rounded-xl border border-slate-200/80 bg-white shadow-2xs hover:border-slate-300 transition-all">
              <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                <span>Faculty Members</span>
                <GraduationCap className="w-4 h-4 text-indigo-500" />
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
                84
              </p>
              <div className="text-[11px] text-slate-400 font-medium mt-1">
                Allocated to 32 Cohorts
              </div>
            </div>

            {/* Card 3: Today's Attendance */}
            <div className="p-4 rounded-xl border border-slate-200/80 bg-white shadow-2xs hover:border-slate-300 transition-all">
              <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                <span>Today's Attendance</span>
                <CalendarCheck className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-[#10B981] mt-2 tracking-tight">
                96.4%
              </p>
              <div className="text-[11px] text-slate-400 font-medium mt-1">
                Verified Roll Call Locked
              </div>
            </div>

            {/* Card 4: Fee Collections */}
            <div className="p-4 rounded-xl border border-slate-200/80 bg-white shadow-2xs hover:border-slate-300 transition-all">
              <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                <span>Fee Collections</span>
                <CreditCard className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
                ₹42.8L
              </p>
              <div className="text-[11px] text-slate-400 font-medium mt-1">
                Zero minor-unit roundoff
              </div>
            </div>
          </div>

          {/* Bottom 3 Operational Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
            {/* Active Assignment Card */}
            <div className="p-4 rounded-xl border border-slate-200/80 bg-white shadow-2xs flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <FileCheck2 className="w-4 h-4 text-blue-600" />
                    <span>Active Assignment</span>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-600 bg-slate-50 border border-slate-200/80 px-2 py-0.5 rounded-md">
                    Grade 10-A
                  </span>
                </div>
                <p className="text-xs sm:text-[13px] font-semibold text-slate-800 leading-snug">
                  Quadratic Systems & Coordinate Symmetry
                </p>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                <span className="text-slate-400 text-[11px]">32 / 35 Submitted</span>
                <span className="text-amber-500 font-semibold text-[11px]">Due Friday</span>
              </div>
            </div>

            {/* Live Classroom Card */}
            <div className="p-4 rounded-xl border border-slate-200/80 bg-white shadow-2xs flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <Video className="w-4 h-4 text-emerald-500" />
                    <span>Live Classroom</span>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-md">
                    Jitsi Bridge
                  </span>
                </div>
                <p className="text-xs sm:text-[13px] font-semibold text-slate-800 leading-snug">
                  Trigonometry Doubt-Clearing Masterclass
                </p>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                <span className="text-slate-400 text-[11px]">Prof. David Wilson</span>
                <span className="text-blue-600 font-semibold text-[11px]">Sat 10:00 AM</span>
              </div>
            </div>

            {/* Weekly Attendance Card with Micro Bars */}
            <div className="p-4 rounded-xl border border-slate-200/80 bg-white shadow-2xs flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Weekly Attendance</span>
                <span className="text-xs font-semibold text-emerald-500">Avg 95.8%</span>
              </div>

              {/* Attendance Bars */}
              <div className="h-12 w-full flex items-end gap-2 pt-2">
                {attendanceBars.map((bar, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <motion.div
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ duration: 0.6, delay: 0.1 * idx, ease: 'easeOut' }}
                      style={{ originY: 1, height: `${bar.height}%` }}
                      className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] rounded-[3px] transition-colors cursor-pointer"
                    />
                    <span className="text-[9px] text-slate-400 font-medium">
                      {bar.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating Card 1: Top-Right (Submission Evaluated) with Idle Floating Animation */}
      <motion.div
        initial={{ opacity: 0, x: 20, y: -10 }}
        animate={{
          opacity: 1,
          x: 0,
          y: [0, -8, 0],
        }}
        transition={{
          opacity: { duration: 0.5, delay: 0.3 },
          x: { duration: 0.5, delay: 0.3 },
          y: { repeat: Infinity, duration: 4.6, ease: 'easeInOut' },
        }}
        className="hidden md:flex absolute -top-3 -right-2 sm:-right-4 lg:-right-6 bg-white rounded-2xl p-3.5 px-4 shadow-[0_15px_35px_rgba(15,23,42,0.1)] border border-slate-100 items-center gap-3.5 text-xs z-20"
      >
        <div className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 shrink-0">
          <CheckCircle2 className="w-5 h-5 stroke-[2.2]" />
        </div>
        <div>
          <p className="font-bold text-slate-800 text-xs sm:text-[13px] leading-tight">
            Submission Evaluated
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
            Aarav Patel scored 94/100 (A+) in Math
          </p>
        </div>
      </motion.div>

      {/* Floating Card 2: Bottom-Left (PostgreSQL RLS Active) with Out-of-Phase Floating Animation */}
      <motion.div
        initial={{ opacity: 0, x: -20, y: 10 }}
        animate={{
          opacity: 1,
          x: 0,
          y: [0, 7, 0],
        }}
        transition={{
          opacity: { duration: 0.5, delay: 0.5 },
          x: { duration: 0.5, delay: 0.5 },
          y: { repeat: Infinity, duration: 5.2, ease: 'easeInOut', delay: 0.4 },
        }}
        className="hidden md:flex absolute -bottom-3 -left-2 sm:-left-4 lg:-left-6 bg-white rounded-2xl p-3.5 px-4 shadow-[0_15px_35px_rgba(15,23,42,0.1)] border border-slate-100 items-center gap-3.5 text-xs z-20"
      >
        <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
          <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
        </div>
        <div>
          <p className="font-bold text-slate-800 text-xs sm:text-[13px] leading-tight">
            PostgreSQL RLS Active
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
            Tenant-partitioned data boundary verified
          </p>
        </div>
      </motion.div>
    </div>
  )
}
