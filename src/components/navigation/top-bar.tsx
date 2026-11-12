import React from 'react'
import { useTenant } from '@/contexts/tenant-context'
import { useAuth } from '@/contexts/auth-context'
import {
  School,
  Shield,
  GraduationCap,
  AlertTriangle,
  LogOut,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export function TopBar() {
  const {
    currentTenant,
    isPlatformRoot,
    isPlatformAdmin,
    setDevSubdomain,
  } = useTenant()

  const { currentUser, userRole, signOut, isAuthenticated } = useAuth()

  // Only render when authenticated and inside an active portal
  if (isPlatformRoot || !isAuthenticated) {
    return null
  }

  const handleSignOut = () => {
    signOut()
    setDevSubdomain(null)
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-2xs">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Left: Active Portal Identity */}
        <div className="flex items-center gap-3">
          {isPlatformAdmin ? (
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center font-bold shadow-sm">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg text-foreground">EduCore Founder Console</span>
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs">
                    Platform Master
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground block -mt-0.5">
                  Global Governance & Multi-Tenant Operations
                </span>
              </div>
            </div>
          ) : currentTenant ? (
            <div className="flex items-center gap-2.5">
              <div
                className="h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold shadow-sm"
                style={{ backgroundColor: currentTenant.primary_color }}
              >
                {currentTenant.institution_type === 'school' ? (
                  <School className="h-5 w-5" />
                ) : (
                  <GraduationCap className="h-5 w-5" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base md:text-lg text-foreground leading-tight">
                    {currentTenant.name}
                  </span>
                  {currentTenant.status === 'active' ? (
                    <Badge variant="success" className="text-[10px] uppercase">
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="text-[10px] uppercase flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" /> Suspended
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="capitalize">{currentTenant.institution_type.replace('_', ' ')}</span>
                  <span>•</span>
                  <span>{currentTenant.slug}.educore.com</span>
                </div>
              </div>
            </div>
          ) : (
            <span className="font-bold text-lg">EduCore Portal</span>
          )}
        </div>

        {/* Right: User Profile & Sign Out Button */}
        <div className="flex items-center gap-3">
          {currentUser && (
            <div className="flex items-center gap-3 pl-3 border-l">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium leading-none text-foreground">
                  {currentUser.full_name}
                </p>
                <p className="text-xs text-muted-foreground capitalize mt-1">
                  Role: <span className="font-semibold text-primary">{userRole.replace('_', ' ')}</span>
                </p>
              </div>
              <img
                src={currentUser.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                alt={currentUser.full_name}
                className="h-9 w-9 rounded-full object-cover ring-2 ring-primary/20"
              />
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            className="flex items-center gap-1.5 text-xs text-slate-700 hover:text-red-600 hover:border-red-200 cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
