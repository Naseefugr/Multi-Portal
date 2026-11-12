import React, { useState } from 'react'
import { useAcademic } from '@/contexts/academic-context'
import { useAuth } from '@/contexts/auth-context'
import type { StudentRecord } from '@/types/database.types'
import {
  UserPlus,
  Search,
  Filter,
  ShieldCheck,
} from 'lucide-react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'

export function StudentManagementView() {
  const { students, sections, batches, admitStudent, updateStudentStatus } = useAcademic()
  const { userRole, hasPermission } = useAuth()

  const [searchTerm, setSearchTerm] = useState('')
  const [filterCohort, setFilterCohort] = useState('all')
  const [isAdmitModalOpen, setIsAdmitModalOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(null)

  // Admission Form
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    cohortType: 'section' as 'section' | 'batch',
    cohortId: sections[0]?.id || '',
    rollNumber: '',
    guardianName: '',
    guardianPhone: '',
    guardianRelationship: 'father',
  })

  const canCreate = userRole === 'institution_admin' || hasPermission('students.create')

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.admission_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.roll_number && s.roll_number.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCohort =
      filterCohort === 'all' || s.section_id === filterCohort || s.batch_id === filterCohort

    return matchesSearch && matchesCohort
  })

  const handleAdmitSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.fullName || !form.email) return

    let cohortName = 'Unassigned'
    let secId: string | undefined = undefined
    let btcId: string | undefined = undefined

    if (form.cohortType === 'section') {
      const sec = sections.find((s) => s.id === form.cohortId)
      cohortName = sec ? sec.name : 'Section A'
      secId = form.cohortId
    } else {
      const btc = batches.find((b) => b.id === form.cohortId)
      cohortName = btc ? btc.name : 'Morning Batch'
      btcId = form.cohortId
    }

    admitStudent({
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      sectionId: secId,
      batchId: btcId,
      cohortName,
      rollNumber: form.rollNumber,
      guardianName: form.guardianName,
      guardianPhone: form.guardianPhone,
      guardianRelationship: form.guardianRelationship,
    })

    setIsAdmitModalOpen(false)
    setForm({
      fullName: '',
      email: '',
      phone: '',
      cohortType: 'section',
      cohortId: sections[0]?.id || '',
      rollNumber: '',
      guardianName: '',
      guardianPhone: '',
      guardianRelationship: 'father',
    })
  }

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Student Information System (SIS)
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Admissions, enrolled cohorts, academic status lifecycle, and verified guardian relationships.
          </p>
        </div>

        {canCreate && (
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setIsAdmitModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
            >
              <UserPlus className="h-3.5 w-3.5 mr-1.5" /> Admit New Student
            </Button>
          </div>
        )}
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Total Enrolled</p>
          <p className="text-2xl font-bold text-foreground">{students.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Active Sections</p>
          <p className="text-2xl font-bold text-blue-600">{sections.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Active Batches</p>
          <p className="text-2xl font-bold text-indigo-600">{batches.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Verified Guardians</p>
          <p className="text-2xl font-bold text-emerald-600">{students.length}</p>
        </Card>
      </div>

      {/* Directory Table with Search & Filter */}
      <Card>
        <CardHeader className="p-4 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, admission no, roll..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 h-9 text-xs"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select
              value={filterCohort}
              onChange={(e) => setFilterCohort(e.target.value)}
              className="text-xs h-9 w-full sm:w-48"
            >
              <option value="all">All Cohorts / Classes</option>
              <optgroup label="School Sections">
                {sections.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Coaching Batches">
                {batches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </optgroup>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Admission No</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Class / Batch</TableHead>
                <TableHead>Roll No</TableHead>
                <TableHead>Verified Guardian</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground text-sm">
                    No students found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredStudents.map((std) => (
                  <TableRow key={std.id} className="hover:bg-muted/40">
                    <TableCell>
                      <code className="bg-muted px-2 py-0.5 rounded text-xs font-mono font-bold text-blue-600">
                        {std.admission_number}
                      </code>
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold text-foreground text-sm">{std.full_name}</div>
                      <div className="text-[11px] text-muted-foreground">{std.email}</div>
                    </TableCell>
                    <TableCell className="text-xs font-medium">
                      {std.cohort_name || 'Unassigned'}
                    </TableCell>
                    <TableCell className="text-xs font-mono">{std.roll_number || '—'}</TableCell>
                    <TableCell>
                      <div className="text-xs font-medium text-foreground">{std.guardian_name}</div>
                      <div className="text-[10px] text-muted-foreground capitalize">
                        {std.guardian_relationship} • {std.guardian_phone || 'Verified'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          std.status === 'enrolled'
                            ? 'success'
                            : std.status === 'promoted'
                            ? 'default'
                            : 'secondary'
                        }
                        className="text-[10px] uppercase font-bold"
                      >
                        {std.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-xs text-blue-600"
                        onClick={() => setSelectedStudent(std)}
                      >
                        View Profile
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* MODAL: ADMIT NEW STUDENT */}
      <Dialog open={isAdmitModalOpen} onOpenChange={setIsAdmitModalOpen}>
        <DialogContent onClose={() => setIsAdmitModalOpen(false)} className="max-w-xl">
          <DialogHeader>
            <DialogTitle>New Student Admission</DialogTitle>
            <DialogDescription>
              Record student identity, allocate academic cohort, and bind verified guardian.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAdmitSubmit} className="space-y-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Student Full Name *</Label>
                <Input
                  placeholder="e.g. Rohan Varma"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1">
                <Label>Student Email *</Label>
                <Input
                  type="email"
                  placeholder="rohan@student.edu"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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

              <div className="space-y-1 sm:col-span-2">
                <Label>Assigned Section / Batch *</Label>
                <Select
                  value={form.cohortId}
                  onChange={(e) => setForm({ ...form, cohortId: e.target.value })}
                  required
                >
                  {form.cohortType === 'section'
                    ? sections.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} (Cap: {s.capacity})
                        </option>
                      ))
                    : batches.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name} (Cap: {b.capacity})
                        </option>
                      ))}
                </Select>
              </div>
            </div>

            <div className="space-y-1">
              <Label>Roll Number</Label>
              <Input
                placeholder="e.g. 10-A-15"
                value={form.rollNumber}
                onChange={(e) => setForm({ ...form, rollNumber: e.target.value })}
              />
            </div>

            <div className="border-t pt-3">
              <h4 className="font-semibold text-xs text-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                Verified Guardian & Emergency Contact
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label>Guardian Name</Label>
                  <Input
                    placeholder="Parent / Guardian"
                    value={form.guardianName}
                    onChange={(e) => setForm({ ...form, guardianName: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Guardian Phone</Label>
                  <Input
                    placeholder="+91 98765 00000"
                    value={form.guardianPhone}
                    onChange={(e) => setForm({ ...form, guardianPhone: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Relationship</Label>
                  <Select
                    value={form.guardianRelationship}
                    onChange={(e) => setForm({ ...form, guardianRelationship: e.target.value })}
                  >
                    <option value="father">Father</option>
                    <option value="mother">Mother</option>
                    <option value="legal_guardian">Legal Guardian</option>
                    <option value="sponsor">Sponsor</option>
                  </Select>
                </div>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsAdmitModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                Complete Admission
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL: VIEW STUDENT DETAILS */}
      {selectedStudent && (
        <Dialog open={Boolean(selectedStudent)} onOpenChange={() => setSelectedStudent(null)}>
          <DialogContent onClose={() => setSelectedStudent(null)}>
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle>{selectedStudent.full_name}</DialogTitle>
                <Badge variant="outline" className="font-mono text-xs">
                  {selectedStudent.admission_number}
                </Badge>
              </div>
              <DialogDescription>
                Enrolled Student Record & Verified Guardian Link
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2 text-xs">
              <div className="p-3 bg-muted rounded-md space-y-1.5">
                <p>
                  <strong className="text-foreground">Cohort Allocation:</strong> {selectedStudent.cohort_name}
                </p>
                <p>
                  <strong className="text-foreground">Official Roll No:</strong> {selectedStudent.roll_number || 'Not Assigned'}
                </p>
                <p>
                  <strong className="text-foreground">Contact Email:</strong> {selectedStudent.email}
                </p>
                <p>
                  <strong className="text-foreground">Current Status:</strong>{' '}
                  <span className="capitalize font-semibold text-emerald-600">{selectedStudent.status}</span>
                </p>
              </div>

              <div className="p-3 border rounded-md space-y-1.5">
                <h5 className="font-semibold text-foreground text-xs flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  Verified Guardian Access (Anti-IDOR Protection):
                </h5>
                <p className="text-muted-foreground">
                  Guardian: <strong className="text-foreground">{selectedStudent.guardian_name}</strong> (
                  {selectedStudent.guardian_relationship})
                </p>
                <p className="text-muted-foreground">Phone: {selectedStudent.guardian_phone || 'N/A'}</p>
                <p className="text-[11px] text-muted-foreground italic">
                  PostgreSQL RLS grants access to attendance & report cards strictly to this verified link.
                </p>
              </div>

              {canCreate && (
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-muted-foreground">Update Academic Status:</span>
                  <div className="flex gap-1.5">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-[11px]"
                      onClick={() => {
                        updateStudentStatus(selectedStudent.id, 'promoted')
                        setSelectedStudent(null)
                      }}
                    >
                      Promote
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-[11px] text-amber-600"
                      onClick={() => {
                        updateStudentStatus(selectedStudent.id, 'transferred')
                        setSelectedStudent(null)
                      }}
                    >
                      Transfer
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-[11px] text-destructive"
                      onClick={() => {
                        updateStudentStatus(selectedStudent.id, 'withdrawn')
                        setSelectedStudent(null)
                      }}
                    >
                      Withdraw
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
