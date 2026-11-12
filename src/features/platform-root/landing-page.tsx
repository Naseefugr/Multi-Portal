import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTenant, RESERVED_SUBDOMAINS } from '@/contexts/tenant-context'
import { useAuth } from '@/contexts/auth-context'
import type { InstitutionType } from '@/types/database.types'
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { SignInModal } from '@/components/common/SignInModal'

// First Interface Components
import { Navbar } from '@/components/landing/navbar'
import { Hero as HeroSection } from '@/components/landing/hero'
import { PositioningSection } from '@/components/landing/positioning'
import { Footer } from '@/components/landing/footer'

export function LandingPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { allInstitutions, setDevSubdomain, registerInstitution } = useTenant()
  const { signIn } = useAuth()

  // Modal Dialog States
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [isSignInOpen, setIsSignInOpen] = useState(false)

  // Registration Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    institution_type: 'school' as InstitutionType,
    contact_email: '',
    contact_phone: '',
    admin_name: '',
  })
  const [slugFeedback, setSlugFeedback] = useState<{ isAvailable?: boolean; error?: string }>({})
  const [registerError, setRegisterError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Handle hash scrolling on page mount or hash change
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '')
      const el = document.getElementById(id)
      if (el) {
        setTimeout(() => {
          const navOffset = 80
          const elementPosition = el.getBoundingClientRect().top
          const offsetPosition = elementPosition + window.pageYOffset - navOffset
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          })
        }, 100)
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [location.hash, location.pathname])

  const handleSlugChange = (raw: string) => {
    const slug = raw.toLowerCase().replace(/[^a-z0-9-]/g, '')
    setFormData((prev) => ({ ...prev, slug }))

    if (!slug) {
      setSlugFeedback({})
      return
    }

    if (slug.length < 3) {
      setSlugFeedback({ error: 'Slug must be at least 3 characters long.' })
      return
    }

    if (RESERVED_SUBDOMAINS.includes(slug)) {
      setSlugFeedback({ error: `"${slug}" is a reserved system subdomain and cannot be used.` })
      return
    }

    const exists = allInstitutions.some((i) => i.slug.toLowerCase() === slug)
    if (exists) {
      setSlugFeedback({ error: `Subdomain "${slug}.educore.com" is already registered.` })
      return
    }

    setSlugFeedback({ isAvailable: true })
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setRegisterError(null)

    if (!formData.name.trim() || !formData.slug.trim() || !formData.contact_email.trim()) {
      setRegisterError('Please fill in all mandatory fields.')
      return
    }

    if (slugFeedback.error) {
      setRegisterError(slugFeedback.error)
      return
    }

    setIsSubmitting(true)
    try {
      const result = await registerInstitution(formData)
      if (!result.success) {
        setRegisterError(result.error || 'Failed to register institution.')
        return
      }

      setIsRegisterOpen(false)
      // Automatically sign in as admin of newly created institution
      signIn(formData.contact_email, '', 'institution_admin')
      setDevSubdomain(formData.slug)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-600 selection:text-white flex flex-col justify-between">
      {/* SECTION 01: Responsive Sticky Navigation */}
      <Navbar
        onOpenRegister={() => setIsRegisterOpen(true)}
        onOpenSignIn={() => setIsSignInOpen(true)}
      />

      {/* Main Content Area: First Interface */}
      <main className="flex-1">
        {/* SECTION 02: Hero Experience with Interactive Live Dashboard Frame */}
        <HeroSection
          onOpenRegister={() => setIsRegisterOpen(true)}
          onExploreFeatures={() => {
            const el = document.getElementById('positioning')
            el?.scrollIntoView({ behavior: 'smooth' })
          }}
        />

        {/* SECTION 03: Institutional Flexibility (Kept directly on First Interface) */}
        <PositioningSection />

        {/* SECTION 04: Elegant Platform Deep-Dive Banner */}
        <section className="py-20 bg-slate-50 border-b border-slate-200/80 relative">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
            <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white p-8 sm:p-12 shadow-xl border border-slate-700/60 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-3 max-w-xl text-center md:text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold uppercase tracking-wider border border-blue-400/30">
                  <Sparkles className="w-3.5 h-3.5" />
                  Comprehensive Architecture & Mission
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Discover how EduCore unifies the entire educational lifecycle
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Explore our detailed /about page covering PostgreSQL RLS tenant isolation, hybrid SIS models, minor-unit financial ledgers, and interactive role demos.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <Button
                  onClick={() => {
                    navigate('/about')
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm px-5 h-11 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Explore /about Page</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setIsRegisterOpen(true)}
                  className="border-slate-600 bg-slate-800/80 text-slate-200 hover:bg-slate-700 hover:text-white text-xs sm:text-sm px-5 h-11 rounded-xl cursor-pointer"
                >
                  Deploy Free Portal
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* SECTION 05: Comprehensive SaaS Footer */}
      <Footer />

      {/* =========================================================================
          DIALOG 1: CREATE INSTITUTION PORTAL
          ========================================================================= */}
      <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
        <DialogContent className="max-w-xl p-0 overflow-hidden rounded-3xl border-slate-200">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
            <div className="flex items-center gap-2 text-blue-200 text-xs font-semibold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              Instant Provisioning
            </div>
            <DialogTitle className="text-2xl font-extrabold text-white">
              Create Your Institution Portal
            </DialogTitle>
            <DialogDescription className="text-blue-100 text-xs sm:text-sm mt-1">
              Deploy your dedicated educational portal with your chosen subdomain in under 60 seconds.
            </DialogDescription>
          </div>

          <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
            {registerError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-red-600 shrink-0" />
                <span>{registerError}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">Institution Legal Name *</Label>
              <Input
                placeholder="e.g. Oakridge International Academy"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-bold text-slate-700">Subdomain Identifier *</Label>
                <span className="text-[11px] text-slate-400">3-63 characters, lowercase & hyphens</span>
              </div>
              <div className="flex items-center">
                <Input
                  placeholder="oakridge"
                  value={formData.slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  className="rounded-r-none font-mono text-xs"
                  required
                />
                <span className="inline-flex items-center px-3 border border-l-0 border-slate-300 bg-slate-100 text-slate-600 text-xs font-mono rounded-r-md h-9 select-none">
                  .educore.com
                </span>
              </div>
              {slugFeedback.error && (
                <p className="text-[11px] text-red-600 font-medium">{slugFeedback.error}</p>
              )}
              {slugFeedback.isAvailable && (
                <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Subdomain is available!
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">Academic Structure Model *</Label>
              <Select
                value={formData.institution_type}
                onChange={(e) =>
                  setFormData({ ...formData, institution_type: e.target.value as InstitutionType })
                }
              >
                <option value="school">K-12 School (Academic Years, Classes & Sections)</option>
                <option value="coaching_institute">Coaching Academy (Courses, Fast-Track Batches)</option>
                <option value="tuition_centre">Tuition Centre (Subject Cohorts & Session Ledger)</option>
                <option value="academy">Specialized Sports/Arts Academy</option>
                <option value="college">Higher Education College / Campus</option>
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">Primary Contact Email *</Label>
                <Input
                  type="email"
                  placeholder="admin@school.edu"
                  value={formData.contact_email}
                  onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">Contact Phone</Label>
                <Input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.contact_phone}
                  onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                />
              </div>
            </div>

            <DialogFooter className="pt-2 sm:pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsRegisterOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || Boolean(slugFeedback.error)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              >
                {isSubmitting ? 'Provisioning...' : 'Provision Portal Now'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* =========================================================================
          DIALOG 2: SIGN IN MODAL (Clean, Secure, No Demo Lists)
          ========================================================================= */}
      <SignInModal
        isOpen={isSignInOpen}
        onClose={() => setIsSignInOpen(false)}
        onOpenRegister={() => {
          setIsSignInOpen(false)
          setIsRegisterOpen(true)
        }}
      />
    </div>
  )
}
