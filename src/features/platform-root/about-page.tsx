import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useTenant, RESERVED_SUBDOMAINS } from '@/contexts/tenant-context'
import type { InstitutionType } from '@/types/database.types'
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'

// Shared Landing Components
import { Navbar } from '@/components/landing/navbar'
import { AboutSection } from '@/components/landing/about-section'
import { PositioningSection } from '@/components/landing/positioning'
import { ProblemSolutionSection } from '@/components/landing/problem-solution'
import { FeatureBentoSection } from '@/components/landing/feature-bento'
import { RoleExperienceSection, type RoleKey } from '@/components/landing/role-experience'
import { HowItWorksSection } from '@/components/landing/how-it-works'
import { MultiTenantPortalsSection } from '@/components/landing/multi-tenant-portals'
import { FlexibleManagementSection } from '@/components/landing/flexible-management'
import { SecuritySection } from '@/components/landing/security-section'
import { PricingSection } from '@/components/landing/pricing-section'
import { FAQSection } from '@/components/landing/faq-section'
import { FinalCTASection } from '@/components/landing/final-cta'
import { Footer } from '@/components/landing/footer'

export function AboutPage() {
  const location = useLocation()
  const { allInstitutions, setDevSubdomain, registerInstitution } = useTenant()

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
      setDevSubdomain(formData.slug)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLaunchDemoInstitution = (slug: string) => {
    setDevSubdomain(slug)
    setIsSignInOpen(false)
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-600 selection:text-white flex flex-col justify-between">
      {/* SECTION 01: Responsive Sticky Navigation */}
      <Navbar
        onOpenRegister={() => setIsRegisterOpen(true)}
        onOpenSignIn={() => setIsSignInOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 pt-16 sm:pt-20">
        {/* Dedicated About Hero Header */}
        <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-blue-50/30 to-white py-16 sm:py-24 border-b border-slate-200/80">
          <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none" />
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl text-center space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/80 border border-blue-200/80 text-blue-700 text-xs font-semibold uppercase tracking-wider shadow-2xs">
              <Sparkles className="h-3.5 w-3.5 text-blue-600" />
              Platform Architecture & Story
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              About the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700">EduCore</span> Operating System
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
              EduCore was architected from first principles to replace fragmented school tools with a single unified, multi-tenant cloud platform—combining granular security, hybrid academic taxonomies, and minor-unit financial precision.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Button
                onClick={() => setIsRegisterOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-6 h-11 rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Create Your Institution Portal</span>
                <ArrowRight className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  const el = document.getElementById('about-pillars')
                  el?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="border-slate-300 text-slate-700 hover:bg-slate-50 text-sm px-5 h-11 rounded-xl cursor-pointer"
              >
                Explore Architecture Details
              </Button>
            </div>
          </div>
        </section>

        {/* SECTION 02: Core Architecture & Mission */}
        <div id="about-pillars">
          <AboutSection />
        </div>

        {/* SECTION 03: Four Institutional Categories Overview */}
        <PositioningSection />

        {/* SECTION 04: The Problem We Solve & Connected Architecture */}
        <ProblemSolutionSection />

        {/* SECTION 05: Feature Bento Grid (10 Core Modules) */}
        <FeatureBentoSection />

        {/* SECTION 06: Interactive Role Experience */}
        <RoleExperienceSection
          onLaunchRoleDemo={(_role: RoleKey) => {
            setIsSignInOpen(true)
          }}
        />

        {/* SECTION 07: 4-Step How EduCore Works */}
        <HowItWorksSection />

        {/* SECTION 08: Multi-Tenant Institution Portals Showcase */}
        <MultiTenantPortalsSection />

        {/* SECTION 09: Flexible Management & Granular Permissions */}
        <FlexibleManagementSection />

        {/* SECTION 10: Security, Privacy & Enterprise Architecture */}
        <SecuritySection />

        {/* SECTION 11: Transparent SaaS Pricing */}
        <PricingSection onOpenRegister={() => setIsRegisterOpen(true)} />

        {/* SECTION 12: Frequently Asked Questions */}
        <FAQSection />

        {/* SECTION 13: Final Conversion Call to Action */}
        <FinalCTASection
          onOpenRegister={() => setIsRegisterOpen(true)}
          onExploreDemo={() => {
            const el = document.getElementById('portals')
            el?.scrollIntoView({ behavior: 'smooth' })
          }}
        />
      </main>

      {/* SECTION 14: Comprehensive SaaS Footer */}
      <Footer />

      {/* DIALOG 1: CREATE INSTITUTION PORTAL */}
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

      {/* DIALOG 2: INSTANT DEMO LAUNCHER / SIGN IN */}
      <Dialog open={isSignInOpen} onOpenChange={setIsSignInOpen}>
        <DialogContent className="max-w-md p-6 rounded-3xl border-slate-200">
          <div className="text-center space-y-2 mb-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 mb-1">
              <Lock className="h-6 w-6" />
            </div>
            <DialogTitle className="text-xl font-bold text-slate-900">
              Sign In to Your Institution
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Select one of the live seeded demo institutions or enter your subdomain.
            </DialogDescription>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Quick Launch Seeded Demo Portals:
            </p>
            {allInstitutions.map((inst) => (
              <button
                key={inst.id}
                type="button"
                onClick={() => handleLaunchDemoInstitution(inst.slug)}
                className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-blue-700">
                    {inst.name}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    {inst.slug}.educore.com
                  </div>
                </div>
                <div className="text-xs font-semibold text-blue-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Enter</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 text-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsSignInOpen(false)
                setIsRegisterOpen(true)
              }}
              className="text-xs"
            >
              Need a new portal? Register here
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
