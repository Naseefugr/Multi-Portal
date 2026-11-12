import React, { createContext, useContext, useState, useEffect, useMemo } from 'react'
import type { Institution, TenantStatus, InstitutionType } from '@/types/database.types'
import { supabase, isLiveSupabaseConfigured } from '@/integrations/supabase/client'

import { BRIGHT_TENANT_ID, APEX_TENANT_ID, ALNOOR_TENANT_ID } from '@/services/mock-data'

export const RESERVED_SUBDOMAINS = [
  'www', 'admin', 'api', 'app', 'auth', 'billing', 'blog', 'cdn',
  'dashboard', 'dev', 'docs', 'email', 'help', 'hub', 'internal',
  'login', 'mail', 'portal', 'root', 'secure', 'signup', 'stage',
  'staging', 'status', 'support', 'test', 'web', 'webhook', 'ws'
]

interface TenantContextType {
  currentSubdomain: string | null
  currentTenant: Institution | null
  isPlatformRoot: boolean
  isPlatformAdmin: boolean
  isSuspended: boolean
  allInstitutions: Institution[]
  setDevSubdomain: (subdomain: string | null) => void
  registerInstitution: (data: {
    name: string
    slug: string
    institution_type: InstitutionType
    contact_email: string
    contact_phone?: string
    admin_name: string
  }) => Promise<{ success: boolean; error?: string }>
  updateTenantStatus: (id: string, status: TenantStatus) => Promise<void>
  updateInstitutionProfile: (id: string, updates: Partial<Institution>) => Promise<void>
}

