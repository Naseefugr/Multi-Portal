import React, { useState } from 'react'
import {
  Sliders,
  Shield,
  Check,
  X,
  UserCheck,
  CreditCard,
  CalendarCheck,
  GraduationCap,
  Bell,
} from 'lucide-react'

interface PermissionPreset {
  id: string
  roleTitle: string
  description: string
  badge: string
  permissions: {
    module: string
    icon: React.ElementType
    canView: boolean
    canCreate: boolean
    canEdit: boolean
    canDelete: boolean
    canExport: boolean
  }[]
}

const PRESETS: PermissionPreset[] = [
  {
    id: 'finance-officer',
    roleTitle: 'Finance & Accounts Officer',
    description: 'Complete sovereignty over fee schedules, dues, and transaction ledgers without academic exposure.',
    badge: 'Finance Specialised',
    permissions: [
      { module: 'Fee Ledger & Collections', icon: CreditCard, canView: true, canCreate: true, canEdit: true, canDelete: false, canExport: true },
      { module: 'Student Attendance', icon: CalendarCheck, canView: false, canCreate: false, canEdit: false, canDelete: false, canExport: false },
      { module: 'Examinations & Marks', icon: GraduationCap, canView: false, canCreate: false, canEdit: false, canDelete: false, canExport: false },
      { module: 'Announcements & Notices', icon: Bell, canView: true, canCreate: false, canEdit: false, canDelete: false, canExport: false },
      { module: 'Student Enrolment Profiles', icon: UserCheck, canView: true, canCreate: false, canEdit: false, canDelete: false, canExport: true },
    ],
  },
  {
    id: 'academic-head',
    roleTitle: 'Academic Coordinator',
    description: 'Supervises curricula, grading standards, timetables, and teacher assignments without financial clearance.',
    badge: 'Academic Specialised',
    permissions: [
      { module: 'Fee Ledger & Collections', icon: CreditCard, canView: false, canCreate: false, canEdit: false, canDelete: false, canExport: false },
      { module: 'Student Attendance', icon: CalendarCheck, canView: true, canCreate: true, canEdit: true, canDelete: false, canExport: true },
      { module: 'Examinations & Marks', icon: GraduationCap, canView: true, canCreate: true, canEdit: true, canDelete: true, canExport: true },
      { module: 'Announcements & Notices', icon: Bell, canView: true, canCreate: true, canEdit: true, canDelete: false, canExport: true },
      { module: 'Student Enrolment Profiles', icon: UserCheck, canView: true, canCreate: true, canEdit: true, canDelete: false, canExport: true },
    ],
  },
  {
    id: 'front-desk',
    roleTitle: 'Front-Desk Administrator',
    description: 'Handles day-to-day visitor logs, student check-ins, fee receipt counters, and operational notices.',
    badge: 'Front-Office Specialised',
    permissions: [
      { module: 'Fee Ledger & Collections', icon: CreditCard, canView: true, canCreate: true, canEdit: false, canDelete: false, canExport: false },
      { module: 'Student Attendance', icon: CalendarCheck, canView: true, canCreate: true, canEdit: false, canDelete: false, canExport: false },
      { module: 'Examinations & Marks', icon: GraduationCap, canView: true, canCreate: false, canEdit: false, canDelete: false, canExport: false },
      { module: 'Announcements & Notices', icon: Bell, canView: true, canCreate: true, canEdit: false, canDelete: false, canExport: false },
      { module: 'Student Enrolment Profiles', icon: UserCheck, canView: true, canCreate: true, canEdit: false, canDelete: false, canExport: false },
    ],
  },
]

