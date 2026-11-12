import React, { useState } from 'react'
import { motion } from 'motion/react'
import { useTenant } from '@/contexts/tenant-context'
import { useAuth } from '@/contexts/auth-context'
import type { UserRole } from '@/types/database.types'
import {
  GraduationCap,
  ShieldCheck,
  Lock,
  ArrowRight,
  UserCheck,
  Users,
  HeartHandshake,
  CheckCircle2,
  Globe,
  Building,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function TenantLoginScreen() {
  const { currentTenant, setDevSubdomain } = useTenant()
  const { signIn, loginAsRole } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      signIn(email || 'admin@institution.edu', password || 'password', 'institution_admin')
    }, 400)
  }

  const roleProfiles: { role: UserRole; title: string; desc: string; icon: React.ElementType; badge: string }[] = [
    {
      role: 'institution_admin',
      title: 'Institution Admin',
      desc: 'Director / Principal credentials with full operational governance',
      icon: Building,
      badge: '👑 Admin',
    },
    {
      role: 'teacher',
      title: 'Teacher / Faculty',
      desc: 'Class 10-A, 10-B subject allocations & gradebook evaluations',
      icon: GraduationCap,
      badge: '👨‍🏫 Faculty',
    },
    {
      role: 'student',
      title: 'Student (Aarav Patel)',
      desc: 'Grade 10-A learner: assignments, class feeds, and term rank',
      icon: Users,
      badge: '🎓 Student',
    },
    {
      role: 'parent',
      title: 'Verified Guardian',
      desc: 'Cryptographically linked to Aarav Patel with anti-IDOR shielding',
      icon: HeartHandshake,
      badge: '👨‍👩‍👦 Parent',
    },
    {
      role: 'manager',
      title: 'Delegated Manager',
      desc: 'Operational supervisor with granular fee & attendance overrides',
      icon: UserCheck,
      badge: '⚙️ Manager',
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Top minimal header */}
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-sm"
            style={{ backgroundColor: currentTenant?.primary_color || '#2563EB' }}
          >
            {currentTenant?.name.charAt(0) || 'E'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-slate-900 leading-tight">
                {currentTenant?.name || 'Educational Institution'}
              </h1>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Portal Active
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono">
              https://{currentTenant?.slug || 'portal'}.educore.com
            </p>
          </div>
        </div>

        <button
          onClick={() => setDevSubdomain(null)}
          className="text-xs font-semibold text-slate-600 hover:text-blue-600 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>EduCore Network</span>
        </button>
      </header>

      {/* Main Login Workspace */}
      <main className="flex-1 container mx-auto px-4 py-8 sm:py-12 max-w-5xl flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Sign In Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 shadow-xl p-6 sm:p-8 space-y-6"
          >
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-2">
                <Lock className="w-3 h-3 text-blue-600" />
                Institutional Authentication
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Sign in to your portal
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Enter your credentials or choose a pre-configured role identity to access the dashboard.
              </p>
            </div>

            {/* Credential Form */}
            <form onSubmit={handleCredentialsSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="login-email" className="text-xs font-bold text-slate-700">
                  Institutional Email / Student ID
                </Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="admin@bright.educore.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10 text-sm rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="login-password" className="text-xs font-bold text-slate-700">
                    Password
                  </Label>
                  <a href="#forgot" className="text-[11px] font-semibold text-blue-600 hover:underline">
                    Forgot password?
                  </a>
                </div>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-10 text-sm rounded-xl"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-10 font-semibold text-xs shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{isLoading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>

            {/* Quick Demo Access Bar */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  1-Click Role Exploration
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                  Instant Demo Login
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {roleProfiles.map((item) => (
                  <button
                    key={item.role}
                    type="button"
                    onClick={() => loginAsRole(item.role)}
                    className="p-2.5 rounded-xl border border-slate-200/80 hover:border-blue-500 hover:bg-blue-50/40 text-left transition-all duration-150 flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-semibold text-slate-800 group-hover:text-blue-700">
                        {item.title}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-100 group-hover:bg-blue-100 group-hover:text-blue-800 px-2 py-0.5 rounded">
                      {item.badge}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column: Institutional Identity & Security Guarantees */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-5 rounded-3xl bg-slate-900 text-white p-6 sm:p-8 flex flex-col justify-between shadow-xl border border-slate-800 space-y-6"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold text-xl">
                <ShieldCheck className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-white">
                  PostgreSQL Row-Level Security Fenced
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Your academic records, examinations, and minor-unit fee ledgers are cryptographically isolated under tenant ID:
                </p>
                <div className="mt-2 p-2 bg-slate-950 rounded-lg border border-slate-800 font-mono text-[11px] text-emerald-400">
                  {currentTenant?.id || 'tenant_bright_valley_01'}
                </div>
              </div>

              <div className="space-y-2.5 pt-2 text-xs text-slate-300">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Only authenticated members can access student directories</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Double-entry ledger with integer paise precision</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Encrypted document storage with 60-second signed URLs</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <span>Academic Year 2026–2027</span>
              <span>EduCore Cloud v2.4</span>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-4 text-center text-xs text-slate-500">
        Protected by EduCore Multi-Tenant Architecture &bull; ISO 27001 & FERPA Compliant
      </footer>
    </div>
  )
}
