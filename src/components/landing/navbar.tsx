import React, { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { EduCoreLogo } from './logo'
import {
  ChevronDown,
  Menu,
  X,
  ArrowRight,
  School,
  BookOpen,
  FileCheck,
  CalendarCheck,
  CreditCard,
  Video,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'

interface NavbarProps {
  onOpenRegister: () => void
  onOpenSignIn: () => void
}

export function Navbar({ onOpenRegister, onOpenSignIn }: NavbarProps) {
  const location = useLocation()
  const navigate = useNavigate()

  const isHomePage = location.pathname === '/'
  const isAboutPage = location.pathname === '/about'
  const { isAuthenticated, signOut } = useAuth()

  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<'features' | 'solutions' | null>(null)
  const navRef = useRef<HTMLElement>(null)

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Auto-close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close mobile menu on screen resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false)
        setActiveDropdown(null)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Smooth Navigation Handler
  const navigateTo = (targetPath: string, hash?: string) => {
    setActiveDropdown(null)
    setMobileMenuOpen(false)

    if (hash) {
      if (location.pathname === targetPath) {
        const el = document.getElementById(hash)
        if (el) {
          const navOffset = 80
          const elementPosition = el.getBoundingClientRect().top
          const offsetPosition = elementPosition + window.pageYOffset - navOffset
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          })
        }
      } else {
        navigate(`${targetPath}#${hash}`)
      }
    } else {
      if (location.pathname === targetPath) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        navigate(targetPath)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  }

  return (
    <header
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-xs border-b border-slate-200/90'
          : 'bg-white/90 backdrop-blur-md border-b border-slate-200/70'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl h-16 sm:h-20 flex items-center justify-between">
        {/* Brand Logo & Desktop Nav Links */}
        <div className="flex items-center gap-6 xl:gap-8">
          <Link
            to="/"
            onClick={() => {
              if (isHomePage) {
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }
            }}
            className="shrink-0 flex items-center group cursor-pointer"
          >
            <EduCoreLogo size="md" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
            {/* Home Link */}
            <button
              type="button"
              onClick={() => navigateTo('/')}
              className={`px-3 py-1.5 text-xs xl:text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                isHomePage && !location.hash
                  ? 'text-blue-600 bg-blue-50/80 font-bold'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
              }`}
            >
              Home
            </button>

            {/* Institutional Flexibility (Prominently featured on First Interface) */}
            <button
              type="button"
              onClick={() => navigateTo('/', 'positioning')}
              className={`px-3 py-1.5 text-xs xl:text-sm font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5 cursor-pointer ${
                isHomePage && location.hash === '#positioning'
                  ? 'text-blue-600 bg-blue-50/80 font-bold'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-slate-50'
              }`}
            >
              <School className="h-3.5 w-3.5 text-blue-600" />
              <span>Institutional Flexibility</span>
            </button>

            {/* About Link with Active Page Indicator */}
            <button
              type="button"
              onClick={() => navigateTo('/about')}
              className={`px-3 py-1.5 text-xs xl:text-sm font-semibold rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer ${
                isAboutPage
                  ? 'text-blue-600 bg-blue-50/80 font-bold'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
              }`}
            >
              <span>About</span>
              {isAboutPage && (
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
              )}
            </button>

            {/* Features / Capabilities Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('features')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                type="button"
                onClick={() =>
                  setActiveDropdown(activeDropdown === 'features' ? null : 'features')
                }
                className="px-3 py-1.5 text-xs xl:text-sm font-semibold text-slate-600 hover:text-slate-950 hover:bg-slate-50 transition-colors inline-flex items-center gap-1 rounded-lg cursor-pointer"
              >
                <span>Capabilities</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    activeDropdown === 'features' ? 'rotate-180 text-blue-600' : 'opacity-60'
                  }`}
                />
              </button>

              {/* Dropdown Container */}
              {activeDropdown === 'features' && (
                <div className="absolute top-full left-0 pt-2 z-50">
                  <div className="w-[460px] bg-white rounded-2xl shadow-xl border border-slate-200/90 p-4 grid grid-cols-2 gap-2 animate-in fade-in-50 zoom-in-95 duration-150">
                    <button
                      type="button"
                      onClick={() => navigateTo('/about', 'features')}
                      className="p-2.5 rounded-xl text-left hover:bg-slate-50 transition-colors flex items-start gap-3 cursor-pointer group"
                    >
                      <BookOpen className="h-4 w-4 text-blue-600 mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                      <div>
                        <div className="text-xs font-bold text-slate-900">LMS & Notes</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">Rich handouts and materials.</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => navigateTo('/about', 'features')}
                      className="p-2.5 rounded-xl text-left hover:bg-slate-50 transition-colors flex items-start gap-3 cursor-pointer group"
                    >
                      <FileCheck className="h-4 w-4 text-indigo-600 mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                      <div>
                        <div className="text-xs font-bold text-slate-900">Assignments</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">Online submissions & grading.</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => navigateTo('/about', 'features')}
                      className="p-2.5 rounded-xl text-left hover:bg-slate-50 transition-colors flex items-start gap-3 cursor-pointer group"
                    >
                      <CalendarCheck className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                      <div>
                        <div className="text-xs font-bold text-slate-900">Attendance</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">Daily & session roll call locks.</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => navigateTo('/about', 'features')}
                      className="p-2.5 rounded-xl text-left hover:bg-slate-50 transition-colors flex items-start gap-3 cursor-pointer group"
                    >
                      <CreditCard className="h-4 w-4 text-amber-600 mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                      <div>
                        <div className="text-xs font-bold text-slate-900">Fee Ledger</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">Minor-unit integer balance.</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => navigateTo('/about', 'features')}
                      className="p-2.5 rounded-xl text-left hover:bg-slate-50 transition-colors flex items-start gap-3 col-span-2 border-t border-slate-100 pt-3 cursor-pointer group"
                    >
                      <Video className="h-4 w-4 text-cyan-600 mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                      <div>
                        <div className="text-xs font-bold text-slate-900">Integrated Live Classrooms</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">One-click video bridge with automated duration logs.</div>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Direct Links */}
            <button
              type="button"
              onClick={() => navigateTo('/about', 'portals')}
              className="px-3 py-1.5 text-xs xl:text-sm font-semibold text-slate-600 hover:text-slate-950 hover:bg-slate-50 transition-colors rounded-lg cursor-pointer"
            >
              Portals
            </button>

            <button
              type="button"
              onClick={() => navigateTo('/about', 'security')}
              className="px-3 py-1.5 text-xs xl:text-sm font-semibold text-slate-600 hover:text-slate-950 hover:bg-slate-50 transition-colors rounded-lg cursor-pointer"
            >
              Security
            </button>

            <button
              type="button"
              onClick={() => navigateTo('/about', 'pricing')}
              className="px-3 py-1.5 text-xs xl:text-sm font-semibold text-slate-600 hover:text-slate-950 hover:bg-slate-50 transition-colors rounded-lg cursor-pointer"
            >
              Pricing
            </button>
          </nav>
        </div>

        {/* Right Action CTAs */}
        <div className="flex items-center gap-2 sm:gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={() => window.location.reload()}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all px-3 sm:px-4 h-9 sm:h-10 rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <span>My Account</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut()}
                className="text-slate-600 hover:text-red-600 text-xs sm:text-sm font-semibold cursor-pointer"
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={onOpenSignIn}
                className="text-slate-700 hover:text-slate-950 font-semibold text-xs sm:text-sm px-2.5 sm:px-3.5 cursor-pointer"
              >
                Sign in
              </Button>

              <Button
                size="sm"
                onClick={onOpenRegister}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all px-3 sm:px-4 h-9 sm:h-10 rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <span className="hidden sm:inline">Create your institution</span>
                <span className="sm:hidden">Get started</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-5 py-5 space-y-4 shadow-2xl max-h-[calc(100vh-4.5rem)] overflow-y-auto animate-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col space-y-1">
            <button
              type="button"
              onClick={() => navigateTo('/')}
              className={`px-3 py-2.5 text-left text-sm font-bold rounded-xl ${
                isHomePage && !location.hash ? 'text-blue-600 bg-blue-50' : 'text-slate-800 hover:bg-slate-50'
              }`}
            >
              Home
            </button>

            <button
              type="button"
              onClick={() => navigateTo('/', 'positioning')}
              className="px-3 py-2.5 text-left text-sm font-bold text-slate-800 hover:bg-slate-50 rounded-xl flex items-center gap-2"
            >
              <School className="h-4 w-4 text-blue-600" />
              <span>Institutional Flexibility</span>
            </button>

            <button
              type="button"
              onClick={() => navigateTo('/about')}
              className={`px-3 py-2.5 text-left text-sm font-bold rounded-xl flex items-center justify-between ${
                isAboutPage ? 'text-blue-600 bg-blue-50' : 'text-slate-800 hover:bg-slate-50'
              }`}
            >
              <span>About EduCore</span>
              {isAboutPage && <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">Active</span>}
            </button>

            <button
              type="button"
              onClick={() => navigateTo('/about', 'features')}
              className="px-3 py-2.5 text-left text-sm font-bold text-slate-800 hover:bg-slate-50 rounded-xl"
            >
              Platform Capabilities
            </button>

            <button
              type="button"
              onClick={() => navigateTo('/about', 'portals')}
              className="px-3 py-2.5 text-left text-sm font-bold text-slate-800 hover:bg-slate-50 rounded-xl"
            >
              Multi-Tenant Portals
            </button>

            <button
              type="button"
              onClick={() => navigateTo('/about', 'security')}
              className="px-3 py-2.5 text-left text-sm font-bold text-slate-800 hover:bg-slate-50 rounded-xl"
            >
              Security Architecture
            </button>

            <button
              type="button"
              onClick={() => navigateTo('/about', 'pricing')}
              className="px-3 py-2.5 text-left text-sm font-bold text-slate-800 hover:bg-slate-50 rounded-xl"
            >
              Pricing & Plans
            </button>
          </nav>

          <div className="pt-3 border-t border-slate-100 space-y-2">
            {isAuthenticated ? (
              <>
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold h-10 rounded-xl"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    window.location.reload()
                  }}
                >
                  My Account
                </Button>
                <Button
                  variant="outline"
                  className="w-full text-xs font-semibold h-10 rounded-xl text-red-600 hover:bg-red-50"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    signOut()
                  }}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="w-full text-xs font-semibold h-10 rounded-xl"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    onOpenSignIn()
                  }}
                >
                  Sign In
                </Button>
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold h-10 rounded-xl"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    onOpenRegister()
                  }}
                >
                  Create Your Institution Portal
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
