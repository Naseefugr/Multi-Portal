import React, { useState } from 'react'
import { useCommunication } from '@/contexts/communication-context'
import { useAcademic } from '@/contexts/academic-context'
import { useAuth } from '@/contexts/auth-context'
import type { LiveClassSession } from '@/types/database.types'
import {
  Clock,
  Plus,
  Users,
  ExternalLink,
  ShieldAlert,
  Play,
  Monitor,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'

export function LiveClassesView() {
  const { liveClasses, scheduleLiveClass } = useCommunication()
  const { sections, batches, subjects } = useAcademic()
  const { userRole } = useAuth()

  const [isScheduleOpen, setIsScheduleOpen] = useState(false)
  const [activeMeetingRoom, setActiveMeetingRoom] = useState<LiveClassSession | null>(null)

  const [form, setForm] = useState({
    title: '',
    agenda: '',
    cohortName: sections[0]?.name || 'Grade 10 - Section A',
    subjectName: subjects[0]?.name || 'Mathematics',
    startTime: '2026-11-18T10:00',
    durationMinutes: 45,
    provider: 'jitsi' as LiveClassSession['provider'],
  })

  const canSchedule =
    userRole === 'institution_admin' || userRole === 'teacher' || userRole === 'manager'

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title) return

    scheduleLiveClass({
      title: form.title,
      agenda: form.agenda,
      cohortName: form.cohortName,
      subjectName: form.subjectName,
      startTime: form.startTime,
      durationMinutes: form.durationMinutes,
      provider: form.provider,
    })

    setIsScheduleOpen(false)
    setForm({
      title: '',
      agenda: '',
      cohortName: sections[0]?.name || 'Grade 10 - Section A',
      subjectName: subjects[0]?.name || 'Mathematics',
      startTime: '2026-11-18T10:00',
      durationMinutes: 45,
      provider: 'jitsi',
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Virtual Live Classes & Video Infrastructure
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Agnostic meeting provider integration (Zoom, Google Meet, Jitsi) with secure host credential isolation.
          </p>
        </div>

        {canSchedule && (
          <Button
            onClick={() => setIsScheduleOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
          >
            <Plus className="h-3.5 w-3.5 mr-1" /> Schedule Live Classroom
          </Button>
        )}
      </div>

      {/* Security Architecture Notice */}
      <div className="bg-indigo-50/70 border border-indigo-200 rounded-lg p-3 text-xs text-indigo-900 space-y-1">
        <span className="font-semibold flex items-center gap-1.5 text-indigo-950">
          <ShieldAlert className="h-4 w-4 text-indigo-700" />
          Agnostic Provider Credential Isolation:
        </span>
        <p>
          Students receive solely signed temporary join URLs. Host API tokens, Zoom JWT keys, and administrative moderation links are kept strictly isolated on the backend.
        </p>
      </div>

      {/* Live Sessions List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {liveClasses.map((sess) => (
          <Card key={sess.id} className="border shadow-sm flex flex-col justify-between">
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-semibold text-xs text-primary">
                    {sess.subject_name}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {sess.cohort_name}
                  </Badge>
                </div>
                <Badge variant="default" className="text-[10px] uppercase font-bold bg-blue-600">
                  {sess.provider}
                </Badge>
              </div>

              <CardTitle className="text-base sm:text-lg font-bold text-foreground mt-2">
                {sess.title}
              </CardTitle>
              <CardDescription className="text-xs">
                Host Faculty: <strong className="text-foreground">{sess.host_teacher_name}</strong>
              </CardDescription>
            </CardHeader>

            <CardContent className="p-4 pt-1 space-y-3">
              {sess.agenda && (
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {sess.agenda}
                </p>
              )}

              <div className="p-2.5 bg-muted/40 rounded-md border text-xs flex items-center justify-between text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                  <span>
                    {new Date(sess.start_time).toLocaleDateString()} at{' '}
                    {new Date(sess.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <span>Duration: {sess.duration_minutes} mins</span>
              </div>

              <div className="pt-2 border-t flex items-center justify-between">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Users className="h-3.5 w-3.5 text-primary" /> Max Seats: 50 Students
                </span>

                <Button
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs flex items-center gap-1.5"
                  onClick={() => setActiveMeetingRoom(sess)}
                >
                  <Play className="h-3.5 w-3.5" /> Launch Classroom
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* MODAL: SCHEDULE LIVE CLASS */}
      <Dialog open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
        <DialogContent onClose={() => setIsScheduleOpen(false)} className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Schedule Virtual Live Classroom</DialogTitle>
            <DialogDescription>
              Create a live interactive video session for your assigned student cohort.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleScheduleSubmit} className="space-y-4 py-2">
            <div className="space-y-1">
              <Label>Session Title / Topic *</Label>
              <Input
                placeholder="e.g. Organic Chemistry — Alkanes & Isomerism Live Demo"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

              <div className="space-y-1">
                <Label>Subject Curriculum *</Label>
                <Select
                  value={form.subjectName}
                  onChange={(e) => setForm({ ...form, subjectName: e.target.value })}
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1 sm:col-span-2">
                <Label>Date & Time *</Label>
                <Input
                  type="datetime-local"
                  value={form.startTime}
                  onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1">
                <Label>Duration (Mins)</Label>
                <Input
                  type="number"
                  value={form.durationMinutes}
                  onChange={(e) => setForm({ ...form, durationMinutes: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label>Video Conferencing Provider *</Label>
              <Select
                value={form.provider}
                onChange={(e) =>
                  setForm({ ...form, provider: e.target.value as LiveClassSession['provider'] })
                }
              >
                <option value="jitsi">Jitsi Meet (Embedded Secure Video — No Keys Required)</option>
                <option value="google_meet">Google Meet (Cloud Integration)</option>
                <option value="zoom">Zoom Video SDK</option>
              </Select>
            </div>

            <div className="space-y-1">
              <Label>Session Agenda & Preparation Notes</Label>
              <textarea
                rows={3}
                placeholder="What topics will be covered? Any prerequisites..."
                value={form.agenda}
                onChange={(e) => setForm({ ...form, agenda: e.target.value })}
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsScheduleOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                Schedule Session
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL: LIVE MEETING ROOM LAUNCHER */}
      {activeMeetingRoom && (
        <Dialog open={Boolean(activeMeetingRoom)} onOpenChange={() => setActiveMeetingRoom(null)}>
          <DialogContent onClose={() => setActiveMeetingRoom(null)} className="max-w-3xl">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle>{activeMeetingRoom.title}</DialogTitle>
                <Badge variant="outline" className="uppercase font-bold text-xs">
                  {activeMeetingRoom.provider} Provider
                </Badge>
              </div>
              <DialogDescription>
                Subject: {activeMeetingRoom.subject_name} • Cohort: {activeMeetingRoom.cohort_name} • Host:{' '}
                {activeMeetingRoom.host_teacher_name}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              {/* Virtual Classroom Frame Simulation */}
              <div className="aspect-video w-full rounded-lg bg-slate-900 flex flex-col items-center justify-center text-white p-6 text-center space-y-4 relative overflow-hidden">
                <div className="w-16 h-16 rounded-full bg-blue-600/30 flex items-center justify-center text-blue-400">
                  <Monitor className="h-8 w-8 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Live Virtual Classroom Active</h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                    Connected to secure end-to-end encrypted video bridge. Participant audio and video feeds are active.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href={activeMeetingRoom.join_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-md shadow"
                  >
                    <ExternalLink className="h-4 w-4" /> Open Full-Screen Interactive Room
                  </a>
                </div>

                <div className="absolute bottom-2 left-4 text-[10px] text-slate-400 font-mono">
                  Room URL: {activeMeetingRoom.join_url}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setActiveMeetingRoom(null)}>
                Exit Classroom
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
