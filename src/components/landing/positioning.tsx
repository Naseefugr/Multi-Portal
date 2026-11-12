import React from 'react'
import { motion } from 'motion/react'
import { School, GraduationCap, Building2, BookOpen, ArrowUpRight } from 'lucide-react'

export function PositioningSection() {
  const categories = [
    {
      id: 'schools',
      title: 'K-12 Schools',
      icon: School,
      tagline: 'Grades, sections, holistic grading & parent relations',
      description:
        'Engineered for comprehensive school governance—from academic years and homeroom daily attendance to term examinations and verified guardian transcripts.',
      accent: 'border-blue-100 bg-blue-50/60 text-blue-600',
      iconBg: 'bg-blue-100/70 text-blue-600',
    },
    {
      id: 'tuition',
      title: 'Tuition Centres',
      icon: BookOpen,
      tagline: 'Flexible batches, subject focus & session billing',
      description:
        'Manage high-frequency micro-cohorts, evening and weekend schedules, subject-wise assignments, and monthly fee installment cycles without friction.',
      accent: 'border-indigo-100 bg-indigo-50/60 text-indigo-600',
      iconBg: 'bg-indigo-100/70 text-indigo-600',
    },
    {
      id: 'coaching',
      title: 'Coaching Institutes',
      icon: GraduationCap,
      tagline: 'Competitive tracks, intensive cohorts & rank analytics',
      description:
        'Built for entrance exam prep (JEE, NEET, Civil Services). Model courses into fast-track batches, mock testing pipelines, and live doubt-solving sessions.',
      accent: 'border-cyan-100 bg-cyan-50/60 text-cyan-700',
      iconBg: 'bg-cyan-100/70 text-cyan-600',
    },
    {
      id: 'organisations',
      title: 'Educational Networks',
      icon: Building2,
      tagline: 'Multi-campus chains, foundations & academies',
      description:
        'Run federated institutional campuses under one unified ecosystem. Maintain platform-wide governance while granting full operational autonomy to each branch.',
      accent: 'border-slate-200 bg-slate-50/80 text-slate-700',
      iconBg: 'bg-slate-200/80 text-slate-700',
    },
  ]

  return (
    <section id="positioning" className="py-24 bg-white border-b border-slate-200/80 relative">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl space-y-14">
        {/* Section Header with Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto space-y-3"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-2">
            Institutional Flexibility
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Architected for every educational model
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Education isn't one-size-fits-all. EduCore natively supports traditional school taxonomies alongside dynamic coaching cohorts on the same isolated cloud engine.
          </p>
        </motion.div>

        {/* 4 Cards Grid with Staggered Viewport Reveal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => {
            const Icon = cat.icon
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: idx * 0.1, ease: 'easeOut' }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="relative rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${cat.iconBg} shadow-2xs group-hover:scale-105 transition-transform duration-300`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>

                  <div>
                    <h3 className="font-bold text-lg text-slate-900">{cat.title}</h3>
                    <p className="text-xs font-semibold text-blue-600 mt-1">{cat.tagline}</p>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed font-normal">
                    {cat.description}
                  </p>
                </div>

                <div className="pt-5 mt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">
                  <span>Explore {cat.title} structure</span>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
