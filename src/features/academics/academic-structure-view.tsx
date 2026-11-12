import React, { useState } from 'react'
import { useAcademic } from '@/contexts/academic-context'
import { useTenant } from '@/contexts/tenant-context'
import { useAuth } from '@/contexts/auth-context'
import {
  Calendar,
  GraduationCap,
  BookOpen,
  Plus,
  School,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'

export function AcademicStructureView() {
  const { currentTenant } = useTenant()
  const { userRole, hasPermission } = useAuth()
  const {
    academicYears,
    classes,
    sections,
    courses,
    batches,
    subjects,
    addAcademicYear,
    addClass,
    addSection,
    addCourse,
    addBatch,
    addSubject,
  } = useAcademic()

  const [activeTab, setActiveTab] = useState(
    currentTenant?.institution_type === 'coaching_institute' ? 'coaching' : 'school'
  )

  // Modals state
  const [isYearModalOpen, setIsYearModalOpen] = useState(false)
  const [isClassModalOpen, setIsClassModalOpen] = useState(false)
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false)
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false)
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false)
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false)

  // Form states
  const [selectedClassId, setSelectedClassId] = useState('')
  const [selectedCourseId, setSelectedCourseId] = useState('')

  const [yearForm, setYearForm] = useState({ name: '', startDate: '', endDate: '' })
  const [classForm, setClassForm] = useState({ name: '' })
  const [sectionForm, setSectionForm] = useState({ name: '', capacity: 35 })
  const [courseForm, setCourseForm] = useState({ name: '', code: '' })
  const [batchForm, setBatchForm] = useState({ name: '', capacity: 40 })
  const [subjectForm, setSubjectForm] = useState({ code: '', name: '', description: '' })

  const canEdit = userRole === 'institution_admin' || hasPermission('academics.classes.create')

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Academic Architecture & Taxonomy
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Configure academic years, grades, sections, courses, batches, and master subject catalog.
          </p>
        </div>

        {canEdit && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsYearModalOpen(true)}
              className="text-xs"
            >
              <Calendar className="h-3.5 w-3.5 mr-1" /> New Academic Year
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSubjectModalOpen(true)}
              className="text-xs"
            >
              <BookOpen className="h-3.5 w-3.5 mr-1" /> Add Subject
            </Button>
          </div>
        )}
      </div>

      {/* Active Academic Year Banner */}
      <div className="bg-blue-50/70 border border-blue-200 rounded-lg p-4 flex flex-wrap items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-blue-600 text-white flex items-center justify-center font-bold">
            <Calendar className="h-4 w-4" />
          </div>
          <div>
            <span className="font-semibold text-blue-900">
              Active Session: {academicYears[0]?.name || 'Academic Session 2026–2027'}
            </span>
            <span className="text-xs text-blue-700 block">
              Term Window: {academicYears[0]?.start_date || '2026-04-01'} to{' '}
              {academicYears[0]?.end_date || '2027-03-31'}
            </span>
          </div>
        </div>
        <Badge variant="success" className="text-xs font-semibold">
          Current Active Year
        </Badge>
      </div>

      {/* Academic Taxonomy Switcher (Dual Model Support) */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-2">
          <TabsList>
            <TabsTrigger value="school" className="flex items-center gap-2 text-xs">
              <School className="h-4 w-4" /> School Model (Grade &rarr; Section)
            </TabsTrigger>
            <TabsTrigger value="coaching" className="flex items-center gap-2 text-xs">
              <GraduationCap className="h-4 w-4" /> Coaching Model (Course &rarr; Batch)
            </TabsTrigger>
            <TabsTrigger value="subjects" className="flex items-center gap-2 text-xs">
              <BookOpen className="h-4 w-4" /> Subject Catalog ({subjects.length})
            </TabsTrigger>
          </TabsList>
        </div>

        {/* ======================================================== */}
        {/* MODEL A: SCHOOL (GRADE -> SECTION)                      */}
        {/* ======================================================== */}
        <TabsContent value="school" className="space-y-4 pt-3">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Grade & Section structure for traditional K-12 schooling.
            </p>
            {canEdit && (
              <Button size="sm" onClick={() => setIsClassModalOpen(true)} className="text-xs">
                <Plus className="h-3.5 w-3.5 mr-1" /> Add Class / Grade
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classes.map((cls) => {
              const classSections = sections.filter((s) => s.class_id === cls.id)
              return (
                <Card key={cls.id} className="border shadow-sm">
                  <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-base font-bold">{cls.name}</CardTitle>
                      <CardDescription className="text-xs">
                        {classSections.length} Sections Defined
                      </CardDescription>
                    </div>
                    {canEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs text-blue-600 hover:text-blue-700"
                        onClick={() => {
                          setSelectedClassId(cls.id)
                          setIsSectionModalOpen(true)
                        }}
                      >
                        <Plus className="h-3.5 w-3.5 mr-1" /> Add Section
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent className="p-4 pt-2 space-y-2">
                    {classSections.length === 0 ? (
                      <p className="text-xs text-muted-foreground italic py-2">
                        No sections yet. Click "+ Add Section" to add Section A, B, etc.
                      </p>
                    ) : (
                      classSections.map((sec) => (
                        <div
                          key={sec.id}
                          className="flex items-center justify-between p-2.5 bg-muted/40 rounded-md border text-xs"
                        >
                          <span className="font-semibold text-foreground">{sec.name}</span>
                          <span className="text-muted-foreground">Capacity: {sec.capacity} seats</span>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* ======================================================== */}
        {/* MODEL B: COACHING / TUITION (COURSE -> BATCH)           */}
        {/* ======================================================== */}
        <TabsContent value="coaching" className="space-y-4 pt-3">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Course & Batch structure for entrance exams, coaching academies, and tuition centers.
            </p>
            {canEdit && (
              <Button size="sm" onClick={() => setIsCourseModalOpen(true)} className="text-xs">
                <Plus className="h-3.5 w-3.5 mr-1" /> Add Course / Stream
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((crs) => {
              const courseBatches = batches.filter((b) => b.course_id === crs.id)
              return (
                <Card key={crs.id} className="border shadow-sm">
                  <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base font-bold">{crs.name}</CardTitle>
                        {crs.code && <Badge variant="outline" className="text-[10px]">{crs.code}</Badge>}
                      </div>
                      <CardDescription className="text-xs">
                        {courseBatches.length} Operational Batches
                      </CardDescription>
                    </div>
                    {canEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs text-blue-600 hover:text-blue-700"
                        onClick={() => {
                          setSelectedCourseId(crs.id)
                          setIsBatchModalOpen(true)
                        }}
                      >
                        <Plus className="h-3.5 w-3.5 mr-1" /> Add Batch
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent className="p-4 pt-2 space-y-2">
                    {courseBatches.length === 0 ? (
                      <p className="text-xs text-muted-foreground italic py-2">
                        No batches configured. Click "+ Add Batch".
                      </p>
                    ) : (
                      courseBatches.map((btc) => (
                        <div
                          key={btc.id}
                          className="flex items-center justify-between p-2.5 bg-muted/40 rounded-md border text-xs"
                        >
                          <span className="font-semibold text-foreground">{btc.name}</span>
                          <span className="text-muted-foreground">Capacity: {btc.capacity} students</span>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* ======================================================== */}
        {/* SUBJECT CATALOG                                         */}
        {/* ======================================================== */}
        <TabsContent value="subjects" className="space-y-4 pt-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subjects.map((sbj) => (
              <Card key={sbj.id} className="border shadow-sm">
                <CardHeader className="p-4 pb-1">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-bold text-foreground">
                      {sbj.name}
                    </CardTitle>
                    <code className="bg-muted px-2 py-0.5 rounded text-xs font-mono font-bold text-primary">
                      {sbj.code}
                    </code>
                  </div>
                  <CardDescription className="text-xs mt-1">
                    {sbj.description || 'Core academic curriculum unit'}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* MODAL: ADD ACADEMIC YEAR */}
      <Dialog open={isYearModalOpen} onOpenChange={setIsYearModalOpen}>
        <DialogContent onClose={() => setIsYearModalOpen(false)}>
          <DialogHeader>
            <DialogTitle>Create Academic Year</DialogTitle>
            <DialogDescription>Define a new institutional academic calendar cycle.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1">
              <Label>Session Title *</Label>
              <Input
                placeholder="e.g. Academic Year 2027–2028"
                value={yearForm.name}
                onChange={(e) => setYearForm({ ...yearForm, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Start Date *</Label>
                <Input
                  type="date"
                  value={yearForm.startDate}
                  onChange={(e) => setYearForm({ ...yearForm, startDate: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label>End Date *</Label>
                <Input
                  type="date"
                  value={yearForm.endDate}
                  onChange={(e) => setYearForm({ ...yearForm, endDate: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsYearModalOpen(false)}>Cancel</Button>
            <Button
              onClick={() => {
                if (yearForm.name && yearForm.startDate && yearForm.endDate) {
                  addAcademicYear(yearForm.name, yearForm.startDate, yearForm.endDate)
                  setIsYearModalOpen(false)
                  setYearForm({ name: '', startDate: '', endDate: '' })
                }
              }}
            >
              Save Academic Year
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL: ADD CLASS */}
      <Dialog open={isClassModalOpen} onOpenChange={setIsClassModalOpen}>
        <DialogContent onClose={() => setIsClassModalOpen(false)}>
          <DialogHeader>
            <DialogTitle>Add Class / Grade</DialogTitle>
            <DialogDescription>Specify grade or standard name (e.g. Grade 10, Class XII).</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1">
              <Label>Class Name *</Label>
              <Input
                placeholder="e.g. Grade 12"
                value={classForm.name}
                onChange={(e) => setClassForm({ name: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsClassModalOpen(false)}>Cancel</Button>
            <Button
              onClick={() => {
                if (classForm.name) {
                  addClass(classForm.name)
                  setIsClassModalOpen(false)
                  setClassForm({ name: '' })
                }
              }}
            >
              Add Class
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL: ADD SECTION */}
      <Dialog open={isSectionModalOpen} onOpenChange={setIsSectionModalOpen}>
        <DialogContent onClose={() => setIsSectionModalOpen(false)}>
          <DialogHeader>
            <DialogTitle>Add Section</DialogTitle>
            <DialogDescription>Subdivide class into distinct sections (e.g. Section A, Section B).</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1">
              <Label>Section Name *</Label>
              <Input
                placeholder="e.g. Section C"
                value={sectionForm.name}
                onChange={(e) => setSectionForm({ ...sectionForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label>Seat Capacity</Label>
              <Input
                type="number"
                value={sectionForm.capacity}
                onChange={(e) => setSectionForm({ ...sectionForm, capacity: Number(e.target.value) })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSectionModalOpen(false)}>Cancel</Button>
            <Button
              onClick={() => {
                if (sectionForm.name && selectedClassId) {
                  addSection(selectedClassId, sectionForm.name, sectionForm.capacity)
                  setIsSectionModalOpen(false)
                  setSectionForm({ name: '', capacity: 35 })
                }
              }}
            >
              Save Section
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL: ADD COURSE */}
      <Dialog open={isCourseModalOpen} onOpenChange={setIsCourseModalOpen}>
        <DialogContent onClose={() => setIsCourseModalOpen(false)}>
          <DialogHeader>
            <DialogTitle>Add Coaching Course</DialogTitle>
            <DialogDescription>Create a competitive track or program (e.g. IIT-JEE, NEET).</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1">
              <Label>Course Title *</Label>
              <Input
                placeholder="e.g. Foundation NTSE / Olympiad"
                value={courseForm.name}
                onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label>Course Code</Label>
              <Input
                placeholder="e.g. FDN-NTSE-26"
                value={courseForm.code}
                onChange={(e) => setCourseForm({ ...courseForm, code: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCourseModalOpen(false)}>Cancel</Button>
            <Button
              onClick={() => {
                if (courseForm.name) {
                  addCourse(courseForm.name, courseForm.code)
                  setIsCourseModalOpen(false)
                  setCourseForm({ name: '', code: '' })
                }
              }}
            >
              Save Course
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL: ADD BATCH */}
      <Dialog open={isBatchModalOpen} onOpenChange={setIsBatchModalOpen}>
        <DialogContent onClose={() => setIsBatchModalOpen(false)}>
          <DialogHeader>
            <DialogTitle>Add Batch</DialogTitle>
            <DialogDescription>Define timing cohorts (e.g. Morning Alpha, Evening Regular).</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1">
              <Label>Batch Name *</Label>
              <Input
                placeholder="e.g. Evening Elite Batch"
                value={batchForm.name}
                onChange={(e) => setBatchForm({ ...batchForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label>Max Batch Size</Label>
              <Input
                type="number"
                value={batchForm.capacity}
                onChange={(e) => setBatchForm({ ...batchForm, capacity: Number(e.target.value) })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBatchModalOpen(false)}>Cancel</Button>
            <Button
              onClick={() => {
                if (batchForm.name && selectedCourseId) {
                  addBatch(selectedCourseId, batchForm.name, batchForm.capacity)
                  setIsBatchModalOpen(false)
                  setBatchForm({ name: '', capacity: 40 })
                }
              }}
            >
              Save Batch
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL: ADD SUBJECT */}
      <Dialog open={isSubjectModalOpen} onOpenChange={setIsSubjectModalOpen}>
        <DialogContent onClose={() => setIsSubjectModalOpen(false)}>
          <DialogHeader>
            <DialogTitle>Register Master Subject</DialogTitle>
            <DialogDescription>Add a curriculum discipline with official code.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1">
              <Label>Subject Code *</Label>
              <Input
                placeholder="e.g. BIO-101"
                value={subjectForm.code}
                onChange={(e) => setSubjectForm({ ...subjectForm, code: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label>Subject Title *</Label>
              <Input
                placeholder="e.g. Cellular & Molecular Biology"
                value={subjectForm.name}
                onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label>Description</Label>
              <Input
                placeholder="Brief curriculum overview"
                value={subjectForm.description}
                onChange={(e) => setSubjectForm({ ...subjectForm, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSubjectModalOpen(false)}>Cancel</Button>
            <Button
              onClick={() => {
                if (subjectForm.code && subjectForm.name) {
                  addSubject(subjectForm.code, subjectForm.name, subjectForm.description)
                  setIsSubjectModalOpen(false)
                  setSubjectForm({ code: '', name: '', description: '' })
                }
              }}
            >
              Add Subject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
