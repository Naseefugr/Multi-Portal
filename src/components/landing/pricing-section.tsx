import React, { useState } from 'react'
import { motion } from 'motion/react'
import { Check, Sparkles, ArrowRight } from 'lucide-react'

interface PricingPlan {
  id: string
  name: string
  badge?: string
  description: string
  monthlyPrice: number
  annualPrice: number
  studentCap: string
  isPopular?: boolean
  features: string[]
  ctaText: string
  ctaHref: string
}

const PLANS: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter Academy',
    description: 'Designed for single-branch tuition centres, coaching batches, and boutique private academies.',
    monthlyPrice: 79,
    annualPrice: 64,
    studentCap: 'Up to 250 students',
    features: [
      'Up to 250 enrolled students',
      'Academic structure (Years, Classes, Batches)',
      'Class discussions & document sharing',
      'Digital assignments & grading ledger',
      'Daily attendance tracking',
      'Basic fee tracking & receipt logs',
      'Dedicated subdomain (*.educore.com)',
      'Email & community support',
    ],
    ctaText: 'Start with Starter',
    ctaHref: '#register-dialog',
  },
  {
    id: 'growth',
    name: 'Growth Institution',
    badge: 'Most Popular for Schools',
    isPopular: true,
    description: 'The complete digital operating system for K-12 schools, large coaching institutes, and colleges.',
    monthlyPrice: 199,
    annualPrice: 159,
    studentCap: 'Up to 1,500 students',
    features: [
      'Up to 1,500 enrolled students',
      'Everything in Starter Academy, plus:',
      'Double-entry minor-unit fee ledger & PDF receipts',
      'Comprehensive exam engine with auto-ranks',
      'Parent portal with verified student link',
      'Integrated live classes with attendance',
      'Multi-channel SMS & push announcements',
      'Delegated managers with granular RBAC permissions',
      'Priority 24/7 technical support',
    ],
    ctaText: 'Launch Growth Portal',
    ctaHref: '#register-dialog',
  },
  {
    id: 'enterprise',
    name: 'Enterprise & Multi-Campus',
    badge: 'Chains & Districts',
    description: 'Tailored for multi-branch school networks, educational trusts, and large educational organisations.',
    monthlyPrice: 499,
    annualPrice: 399,
    studentCap: 'Unlimited students & campuses',
    features: [
      'Unlimited students & multiple branches',
      'Everything in Growth Institution, plus:',
      'Custom vanity domain (portal.myschool.edu) + SSL',
      'Multi-campus executive consolidation dashboard',
      'Dedicated PostgreSQL database cluster',
      'Single Sign-On (SAML / Google Workspace / Azure)',
      '99.98% uptime SLA with dedicated CSM',
      'Direct REST API access & custom ERP migration',
    ],
    ctaText: 'Contact Enterprise Team',
    ctaHref: '#register-dialog',
  },
]

interface MatrixFeature {
  category: string
  features: {
    name: string
    starter: boolean | string
    growth: boolean | string
    enterprise: boolean | string
  }[]
}

const COMPARISON_MATRIX: MatrixFeature[] = [
  {
    category: 'Core Academic & Taxonomy',
    features: [
      { name: 'Student Capacity', starter: '250', growth: '1,500', enterprise: 'Unlimited' },
      { name: 'Academic Years & Terms', starter: true, growth: true, enterprise: true },
      { name: 'Class, Batch & Subject Mapping', starter: true, growth: true, enterprise: true },
      { name: 'Digital Assignments & Submissions', starter: true, growth: true, enterprise: true },
      { name: 'Examination & Report Card Engine', starter: 'Basic', growth: 'Full Auto-Rank', enterprise: 'Custom Formats' },
    ],
  },
  {
    category: 'Finance & Operations',
    features: [
      { name: 'Minor-Unit Balanced Fee Ledger', starter: false, growth: true, enterprise: true },
      { name: 'Automated PDF Tax Invoices & Receipts', starter: false, growth: true, enterprise: true },
      { name: 'Configurable Manager RBAC Permissions', starter: 'Standard', growth: 'Granular', enterprise: 'Custom Roles' },
      { name: 'Multi-Channel Announcements (SMS/Push)', starter: 'Email Only', growth: true, enterprise: true },
      { name: 'Live Video Class Integration', starter: false, growth: true, enterprise: true },
    ],
  },
  {
    category: 'Infrastructure & Security',
    features: [
      { name: 'Dedicated Subdomain (*.educore.com)', starter: true, growth: true, enterprise: true },
      { name: 'Custom Domain (portal.institution.edu)', starter: false, growth: false, enterprise: true },
      { name: 'PostgreSQL Row-Level Security', starter: true, growth: true, enterprise: true },
      { name: 'Immutable Audit Trail Logs', starter: '30 Days', growth: '1 Year', enterprise: 'Unlimited' },
      { name: 'Uptime SLA', starter: 'Standard', growth: '99.9%', enterprise: '99.98%' },
    ],
  },
]

