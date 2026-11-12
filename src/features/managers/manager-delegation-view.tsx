import React from 'react'
import { useAcademic } from '@/contexts/academic-context'
import { useAuth } from '@/contexts/auth-context'
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Lock,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const AVAILABLE_PERMISSIONS = [
  {
    category: 'Attendance Operations',
    key: 'attendance.record',
    title: 'Record Daily Attendance',
    description: 'Allow manager to mark present, absent, late, or excused for student cohorts.',
  },
  {
    category: 'Attendance Operations',
    key: 'attendance.view_summary',
    title: 'View Attendance Reports',
    description: 'View aggregate attendance percentages and historical roll logs.',
  },
  {
    category: 'Student Information System',
    key: 'students.view_list',
    title: 'View Student Directory',
    description: 'Access student rosters, admission records, and enrolled classes.',
  },
  {
    category: 'Student Information System',
    key: 'students.create',
    title: 'Admit New Students',
    description: 'Submit admissions and assign students to sections or batches.',
  },
  {
    category: 'Class Posting & Content',
    key: 'class_posts.create',
    title: 'Publish Class Posts',
    description: 'Post study materials, announcements, and handouts to class feeds.',
  },
  {
    category: 'Assignments & Grading',
    key: 'assignments.grade',
    title: 'Evaluate Student Submissions',
    description: 'Score student homework, record marks, and publish feedback.',
  },
  {
    category: 'Financial Ledger & Fees (Sensitive)',
    key: 'fees.view_summary',
    title: 'View Fee Summaries',
    description: 'Inspect outstanding student balances and fee collection reports.',
  },
  {
    category: 'Financial Ledger & Fees (Sensitive)',
    key: 'fees.collect_payment',
    title: 'Record Fee Payments',
    description: 'Generate payment receipts and record cash/cheque/bank payments.',
  },
]

export function ManagerDelegationView() {
  const { managerOverrides, toggleManagerPermission } = useAcademic()
  const { userRole } = useAuth()

  const isAdmin = userRole === 'institution_admin'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Manager Role Delegation & Granular Permissions
          </h2>
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300 text-xs">
            Admin Controlled
          </Badge>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Configure operational capabilities for delegated managers. Newly created managers have zero default access.
        </p>
      </div>

      {/* Security Guardrail Banner */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-4 text-xs text-amber-900 space-y-1.5">
        <div className="flex items-center gap-2 font-bold text-amber-950">
          <ShieldAlert className="h-4 w-4 text-amber-700" />
          <span>Strict Privilege Escalation Fence (PostgreSQL RLS Rule):</span>
        </div>
        <p>
          Managers cannot grant themselves additional permissions, modify protected institution administrator roles, or alter tenant ownership. Only the verified <code>institution_admin</code> can modify the permission matrix below.
        </p>
      </div>

      {/* Manager Profile Card */}
      <Card className="border shadow-sm">
        <CardHeader className="p-4 pb-3 flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"
              alt="Manager Avatar"
              className="h-10 w-10 rounded-full object-cover ring-2 ring-primary/20"
            />
            <div>
              <CardTitle className="text-base font-bold">Rohan Mehra</CardTitle>
              <CardDescription className="text-xs">
                Designation: Academic Supervisor • Status:{' '}
                <span className="text-emerald-600 font-semibold">Active Delegated Manager</span>
              </CardDescription>
            </div>
          </div>

          <Badge variant="secondary" className="text-xs">
            Manager ID: mem-mgr-bright
          </Badge>
        </CardHeader>

        <CardContent className="p-4 pt-0">
          <div className="divide-y border rounded-md">
            {AVAILABLE_PERMISSIONS.map((perm) => {
              const override = managerOverrides.find((o) => o.permission_key === perm.key)
              const isGranted = override ? override.is_granted : false

              return (
                <div
                  key={perm.key}
                  className="p-3 flex items-center justify-between gap-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-foreground">{perm.title}</span>
                      <code className="bg-muted px-1.5 py-0.2 rounded text-[11px] font-mono text-muted-foreground">
                        {perm.key}
                      </code>
                    </div>
                    <p className="text-xs text-muted-foreground">{perm.description}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isGranted ? (
                      <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="h-4 w-4" /> Granted
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                        <XCircle className="h-4 w-4" /> Revoked
                      </span>
                    )}

                    {isAdmin ? (
                      <button
                        onClick={() => toggleManagerPermission(perm.key, !isGranted)}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                          isGranted ? 'bg-primary' : 'bg-slate-200'
                        }`}
                        role="switch"
                        aria-checked={isGranted}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            isGranted ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    ) : (
                      <Badge variant="outline" className="text-[10px] text-muted-foreground">
                        <Lock className="h-3 w-3 mr-1" /> Admin Only
                      </Badge>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
