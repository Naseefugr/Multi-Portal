import React from 'react'
import { motion } from 'motion/react'
import { ArrowRight, Sparkles, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { HeroDashboardFrame } from './hero-dashboard-frame'

interface HeroProps {
  onOpenRegister: () => void
  onExploreFeatures: () => void
}

export function Hero({ onOpenRegister, onExploreFeatures }: HeroProps) {
  return (
    <section className="relative pt-24 sm:pt-28 pb-8 sm:pb-12 overflow-hidden bg-white">
      {/* Background Dot Matrix Pattern matching user reference */}
      <div className="absolute inset-0 bg-[radial-gradient(#d1d5db_1.2px,transparent_1.2px)] [background-size:20px_20px] opacity-60 pointer-events-none" />

      {/* Gentle Floating Atmospheric Light Gradients with Breathing Animation */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.4, 0.65, 0.4],
        }}
        transition={{
          repeat: Infinity,
          duration: 9,
          ease: 'easeInOut',
        }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-b from-blue-200/40 via-indigo-100/30 to-transparent blur-3xl pointer-events-none -z-10 rounded-full"
      />

      <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10 space-y-6 sm:space-y-8 text-center">
        {/* Main Headline Group with Staggered Entrance Animation */}
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Top Pill with Subtle Pulse Aura */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200/70 text-blue-700 text-xs font-semibold shadow-xs hover:border-blue-300 transition-colors cursor-default"
          >
            <Sparkles className="h-3.5 w-3.5 text-blue-600 animate-pulse" />
            <span>Next-Generation Multi-Tenant Education Operating System</span>
          </motion.div>

          {/* Primary Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 leading-[1.1]"
          >
            Everything your institution needs.{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 bg-clip-text text-transparent">
              One connected platform.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal"
          >
            From classrooms and assignments to attendance, communications, and minor-unit fee ledgers — manage your entire educational ecosystem with EduCore.
          </motion.p>

          {/* CTA Buttons with Spring Hover Animation */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center justify-center gap-3 pt-1"
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                size="lg"
                onClick={onOpenRegister}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm px-6 sm:px-8 h-11 rounded-xl shadow-md shadow-blue-500/25 hover:shadow-blue-500/40 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Create your institution</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                size="lg"
                variant="outline"
                onClick={onExploreFeatures}
                className="border-slate-300 bg-white text-slate-700 hover:bg-slate-50 text-xs sm:text-sm px-5 h-11 rounded-xl font-medium shadow-2xs cursor-pointer"
              >
                Explore the platform
              </Button>
            </motion.div>
          </motion.div>

          {/* Trust Statement */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="pt-1 text-[11px] text-slate-500 flex items-center justify-center gap-1.5"
          >
            <Shield className="h-3 w-3 text-blue-600" />
            <span>Built for schools, tuition centres, and modern educational organisations.</span>
          </motion.div>
        </div>

        {/* Hero Product Frame Showcase (Matches reference image with floating animations) */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="pt-1"
        >
          <HeroDashboardFrame />
        </motion.div>
      </div>
    </section>
  )
}
