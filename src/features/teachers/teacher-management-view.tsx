import React, { useState } from 'react'
import { useAcademic } from '@/contexts/academic-context'
import { useAuth } from '@/contexts/auth-context'
import {
  BookOpen,
  Plus,
  UserCheck,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'

export function TeacherManagementView() {
  const { teacherAssignments, subjects, sections, batches, assignTeacher } = useAcademic()
  const { userRole } = useAuth()

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
  const [form, setForm] = useState({
    teacherName: 'Prof. David Wilson',
    teacherId: 'mem-teacher-bright',
    subjectId: subjects[0]?.id || '',
    cohortType: 'section' as 'section' | 'batch',
    cohortId: sections[0]?.id || '',
  })

  const canAssign = userRole === 'institution_admin'

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const subject = subjects.find((s) => s.id === form.subjectId)
    if (!subject) return

    let cohortName = ''
    let secId: string | undefined = undefined
    let btcId: string | undefined = undefined

    if (form.cohortType === 'section') {
      const sec = sections.find((s) => s.id === form.cohortId)
      cohortName = sec ? sec.name : 'Section'
      secId = form.cohortId
    } else {
      const btc = batches.find((b) => b.id === form.cohortId)
      cohortName = btc ? btc.name : 'Batch'
      btcId = form.cohortId
    }

    assignTeacher({
      teacherId: form.teacherId,
      teacherName: form.teacherName,
      subjectId: subject.id,
      subjectName: subject.name,
      sectionId: secId,
      batchId: btcId,
      cohortName,
    })

    setIsAssignModalOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Faculty Directory & Academic Allocations
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Manage teacher profiles and assign pedagogical responsibilities across classes and subjects.
          </p>
        </div>

        {canAssign && (
          <Button
            onClick={() => setIsAssignModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
          >
            <Plus className="h-3.5 w-3.5 mr-1" /> Assign Teacher to Cohort
          </Button>
        )}
      </div>

      {/* Allocations Table */}
      <Card>
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-base font-bold">Active Teaching Allocations</CardTitle>
          <CardDescription className="text-xs">
            Teachers can publish posts, formulate assignments, and take attendance only for their authorized allocations.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Teacher Name</TableHead>
                <TableHead>Subject Responsibility</TableHead>
                <TableHead>Assigned Class / Batch</TableHead>
                <TableHead>Authority Scope</TableHead>
                <TableHead className="text-right">Allocation Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teacherAssignments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground text-xs">
                    No active teacher assignments. Click "Assign Teacher to Cohort" to allocate.
                  </TableCell>
                </TableRow>
              ) : (
                teacherAssignments.map((tas) => (
                  <TableRow key={tas.id}>
                    <TableCell className="font-semibold text-foreground text-sm">
                      <div className="flex items-center gap-2">
                        <UserCheck className="h-4 w-4 text-primary" />
                        <span>{tas.teacher_name || 'Faculty Member'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-medium text-xs">
                        <BookOpen className="h-3 w-3 mr-1 text-primary" />
                        {tas.subject_name || 'Mathematics'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs font-semibold text-foreground">
                      {tas.cohort_name || 'Assigned Cohort'}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      Class Posts, Attendance, Gradebook
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="success" className="text-[10px]">
                        Authorized
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* MODAL: ASSIGN TEACHER */}
      <Dialog open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
        <DialogContent onClose={() => setIsAssignModalOpen(false)}>
          <DialogHeader>
            <DialogTitle>Assign Teacher to Academic Cohort</DialogTitle>
            <DialogDescription>
              Grant faculty permission to manage attendance, post materials, and grade assignments for a class.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAssignSubmit} className="space-y-4 py-2">
            <div className="space-y-1">
              <Label>Select Teacher *</Label>
              <Select
                value={form.teacherName}
                onChange={(e) => setForm({ ...form, teacherName: e.target.value })}
              >
                <option value="Prof. David Wilson">Prof. David Wilson (Senior Math Faculty)</option>
                <option value="Dr. Radhika Sen">Dr. Radhika Sen (Physics Department Head)</option>
                <option value="Mr. James Carter">Mr. James Carter (Chemistry Faculty)</option>
              </Select>
            </div>

            <div className="space-y-1">
              <Label>Subject *</Label>
              <Select
                value={form.subjectId}
                onChange={(e) => setForm({ ...form, subjectId: e.target.value })}
              >
                {subjects.map((sbj) => (
                  <option key={sbj.id} value={sbj.id}>
                    {sbj.name} ({sbj.code})
                  </option>
                ))}
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Cohort Taxonomy</Label>
                <Select
                  value={form.cohortType}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      cohortType: e.target.value as 'section' | 'batch',
                      cohortId: e.target.value === 'section' ? sections[0]?.id || '' : batches[0]?.id || '',
                    })
                  }
                >
                  <option value="section">School Section</option>
                  <option value="batch">Coaching Batch</option>
                </Select>
              </div>

              <div className="space-y-1">
                <Label>Target Cohort *</Label>
                <Select
                  value={form.cohortId}
                  onChange={(e) => setForm({ ...form, cohortId: e.target.value })}
                >
                  {form.cohortType === 'section'
                    ? sections.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))
                    : batches.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name}
                        </option>
                      ))}
                </Select>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsAssignModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                Authorize Assignment
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
