import React, { createContext, useContext, useState, useEffect } from 'react'
import type { Profile, UserRole, InstitutionMembership } from '@/types/database.types'
import {
  INITIAL_PROFILES,
  INITIAL_MEMBERSHIPS,
  INITIAL_MANAGER_OVERRIDES,
} from '@/services/mock-data'
import { useTenant } from '@/contexts/tenant-context'

interface AuthContextType {
  currentUser: Profile | null
  currentMembership: InstitutionMembership | null
  userRole: UserRole
  permissions: string[]
  hasPermission: (key: string) => boolean
  isAuthenticated: boolean
  signIn: (email?: string, password?: string, role?: UserRole) => void
  loginAsRole: (role: UserRole) => void
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Default base permissions by role
const BASE_ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  platform_founder: [
    'platform.tenants.view',
    'platform.tenants.create',
    'platform.tenants.manage_status',
    'platform.features.manage_global',
  ],
  institution_admin: [
    'institution.profile.manage',
    'institution.modules.configure',
    'managers.create',
    'managers.edit_permissions',
    'academics.years.manage',
    'academics.classes.create',
    'academics.allocations.manage',
    'students.view_list',
    'students.create',
    'students.edit',
    'teachers.view_list',
    'teachers.create',
    'class_posts.view',
    'class_posts.create',
    'class_posts.publish',
    'assignments.view',
    'assignments.create',
    'assignments.grade',
    'attendance.view_summary',
    'attendance.record',
    'fees.manage_structures',
    'fees.collect_payment',
    'fees.view_summary',
    'communications.announce_institution',
  ],
  manager: [
    // Zero default permissions! Delegated dynamically via overrides.
  ],
  teacher: [
    'students.view_list',
    'teachers.view_list',
    'class_posts.view',
    'class_posts.create',
    'assignments.view',
    'assignments.create',
    'assignments.grade',
    'attendance.record',
    'attendance.view_summary',
    'communications.announce_class',
  ],
  student: [
    'class_posts.view',
    'assignments.view',
    'assignments.submit',
    'attendance.view_summary',
  ],
  parent: [
    'attendance.view_summary',
    'assignments.view',
    'fees.pay_online',
  ],
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { currentTenant, isPlatformAdmin, setDevSubdomain } = useTenant()

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('educore_auth_state') === 'true'
  })

  const [selectedRole, setSelectedRole] = useState<UserRole>(() => {
    return (localStorage.getItem('educore_demo_role') as UserRole) || 'institution_admin'
  })

  // Match profile based on selected role
  const currentUser: Profile = React.useMemo(() => {
    if (isPlatformAdmin || selectedRole === 'platform_founder') {
      return INITIAL_PROFILES[0] // Dr. Vikram Malhotra (Founder)
    }
    switch (selectedRole) {
      case 'institution_admin':
        return INITIAL_PROFILES[1] // Anita Sharma
      case 'manager':
        return INITIAL_PROFILES[2] // Rohan Mehra
      case 'teacher':
        return INITIAL_PROFILES[3] // David Wilson
      case 'student':
        return INITIAL_PROFILES[4] // Aarav Patel
      case 'parent':
        return INITIAL_PROFILES[5] // Rajesh Patel
      default:
        return INITIAL_PROFILES[1]
    }
  }, [selectedRole, isPlatformAdmin])

  const currentMembership: InstitutionMembership | null = React.useMemo(() => {
    if (!currentTenant) return null
    return (
      INITIAL_MEMBERSHIPS.find(
        (m) => m.institution_id === currentTenant.id && m.role === selectedRole
      ) || {
        id: `mem-${selectedRole}-${currentTenant.id}`,
        institution_id: currentTenant.id,
        user_id: currentUser.id,
        role: selectedRole,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    )
  }, [currentTenant, selectedRole, currentUser])

  // Compute total permissions (Base role permissions + Manager overrides)
  const permissions = React.useMemo(() => {
    const base = BASE_ROLE_PERMISSIONS[selectedRole] || []
    if (selectedRole === 'manager' && currentMembership) {
      const overrides = INITIAL_MANAGER_OVERRIDES.filter(
        (o) => o.membership_id === currentMembership.id && o.is_granted
      ).map((o) => o.permission_key)
      return Array.from(new Set([...base, ...overrides]))
    }
    return base
  }, [selectedRole, currentMembership])

  const hasPermission = (key: string): boolean => {
    if (selectedRole === 'institution_admin') return true
    return permissions.includes(key)
  }

  const signIn = (_email?: string, _password?: string, role?: UserRole) => {
    const targetRole = role || 'institution_admin'
    setSelectedRole(targetRole)
    setIsAuthenticated(true)
    localStorage.setItem('educore_demo_role', targetRole)
    localStorage.setItem('educore_auth_state', 'true')
  }

  const loginAsRole = (role: UserRole) => {
    setSelectedRole(role)
    setIsAuthenticated(true)
    localStorage.setItem('educore_demo_role', role)
    localStorage.setItem('educore_auth_state', 'true')
  }

  const signOut = () => {
    setIsAuthenticated(false)
    setSelectedRole('institution_admin')
    localStorage.removeItem('educore_demo_role')
    localStorage.removeItem('educore_auth_state')
    localStorage.removeItem('educore_dev_subdomain')
    setDevSubdomain(null)
  }

  // Auto-switch to founder when navigating to admin portal
  useEffect(() => {
    if (isPlatformAdmin && selectedRole !== 'platform_founder') {
      setSelectedRole('platform_founder')
      setIsAuthenticated(true)
    }
  }, [isPlatformAdmin, selectedRole])

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentMembership,
        userRole: isPlatformAdmin ? 'platform_founder' : selectedRole,
        permissions,
        hasPermission,
        isAuthenticated,
        signIn,
        loginAsRole,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