export function PricingSection({ onOpenRegister }: { onOpenRegister: () => void }) {
  const [isAnnual, setIsAnnual] = useState(true)
  const [showMatrix, setShowMatrix] = useState(false)

  return (
    <section id="pricing" className="py-24 bg-white border-b border-slate-200/80 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Transparent Institutional Pricing
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Predictable plans. No hidden student taxes.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Every plan includes our full multi-tenant security architecture, automatic updates, and dedicated subdomain. 
            Choose the scale that fits your institution today.
          </p>

          {/* Billing Toggle */}
          <div className="mt-8 inline-flex items-center gap-3 p-1.5 rounded-2xl bg-slate-100 border border-slate-200/80">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                !isAnnual
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                isAnnual
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Annual Billing</span>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                SAVE 20%
              </span>
            </button>
          </div>
        </motion.div>

        {/* 3 Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch mb-16">
          {PLANS.map((plan, idx) => {
            const price = isAnnual ? plan.annualPrice : plan.monthlyPrice
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: idx * 0.1, ease: 'easeOut' }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${
                  plan.isPopular
                    ? 'bg-slate-900 text-white shadow-2xl ring-2 ring-blue-600 lg:-translate-y-2'
                    : 'bg-white border border-slate-200 shadow-sm hover:shadow-lg text-slate-900'
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[11px] font-bold px-4 py-1 rounded-full uppercase tracking-wider shadow-md">
                    {plan.badge}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                    {!plan.isPopular && plan.badge && (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {plan.badge}
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-xs mt-2 leading-relaxed ${
                      plan.isPopular ? 'text-slate-300' : 'text-slate-500'
                    }`}
                  >
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="mt-6 flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                      ${price}
                    </span>
                    <span
                      className={`text-xs font-medium ${
                        plan.isPopular ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      / month {isAnnual ? '(billed annually)' : ''}
                    </span>
                  </div>

                  <div
                    className={`mt-2 text-xs font-semibold px-3 py-1.5 rounded-lg inline-block ${
                      plan.isPopular ? 'bg-slate-800 text-blue-400' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    Capacity: {plan.studentCap}
                  </div>

                  {/* Feature List */}
                  <div className="mt-8 space-y-3">
                    <div
                      className={`text-xs font-bold uppercase tracking-wider ${
                        plan.isPopular ? 'text-slate-400' : 'text-slate-400'
                      }`}
                    >
                      Included In This Plan:
                    </div>
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                            plan.isPopular
                              ? 'bg-blue-600/30 text-blue-400'
                              : 'bg-emerald-50 text-emerald-600'
                          }`}
                        >
                          <Check className="w-3 h-3 stroke-[2.5]" />
                        </div>
                        <span
                          className={`text-xs sm:text-sm ${
                            plan.isPopular ? 'text-slate-200' : 'text-slate-700'
                          }`}
                        >
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-200/20">
                  <button
                    onClick={onOpenRegister}
                    className={`w-full py-3.5 px-4 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm ${
                      plan.isPopular
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    <span>{plan.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Comparison Matrix Expandable Toggle */}
        <div className="text-center mb-6">
          <button
            onClick={() => setShowMatrix((prev) => !prev)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 underline underline-offset-4"
          >
            {showMatrix ? 'Hide Full Feature Comparison Matrix ↑' : 'View Full Feature Comparison Matrix ↓'}
          </button>
        </div>

        {/* Feature Comparison Table */}
        {showMatrix && (
          <div className="mt-8 bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in duration-300">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-900 text-white">
                    <th className="py-4 px-6 text-sm font-bold">Feature Category</th>
                    <th className="py-4 px-4 text-center font-bold">Starter Academy</th>
                    <th className="py-4 px-4 text-center font-bold text-blue-400">Growth Institution</th>
                    <th className="py-4 px-4 text-center font-bold">Enterprise & Multi-Campus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {COMPARISON_MATRIX.map((group) => (
                    <React.Fragment key={group.category}>
                      <tr className="bg-slate-50/80 font-bold text-slate-800 text-xs uppercase tracking-wider">
                        <td colSpan={4} className="py-3 px-6">
                          {group.category}
                        </td>
                      </tr>
                      {group.features.map((f, i) => (
                        <tr key={i} className="hover:bg-slate-50/50">
                          <td className="py-3.5 px-6 font-medium text-slate-700">{f.name}</td>

                          {/* Starter */}
                          <td className="py-3.5 px-4 text-center">
                            {typeof f.starter === 'boolean' ? (
                              f.starter ? (
                                <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                              ) : (
                                <span className="text-slate-300">—</span>
                              )
                            ) : (
                              <span className="text-xs font-semibold text-slate-700">{f.starter}</span>
                            )}
                          </td>

                          {/* Growth */}
                          <td className="py-3.5 px-4 text-center bg-blue-50/20">
                            {typeof f.growth === 'boolean' ? (
                              f.growth ? (
                                <Check className="w-4 h-4 text-blue-600 mx-auto" />
                              ) : (
                                <span className="text-slate-300">—</span>
                              )
                            ) : (
                              <span className="text-xs font-bold text-blue-700">{f.growth}</span>
                            )}
                          </td>

                          {/* Enterprise */}
                          <td className="py-3.5 px-4 text-center">
                            {typeof f.enterprise === 'boolean' ? (
                              f.enterprise ? (
                                <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                              ) : (
                                <span className="text-slate-300">—</span>
                              )
                            ) : (
                              <span className="text-xs font-semibold text-slate-800">{f.enterprise}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
