import React, { createContext, useContext, useState, useEffect } from 'react'
import type {
  AcademicYear,
  SchoolClass,
  SchoolSection,
  CoachingCourse,
  CoachingBatch,
  Subject,
  TeacherAssignment,
  StudentRecord,
  PermissionOverride,
} from '@/types/database.types'
import {
  INITIAL_ACADEMIC_YEARS,
  INITIAL_CLASSES,
  INITIAL_SECTIONS,
  INITIAL_COURSES,
  INITIAL_BATCHES,
  INITIAL_SUBJECTS,
  INITIAL_TEACHER_ASSIGNMENTS,
  INITIAL_STUDENTS,
  INITIAL_MANAGER_OVERRIDES,
} from '@/services/mock-data'
import { useTenant } from '@/contexts/tenant-context'

interface AcademicContextType {
  academicYears: AcademicYear[]
  classes: SchoolClass[]
  sections: SchoolSection[]
  courses: CoachingCourse[]
  batches: CoachingBatch[]
  subjects: Subject[]
  teacherAssignments: TeacherAssignment[]
  students: StudentRecord[]
  managerOverrides: PermissionOverride[]

  // Actions
  addAcademicYear: (name: string, startDate: string, endDate: string) => void
  addClass: (name: string) => void
  addSection: (classId: string, name: string, capacity: number) => void
  addCourse: (name: string, code: string) => void
  addBatch: (courseId: string, name: string, capacity: number) => void
  addSubject: (code: string, name: string, description: string) => void
  assignTeacher: (data: {
    teacherId: string
    teacherName: string
    subjectId: string
    subjectName: string
    sectionId?: string
    batchId?: string
    cohortName: string
  }) => void
  admitStudent: (data: {
    fullName: string
    email: string
    phone?: string
    sectionId?: string
    batchId?: string
    cohortName?: string
    rollNumber?: string
    guardianName?: string
    guardianPhone?: string
    guardianRelationship?: string
  }) => StudentRecord
  updateStudentStatus: (id: string, status: StudentRecord['status']) => void
  toggleManagerPermission: (permissionKey: string, isGranted: boolean) => void
}

const AcademicContext = createContext<AcademicContextType | undefined>(undefined)