export function FlexibleManagementSection() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('finance-officer')
  const [customPermissions, setCustomPermissions] = useState(PRESETS[0].permissions)

  const handlePresetSelect = (presetId: string) => {
    setSelectedPresetId(presetId)
    const found = PRESETS.find((p) => p.id === presetId)
    if (found) {
      setCustomPermissions(JSON.parse(JSON.stringify(found.permissions)))
    }
  }

  const togglePermission = (index: number, key: 'canView' | 'canCreate' | 'canEdit' | 'canDelete' | 'canExport') => {
    setCustomPermissions((prev) => {
      const copy = [...prev]
      copy[index] = {
        ...copy[index],
        [key]: !copy[index][key],
      }
      return copy
    })
  }

  const activePreset = PRESETS.find((p) => p.id === selectedPresetId) || PRESETS[0]

  return (
    <section id="permissions" className="py-24 bg-slate-50 border-b border-slate-200/80 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 border border-violet-200/60 text-violet-700 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sliders className="w-3.5 h-3.5" />
            Configurable RBAC & Isolation
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Your institution. Your rules. Your permissions.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Never force your staff into blunt, all-or-nothing admin privileges. EduCore gives you precision
            per-module and per-action access governance tailored to how your real campus runs.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-10">
          {PRESETS.map((preset) => {
            const isSelected = preset.id === selectedPresetId
            return (
              <button
                key={preset.id}
                onClick={() => handlePresetSelect(preset.id)}
                className={`p-5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white border-violet-600 shadow-md ring-2 ring-violet-500/20'
                    : 'bg-white/60 border-slate-200 hover:bg-white hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        isSelected
                          ? 'bg-violet-100 text-violet-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {preset.badge}
                    </span>
                    {isSelected && <Shield className="w-4 h-4 text-violet-600" />}
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm sm:text-base">{preset.roleTitle}</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                    {preset.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-violet-600">
                  {isSelected ? 'Currently Inspecting Matrix' : 'Click to Load Matrix'}
                </div>
              </button>
            )
          })}
        </div>

        {/* Interactive Permission Matrix Table */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden max-w-5xl mx-auto">
          {/* Table Header Description Bar */}
          <div className="p-6 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-violet-400 bg-violet-950 px-2 py-0.5 rounded border border-violet-800">
                  LIVE PERMISSION MATRIX
                </span>
                <span className="text-xs text-slate-400">Click any switch to toggle in real time</span>
              </div>
              <h3 className="text-lg font-bold text-white mt-1">
                Access Policy: {activePreset.roleTitle}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-md border border-emerald-800/60 font-mono">
                PostgreSQL Policy Verified
              </span>
            </div>
          </div>

          {/* Matrix Grid */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6">Protected Module</th>
                  <th className="py-4 px-4 text-center">View (Read)</th>
                  <th className="py-4 px-4 text-center">Create</th>
                  <th className="py-4 px-4 text-center">Modify</th>
                  <th className="py-4 px-4 text-center">Delete</th>
                  <th className="py-4 px-4 text-center">Export CSV</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customPermissions.map((row, idx) => {
                  const Icon = row.icon
                  return (
                    <tr key={row.module} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-6 font-semibold text-slate-800 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span>{row.module}</span>
                      </td>

                      {/* View Toggle */}
                      <td className="py-4 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => togglePermission(idx, 'canView')}
                          className={`w-7 h-7 rounded-lg inline-flex items-center justify-center transition-all ${
                            row.canView
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-sm'
                              : 'bg-slate-100 text-slate-300'
                          }`}
                        >
                          {row.canView ? <Check className="w-4 h-4 stroke-[3]" /> : <X className="w-3.5 h-3.5" />}
                        </button>
                      </td>

                      {/* Create Toggle */}
                      <td className="py-4 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => togglePermission(idx, 'canCreate')}
                          className={`w-7 h-7 rounded-lg inline-flex items-center justify-center transition-all ${
                            row.canCreate
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-sm'
                              : 'bg-slate-100 text-slate-300'
                          }`}
                        >
                          {row.canCreate ? <Check className="w-4 h-4 stroke-[3]" /> : <X className="w-3.5 h-3.5" />}
                        </button>
                      </td>

                      {/* Edit Toggle */}
                      <td className="py-4 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => togglePermission(idx, 'canEdit')}
                          className={`w-7 h-7 rounded-lg inline-flex items-center justify-center transition-all ${
                            row.canEdit
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-sm'
                              : 'bg-slate-100 text-slate-300'
                          }`}
                        >
                          {row.canEdit ? <Check className="w-4 h-4 stroke-[3]" /> : <X className="w-3.5 h-3.5" />}
                        </button>
                      </td>

                      {/* Delete Toggle */}
                      <td className="py-4 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => togglePermission(idx, 'canDelete')}
                          className={`w-7 h-7 rounded-lg inline-flex items-center justify-center transition-all ${
                            row.canDelete
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-sm'
                              : 'bg-slate-100 text-slate-300'
                          }`}
                        >
                          {row.canDelete ? <Check className="w-4 h-4 stroke-[3]" /> : <X className="w-3.5 h-3.5" />}
                        </button>
                      </td>

                      {/* Export Toggle */}
                      <td className="py-4 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => togglePermission(idx, 'canExport')}
                          className={`w-7 h-7 rounded-lg inline-flex items-center justify-center transition-all ${
                            row.canExport
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-sm'
                              : 'bg-slate-100 text-slate-300'
                          }`}
                        >
                          {row.canExport ? <Check className="w-4 h-4 stroke-[3]" /> : <X className="w-3.5 h-3.5" />}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Matrix Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
            <div>Changes are checked in real-time by Supabase RLS security policies before any DB row mutation.</div>
            <div className="font-semibold text-slate-700">Audit logs recorded on every role modification</div>
          </div>
        </div>
      </div>
    </section>
  )
}
