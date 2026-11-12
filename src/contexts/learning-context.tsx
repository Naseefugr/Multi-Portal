import React, { createContext, useContext, useState, useEffect } from 'react'
import type { ClassPost, Assignment, AssignmentSubmission } from '@/types/database.types'
import {
  INITIAL_CLASS_POSTS,
  INITIAL_ASSIGNMENTS,
  INITIAL_SUBMISSIONS,
  BRIGHT_TENANT_ID,
} from '@/services/mock-data'
import { useTenant } from '@/contexts/tenant-context'
import { useAuth } from '@/contexts/auth-context'
import { supabase, isLiveSupabaseConfigured } from '@/integrations/supabase/client'

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
  const tenantId = currentTenant?.id || BRIGHT_TENANT_ID

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

  // Synchronize from live Supabase on mount & tenant change
  useEffect(() => {
    if (!isLiveSupabaseConfigured) return
    let isMounted = true

    async function loadLearningData() {
      try {
        const [postsRes, asgRes, subRes] = await Promise.all([
          supabase.from('class_posts').select('*').eq('institution_id', tenantId).order('created_at', { ascending: false }),
          supabase.from('assignments').select('*').eq('institution_id', tenantId).order('created_at', { ascending: false }),
          supabase.from('assignment_submissions').select('*').eq('institution_id', tenantId),
        ])

        if (isMounted) {
          if (postsRes.data && postsRes.data.length > 0) setClassPosts(postsRes.data as ClassPost[])
          if (asgRes.data && asgRes.data.length > 0) setAssignments(asgRes.data as Assignment[])
          if (subRes.data && subRes.data.length > 0) setSubmissions(subRes.data as AssignmentSubmission[])
        }
      } catch (err) {
        console.info('Supabase learning sync notice:', err)
      }
    }

    loadLearningData()

    return () => {
      isMounted = false
    }
  }, [tenantId])

  // Synchronize changes to localStorage
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
    const newPostId = `0192e85a-0050-7000-8000-${Date.now().toString(16).padStart(12, '0').slice(-12)}`
    const newPost: ClassPost = {
      id: newPostId,
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

    if (isLiveSupabaseConfigured) {
      supabase.from('class_posts').insert([{
        id: newPost.id,
        institution_id: newPost.institution_id,
        author_name: newPost.author_name,
        cohort_name: newPost.cohort_name,
        subject_name: newPost.subject_name,
        title: newPost.title,
        content: newPost.content,
        is_pinned: newPost.is_pinned,
        status: newPost.status,
      }]).then(({ error }) => {
        if (error) console.info('Supabase post insert notice:', error.message)
      })
    }
  }

  const togglePinPost = (id: string) => {
    setClassPosts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextPinned = !p.is_pinned
          if (isLiveSupabaseConfigured) {
            supabase.from('class_posts').update({ is_pinned: nextPinned }).eq('id', id).then()
          }
          return { ...p, is_pinned: nextPinned }
        }
        return p
      })
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
    const newAsgId = `0192e85a-0060-7000-8000-${Date.now().toString(16).padStart(12, '0').slice(-12)}`
    const newAsg: Assignment = {
      id: newAsgId,
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

    if (isLiveSupabaseConfigured) {
      supabase.from('assignments').insert([{
        id: newAsg.id,
        institution_id: newAsg.institution_id,
        cohort_name: newAsg.cohort_name,
        subject_name: newAsg.subject_name,
        title: newAsg.title,
        instructions: newAsg.instructions,
        max_marks: newAsg.max_marks,
        deadline: newAsg.deadline,
        allow_late_submissions: newAsg.allow_late_submissions,
        status: newAsg.status,
      }]).then(({ error }) => {
        if (error) console.info('Supabase assignment insert notice:', error.message)
      })
    }
  }

  const submitAssignment = (data: {
    assignmentId: string
    submissionText: string
    attachmentFileName?: string
  }) => {
    const newSubId = `0192e85a-0070-7000-8000-${Date.now().toString(16).padStart(12, '0').slice(-12)}`
    const newSub: AssignmentSubmission = {
      id: newSubId,
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

    if (isLiveSupabaseConfigured) {
      supabase.from('assignment_submissions').insert([{
        id: newSub.id,
        institution_id: newSub.institution_id,
        assignment_id: newSub.assignment_id,
        student_name: newSub.student_name,
        submission_text: newSub.submission_text,
        status: newSub.status,
      }]).then(({ error }) => {
        if (error) console.info('Supabase submission insert notice:', error.message)
      })
    }
  }

  const gradeSubmission = (data: {
    submissionId: string
    marksObtained: number
    maxMarks: number
    feedback: string
  }) => {
    setSubmissions((prev) =>
      prev.map((sub) => {
        if (sub.id === data.submissionId) {
          if (isLiveSupabaseConfigured) {
            supabase.from('assignment_submissions').update({
              marks_obtained: data.marksObtained,
              feedback: data.feedback,
              status: 'evaluated',
            }).eq('id', data.submissionId).then()
          }
          return {
            ...sub,
            status: 'evaluated',
            marks_obtained: data.marksObtained,
            feedback: data.feedback,
            grade: {
              marks_obtained: data.marksObtained,
              max_marks: data.maxMarks,
              feedback: data.feedback,
              evaluator_name: currentUser?.full_name || 'Evaluating Faculty',
              graded_at: new Date().toISOString(),
            },
          }
        }
        return sub
      })
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
