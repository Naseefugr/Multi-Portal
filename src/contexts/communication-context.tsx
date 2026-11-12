import React, { createContext, useContext, useState, useEffect } from 'react'
import type { Announcement, AppNotification, LiveClassSession } from '@/types/database.types'
import {
  INITIAL_ANNOUNCEMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_LIVE_CLASSES,
  BRIGHT_TENANT_ID,
} from '@/services/mock-data'
import { useTenant } from '@/contexts/tenant-context'
import { useAuth } from '@/contexts/auth-context'
import { supabase, isLiveSupabaseConfigured } from '@/integrations/supabase/client'

interface CommunicationContextType {
  announcements: Announcement[]
  notifications: AppNotification[]
  liveClasses: LiveClassSession[]
  unreadCount: number

  // Announcement Actions
  createAnnouncement: (data: {
    title: string
    content: string
    scope: Announcement['scope']
    cohortName?: string
    isUrgent: boolean
  }) => void

  // Notification Actions
  markNotificationAsRead: (id: string) => void
  markAllNotificationsAsRead: () => void

  // Live Class Actions
  scheduleLiveClass: (data: {
    title: string
    agenda?: string
    cohortName: string
    subjectName: string
    startTime: string
    durationMinutes: number
    provider: LiveClassSession['provider']
    customJoinUrl?: string
  }) => void
}

const CommunicationContext = createContext<CommunicationContextType | undefined>(undefined)

