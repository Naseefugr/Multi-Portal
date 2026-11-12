import React, { createContext, useContext, useState, useEffect } from 'react'
import type { ClassPost, Assignment, AssignmentSubmission } from '@/types/database.types'
import {
  INITIAL_CLASS_POSTS,
  INITIAL_ASSIGNMENTS,
  INITIAL_SUBMISSIONS,
} from '@/services/mock-data'
import { useTenant } from '@/contexts/tenant-context'
import { useAuth } from '@/contexts/auth-context'

interface LearningContextType {
  classPosts: ClassPost[]
  assignments: Assignment[]
  submissions: AssignmentSubmission[]

  // Class Post Actions
  createClassPost: (data: {
    title: string
    content: string
    cohortName: string
    subjectName?: string
    isPinned?: boolean
    attachmentName?: string
  }) => void
  togglePinPost: (id: string) => void

  // Assignment Actions
  createAssignment: (data: {
    title: string
    instructions: string
    cohortName: string
    subjectId: string
    subjectName: string
    maxMarks: number
    deadline: string
    allowLate: boolean
  }) => void

  // Submission & Grading Actions
  submitAssignment: (data: {
    assignmentId: string
    submissionText: string
    attachmentFileName?: string
  }) => void
  gradeSubmission: (data: {
    submissionId: string
    marksObtained: number
    maxMarks: number
    feedback: string
  }) => void
}

const LearningContext = createContext<LearningContextType | undefined>(undefined)

export function LearningProvider({ children }: { children: React.ReactNode }) {
  const { currentTenant } = useTenant()
  const { currentUser, userRole } = useAuth()
  const tenantId = currentTenant?.id || 'inst-001-bright'

  const [classPosts, setClassPosts] = useState<ClassPost[]>(() => {
    const saved = localStorage.getItem(`educore_posts_${tenantId}`)
    return saved ? JSON.parse(saved) : INITIAL_CLASS_POSTS
  })

  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const saved = localStorage.getItem(`educore_assignments_list_${tenantId}`)
    return saved ? JSON.parse(saved) : INITIAL_ASSIGNMENTS
  })

  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>(() => {
    const saved = localStorage.getItem(`educore_submissions_${tenantId}`)
    return saved ? JSON.parse(saved) : INITIAL_SUBMISSIONS
  })

  // Synchronize changes
  useEffect(() => {
    if (!currentTenant) return
    localStorage.setItem(`educore_posts_${tenantId}`, JSON.stringify(classPosts))
    localStorage.setItem(`educore_assignments_list_${tenantId}`, JSON.stringify(assignments))
    localStorage.setItem(`educore_submissions_${tenantId}`, JSON.stringify(submissions))
  }, [classPosts, assignments, submissions, currentTenant, tenantId])

  const createClassPost = (data: {
    title: string
    content: string
    cohortName: string
    subjectName?: string
    isPinned?: boolean
    attachmentName?: string
  }) => {
    const newPost: ClassPost = {
      id: `post-${Date.now()}`,
      institution_id: tenantId,
      author_id: currentUser?.id || 'usr-teacher-bright',
      author_name: currentUser?.full_name || 'Teacher',
      author_role: userRole,
      cohort_name: data.cohortName,
      subject_name: data.subjectName || 'General',
      title: data.title,
      content: data.content,
      attachments: data.attachmentName
        ? [
            {
              name: data.attachmentName,
              url: '#',
              size: '1.8 MB',
              type: 'application/pdf',
            },
          ]
        : [],
      is_pinned: Boolean(data.isPinned),
      status: 'published',
      created_at: new Date().toISOString(),
    }
    setClassPosts((prev) => [newPost, ...prev])
  }

  const togglePinPost = (id: string) => {
    setClassPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, is_pinned: !p.is_pinned } : p))
    )
  }

  const createAssignment = (data: {
    title: string
    instructions: string
    cohortName: string
    subjectId: string
    subjectName: string
    maxMarks: number
    deadline: string
    allowLate: boolean
  }) => {
    const newAsg: Assignment = {
      id: `asg-${Date.now()}`,
      institution_id: tenantId,
      author_id: currentUser?.id || 'usr-teacher-bright',
      author_name: currentUser?.full_name || 'Faculty Member',
      cohort_name: data.cohortName,
      subject_id: data.subjectId,
      subject_name: data.subjectName,
      title: data.title,
      instructions: data.instructions,
      max_marks: data.maxMarks,
      deadline: data.deadline,
      allow_late_submissions: data.allowLate,
      status: 'published',
      created_at: new Date().toISOString(),
    }
    setAssignments((prev) => [newAsg, ...prev])
  }

  const submitAssignment = (data: {
    assignmentId: string
    submissionText: string
    attachmentFileName?: string
  }) => {
    const newSub: AssignmentSubmission = {
      id: `sub-${Date.now()}`,
      institution_id: tenantId,
      assignment_id: data.assignmentId,
      student_membership_id: 'mem-student-bright',
      student_name: currentUser?.full_name || 'Aarav Patel',
      submission_text: data.submissionText,
      attachment_file_name: data.attachmentFileName || 'Student_Homework_Upload.pdf',
      submitted_at: new Date().toISOString(),
      status: 'submitted',
    }
    setSubmissions((prev) => [newSub, ...prev.filter((s) => s.assignment_id !== data.assignmentId)])
  }

  const gradeSubmission = (data: {
    submissionId: string
    marksObtained: number
    maxMarks: number
    feedback: string
  }) => {
    setSubmissions((prev) =>
      prev.map((sub) =>
        sub.id === data.submissionId
          ? {
              ...sub,
              status: 'evaluated',
              grade: {
                marks_obtained: data.marksObtained,
                max_marks: data.maxMarks,
                feedback: data.feedback,
                evaluator_name: currentUser?.full_name || 'Evaluating Faculty',
                graded_at: new Date().toISOString(),
              },
            }
          : sub
      )
    )
  }

  return (
    <LearningContext.Provider
      value={{
        classPosts,
        assignments,
        submissions,
        createClassPost,
        togglePinPost,
        createAssignment,
        submitAssignment,
        gradeSubmission,
      }}
    >
      {children}
    </LearningContext.Provider>
  )
}

export function useLearning() {
  const context = useContext(LearningContext)
  if (!context) {
    throw new Error('useLearning must be used within a LearningProvider')
  }
  return context
}
