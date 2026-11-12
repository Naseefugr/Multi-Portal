import React from 'react'
import { useTenant } from '@/contexts/tenant-context'
import { useAuth } from '@/contexts/auth-context'
import type { UserRole } from '@/types/database.types'
import {
  School,
  Shield,
  UserCheck,
  GraduationCap,
  AlertTriangle,
  Globe,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function TopBar() {
  const {
    currentSubdomain,
    currentTenant,
    isPlatformRoot,
    isPlatformAdmin,
    isSuspended,
    allInstitutions,
    setDevSubdomain,
  } = useTenant()

  const { currentUser, userRole, loginAsRole, isAuthenticated } = useAuth()

  // Remove top bar and dev simulator when on public website or before logging into portal
  if (isPlatformRoot || !isAuthenticated) {
    return null
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Dev Environment Simulator Banner */}
      <div className="bg-slate-900 text-slate-100 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-slate-300">EduCore Multi-Tenant Simulator:</span>
          <span className="text-slate-400">
            Host Context:{' '}
            <code className="bg-slate-800 px-1.5 py-0.5 rounded text-amber-300">
              {isPlatformRoot
                ? 'educore.com (Platform Root)'
                : isPlatformAdmin
                ? 'admin.educore.com (Founder Admin)'
                : `${currentSubdomain}.educore.com`}
            </code>
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Tenant Switcher */}
          <div className="flex items-center gap-1.5">
            <Globe className="h-3.5 w-3.5 text-slate-400" />
            <label className="text-slate-400 text-xs">Switch Tenant:</label>
            <select
              value={isPlatformRoot ? 'root' : isPlatformAdmin ? 'admin' : currentSubdomain || 'root'}
              onChange={(e) => {
                const val = e.target.value
                if (val === 'root') setDevSubdomain(null)
                else if (val === 'admin') setDevSubdomain('admin')
                else setDevSubdomain(val)
              }}
              className="bg-slate-800 text-slate-200 border border-slate-700 text-xs rounded px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="root">🌐 Platform Root (Landing & Registration)</option>
              <option value="admin">🛡️ Platform Admin (Founder Portal)</option>
              <optgroup label="Registered Institutions">
                {allInstitutions.map((inst) => (
                  <option key={inst.id} value={inst.slug}>
                    {inst.name} ({inst.slug}) {inst.status === 'suspended' ? '⚠️ [SUSPENDED]' : ''}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Role Switcher (Available when inside a tenant) */}
          {!isPlatformRoot && !isPlatformAdmin && !isSuspended && (
            <div className="flex items-center gap-1.5">
              <UserCheck className="h-3.5 w-3.5 text-slate-400" />
              <label className="text-slate-400 text-xs">Switch Role:</label>
              <select
                value={userRole}
                onChange={(e) => loginAsRole(e.target.value as UserRole)}
                className="bg-slate-800 text-slate-200 border border-slate-700 text-xs rounded px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium text-emerald-400"
              >
                <option value="institution_admin">👑 Institution Admin</option>
                <option value="manager">⚙️ Delegated Manager</option>
                <option value="teacher">👨‍🏫 Teacher / Faculty</option>
                <option value="student">🎓 Student</option>
                <option value="parent">👨‍👩‍👦 Verified Guardian</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Main Tenant Navigation Bar (Rendered for specific tenant portals or admin console) */}
      {!isPlatformRoot && (
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isPlatformAdmin ? (
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center font-bold shadow">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg text-foreground">EduCore Founder Console</span>
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs">
                      Platform Master
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground block -mt-0.5">
                    Global Ecosystem Governance
                  </span>
                </div>
              </div>
            ) : currentTenant ? (
              <div className="flex items-center gap-2.5">
                <div
                  className="h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold shadow-sm"
                  style={{ backgroundColor: currentTenant.primary_color }}
                >
                  {currentTenant.institution_type === 'school' ? (
                    <School className="h-5 w-5" />
                  ) : (
                    <GraduationCap className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base md:text-lg text-foreground leading-tight">
                      {currentTenant.name}
                    </span>
                    {currentTenant.status === 'active' ? (
                      <Badge variant="success" className="text-[10px] uppercase">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="text-[10px] uppercase flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" /> Suspended
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="capitalize">{currentTenant.institution_type.replace('_', ' ')}</span>
                    <span>•</span>
                    <span>{currentTenant.slug}.educore.com</span>
                  </div>
                </div>
              </div>
            ) : (
              <span className="font-bold text-lg">EduCore Portal</span>
            )}
          </div>

          {/* User Identity & Active Role Badge */}
          <div className="flex items-center gap-3">
            {currentUser && (
              <div className="flex items-center gap-2.5 pl-3 border-l">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium leading-none text-foreground">
                    {currentUser.full_name}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize mt-1">
                    Role: <span className="font-semibold text-primary">{userRole.replace('_', ' ')}</span>
                  </p>
                </div>
                <img
                  src={currentUser.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                  alt={currentUser.full_name}
                  className="h-9 w-9 rounded-full object-cover ring-2 ring-primary/20"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
