import React from 'react'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'dark' | 'light' | 'white'
}

export function EduCoreLogo({ className = '', size = 'md', variant = 'dark' }: LogoProps) {
  const iconSizes = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
  }

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  }

  return (
    <div className={`inline-flex items-center gap-2.5 font-bold tracking-tight select-none ${className}`}>
      {/* Custom Educational Technology Symbol */}
      <div
        className={`${iconSizes[size]} relative rounded-lg flex items-center justify-center shrink-0 overflow-hidden shadow-sm`}
        style={{
          background: 'linear-gradient(135deg, #315CF5 0%, #1D4ED8 100%)',
        }}
      >
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-5/6 h-5/6 text-white"
        >
          {/* Central Core & Interconnected Educational Nodes */}
          <path
            d="M16 4L6 9.5L16 15L26 9.5L16 4Z"
            fill="currentColor"
            fillOpacity="0.95"
          />
          <path
            d="M6 13.5V20.5L16 26V19L6 13.5Z"
            fill="currentColor"
            fillOpacity="0.75"
          />
          <path
            d="M26 13.5V20.5L16 26V19L26 13.5Z"
            fill="currentColor"
            fillOpacity="0.85"
          />
          {/* Subtle Core Accent */}
          <circle cx="16" cy="15" r="2.2" fill="#93C5FD" />
        </svg>
      </div>

      <div className="flex flex-col leading-none">
        <span
          className={`${textSizes[size]} font-extrabold tracking-tight ${
            variant === 'white' ? 'text-white' : 'text-slate-900 dark:text-white'
          }`}
        >
          Edu<span className="text-blue-600">Core</span>
        </span>
      </div>
    </div>
  )
}