export function AcademicProvider({ children }: { children: React.ReactNode }) {
  const { currentTenant } = useTenant()
  const tenantId = currentTenant?.id || 'inst-001-bright'

  const [academicYears, setAcademicYears] = useState<AcademicYear[]>(() => {
    const saved = localStorage.getItem(`educore_years_${tenantId}`)
    return saved ? JSON.parse(saved) : INITIAL_ACADEMIC_YEARS
  })

  const [classes, setClasses] = useState<SchoolClass[]>(() => {
    const saved = localStorage.getItem(`educore_classes_${tenantId}`)
    return saved ? JSON.parse(saved) : INITIAL_CLASSES
  })

  const [sections, setSections] = useState<SchoolSection[]>(() => {
    const saved = localStorage.getItem(`educore_sections_${tenantId}`)
    return saved ? JSON.parse(saved) : INITIAL_SECTIONS
  })

  const [courses, setCourses] = useState<CoachingCourse[]>(() => {
    const saved = localStorage.getItem(`educore_courses_${tenantId}`)
    return saved ? JSON.parse(saved) : INITIAL_COURSES
  })

  const [batches, setBatches] = useState<CoachingBatch[]>(() => {
    const saved = localStorage.getItem(`educore_batches_${tenantId}`)
    return saved ? JSON.parse(saved) : INITIAL_BATCHES
  })

  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem(`educore_subjects_${tenantId}`)
    return saved ? JSON.parse(saved) : INITIAL_SUBJECTS
  })

  const [teacherAssignments, setTeacherAssignments] = useState<TeacherAssignment[]>(() => {
    const saved = localStorage.getItem(`educore_assignments_${tenantId}`)
    return saved ? JSON.parse(saved) : INITIAL_TEACHER_ASSIGNMENTS
  })

  const [students, setStudents] = useState<StudentRecord[]>(() => {
    const saved = localStorage.getItem(`educore_students_${tenantId}`)
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS
  })

  const [managerOverrides, setManagerOverrides] = useState<PermissionOverride[]>(() => {
    const saved = localStorage.getItem(`educore_mgr_overrides_${tenantId}`)
    return saved ? JSON.parse(saved) : INITIAL_MANAGER_OVERRIDES
  })

  // Synchronize state when switching tenants
  useEffect(() => {
    if (!currentTenant) return
    localStorage.setItem(`educore_students_${tenantId}`, JSON.stringify(students))
    localStorage.setItem(`educore_classes_${tenantId}`, JSON.stringify(classes))
    localStorage.setItem(`educore_sections_${tenantId}`, JSON.stringify(sections))
    localStorage.setItem(`educore_subjects_${tenantId}`, JSON.stringify(subjects))
    localStorage.setItem(`educore_assignments_${tenantId}`, JSON.stringify(teacherAssignments))
    localStorage.setItem(`educore_mgr_overrides_${tenantId}`, JSON.stringify(managerOverrides))
  }, [students, classes, sections, subjects, teacherAssignments, managerOverrides, currentTenant, tenantId])

  const addAcademicYear = (name: string, startDate: string, endDate: string) => {
    const newYear: AcademicYear = {
      id: `ay-${Date.now()}`,
      institution_id: tenantId,
      name,
      start_date: startDate,
      end_date: endDate,
      is_current: false,
      created_at: new Date().toISOString(),
    }
    setAcademicYears((prev) => [newYear, ...prev])
  }

  const addClass = (name: string) => {
    const newClass: SchoolClass = {
      id: `cls-${Date.now()}`,
      institution_id: tenantId,
      academic_year_id: academicYears[0]?.id || 'ay-2026',
      name,
      display_order: classes.length + 1,
      created_at: new Date().toISOString(),
    }
    setClasses((prev) => [...prev, newClass])
  }

  const addSection = (classId: string, name: string, capacity: number) => {
    const newSection: SchoolSection = {
      id: `sec-${Date.now()}`,
      institution_id: tenantId,
      class_id: classId,
      name,
      capacity: capacity || 40,
      created_at: new Date().toISOString(),
    }
    setSections((prev) => [...prev, newSection])
  }

  const addCourse = (name: string, code: string) => {
    const newCourse: CoachingCourse = {
      id: `crs-${Date.now()}`,
      institution_id: tenantId,
      academic_year_id: academicYears[0]?.id || 'ay-2026',
      name,
      code,
      created_at: new Date().toISOString(),
    }
    setCourses((prev) => [...prev, newCourse])
  }

  const addBatch = (courseId: string, name: string, capacity: number) => {
    const newBatch: CoachingBatch = {
      id: `btc-${Date.now()}`,
      institution_id: tenantId,
      course_id: courseId,
      name,
      capacity: capacity || 50,
      created_at: new Date().toISOString(),
    }
    setBatches((prev) => [...prev, newBatch])
  }

  const addSubject = (code: string, name: string, description: string) => {
    const newSubject: Subject = {
      id: `sbj-${Date.now()}`,
      institution_id: tenantId,
      code,
      name,
      description,
      created_at: new Date().toISOString(),
    }
    setSubjects((prev) => [...prev, newSubject])
  }

  const assignTeacher = (data: {
    teacherId: string
    teacherName: string
    subjectId: string
    subjectName: string
    sectionId?: string
    batchId?: string
    cohortName: string
  }) => {
    const newAssignment: TeacherAssignment = {
      id: `tas-${Date.now()}`,
      institution_id: tenantId,
      teacher_membership_id: data.teacherId,
      subject_id: data.subjectId,
      section_id: data.sectionId || null,
      batch_id: data.batchId || null,
      teacher_name: data.teacherName,
      subject_name: data.subjectName,
      cohort_name: data.cohortName,
      created_at: new Date().toISOString(),
    }
    setTeacherAssignments((prev) => [...prev, newAssignment])
  }

  const admitStudent = (data: {
    fullName: string
    email: string
    phone?: string
    sectionId?: string
    batchId?: string
    cohortName?: string
    rollNumber?: string
    guardianName?: string
    guardianPhone?: string
    guardianRelationship?: string
  }): StudentRecord => {
    const count = students.length + 1
    const prefix = currentTenant?.slug ? currentTenant.slug.toUpperCase().slice(0, 4) : 'EDU'
    const newStudent: StudentRecord = {
      id: `std-${Date.now()}`,
      institution_id: tenantId,
      student_membership_id: `mem-std-${Date.now()}`,
      admission_number: `${prefix}-2026-${String(count).padStart(4, '0')}`,
      full_name: data.fullName,
      email: data.email,
      phone: data.phone || null,
      section_id: data.sectionId || null,
      batch_id: data.batchId || null,
      cohort_name: data.cohortName || 'Unassigned',
      roll_number: data.rollNumber || `${count}`,
      status: 'enrolled',
      guardian_name: data.guardianName || 'Parent / Legal Guardian',
      guardian_phone: data.guardianPhone || '',
      guardian_relationship: data.guardianRelationship || 'father',
      created_at: new Date().toISOString(),
    }
    setStudents((prev) => [newStudent, ...prev])
    return newStudent
  }

  const updateStudentStatus = (id: string, status: StudentRecord['status']) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    )
  }

  const toggleManagerPermission = (permissionKey: string, isGranted: boolean) => {
    setManagerOverrides((prev) => {
      const existing = prev.find((o) => o.permission_key === permissionKey)
      if (existing) {
        return prev.map((o) =>
          o.permission_key === permissionKey ? { ...o, is_granted: isGranted } : o
        )
      } else {
        return [
          ...prev,
          {
            id: `ovr-${Date.now()}`,
            institution_id: tenantId,
            membership_id: 'mem-mgr-bright',
            permission_key: permissionKey,
            is_granted: isGranted,
            granted_by: 'usr-admin-bright',
            created_at: new Date().toISOString(),
          },
        ]
      }
    })
  }

  return (
    <AcademicContext.Provider
      value={{
        academicYears,
        classes,
        sections,
        courses,
        batches,
        subjects,
        teacherAssignments,
        students,
        managerOverrides,
        addAcademicYear,
        addClass,
        addSection,
        addCourse,
        addBatch,
        addSubject,
        assignTeacher,
        admitStudent,
        updateStudentStatus,
        toggleManagerPermission,
      }}
    >
      {children}
    </AcademicContext.Provider>
  )
}

export function useAcademic() {
  const context = useContext(AcademicContext)
  if (!context) {
    throw new Error('useAcademic must be used within an AcademicProvider')
  }
  return context
}
