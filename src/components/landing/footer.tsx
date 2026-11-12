import React from 'react'
import { EduCoreLogo } from './logo'

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-xs sm:text-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pt-16 pb-12">
        {/* Main Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12 pb-12 border-b border-slate-800">
          {/* Brand Column */}
          <div className="col-span-2 space-y-4">
            <EduCoreLogo variant="white" size="md" />
            <p className="text-slate-400 max-w-sm text-xs sm:text-sm leading-relaxed mt-3">
              One platform. Every part of education. The enterprise multi-tenant operating system for schools, tuition centres, coaching institutes, and educational organisations.
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-md text-emerald-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                All Systems Operational
              </span>
              <span className="font-mono text-slate-500">v2.4.0-cloud</span>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-white uppercase tracking-wider">Product</div>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Academic Structure
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Fee Ledger & Receipts
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Examinations & Marks
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Attendance Tracking
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Live Virtual Classes
                </a>
              </li>
              <li>
                <a href="#permissions" className="hover:text-white transition-colors">
                  Granular RBAC System
                </a>
              </li>
            </ul>
          </div>

          {/* Solutions Links */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-white uppercase tracking-wider">Solutions</div>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#positioning" className="hover:text-white transition-colors">
                  K-12 & High Schools
                </a>
              </li>
              <li>
                <a href="#positioning" className="hover:text-white transition-colors">
                  Tuition & Coaching
                </a>
              </li>
              <li>
                <a href="#positioning" className="hover:text-white transition-colors">
                  Colleges & Academies
                </a>
              </li>
              <li>
                <a href="#portals" className="hover:text-white transition-colors">
                  Multi-Campus Networks
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition-colors">
                  Pricing Plans
                </a>
              </li>
            </ul>
          </div>

          {/* Architecture & Security Links */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-white uppercase tracking-wider">Architecture</div>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#security" className="hover:text-white transition-colors">
                  PostgreSQL RLS Isolation
                </a>
              </li>
              <li>
                <a href="#security" className="hover:text-white transition-colors">
                  Minor-Unit Ledger Spec
                </a>
              </li>
              <li>
                <a href="#security" className="hover:text-white transition-colors">
                  Signed Document Storage
                </a>
              </li>
              <li>
                <a href="#portals" className="hover:text-white transition-colors">
                  Subdomain Provisioning
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  Platform Documentation
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            © {new Date().getFullYear()} EduCore Technologies Inc. All rights reserved. Built for global educational excellence.
          </div>

          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">COPPA / FERPA Compliance</span>
            <span className="hover:text-slate-400 cursor-pointer">Security Whitepaper</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
