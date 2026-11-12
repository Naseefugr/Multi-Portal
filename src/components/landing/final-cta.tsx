import React from 'react'
import { motion } from 'motion/react'
import { ArrowRight, Sparkles, ShieldCheck, CheckCircle2, Building2 } from 'lucide-react'

export function FinalCTASection({
  onOpenRegister,
  onExploreDemo,
}: {
  onOpenRegister: () => void
  onExploreDemo: () => void
}) {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white p-8 sm:p-12 md:p-16 shadow-2xl border border-slate-800 overflow-hidden text-center"
        >
          {/* Subtle background glowing rings with breathing animation */}
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
            className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"
          />
          <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Ready for Immediate Deployment</span>
          </div>

          {/* Headline */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight max-w-3xl mx-auto leading-tight">
            Bring your entire institution together on EduCore
          </h2>

          {/* Subtext */}
          <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Eliminate disconnected spreadsheets, uncollected fees, and fragmented messaging apps. 
            Claim your custom institution subdomain and experience the future of educational administration.
          </p>

          {/* CTA Buttons with spring interaction */}
          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenRegister}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm sm:text-base font-bold shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Create Your Institution Portal</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={onExploreDemo}
              className="w-full sm:w-auto px-7 py-4 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-slate-200 border border-slate-700 text-sm sm:text-base font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Building2 className="w-4 h-4 text-blue-400" />
              <span>Explore Live Institutions</span>
            </motion.button>
          </div>

          {/* Value Badges */}
          <div className="mt-10 pt-8 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Ready in under 60 seconds</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Free 14-day evaluation</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>PostgreSQL RLS security guaranteed</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
