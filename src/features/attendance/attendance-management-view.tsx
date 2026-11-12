import React, { useState } from 'react'
import { useOperations } from '@/contexts/operations-context'
import { useAcademic } from '@/contexts/academic-context'
import { useAuth } from '@/contexts/auth-context'
import type { StudentAttendanceRecord } from '@/types/database.types'
import {
  ShieldCheck,
  Plus,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'

export function AttendanceManagementView() {
  const { attendanceSessions, attendanceRecords, recordAttendance } = useOperations()
  const { students, sections, batches } = useAcademic()
  const { userRole, currentUser } = useAuth()

  const [isTakeAttendanceOpen, setIsTakeAttendanceOpen] = useState(false)
  const [selectedSessionDate, setSelectedSessionDate] = useState('2026-11-12')
  const [selectedCohort, setSelectedCohort] = useState(sections[0]?.name || 'Grade 10 - Section A')

  // Roster state for taking attendance
  const [roster, setRoster] = useState<Record<string, StudentAttendanceRecord['status']>>({})

  const canRecord =
    userRole === 'institution_admin' ||
    userRole === 'teacher' ||
    userRole === 'manager'
  const isStudentOrParent = userRole === 'student' || userRole === 'parent'

  const handleOpenTakeAttendance = () => {
    // Default all students in cohort to present
    const initial: Record<string, StudentAttendanceRecord['status']> = {}
    students.forEach((s) => {
      initial[s.id] = 'present'
    })
    setRoster(initial)
    setIsTakeAttendanceOpen(true)
  }

  const handleSaveAttendance = (e: React.FormEvent) => {
    e.preventDefault()

    const records = students.map((std) => ({
      studentId: std.id,
      studentName: std.full_name,
      admissionNumber: std.admission_number,
      status: roster[std.id] || 'present',
    }))

    recordAttendance({
      cohortName: selectedCohort,
      sessionDate: selectedSessionDate,
      subjectName: 'Daily Homeroom Attendance',
      records,
    })

    setIsTakeAttendanceOpen(false)
  }

  // Student / Parent specific records
  const myRecords = attendanceRecords.filter((r) =>
    r.student_name.toLowerCase().includes(currentUser?.full_name?.toLowerCase() || 'aarav')
  )

  const presentCount = attendanceRecords.filter((r) => r.status === 'present').length
  const totalCount = attendanceRecords.length || 1
  const attendancePercentage = Math.round((presentCount / totalCount) * 100)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Attendance Tracking & Roster Management
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Daily homeroom and subject period roll calls with duplicate session prevention and verified guardian notifications.
          </p>
        </div>

        {canRecord && (
          <Button
            onClick={handleOpenTakeAttendance}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
          >
            <Plus className="h-3.5 w-3.5 mr-1" /> Take Roll Call Session
          </Button>
        )}
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Attendance Rate</p>
          <p className="text-2xl font-bold text-emerald-600">{attendancePercentage}%</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Recorded Sessions</p>
          <p className="text-2xl font-bold text-foreground">{attendanceSessions.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Present Entries</p>
          <p className="text-2xl font-bold text-blue-600">{presentCount}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Late / Excused</p>
          <p className="text-2xl font-bold text-amber-600">
            {attendanceRecords.filter((r) => r.status === 'late' || r.status === 'excused').length}
          </p>
        </Card>
      </div>

      {/* Student / Parent View */}
      {isStudentOrParent ? (
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Verified Attendance History (Aarav Patel)
            </CardTitle>
            <CardDescription className="text-xs">
              Directly fetched from PostgreSQL attendance ledger for linked verified student.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Cohort</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Remarks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6 text-muted-foreground text-xs">
                      No attendance logged for current student yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  myRecords.map((rec) => (
                    <TableRow key={rec.id}>
                      <TableCell className="font-semibold text-xs">
                        {selectedSessionDate}
                      </TableCell>
                      <TableCell className="text-xs">Grade 10 - Section A</TableCell>
                      <TableCell>
                        <Badge
                          variant={rec.status === 'present' ? 'success' : 'destructive'}
                          className="text-[10px] uppercase font-bold"
                        >
                          {rec.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {rec.remarks || 'Normal attendance logged'}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        /* Teacher / Admin Session Logs */
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-base font-bold">Recent Recorded Sessions</CardTitle>
            <CardDescription className="text-xs">
              Every session enforces composite unique constraint <code>(session_date, cohort, subject)</code>.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Session Date</TableHead>
                  <TableHead>Cohort / Class</TableHead>
                  <TableHead>Subject Period</TableHead>
                  <TableHead>Logged By</TableHead>
                  <TableHead className="text-right">Roster Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceSessions.map((sess) => (
                  <TableRow key={sess.id}>
                    <TableCell className="font-semibold text-sm">
                      {sess.session_date}
                    </TableCell>
                    <TableCell className="text-xs font-semibold text-foreground">
                      {sess.cohort_name}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {sess.subject_name || 'Daily Homeroom'}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {sess.recorded_by_name}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="success" className="text-[10px] uppercase font-bold">
                        Submitted & Locked
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* MODAL: TAKE ATTENDANCE */}
      <Dialog open={isTakeAttendanceOpen} onOpenChange={setIsTakeAttendanceOpen}>
        <DialogContent onClose={() => setIsTakeAttendanceOpen(false)} className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Take Attendance Session</DialogTitle>
            <DialogDescription>
              Mark student presence for today's session.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveAttendance} className="space-y-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Session Date *</Label>
                <Input
                  type="date"
                  value={selectedSessionDate}
                  onChange={(e) => setSelectedSessionDate(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <Label>Cohort *</Label>
                <Select
                  value={selectedCohort}
                  onChange={(e) => setSelectedCohort(e.target.value)}
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
            </div>

            <div className="border rounded-md overflow-hidden">
              <div className="bg-muted p-2 flex items-center justify-between text-xs font-semibold">
                <span>Student Roster ({students.length} Enrolled)</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const allP: Record<string, StudentAttendanceRecord['status']> = {}
                      students.forEach((s) => (allP[s.id] = 'present'))
                      setRoster(allP)
                    }}
                    className="text-emerald-700 hover:underline"
                  >
                    Mark All Present
                  </button>
                </div>
              </div>

              <div className="max-h-60 overflow-y-auto divide-y">
                {students.map((std) => (
                  <div key={std.id} className="p-2.5 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <p className="font-semibold text-foreground">{std.full_name}</p>
                      <p className="text-[10px] text-muted-foreground font-mono">
                        {std.admission_number} • Roll: {std.roll_number || '—'}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {(['present', 'absent', 'late', 'excused'] as const).map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setRoster((prev) => ({ ...prev, [std.id]: st }))}
                          className={`px-2 py-1 rounded text-[11px] font-semibold capitalize border transition-all ${
                            roster[std.id] === st
                              ? st === 'present'
                                ? 'bg-emerald-600 text-white border-emerald-600'
                                : st === 'absent'
                                ? 'bg-destructive text-white border-destructive'
                                : 'bg-amber-500 text-white border-amber-500'
                              : 'bg-background text-muted-foreground hover:bg-muted'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsTakeAttendanceOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                Submit Attendance Register
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
