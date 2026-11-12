import React, { useState } from 'react'
import { useLearning } from '@/contexts/learning-context'
import { useAcademic } from '@/contexts/academic-context'
import { useAuth } from '@/contexts/auth-context'
import type { Assignment, AssignmentSubmission } from '@/types/database.types'
import {
  FileCheck,
  Clock,
  Plus,
  Upload,
  CheckCircle2,
  FileText,
  Users,
  Award,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'

export function AssignmentsManagementView() {
  const { assignments, submissions, createAssignment, submitAssignment, gradeSubmission } =
    useLearning()
  const { sections, batches, subjects } = useAcademic()
  const { userRole, currentUser } = useAuth()

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [selectedAssignmentForSubmission, setSelectedAssignmentForSubmission] =
    useState<Assignment | null>(null)
  const [selectedAssignmentForReview, setSelectedAssignmentForReview] =
    useState<Assignment | null>(null)
  const [selectedSubmissionToGrade, setSelectedSubmissionToGrade] =
    useState<AssignmentSubmission | null>(null)

  // Creation Form
  const [asgForm, setAsgForm] = useState({
    title: '',
    instructions: '',
    cohortName: sections[0]?.name || 'Grade 10 - Section A',
    subjectId: subjects[0]?.id || '',
    subjectName: subjects[0]?.name || 'Mathematics',
    maxMarks: 100,
    deadline: '2026-11-25T23:59',
    allowLate: false,
  })

  // Student Submission Form
  const [submissionForm, setSubmissionForm] = useState({
    text: '',
    fileName: '',
  })

  // Grading Form
  const [gradingForm, setGradingForm] = useState({
    marks: 85,
    feedback: 'Good overall approach. Solid reasoning.',
  })

  const isTeacherOrAdmin =
    userRole === 'institution_admin' || userRole === 'teacher' || userRole === 'manager'
  const isStudent = userRole === 'student'

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!asgForm.title) return

    createAssignment({
      title: asgForm.title,
      instructions: asgForm.instructions,
      cohortName: asgForm.cohortName,
      subjectId: asgForm.subjectId,
      subjectName: asgForm.subjectName,
      maxMarks: asgForm.maxMarks,
      deadline: asgForm.deadline,
      allowLate: asgForm.allowLate,
    })

    setIsCreateOpen(false)
    setAsgForm({
      title: '',
      instructions: '',
      cohortName: sections[0]?.name || 'Grade 10 - Section A',
      subjectId: subjects[0]?.id || '',
      subjectName: subjects[0]?.name || 'Mathematics',
      maxMarks: 100,
      deadline: '2026-11-25T23:59',
      allowLate: false,
    })
  }

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedAssignmentForSubmission) return

    submitAssignment({
      assignmentId: selectedAssignmentForSubmission.id,
      submissionText: submissionForm.text,
      attachmentFileName: submissionForm.fileName,
    })

    setSelectedAssignmentForSubmission(null)
    setSubmissionForm({ text: '', fileName: '' })
  }

  const handleGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSubmissionToGrade) return

    gradeSubmission({
      submissionId: selectedSubmissionToGrade.id,
      marksObtained: Number(gradingForm.marks),
      maxMarks: 100,
      feedback: gradingForm.feedback,
    })

    setSelectedSubmissionToGrade(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Assignment Management & Grading Workflow
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Formulate curriculum assignments, enforce server-side deadline rules, and evaluate student submissions.
          </p>
        </div>

        {isTeacherOrAdmin && (
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
          >
            <Plus className="h-3.5 w-3.5 mr-1" /> Formulate New Assignment
          </Button>
        )}
      </div>

      {/* Assignment List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {assignments.map((asg) => {
          const assignmentSubs = submissions.filter((s) => s.assignment_id === asg.id)
          const mySubmission = submissions.find(
            (s) => s.assignment_id === asg.id && s.student_name === (currentUser?.full_name || 'Aarav Patel')
          )
          const isOverdue = new Date(asg.deadline).getTime() < Date.now()

          return (
            <Card key={asg.id} className="border shadow-sm flex flex-col justify-between">
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline" className="font-semibold text-xs text-primary">
                    {asg.subject_name}
                  </Badge>
                  <div className="flex items-center gap-1.5">
                    {asg.allow_late_submissions ? (
                      <Badge variant="secondary" className="text-[10px]">Late Allowed</Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px] text-muted-foreground">Strict Deadline</Badge>
                    )}
                    <Badge variant="success" className="text-[10px] uppercase font-bold">
                      {asg.status}
                    </Badge>
                  </div>
                </div>

                <CardTitle className="text-base font-bold text-foreground mt-2">
                  {asg.title}
                </CardTitle>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Cohort: {asg.cohort_name}</span>
                  <span>•</span>
                  <span>Max Marks: {asg.max_marks} pts</span>
                </div>
              </CardHeader>

              <CardContent className="p-4 pt-1 space-y-3">
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {asg.instructions}
                </p>

                <div className="p-2.5 bg-muted/40 rounded-md border text-xs flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                    <span>Deadline:</span>
                    <strong className={isOverdue ? 'text-destructive' : 'text-foreground'}>
                      {new Date(asg.deadline).toLocaleDateString()} at{' '}
                      {new Date(asg.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </strong>
                  </div>
                  {isOverdue && <span className="text-[10px] text-destructive font-bold">EXPIRED</span>}
                </div>

                {/* Student Submission Status Badge */}
                {isStudent && (
                  <div className="pt-1">
                    {mySubmission ? (
                      <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-md text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-emerald-900 flex items-center gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                            Submitted on {new Date(mySubmission.submitted_at).toLocaleDateString()}
                          </span>
                          <Badge variant="success" className="text-[10px] uppercase">
                            {mySubmission.status}
                          </Badge>
                        </div>
                        {mySubmission.grade ? (
                          <div className="pt-1 border-t border-emerald-200/60 flex items-center justify-between">
                            <span className="font-bold text-sm text-emerald-800">
                              Score: {mySubmission.grade.marks_obtained}/{mySubmission.grade.max_marks}
                            </span>
                            <span className="text-[11px] text-emerald-700 italic">
                              "{mySubmission.grade.feedback}"
                            </span>
                          </div>
                        ) : (
                          <p className="text-[11px] text-emerald-700">Awaiting faculty evaluation.</p>
                        )}
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        disabled={isOverdue && !asg.allow_late_submissions}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs"
                        onClick={() => setSelectedAssignmentForSubmission(asg)}
                      >
                        <Upload className="h-3.5 w-3.5 mr-1.5" /> Submit Assignment Answers
                      </Button>
                    )}
                  </div>
                )}

                {/* Teacher Evaluator Actions */}
                {isTeacherOrAdmin && (
                  <div className="pt-2 border-t flex items-center justify-between">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Users className="h-3.5 w-3.5 text-primary" /> {assignmentSubs.length} Submissions
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs text-primary"
                      onClick={() => setSelectedAssignmentForReview(asg)}
                    >
                      <FileCheck className="h-3.5 w-3.5 mr-1" /> Review & Grade Work
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* MODAL: CREATE ASSIGNMENT */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent onClose={() => setIsCreateOpen(false)} className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Formulate New Course Assignment</DialogTitle>
            <DialogDescription>
              Assign homework or problem sets with strict or flexible deadlines.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateSubmit} className="space-y-4 py-2">
            <div className="space-y-1">
              <Label>Assignment Title *</Label>
              <Input
                placeholder="e.g. Assignment 05 — Differential Calculus Applications"
                value={asgForm.title}
                onChange={(e) => setAsgForm({ ...asgForm, title: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Target Cohort *</Label>
                <Select
                  value={asgForm.cohortName}
                  onChange={(e) => setAsgForm({ ...asgForm, cohortName: e.target.value })}
                >
                  <optgroup label="School Sections">
                    {sections.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Coaching Batches">
                    {batches.map((b) => (
                      <option key={b.id} value={b.name}>
                        {b.name}
                      </option>
                    ))}
                  </optgroup>
                </Select>
              </div>

              <div className="space-y-1">
                <Label>Subject Curriculum *</Label>
                <Select
                  value={asgForm.subjectId}
                  onChange={(e) => {
                    const sbj = subjects.find((s) => s.id === e.target.value)
                    setAsgForm({
                      ...asgForm,
                      subjectId: e.target.value,
                      subjectName: sbj ? sbj.name : 'Mathematics',
                    })
                  }}
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Max Marks *</Label>
                <Input
                  type="number"
                  value={asgForm.maxMarks}
                  onChange={(e) => setAsgForm({ ...asgForm, maxMarks: Number(e.target.value) })}
                  required
                />
              </div>

              <div className="space-y-1">
                <Label>Submission Deadline *</Label>
                <Input
                  type="datetime-local"
                  value={asgForm.deadline}
                  onChange={(e) => setAsgForm({ ...asgForm, deadline: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label>Instructions & Problem Brief *</Label>
              <textarea
                rows={3}
                placeholder="Specify requirements, questions, and formatting expectations..."
                value={asgForm.instructions}
                onChange={(e) => setAsgForm({ ...asgForm, instructions: e.target.value })}
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                required
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="allow-late"
                checked={asgForm.allowLate}
                onChange={(e) => setAsgForm({ ...asgForm, allowLate: e.target.checked })}
                className="rounded border-input h-4 w-4 text-primary focus:ring-primary"
              />
              <Label htmlFor="allow-late" className="cursor-pointer font-medium text-xs">
                Allow late submissions after deadline with "Late" status tag
              </Label>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                Publish Assignment
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL: STUDENT SUBMISSION */}
      {selectedAssignmentForSubmission && (
        <Dialog
          open={Boolean(selectedAssignmentForSubmission)}
          onOpenChange={() => setSelectedAssignmentForSubmission(null)}
        >
          <DialogContent onClose={() => setSelectedAssignmentForSubmission(null)}>
            <DialogHeader>
              <DialogTitle>Submit Work: {selectedAssignmentForSubmission.title}</DialogTitle>
              <DialogDescription>
                Subject: {selectedAssignmentForSubmission.subject_name} • Max Marks:{' '}
                {selectedAssignmentForSubmission.max_marks}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleStudentSubmit} className="space-y-4 py-2">
              <div className="space-y-1">
                <Label>Submission Notes / Written Answers</Label>
                <textarea
                  rows={4}
                  placeholder="Provide text answers, commentary, or problem steps..."
                  value={submissionForm.text}
                  onChange={(e) => setSubmissionForm({ ...submissionForm, text: e.target.value })}
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label>Attach Solution Document File Name</Label>
                <Input
                  placeholder="e.g. Aarav_Patel_Assignment_Solutions.pdf"
                  value={submissionForm.fileName}
                  onChange={(e) => setSubmissionForm({ ...submissionForm, fileName: e.target.value })}
                />
                <p className="text-[11px] text-muted-foreground">
                  Simulates pre-signed upload to private <code>assignment-submissions</code> storage bucket.
                </p>
              </div>

              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedAssignmentForSubmission(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Confirm Submission
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* MODAL: TEACHER REVIEW & GRADING ROSTER */}
      {selectedAssignmentForReview && (
        <Dialog
          open={Boolean(selectedAssignmentForReview)}
          onOpenChange={() => setSelectedAssignmentForReview(null)}
        >
          <DialogContent onClose={() => setSelectedAssignmentForReview(null)} className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Submissions Roster: {selectedAssignmentForReview.title}</DialogTitle>
              <DialogDescription>
                Cohort: {selectedAssignmentForReview.cohort_name} • Total Submissions:{' '}
                {submissions.filter((s) => s.assignment_id === selectedAssignmentForReview.id).length}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Submitted File</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead className="text-right">Evaluate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions
                    .filter((s) => s.assignment_id === selectedAssignmentForReview.id)
                    .map((sub) => (
                      <TableRow key={sub.id}>
                        <TableCell className="font-semibold text-sm">{sub.student_name}</TableCell>
                        <TableCell className="text-xs">
                          {sub.attachment_file_name ? (
                            <span className="flex items-center gap-1 text-blue-600">
                              <FileText className="h-3.5 w-3.5" /> {sub.attachment_file_name}
                            </span>
                          ) : (
                            'Text Response'
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={sub.status === 'evaluated' ? 'success' : 'default'}
                            className="text-[10px] uppercase font-bold"
                          >
                            {sub.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs font-bold">
                          {sub.grade ? `${sub.grade.marks_obtained}/${sub.grade.max_marks}` : '—'}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="secondary"
                            className="h-7 text-xs"
                            onClick={() => {
                              setSelectedSubmissionToGrade(sub)
                              if (sub.grade) {
                                setGradingForm({
                                  marks: sub.grade.marks_obtained,
                                  feedback: sub.grade.feedback,
                                })
                              }
                            }}
                          >
                            <Award className="h-3.5 w-3.5 mr-1" />
                            {sub.grade ? 'Edit Grade' : 'Score'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* MODAL: SCORE SUBMISSION */}
      {selectedSubmissionToGrade && (
        <Dialog
          open={Boolean(selectedSubmissionToGrade)}
          onOpenChange={() => setSelectedSubmissionToGrade(null)}
        >
          <DialogContent onClose={() => setSelectedSubmissionToGrade(null)}>
            <DialogHeader>
              <DialogTitle>Grade Submission: {selectedSubmissionToGrade.student_name}</DialogTitle>
              <DialogDescription>
                Attached file: {selectedSubmissionToGrade.attachment_file_name || 'Written text'}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleGradeSubmit} className="space-y-4 py-2">
              <div className="p-3 bg-muted rounded-md text-xs space-y-1">
                <span className="font-semibold text-foreground">Student Notes:</span>
                <p className="text-muted-foreground">{selectedSubmissionToGrade.submission_text}</p>
              </div>

              <div className="space-y-1">
                <Label>Marks Obtained (out of 100) *</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={gradingForm.marks}
                  onChange={(e) => setGradingForm({ ...gradingForm, marks: Number(e.target.value) })}
                  required
                />
              </div>

              <div className="space-y-1">
                <Label>Qualitative Feedback & Remarks</Label>
                <textarea
                  rows={3}
                  value={gradingForm.feedback}
                  onChange={(e) => setGradingForm({ ...gradingForm, feedback: e.target.value })}
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>

              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedSubmissionToGrade(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  Publish Grade
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
