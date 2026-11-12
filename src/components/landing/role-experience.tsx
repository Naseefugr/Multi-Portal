import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Shield,
  Building,
  UserCheck,
  GraduationCap,
  Users,
  HeartHandshake,
  ArrowRight,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export type RoleKey = 'founder' | 'admin' | 'manager' | 'teacher' | 'student' | 'parent'

interface RoleExperienceProps {
  onLaunchRoleDemo?: (role: RoleKey) => void
}

export function RoleExperienceSection({ onLaunchRoleDemo }: RoleExperienceProps = {}) {
  const [activeRole, setActiveRole] = useState<RoleKey>('admin')

  const roles = [
    {
      id: 'admin' as RoleKey,
      label: 'Institution Admin',
      short: 'Admin',
      icon: Building,
      summary: 'Complete operational authority over the institution portal.',
    },
    {
      id: 'manager' as RoleKey,
      label: 'Delegated Manager',
      short: 'Manager',
      icon: UserCheck,
      summary: 'Granularly assigned operational modules with zero default access.',
    },
    {
      id: 'teacher' as RoleKey,
      label: 'Teacher / Faculty',
      short: 'Teacher',
      icon: GraduationCap,
      summary: 'Curriculum delivery for assigned classes and subjects.',
    },
    {
      id: 'student' as RoleKey,
      label: 'Student / Learner',
      short: 'Student',
      icon: Users,
      summary: 'Personal homework submission, attendance, and learning materials.',
    },
    {
      id: 'parent' as RoleKey,
      label: 'Verified Guardian',
      short: 'Parent',
      icon: HeartHandshake,
      summary: 'Cryptographically linked visibility into child attendance & grades.',
    },
    {
      id: 'founder' as RoleKey,
      label: 'Platform Founder',
      short: 'Founder',
      icon: Shield,
      summary: 'Cross-tenant oversight, lifecycle control, and system telemetry.',
    },
  ]

  const currentRole = roles.find((r) => r.id === activeRole) || roles[0]

  return (
    <section id="roles" className="py-24 bg-slate-50 border-b border-slate-200/80 relative">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl space-y-14">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto space-y-4"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-semibold uppercase tracking-wider">
            Tailored Experiences
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Six roles. Six precision dashboards. Zero friction.
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Every user interacts with EduCore through a role-tailored view designed for their exact operational boundaries.
          </p>
        </motion.div>

        {/* Role Switcher Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
          {roles.map((r) => {
            const Icon = r.icon
            const isSelected = r.id === activeRole
            return (
              <motion.button
                key={r.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveRole(r.id)}
                className={`relative px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 border cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <Icon className={`h-4 w-4 ${isSelected ? 'text-blue-400' : 'text-slate-400'}`} />
                <span>{r.label}</span>
                {isSelected && (
                  <motion.div
                    layoutId="active-role-tab"
                    className="absolute inset-0 border-2 border-blue-500 rounded-xl pointer-events-none"
                    transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                  />
                )}
              </motion.button>
            )
          })}
        </div>

        {/* Dynamic Role Dashboard Preview Container */}
        <div className="max-w-4xl mx-auto rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 md:p-10 shadow-xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                  {currentRole.label} Workspace
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60 font-mono">
                  PostgreSQL RLS Scoped
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 font-normal">
                {currentRole.summary}
              </p>
            </div>

            {onLaunchRoleDemo && (
              <button
                onClick={() => onLaunchRoleDemo(activeRole)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
              >
                <span>Launch {currentRole.short} Demo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* AnimatePresence for smoothly swapping role preview content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeRole}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {activeRole === 'admin' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 shadow-2xs">
                      <span className="text-slate-400 block font-medium">Institution Scope</span>
                      <strong className="text-sm font-bold text-slate-900">Full Authority</strong>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 shadow-2xs">
                      <span className="text-slate-400 block font-medium">Academic Year</span>
                      <strong className="text-sm font-bold text-blue-600">2026–2027</strong>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 shadow-2xs">
                      <span className="text-slate-400 block font-medium">Ledger Status</span>
                      <strong className="text-sm font-bold text-emerald-600">Reconciled</strong>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 shadow-2xs">
                      <span className="text-slate-400 block font-medium">Audit Trail</span>
                      <strong className="text-sm font-bold text-slate-900">Immutable Log</strong>
                    </div>
                  </div>
                  <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-100 text-xs text-blue-900 font-medium">
                    Admin Privileges: Module configuration, fee schedules, manager invitations, and automated rank calculation.
                  </div>
                </div>
              )}

              {activeRole === 'manager' && (
                <div className="space-y-4">
                  <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200/70 text-xs text-amber-900 flex items-center justify-between">
                    <span>
                      Delegation Policy: <strong>Granular Attendance & Fee Recording Access</strong>
                    </span>
                    <Badge variant="outline" className="text-[10px] bg-white border-amber-300">Active Delegate</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 shadow-2xs">
                      <span className="text-slate-400 block font-medium">Fees View</span>
                      <strong className="text-sm font-bold text-emerald-600">Granted (Record Receipts)</strong>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 shadow-2xs">
                      <span className="text-slate-400 block font-medium">Attendance View</span>
                      <strong className="text-sm font-bold text-emerald-600">Granted (Mark Sessions)</strong>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 shadow-2xs">
                      <span className="text-slate-400 block font-medium">Fee Deletion</span>
                      <strong className="text-sm font-bold text-rose-600">Restricted by Admin</strong>
                    </div>
                  </div>
                </div>
              )}

              {activeRole === 'teacher' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 shadow-2xs">
                      <span className="text-slate-400 block font-medium">Assigned Batches</span>
                      <strong className="text-sm font-bold text-slate-900">Class 10-A, 10-B</strong>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 shadow-2xs">
                      <span className="text-slate-400 block font-medium">Today's Sessions</span>
                      <strong className="text-sm font-bold text-blue-600">3 Scheduled</strong>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 shadow-2xs">
                      <span className="text-slate-400 block font-medium">Pending Evaluations</span>
                      <strong className="text-sm font-bold text-amber-600">12 Submissions</strong>
                    </div>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-600">
                    Faculty access is scoped strictly to mapped subjects and classes. Teachers cannot see unassigned student rosters.
                  </div>
                </div>
              )}

              {activeRole === 'student' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 shadow-2xs">
                      <span className="text-slate-400 block font-medium">Homework Due</span>
                      <strong className="text-sm font-bold text-amber-600">Assignment 03 (Fri)</strong>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 shadow-2xs">
                      <span className="text-slate-400 block font-medium">My Attendance</span>
                      <strong className="text-sm font-bold text-emerald-600">96% Present</strong>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 shadow-2xs">
                      <span className="text-slate-400 block font-medium">Term 1 Exam Result</span>
                      <strong className="text-sm font-bold text-blue-600">93% (Grade A+)</strong>
                    </div>
                  </div>
                  <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-100 text-xs text-blue-900 font-medium">
                    Latest Class Note: <em>Trigonometric Identities & Quadratic Systems Lecture Handout.pdf</em> (2.4 MB)
                  </div>
                </div>
              )}

              {activeRole === 'parent' && (
                <div className="space-y-4">
                  <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200/70 text-xs text-emerald-900 flex items-center justify-between">
                    <span>
                      Verified Linked Child: <strong>Aarav Patel</strong> (Grade 10 - Section A)
                    </span>
                    <Badge variant="success" className="text-[10px]">Verified Father</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 shadow-2xs">
                      <span className="text-slate-400 block font-medium">Attendance Rate</span>
                      <strong className="text-sm font-bold text-emerald-600">96% Verified</strong>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 shadow-2xs">
                      <span className="text-slate-400 block font-medium">Academic Standing</span>
                      <strong className="text-sm font-bold text-slate-900">Top 5% Cohort</strong>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 shadow-2xs">
                      <span className="text-slate-400 block font-medium">Term 1 Fee Status</span>
                      <strong className="text-sm font-bold text-emerald-600">₹0.00 Outstanding</strong>
                    </div>
                  </div>
                </div>
              )}

              {activeRole === 'founder' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 shadow-2xs">
                      <span className="text-slate-400 block font-medium">Registered Tenants</span>
                      <strong className="text-xl font-bold text-blue-600">142 Institutions</strong>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 shadow-2xs">
                      <span className="text-slate-400 block font-medium">Active Portals</span>
                      <strong className="text-xl font-bold text-emerald-600">138 Active</strong>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 shadow-2xs">
                      <span className="text-slate-400 block font-medium">Global Telemetry</span>
                      <strong className="text-xl font-bold text-slate-900">99.98% SLA</strong>
                    </div>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-600 font-medium">
                    Platform Master Console: Tenant lifecycle management (suspend, reactivate), global feature gates, and plan quotas.
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
