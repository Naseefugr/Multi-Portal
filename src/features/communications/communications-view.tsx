import React, { useState } from 'react'
import { useCommunication } from '@/contexts/communication-context'
import { useAcademic } from '@/contexts/academic-context'
import { useAuth } from '@/contexts/auth-context'
import type { Announcement } from '@/types/database.types'
import {
  Bell,
  Megaphone,
  Plus,
  AlertTriangle,
  Calendar,
  Check,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'

export function CommunicationsView() {
  const {
    announcements,
    notifications,
    unreadCount,
    createAnnouncement,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  } = useCommunication()
  const { sections, batches } = useAcademic()
  const { userRole } = useAuth()

  const [activeTab, setActiveTab] = useState('announcements')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [form, setForm] = useState({
    title: '',
    content: '',
    scope: 'all' as Announcement['scope'],
    cohortName: sections[0]?.name || 'Grade 10 - Section A',
    isUrgent: false,
  })

  const canAnnounce =
    userRole === 'institution_admin' || userRole === 'teacher' || userRole === 'manager'

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.content) return

    createAnnouncement({
      title: form.title,
      content: form.content,
      scope: form.scope,
      cohortName: form.scope === 'cohort' ? form.cohortName : undefined,
      isUrgent: form.isUrgent,
    })

    setIsCreateOpen(false)
    setForm({
      title: '',
      content: '',
      scope: 'all',
      cohortName: sections[0]?.name || 'Grade 10 - Section A',
      isUrgent: false,
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Omnichannel Communications & Notification Center
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Institution-wide broadcasts, cohort alerts, and in-app push notifications.
          </p>
        </div>

        {canAnnounce && (
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
          >
            <Plus className="h-3.5 w-3.5 mr-1" /> New Broadcast Announcement
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="announcements" className="flex items-center gap-1.5 text-xs">
            <Megaphone className="h-4 w-4" /> Announcements ({announcements.length})
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-1.5 text-xs">
            <Bell className="h-4 w-4" /> In-App Notification Bell
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-1 px-1.5 py-0 text-[10px]">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: ANNOUNCEMENTS */}
        <TabsContent value="announcements" className="space-y-4 pt-3">
          {announcements.map((ann) => (
            <Card
              key={ann.id}
              className={`border transition-all ${
                ann.is_urgent ? 'border-destructive/40 bg-red-50/20' : 'hover:shadow-sm'
              }`}
            >
              <CardHeader className="p-4 sm:p-5 pb-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {ann.is_urgent && (
                      <Badge variant="destructive" className="text-[10px] uppercase flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" /> Urgent Notice
                      </Badge>
                    )}
                    <Badge variant="secondary" className="text-xs capitalize">
                      Scope: {ann.scope} {ann.cohort_name ? `(${ann.cohort_name})` : ''}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(ann.created_at).toLocaleDateString()}
                  </span>
                </div>

                <CardTitle className="text-base sm:text-lg font-bold text-foreground mt-2">
                  {ann.title}
                </CardTitle>
                <CardDescription className="text-xs">
                  Announced by: <strong className="text-foreground">{ann.author_name}</strong>
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-5 pt-2">
                <p className="text-sm text-foreground/90 whitespace-pre-line leading-relaxed">
                  {ann.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* TAB 2: IN-APP NOTIFICATIONS */}
        <TabsContent value="notifications" className="pt-3 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Real-time user alerts triggered by assignments, attendance logs, and fee events.
            </p>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-primary h-7"
                onClick={markAllNotificationsAsRead}
              >
                <Check className="h-3.5 w-3.5 mr-1" /> Mark All as Read
              </Button>
            )}
          </div>

          <div className="divide-y border rounded-lg bg-card">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-4 flex items-start justify-between gap-3 transition-colors ${
                  notif.is_read ? 'bg-card' : 'bg-blue-50/40'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 p-2 rounded-full ${
                      notif.is_read ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary'
                    }`}
                  >
                    <Bell className="h-4 w-4" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-foreground">{notif.title}</span>
                      {!notif.is_read && (
                        <span className="h-2 w-2 rounded-full bg-blue-600" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{notif.message}</p>
                    <span className="text-[10px] text-muted-foreground block pt-1">
                      {new Date(notif.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>

                {!notif.is_read && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs text-muted-foreground"
                    onClick={() => markNotificationAsRead(notif.id)}
                  >
                    Mark Read
                  </Button>
                )}
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* MODAL: NEW ANNOUNCEMENT */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent onClose={() => setIsCreateOpen(false)}>
          <DialogHeader>
            <DialogTitle>Broadcast New Announcement</DialogTitle>
            <DialogDescription>
              Deliver communication to students, faculty, or guardians.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateSubmit} className="space-y-4 py-2">
            <div className="space-y-1">
              <Label>Announcement Headline *</Label>
              <Input
                placeholder="e.g. Schedule for Sports Day Qualifications"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-1">
              <Label>Audience Scope *</Label>
              <Select
                value={form.scope}
                onChange={(e) =>
                  setForm({ ...form, scope: e.target.value as Announcement['scope'] })
                }
              >
                <option value="all">Entire Institution (All Members)</option>
                <option value="students">Students Only</option>
                <option value="teachers">Faculty / Teachers Only</option>
                <option value="parents">Guardians / Parents Only</option>
                <option value="cohort">Specific Class / Batch Only</option>
              </Select>
            </div>

            {form.scope === 'cohort' && (
              <div className="space-y-1">
                <Label>Target Cohort *</Label>
                <Select
                  value={form.cohortName}
                  onChange={(e) => setForm({ ...form, cohortName: e.target.value })}
                >
                  {sections.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                  {batches.map((b) => (
                    <option key={b.id} value={b.name}>
                      {b.name}
                    </option>
                  ))}
                </Select>
              </div>
            )}

            <div className="space-y-1">
              <Label>Message Content *</Label>
              <textarea
                rows={4}
                placeholder="Compose announcement body..."
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                required
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="urgent-notice"
                checked={form.isUrgent}
                onChange={(e) => setForm({ ...form, isUrgent: e.target.checked })}
                className="rounded border-input h-4 w-4 text-destructive focus:ring-destructive"
              />
              <Label htmlFor="urgent-notice" className="cursor-pointer font-medium text-xs text-destructive">
                Mark as high-priority urgent announcement
              </Label>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                Dispatch Broadcast
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
