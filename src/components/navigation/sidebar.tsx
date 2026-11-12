import React from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useTenant } from '@/contexts/tenant-context'
import {
  LayoutDashboard,
  Layers,
  Users,
  GraduationCap,
  Shield,
  BookOpen,
  CalendarCheck,
  CreditCard,
  Settings,
  Bell,
  Video,
  FileCheck,
  Award,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarProps {
  currentView: string
  onSelectView: (view: string) => void
}

export function Sidebar({ currentView, onSelectView }: SidebarProps) {
  const { userRole, hasPermission, signOut } = useAuth()
  const { currentTenant } = useTenant()

  const navGroups = [
    {
      label: 'Overview',
      items: [
        {
          id: 'dashboard',
          title: 'Role Dashboard',
          icon: LayoutDashboard,
          visible: true,
        },
      ],
    },
    {
      label: 'Academic Foundation',
      items: [
        {
          id: 'academics',
          title: 'Academic Structure',
          icon: Layers,
          visible:
            userRole === 'institution_admin' ||
            userRole === 'manager' ||
            userRole === 'teacher',
        },
        {
          id: 'students',
          title: 'Student SIS Directory',
          icon: Users,
          visible:
            userRole === 'institution_admin' ||
            userRole === 'teacher' ||
            (userRole === 'manager' && hasPermission('students.view_list')),
        },
        {
          id: 'teachers',
          title: 'Faculty Allocations',
          icon: GraduationCap,
          visible:
            userRole === 'institution_admin' ||
            userRole === 'teacher' ||
            userRole === 'manager',
        },
      ],
    },
    {
      label: 'Learning & Classroom (Phase 3)',
      items: [
        {
          id: 'posts',
          title: 'Class Posts & Notes',
          icon: BookOpen,
          visible: true,
        },
        {
          id: 'assignments',
          title: 'Assignments & Grading',
          icon: FileCheck,
          visible: true,
        },
      ],
    },
    {
      label: 'Operations & Ledger (Phase 4)',
      items: [
        {
          id: 'attendance',
          title: 'Attendance Roster',
          icon: CalendarCheck,
          visible:
            userRole === 'institution_admin' ||
            userRole === 'teacher' ||
            userRole === 'student' ||
            userRole === 'parent' ||
            (userRole === 'manager' && hasPermission('attendance.record')),
        },
        {
          id: 'examinations',
          title: 'Examinations & Marks',
          icon: Award,
          visible: true,
        },
        {
          id: 'fees',
          title: 'Fees & Minor-Unit Ledger',
          icon: CreditCard,
          visible:
            userRole === 'institution_admin' ||
            userRole === 'student' ||
            userRole === 'parent' ||
            (userRole === 'manager' && hasPermission('fees.view_summary')),
        },
      ],
    },
    {
      label: 'Communications (Phase 5)',
      items: [
        {
          id: 'communications',
          title: 'Announcements & Alerts',
          icon: Bell,
          visible: true,
        },
        {
          id: 'live_classes',
          title: 'Virtual Live Classes',
          icon: Video,
          visible: true,
        },
      ],
    },
    {
      label: 'Administration',
      items: [
        {
          id: 'managers',
          title: 'Manager Delegation',
          icon: Shield,
          visible: userRole === 'institution_admin',
        },
        {
          id: 'settings',
          title: 'Institution Profile',
          icon: Settings,
          visible: userRole === 'institution_admin',
        },
      ],
    },
  ]

  return (
    <aside className="w-64 border-r bg-card shrink-0 flex flex-col justify-between hidden md:flex min-h-[calc(100vh-4rem)]">
      <div className="p-4 space-y-5 overflow-y-auto max-h-[calc(100vh-8rem)]">
        {/* Tenant Header Info */}
        <div className="px-2 py-1 bg-muted/40 rounded-md border">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            {currentTenant?.institution_type.replace('_', ' ') || 'Institution'} Portal
          </p>
          <p className="text-xs font-bold text-foreground truncate mt-0.5">
            {currentTenant?.name}
          </p>
        </div>

        {/* Grouped Navigation */}
        {navGroups.map((group) => {
          const visibleItems = group.items.filter((item) => item.visible)
          if (visibleItems.length === 0) return null

          return (
            <div key={group.label} className="space-y-1">
              <p className="px-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                {group.label}
              </p>
              {visibleItems.map((item) => {
                const Icon = item.icon
                const isActive = currentView === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectView(item.id)}
                    className={cn(
                      'w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors text-left',
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    <span>{item.title}</span>
                  </button>
                )
              })}
            </div>
          )
        })}
      </div>

      {/* Database Security Status Footer */}
      <div className="p-3 border-t text-[11px] text-muted-foreground bg-muted/20 space-y-2">
        <div>
          <div className="flex items-center gap-1.5 text-emerald-600 font-semibold mb-0.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Tenant RLS Active</span>
          </div>
          <p className="leading-tight text-[10px]">
            Fenced ID: <code>{currentTenant?.slug}</code>
          </p>
        </div>

        <button
          onClick={signOut}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 text-xs font-semibold transition-colors cursor-pointer border border-slate-200"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  )
}
