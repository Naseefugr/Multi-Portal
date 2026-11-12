import React, { useState } from 'react'
import { useOperations } from '@/contexts/operations-context'
import { useAcademic } from '@/contexts/academic-context'
import { useAuth } from '@/contexts/auth-context'
import {
  Award,
  Plus,
  Printer,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'

export function ExaminationsView() {
  const { examinations, examResults, createExamination, recordExamMarks } = useOperations()
  const { students, subjects } = useAcademic()
  const { userRole, currentUser } = useAuth()

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isRecordMarksOpen, setIsRecordMarksOpen] = useState(false)
  const [examForm, setExamForm] = useState({
    name: '',
    startDate: '',
    endDate: '',
  })

  // Marks Entry Form
  const [marksForm, setMarksForm] = useState({
    examId: examinations[0]?.id || 'ex-midterm-26',
    subjectId: subjects[0]?.id || '',
    studentId: students[0]?.id || '',
    marksObtained: 85,
    maxMarks: 100,
    passingMarks: 40,
    remarks: 'Consistent analytical presentation.',
  })

  const isStaffOrAdmin =
    userRole === 'institution_admin' || userRole === 'teacher' || userRole === 'manager'
  const isStudentOrParent = userRole === 'student' || userRole === 'parent'

  // Student specific results
  const myResults = examResults.filter(
    (r) =>
      r.student_name.toLowerCase().includes(currentUser?.full_name?.toLowerCase() || 'aarav') ||
      r.student_id === 'std-001'
  )

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!examForm.name || !examForm.startDate || !examForm.endDate) return

    createExamination(examForm.name, examForm.startDate, examForm.endDate)
    setIsCreateOpen(false)
    setExamForm({ name: '', startDate: '', endDate: '' })
  }

  const handleMarksSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const student = students.find((s) => s.id === marksForm.studentId)
    const subject = subjects.find((s) => s.id === marksForm.subjectId)
    if (!student || !subject) return

    recordExamMarks({
      examId: marksForm.examId,
      subjectId: subject.id,
      subjectName: subject.name,
      studentId: student.id,
      studentName: student.full_name,
      admissionNumber: student.admission_number,
      cohortName: student.cohort_name || 'Grade 10 - Section A',
      marksObtained: Number(marksForm.marksObtained),
      maxMarks: Number(marksForm.maxMarks),
      passingMarks: Number(marksForm.passingMarks),
      remarks: marksForm.remarks,
    })

    setIsRecordMarksOpen(false)
  }

  // Calculate totals for report card
  const totalMaxMarks = myResults.reduce((acc, r) => acc + r.max_marks, 0) || 100
  const totalObtainedMarks = myResults.reduce((acc, r) => acc + r.marks_obtained, 0)
  const cumulativePercentage = Math.round((totalObtainedMarks / totalMaxMarks) * 100)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Examinations, Performance & Grade Book
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Schedule formal examinations, record subject marks, and publish verified academic report cards.
          </p>
        </div>

        {isStaffOrAdmin && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsRecordMarksOpen(true)}
              className="text-xs"
            >
              <Award className="h-3.5 w-3.5 mr-1" /> Enter Student Marks
            </Button>
            <Button
              size="sm"
              onClick={() => setIsCreateOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
            >
              <Plus className="h-3.5 w-3.5 mr-1" /> Schedule Exam
            </Button>
          </div>
        )}
      </div>

      {/* STUDENT & PARENT VIEW: OFFICIAL REPORT CARD */}
      {isStudentOrParent ? (
        <Card className="border-2 border-primary/20 shadow-md max-w-3xl mx-auto">
          <CardHeader className="bg-muted/30 border-b p-6 text-center space-y-2">
            <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
              <Award className="h-6 w-6" />
            </div>
            <CardTitle className="text-xl font-extrabold text-foreground tracking-tight">
              Official Academic Performance Transcript
            </CardTitle>
            <CardDescription className="text-xs">
              Term 1 Mid-Year Examination • Session 2026–2027
            </CardDescription>

            <div className="p-3 bg-background rounded-md border text-xs grid grid-cols-2 sm:grid-cols-4 gap-2 text-left mt-3">
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Student Name</span>
                <strong className="text-foreground">Aarav Patel</strong>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Admission No</span>
                <strong className="text-primary font-mono">BVIS-2026-0104</strong>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Cohort</span>
                <strong className="text-foreground">Grade 10 - Section A</strong>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Verified Guardian</span>
                <strong className="text-foreground">Rajesh Patel</strong>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject Name</TableHead>
                  <TableHead>Max Marks</TableHead>
                  <TableHead>Passing Marks</TableHead>
                  <TableHead>Marks Scored</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Faculty Remarks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myResults.map((res) => (
                  <TableRow key={res.id}>
                    <TableCell className="font-semibold text-xs text-foreground">
                      {res.subject_name}
                    </TableCell>
                    <TableCell className="text-xs font-mono">{res.max_marks}</TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground">
                      {res.passing_marks}
                    </TableCell>
                    <TableCell className="text-sm font-bold text-foreground">
                      {res.marks_obtained}
                    </TableCell>
                    <TableCell>
                      <Badge variant="success" className="text-xs font-bold">
                        {res.grade_letter}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {res.remarks || 'Satisfactory'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Performance Summary Banner */}
            <div className="p-4 bg-muted/40 rounded-lg border flex items-center justify-between">
              <div>
                <span className="text-xs text-muted-foreground block">Aggregate Performance</span>
                <span className="text-2xl font-black text-foreground">
                  {cumulativePercentage}% (Grade A+)
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-xs flex items-center gap-1.5"
                onClick={() => window.print()}
              >
                <Printer className="h-4 w-4" /> Print Report Card
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* STAFF & ADMIN VIEW: EXAMS DIRECTORY */
        <div className="space-y-4">
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-base font-bold">Scheduled Examination Cycles</CardTitle>
              <CardDescription className="text-xs">
                Active examination periods and grade boundaries.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Exam Title</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Results Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {examinations.map((ex) => (
                    <TableRow key={ex.id}>
                      <TableCell className="font-semibold text-sm">{ex.name}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{ex.start_date}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{ex.end_date}</TableCell>
                      <TableCell>
                        <Badge variant="success" className="text-[10px] uppercase font-bold">
                          {ex.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-xs text-primary"
                          onClick={() => setIsRecordMarksOpen(true)}
                        >
                          Grade Book Entries
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* MODAL: CREATE EXAM */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent onClose={() => setIsCreateOpen(false)}>
          <DialogHeader>
            <DialogTitle>Schedule New Examination</DialogTitle>
            <DialogDescription>Define an academic evaluation period.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateSubmit} className="space-y-4 py-2">
            <div className="space-y-1">
              <Label>Examination Name *</Label>
              <Input
                placeholder="e.g. Term 2 Annual Final Examination"
                value={examForm.name}
                onChange={(e) => setExamForm({ ...examForm, name: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Start Date *</Label>
                <Input
                  type="date"
                  value={examForm.startDate}
                  onChange={(e) => setExamForm({ ...examForm, startDate: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1">
                <Label>End Date *</Label>
                <Input
                  type="date"
                  value={examForm.endDate}
                  onChange={(e) => setExamForm({ ...examForm, endDate: e.target.value })}
                  required
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                Create Examination
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL: RECORD STUDENT MARKS */}
      <Dialog open={isRecordMarksOpen} onOpenChange={setIsRecordMarksOpen}>
        <DialogContent onClose={() => setIsRecordMarksOpen(false)}>
          <DialogHeader>
            <DialogTitle>Enter Student Examination Marks</DialogTitle>
            <DialogDescription>
              Score student answers; letter grade is calculated automatically.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleMarksSubmit} className="space-y-4 py-2">
            <div className="space-y-1">
              <Label>Student *</Label>
              <Select
                value={marksForm.studentId}
                onChange={(e) => setMarksForm({ ...marksForm, studentId: e.target.value })}
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.full_name} ({s.admission_number})
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-1">
              <Label>Subject *</Label>
              <Select
                value={marksForm.subjectId}
                onChange={(e) => setMarksForm({ ...marksForm, subjectId: e.target.value })}
              >
                {subjects.map((sbj) => (
                  <option key={sbj.id} value={sbj.id}>
                    {sbj.name} ({sbj.code})
                  </option>
                ))}
              </Select>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label>Marks Scored *</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={marksForm.marksObtained}
                  onChange={(e) => setMarksForm({ ...marksForm, marksObtained: Number(e.target.value) })}
                  required
                />
              </div>

              <div className="space-y-1">
                <Label>Max Marks</Label>
                <Input
                  type="number"
                  value={marksForm.maxMarks}
                  onChange={(e) => setMarksForm({ ...marksForm, maxMarks: Number(e.target.value) })}
                />
              </div>

              <div className="space-y-1">
                <Label>Passing Marks</Label>
                <Input
                  type="number"
                  value={marksForm.passingMarks}
                  onChange={(e) => setMarksForm({ ...marksForm, passingMarks: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label>Faculty Remarks</Label>
              <Input
                placeholder="e.g. Excellent command over algebraic proofs."
                value={marksForm.remarks}
                onChange={(e) => setMarksForm({ ...marksForm, remarks: e.target.value })}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsRecordMarksOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                Record Marks
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