export function CommunicationProvider({ children }: { children: React.ReactNode }) {
  const { currentTenant } = useTenant()
  const { currentUser } = useAuth()
  const tenantId = currentTenant?.id || BRIGHT_TENANT_ID

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem(`educore_announcements_${tenantId}`)
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS
  })

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem(`educore_notifications_${tenantId}`)
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS
  })

  const [liveClasses, setLiveClasses] = useState<LiveClassSession[]>(() => {
    const saved = localStorage.getItem(`educore_live_classes_${tenantId}`)
    return saved ? JSON.parse(saved) : INITIAL_LIVE_CLASSES
  })

  // Synchronize from live Supabase on mount & tenant switch
  useEffect(() => {
    if (!isLiveSupabaseConfigured) return
    let isMounted = true

    async function loadCommunicationsData() {
      try {
        const [annRes, notifRes, liveRes] = await Promise.all([
          supabase.from('announcements').select('*').eq('institution_id', tenantId).order('created_at', { ascending: false }),
          supabase.from('notifications').select('*').eq('institution_id', tenantId).order('created_at', { ascending: false }),
          supabase.from('live_classes').select('*').eq('institution_id', tenantId).order('start_time', { ascending: true }),
        ])

        if (isMounted) {
          if (annRes.data && annRes.data.length > 0) setAnnouncements(annRes.data as Announcement[])
          if (notifRes.data && notifRes.data.length > 0) setNotifications(notifRes.data as AppNotification[])
          if (liveRes.data && liveRes.data.length > 0) setLiveClasses(liveRes.data as LiveClassSession[])
        }
      } catch (err) {
        console.info('Supabase communications sync notice:', err)
      }
    }

    loadCommunicationsData()

    return () => {
      isMounted = false
    }
  }, [tenantId])

  useEffect(() => {
    if (!currentTenant) return
    localStorage.setItem(`educore_announcements_${tenantId}`, JSON.stringify(announcements))
    localStorage.setItem(`educore_notifications_${tenantId}`, JSON.stringify(notifications))
    localStorage.setItem(`educore_live_classes_${tenantId}`, JSON.stringify(liveClasses))
  }, [announcements, notifications, liveClasses, currentTenant, tenantId])

  const unreadCount = notifications.filter((n) => !n.is_read).length

  const createAnnouncement = (data: {
    title: string
    content: string
    scope: Announcement['scope']
    cohortName?: string
    isUrgent: boolean
  }) => {
    const annId = `0192e85a-0140-7000-8000-${Date.now().toString(16).padStart(12, '0').slice(-12)}`
    const newAnn: Announcement = {
      id: annId,
      institution_id: tenantId,
      title: data.title,
      content: data.content,
      author_name: currentUser?.full_name || 'Administration',
      scope: data.scope,
      cohort_name: data.cohortName,
      is_urgent: data.isUrgent,
      created_at: new Date().toISOString(),
    }
    setAnnouncements((prev) => [newAnn, ...prev])

    // Generate in-app notification for users
    const notifId = `0192e85a-0150-7000-8000-${Date.now().toString(16).padStart(12, '0').slice(-12)}`
    const newNotif: AppNotification = {
      id: notifId,
      institution_id: tenantId,
      user_id: 'usr-student-bright',
      title: data.title,
      message: data.content.slice(0, 100) + '...',
      type: 'general',
      is_read: false,
      created_at: new Date().toISOString(),
    }
    setNotifications((prev) => [newNotif, ...prev])

    if (isLiveSupabaseConfigured) {
      supabase.from('announcements').insert([{
        id: newAnn.id,
        institution_id: newAnn.institution_id,
        title: newAnn.title,
        content: newAnn.content,
        scope: newAnn.scope,
        is_urgent: newAnn.is_urgent,
      }]).then(({ error }) => {
        if (error) console.info('Supabase announcement insert notice:', error.message)
      })

      supabase.from('notifications').insert([{
        id: newNotif.id,
        institution_id: newNotif.institution_id,
        title: newNotif.title,
        message: newNotif.message,
        type: newNotif.type,
        is_read: false,
      }]).then(({ error }) => {
        if (error) console.info('Supabase notification insert notice:', error.message)
      })
    }
  }

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    )
    if (isLiveSupabaseConfigured) {
      supabase.from('notifications').update({ is_read: true }).eq('id', id).then()
    }
  }

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
    if (isLiveSupabaseConfigured) {
      supabase.from('notifications').update({ is_read: true }).eq('institution_id', tenantId).then()
    }
  }

  const scheduleLiveClass = (data: {
    title: string
    agenda?: string
    cohortName: string
    subjectName: string
    startTime: string
    durationMinutes: number
    provider: LiveClassSession['provider']
    customJoinUrl?: string
  }) => {
    let joinUrl = data.customJoinUrl
    if (!joinUrl) {
      if (data.provider === 'jitsi') {
        const roomName = `EduCore-${tenantId.slice(-6)}-${data.title.replace(/\s+/g, '-')}-${Date.now().toString().slice(-4)}`
        joinUrl = `https://meet.jit.si/${roomName}`
      } else if (data.provider === 'google_meet') {
        joinUrl = 'https://meet.google.com/edu-live-session'
      } else {
        joinUrl = 'https://zoom.us/j/98712345678'
      }
    }

    const liveId = `0192e85a-0160-7000-8000-${Date.now().toString(16).padStart(12, '0').slice(-12)}`
    const newSession: LiveClassSession = {
      id: liveId,
      institution_id: tenantId,
      title: data.title,
      agenda: data.agenda,
      cohort_name: data.cohortName,
      subject_name: data.subjectName,
      host_teacher_name: currentUser?.full_name || 'Faculty Host',
      start_time: data.startTime,
      duration_minutes: data.durationMinutes,
      provider: data.provider,
      join_url: joinUrl,
      status: 'scheduled',
      participants_count: 0,
    }

    setLiveClasses((prev) => [newSession, ...prev])

    // Broadcast notification
    const notifId = `0192e85a-0150-7000-8000-${Date.now().toString(16).padStart(12, '0').slice(-12)}`
    const newNotif: AppNotification = {
      id: notifId,
      institution_id: tenantId,
      user_id: 'usr-student-bright',
      title: `Live Class Scheduled: ${data.title}`,
      message: `Join ${data.subjectName} with ${currentUser?.full_name || 'Faculty'} on ${new Date(data.startTime).toLocaleString()}.`,
      type: 'live_class',
      is_read: false,
      created_at: new Date().toISOString(),
    }
    setNotifications((prev) => [newNotif, ...prev])

    if (isLiveSupabaseConfigured) {
      supabase.from('live_classes').insert([{
        id: newSession.id,
        institution_id: newSession.institution_id,
        host_teacher_name: newSession.host_teacher_name,
        cohort_name: newSession.cohort_name,
        subject_name: newSession.subject_name,
        title: newSession.title,
        agenda: newSession.agenda,
        start_time: newSession.start_time,
        duration_minutes: newSession.duration_minutes,
        provider: newSession.provider,
        public_join_url: newSession.join_url,
        status: newSession.status,
      }]).then(({ error }) => {
        if (error) console.info('Supabase live_class insert notice:', error.message)
      })

      supabase.from('notifications').insert([{
        id: newNotif.id,
        institution_id: newNotif.institution_id,
        title: newNotif.title,
        message: newNotif.message,
        type: newNotif.type,
        is_read: false,
      }]).then()
    }
  }

  return (
    <CommunicationContext.Provider
      value={{
        announcements,
        notifications,
        liveClasses,
        unreadCount,
        createAnnouncement,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        scheduleLiveClass,
      }}
    >
      {children}
    </CommunicationContext.Provider>
  )
}

export function useCommunication() {
  const context = useContext(CommunicationContext)
  if (!context) {
    throw new Error('useCommunication must be used within a CommunicationProvider')
  }
  return context
}