const TenantContext = createContext<TenantContextType | undefined>(undefined)

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [institutions, setInstitutions] = useState<Institution[]>(() => {
    const saved = localStorage.getItem('educore_institutions')
    if (saved) {
      try {
        const parsed: Institution[] = JSON.parse(saved)
        const nonDemo = parsed.filter(
          (i) =>
            !['inst-001-bright', 'inst-002-apex', 'inst-003-alnoor', BRIGHT_TENANT_ID, APEX_TENANT_ID, ALNOOR_TENANT_ID].includes(i.id) &&
            !['bright', 'apex-prep', 'alnoor'].includes(i.slug)
        )
        return nonDemo
      } catch {
        return []
      }
    }
    return []
  })

  // Local development / simulated subdomain override: Defaults to null (Home page)
  const [devSubdomain, setDevSubdomain] = useState<string | null>(() => {
    const isAuth = localStorage.getItem('educore_auth_state') === 'true'
    if (!isAuth) {
      localStorage.removeItem('educore_dev_subdomain')
      return null
    }
    return localStorage.getItem('educore_dev_subdomain') || null
  })

  // Sync from live Supabase on load
  useEffect(() => {
    if (!isLiveSupabaseConfigured) return

    let isMounted = true

    async function loadFromSupabase() {
      try {
        const { data, error } = await supabase.from('institutions').select('*')
        if (error) {
          console.info('Supabase institutions query notice:', error.message)
          return
        }
        if (data && data.length > 0 && isMounted) {
          setInstitutions(data as Institution[])
        }
      } catch (err) {
        console.info('Supabase connection notice:', err)
      }
    }

    loadFromSupabase()

    return () => {
      isMounted = false
    }
  }, [])

  // Extract real hostname subdomain if running on live wildcard
  const detectedSubdomain = useMemo(() => {
    if (typeof window === 'undefined') return null

    const hostname = window.location.hostname
    // If running on custom wildcard domain like bright.educore.com
    const parts = hostname.split('.')
    if (parts.length > 2 && !hostname.includes('localhost') && !hostname.includes('127.0.0.1')) {
      const sub = parts[0].toLowerCase()
      return sub
    }
    // If running on lvh.me (e.g. bright.lvh.me)
    if (hostname.includes('lvh.me')) {
      return parts[0].toLowerCase()
    }
    // Fall back to devSubdomain selector for easy testing
    return devSubdomain
  }, [devSubdomain])

  const activeSubdomain = devSubdomain !== undefined ? devSubdomain : detectedSubdomain

  const isPlatformRoot = activeSubdomain === null || activeSubdomain === 'www' || activeSubdomain === ''
  const isPlatformAdmin = activeSubdomain === 'admin'

  const currentTenant = useMemo(() => {
    if (isPlatformRoot || isPlatformAdmin) return null
    return institutions.find((inst) => inst.slug.toLowerCase() === activeSubdomain?.toLowerCase()) || null
  }, [institutions, activeSubdomain, isPlatformRoot, isPlatformAdmin])

  const isSuspended = currentTenant?.status === 'suspended'

  // Persist dev changes
  useEffect(() => {
    localStorage.setItem('educore_institutions', JSON.stringify(institutions))
  }, [institutions])

  const updateTenantStatus = async (id: string, status: TenantStatus) => {
    const updatedAt = new Date().toISOString()
    setInstitutions((prev) =>
      prev.map((inst) => (inst.id === id ? { ...inst, status, updated_at: updatedAt } : inst))
    )

    if (isLiveSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('institutions')
          .update({ status, updated_at: updatedAt })
          .eq('id', id)
        if (error) {
          console.warn('Supabase status update notice:', error.message)
        }
      } catch (err) {
        console.warn('Supabase status update error:', err)
      }
    }
  }

  const updateInstitutionProfile = async (id: string, updates: Partial<Institution>) => {
    const updatedAt = new Date().toISOString()
    setInstitutions((prev) =>
      prev.map((inst) => (inst.id === id ? { ...inst, ...updates, updated_at: updatedAt } : inst))
    )

    if (isLiveSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('institutions')
          .update({ ...updates, updated_at: updatedAt })
          .eq('id', id)
        if (error) {
          console.warn('Supabase profile update notice:', error.message)
        }
      } catch (err) {
        console.warn('Supabase profile update error:', err)
      }
    }
  }

  const registerInstitution = async (data: {
    name: string
    slug: string
    institution_type: InstitutionType
    contact_email: string
    contact_phone?: string
    admin_name: string
  }) => {
    const cleanSlug = data.slug.toLowerCase().trim()

    // 1. Slug format validation
    if (!/^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$/.test(cleanSlug)) {
      return {
        success: false,
        error: 'Slug must be 3-63 characters, lowercase letters, numbers, and hyphens only.',
      }
    }

    // 2. Reserved subdomain check
    if (RESERVED_SUBDOMAINS.includes(cleanSlug)) {
      return {
        success: false,
        error: `The subdomain "${cleanSlug}" is reserved by the platform. Please choose another name.`,
      }
    }

    // 3. Duplicate check
    if (institutions.some((inst) => inst.slug.toLowerCase() === cleanSlug)) {
      return {
        success: false,
        error: `Subdomain "${cleanSlug}.educore.com" is already registered.`,
      }
    }

    const now = new Date().toISOString()
    const newTenant: Institution = {
      id: `0192e85a-000${Math.floor(Math.random() * 9) + 4}-7000-8000-00000000000${Math.floor(Math.random() * 9)}`,
      slug: cleanSlug,
      name: data.name,
      institution_type: data.institution_type,
      status: 'active',
      primary_color: '#2563eb',
      timezone: 'Asia/Kolkata',
      currency: 'INR',
      contact_email: data.contact_email,
      contact_phone: data.contact_phone || null,
      created_at: now,
      updated_at: now,
    }

    setInstitutions((prev) => [...prev, newTenant])
    setDevSubdomain(cleanSlug)
    localStorage.setItem('educore_dev_subdomain', cleanSlug)

    if (isLiveSupabaseConfigured) {
      try {
        const { error } = await supabase.from('institutions').insert([newTenant])
        if (error) {
          console.warn('Supabase insert institution notice:', error.message)
        }
      } catch (err) {
        console.warn('Supabase register error:', err)
      }
    }

    return { success: true }
  }

  const handleSetDevSubdomain = (sub: string | null) => {
    setDevSubdomain(sub)
    if (sub) {
      localStorage.setItem('educore_dev_subdomain', sub)
    } else {
      localStorage.removeItem('educore_dev_subdomain')
    }
  }

  return (
    <TenantContext.Provider
      value={{
        currentSubdomain: activeSubdomain,
        currentTenant,
        isPlatformRoot,
        isPlatformAdmin,
        isSuspended,
        allInstitutions: institutions,
        setDevSubdomain: handleSetDevSubdomain,
        registerInstitution,
        updateTenantStatus,
        updateInstitutionProfile,
      }}
    >
      {children}
    </TenantContext.Provider>
  )
}

export function useTenant() {
  const context = useContext(TenantContext)
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider')
  }
  return context
}
