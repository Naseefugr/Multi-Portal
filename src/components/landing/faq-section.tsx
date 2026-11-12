import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronDown, HelpCircle, MessageSquare } from 'lucide-react'

interface FAQItem {
  id: string
  question: string
  answer: string
  category: 'Security' | 'Academic' | 'Billing' | 'Architecture'
}

const FAQS: FAQItem[] = [
  {
    id: 'isolation',
    category: 'Security',
    question: 'How does EduCore guarantee data isolation between different institutions?',
    answer:
      'EduCore uses PostgreSQL Row-Level Security (RLS) policies at the database engine layer. Every query is cryptographically scoped to the authenticated institution_id extracted from verified session tokens. It is physically impossible for a staff member, teacher, or student at one institution to view, mutate, or query records belonging to another institution.',
  },
  {
    id: 'custom-domains',
    category: 'Architecture',
    question: 'Can we use our own custom domain (e.g. portal.greenvalleyschool.org)?',
    answer:
      'Yes. While every institution automatically receives an instant secure subdomain (e.g. greenvalley.educore.com), Enterprise plan institutions can bind their own custom domains using a standard CNAME record. EduCore automatically provisions and renews SSL/TLS certificates through our Cloudflare edge network.',
  },
  {
    id: 'multi-memberships',
    category: 'Architecture',
    question: 'What happens if a teacher works in two institutions or a parent has children in different schools?',
    answer:
      'EduCore separates global identity from institutional membership. A single user login (email or phone) can belong to multiple institutions with different roles. When logging in, users can switch between their distinct institutional dashboards seamlessly without having to register separate accounts.',
  },
  {
    id: 'manager-rbac',
    category: 'Academic',
    question: 'Can managers be restricted to only specific modules like fee collection?',
    answer:
      'Absolutely. EduCore does not rely on generic all-or-nothing admin access. Institution Admins can define custom manager permissions with per-module granularity (View, Create, Modify, Delete, Export) across fees, attendance, admissions, examinations, and communication notices.',
  },
  {
    id: 'fee-ledger',
    category: 'Billing',
    question: 'How does EduCore handle fee receipts, installments, and tax compliance?',
    answer:
      'EduCore features a double-entry minor-unit ledger where monetary values are calculated in cents or paise to eliminate floating-point arithmetic errors. The system supports installment schedules, automated late fees, scholarship waivers, and generates downloadable PDF receipts complete with institutional branding.',
  },
  {
    id: 'mobile-experience',
    category: 'Architecture',
    question: 'Is EduCore fully accessible on smartphones and mobile browsers?',
    answer:
      'Yes. Every interface in EduCore is built mobile-first using responsive Tailwind CSS. Teachers can record classroom attendance from their phones in seconds, students can submit homework attachments via camera capture, and parents can inspect report cards on any smartphone browser.',
  },
  {
    id: 'data-ownership',
    category: 'Security',
    question: 'Can we export our institutional data if we ever choose to migrate?',
    answer:
      'You maintain 100% data ownership. Authorized Institution Admins can export student enrollment rosters, examination gradebooks, attendance logs, and financial transaction journals to CSV or structured JSON at any time with a single click.',
  },
  {
    id: 'attendance-alerts',
    category: 'Academic',
    question: 'How does attendance tracking work, and can parents be notified instantly?',
    answer:
      'Teachers mark batch attendance with single-tap status toggles (Present, Absent, Late, Excused). When a student is marked absent, the automated notification engine can immediately dispatch SMS, email, or mobile push alerts to verified guardian profiles.',
  },
  {
    id: 'live-classes',
    category: 'Academic',
    question: 'Does EduCore support online assignments and live virtual classes?',
    answer:
      'Yes. The academic suite integrates a class stream post feed, rich assignment submissions with file uploads, and integrated live class sessions with automated participant duration logging.',
  },
  {
    id: 'onboarding-speed',
    category: 'Academic',
    question: 'How quickly can our institution onboard and start running classes?',
    answer:
      'An institution can be registered and live in under 60 seconds. Our bulk CSV import templates allow administrators to upload hundreds of students, faculty rosters, and class schedules in minutes, making full migration achievable over a single weekend.',
  },
]

export function FAQSection() {
  const [openId, setOpenId] = useState<string | null>('isolation')

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id))
  }

  return (
    <section id="faq" className="py-24 bg-slate-50 border-b border-slate-200/80 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/80 border border-slate-300 text-slate-700 text-xs font-semibold uppercase tracking-wider mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            Answers to Common Inquiries
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Frequently asked questions
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Everything you need to know about EduCore's multi-tenant architecture, data privacy, fee management, and onboarding.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {FAQS.map((faq) => {
            const isOpen = openId === faq.id
            return (
              <div
                key={faq.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-white border-blue-600 shadow-md ring-1 ring-blue-500/20'
                    : 'bg-white/80 border-slate-200 hover:bg-white hover:border-slate-300'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleItem(faq.id)}
                  className="w-full py-5 px-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    {faq.question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? 'bg-blue-600 text-white rotate-180' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-1 text-slate-600 text-sm sm:text-base leading-relaxed border-t border-slate-100">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>

        {/* Help Banner */}
        <div className="mt-12 p-6 rounded-2xl bg-blue-50 border border-blue-200/70 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">Have a specific question not covered here?</div>
              <div className="text-xs text-slate-600">
                Our architectural and onboarding team is available to assist your educational board.
              </div>
            </div>
          </div>
          <a
            href="mailto:support@educore.com"
            className="px-4 py-2.5 rounded-xl bg-white text-blue-600 border border-blue-200 text-xs font-semibold hover:bg-blue-600 hover:text-white transition-all shrink-0 shadow-sm"
          >
            Contact Engineering Team
          </a>
        </div>
      </div>
    </section>
  )
}
