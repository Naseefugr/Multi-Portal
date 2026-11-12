import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { TenantProvider, useTenant } from '@/contexts/tenant-context'
import { AuthProvider, useAuth } from '@/contexts/auth-context'
import { AcademicProvider } from '@/contexts/academic-context'
import { LearningProvider } from '@/contexts/learning-context'
import { OperationsProvider } from '@/contexts/operations-context'
import { CommunicationProvider } from '@/contexts/communication-context'
import { TopBar } from '@/components/navigation/top-bar'
import { LandingPage } from '@/features/platform-root/landing-page'
import { AboutPage } from '@/features/platform-root/about-page'
import { FounderPortal } from '@/features/platform-admin/founder-portal'
import { SuspendedScreen } from '@/features/tenant/suspended-screen'
import { TenantDashboardShell } from '@/features/tenant/tenant-dashboard-shell'

function AppRouter() {
  const { currentTenant, isPlatformAdmin, isSuspended } = useTenant()
  const { isAuthenticated } = useAuth()

  // First open home page. If not signed in, always open home.
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    )
  }

  // If signed in: open their account!
  if (isPlatformAdmin) {
    return <FounderPortal />
  }

  if (isSuspended) {
    return <SuspendedScreen />
  }

  if (currentTenant) {
    return <TenantDashboardShell />
  }

  // Fallback if signed in without specific tenant selected
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export function App() {
  return (
    <BrowserRouter>
      <TenantProvider>
        <AuthProvider>
          <AcademicProvider>
            <LearningProvider>
              <OperationsProvider>
                <CommunicationProvider>
                  <div className="min-h-screen bg-background text-foreground flex flex-col font-sans antialiased">
                    <TopBar />
                    <div className="flex-1">
                      <AppRouter />
                    </div>
                  </div>
                </CommunicationProvider>
              </OperationsProvider>
            </LearningProvider>
          </AcademicProvider>
        </AuthProvider>
      </TenantProvider>
    </BrowserRouter>
  )
}

export default App
