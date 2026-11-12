import React, { createContext, useContext, useState, useEffect } from 'react'
import type { Announcement, AppNotification, LiveClassSession } from '@/types/database.types'
import {
  INITIAL_ANNOUNCEMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_LIVE_CLASSES,
} from '@/services/mock-data'
import { useTenant } from '@/contexts/tenant-context'
import { useAuth } from '@/contexts/auth-context'

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
  const tenantId = currentTenant?.id || 'inst-001-bright'

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
    const newAnn: Announcement = {
      id: `ann-${Date.now()}`,
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
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      institution_id: tenantId,
      user_id: 'usr-student-bright',
      title: data.title,
      message: data.content.slice(0, 100) + '...',
      type: 'general',
      is_read: false,
      created_at: new Date().toISOString(),
    }
    setNotifications((prev) => [newNotif, ...prev])
  }

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    )
  }

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
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

    const newSession: LiveClassSession = {
      id: `live-${Date.now()}`,
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
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      institution_id: tenantId,
      user_id: 'usr-student-bright',
      title: `Live Class Scheduled: ${data.title}`,
      message: `Join ${data.subjectName} with ${currentUser?.full_name || 'Faculty'} on ${new Date(data.startTime).toLocaleString()}.`,
      type: 'live_class',
      is_read: false,
      created_at: new Date().toISOString(),
    }
    setNotifications((prev) => [newNotif, ...prev])
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
