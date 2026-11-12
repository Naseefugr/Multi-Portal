import React, { createContext, useContext, useState, useEffect } from 'react'
import type {
  AttendanceSession,
  StudentAttendanceRecord,
  Examination,
  ExamSubjectResult,
  FeeCategory,
  FeeStructure,
  StudentInvoice,
  PaymentReceipt,
} from '@/types/database.types'
import {
  INITIAL_ATTENDANCE_SESSIONS,
  INITIAL_ATTENDANCE_RECORDS,
  INITIAL_EXAMS,
  INITIAL_EXAM_RESULTS,
  INITIAL_FEE_CATEGORIES,
  INITIAL_FEE_STRUCTURES,
  INITIAL_INVOICES,
  INITIAL_PAYMENTS,
  BRIGHT_TENANT_ID,
} from '@/services/mock-data'
import { useTenant } from '@/contexts/tenant-context'
import { useAuth } from '@/contexts/auth-context'
import { supabase, isLiveSupabaseConfigured } from '@/integrations/supabase/client'

interface OperationsContextType {
  attendanceSessions: AttendanceSession[]
  attendanceRecords: StudentAttendanceRecord[]
  examinations: Examination[]
  examResults: ExamSubjectResult[]
  feeCategories: FeeCategory[]
  feeStructures: FeeStructure[]
  invoices: StudentInvoice[]
  payments: PaymentReceipt[]

  // Attendance Actions
  recordAttendance: (data: {
    cohortName: string
    sessionDate: string
    subjectName?: string
    records: { studentId: string; studentName: string; admissionNumber: string; status: StudentAttendanceRecord['status']; remarks?: string }[]
  }) => void

  // Exam Actions
  createExamination: (name: string, startDate: string, endDate: string) => void
  recordExamMarks: (data: {
    examId: string
    subjectId: string
    subjectName: string
    studentId: string
    studentName: string
    admissionNumber: string
    cohortName: string
    marksObtained: number
    maxMarks: number
    passingMarks: number
    remarks?: string
  }) => void

  // Fee Actions
  createFeeStructure: (data: {
    categoryId: string
    categoryName: string
    cohortName: string
    amountInPaise: number
    dueDate: string
  }) => void
  recordPayment: (data: {
    invoiceId: string
    amountInPaise: number
    paymentMethod: PaymentReceipt['payment_method']
    transactionId?: string
  }) => PaymentReceipt | null
}

const OperationsContext = createContext<OperationsContextType | undefined>(undefined)

export function OperationsProvider({ children }: { children: React.ReactNode }) {
  const { currentTenant } = useTenant()
  const { currentUser } = useAuth()
  const tenantId = currentTenant?.id || BRIGHT_TENANT_ID

  const [attendanceSessions, setAttendanceSessions] = useState<AttendanceSession[]>(() => {
    const saved = localStorage.getItem(`educore_att_sessions_${tenantId}`)
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE_SESSIONS
  })

  const [attendanceRecords, setAttendanceRecords] = useState<StudentAttendanceRecord[]>(() => {
    const saved = localStorage.getItem(`educore_att_records_${tenantId}`)
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE_RECORDS
  })

  const [examinations, setExaminations] = useState<Examination[]>(() => {
    const saved = localStorage.getItem(`educore_exams_${tenantId}`)
    return saved ? JSON.parse(saved) : INITIAL_EXAMS
  })

  const [examResults, setExamResults] = useState<ExamSubjectResult[]>(() => {
    const saved = localStorage.getItem(`educore_exam_results_${tenantId}`)
    return saved ? JSON.parse(saved) : INITIAL_EXAM_RESULTS
  })

  const [feeCategories] = useState<FeeCategory[]>(INITIAL_FEE_CATEGORIES)

  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>(() => {
    const saved = localStorage.getItem(`educore_fee_structures_${tenantId}`)
    return saved ? JSON.parse(saved) : INITIAL_FEE_STRUCTURES
  })

  const [invoices, setInvoices] = useState<StudentInvoice[]>(() => {
    const saved = localStorage.getItem(`educore_invoices_${tenantId}`)
    return saved ? JSON.parse(saved) : INITIAL_INVOICES
  })

  const [payments, setPayments] = useState<PaymentReceipt[]>(() => {
    const saved = localStorage.getItem(`educore_payments_${tenantId}`)
    return saved ? JSON.parse(saved) : INITIAL_PAYMENTS
  })

  // Synchronize from live Supabase on mount & tenant switch
  useEffect(() => {
    if (!isLiveSupabaseConfigured) return
    let isMounted = true

    async function loadOperationsData() {
      try {
        const [attSessRes, attRecRes, examRes, marksRes, _feeCatRes, feeStructRes, invRes, payRes] = await Promise.all([
          supabase.from('attendance_sessions').select('*').eq('institution_id', tenantId).order('session_date', { ascending: false }),
          supabase.from('student_attendance').select('*').eq('institution_id', tenantId),
          supabase.from('examinations').select('*').eq('institution_id', tenantId),
          supabase.from('marks').select('*').eq('institution_id', tenantId),
          supabase.from('fee_categories').select('*').eq('institution_id', tenantId),
          supabase.from('fee_structures').select('*').eq('institution_id', tenantId),
          supabase.from('student_invoices').select('*').eq('institution_id', tenantId),
          supabase.from('payments').select('*').eq('institution_id', tenantId).order('payment_date', { ascending: false }),
        ])

        if (isMounted) {
          if (attSessRes.data && attSessRes.data.length > 0) setAttendanceSessions(attSessRes.data as AttendanceSession[])
          if (attRecRes.data && attRecRes.data.length > 0) setAttendanceRecords(attRecRes.data as StudentAttendanceRecord[])
          if (examRes.data && examRes.data.length > 0) setExaminations(examRes.data as Examination[])
          if (marksRes.data && marksRes.data.length > 0) setExamResults(marksRes.data as ExamSubjectResult[])
          if (feeStructRes.data && feeStructRes.data.length > 0) setFeeStructures(feeStructRes.data as FeeStructure[])
          if (invRes.data && invRes.data.length > 0) setInvoices(invRes.data as StudentInvoice[])
          if (payRes.data && payRes.data.length > 0) setPayments(payRes.data as PaymentReceipt[])
        }
      } catch (err) {
        console.info('Supabase operations sync notice:', err)
      }
    }

    loadOperationsData()

    return () => {
      isMounted = false
    }
  }, [tenantId])

  useEffect(() => {
    if (!currentTenant) return
    localStorage.setItem(`educore_att_sessions_${tenantId}`, JSON.stringify(attendanceSessions))
    localStorage.setItem(`educore_att_records_${tenantId}`, JSON.stringify(attendanceRecords))
    localStorage.setItem(`educore_exams_${tenantId}`, JSON.stringify(examinations))
    localStorage.setItem(`educore_exam_results_${tenantId}`, JSON.stringify(examResults))
    localStorage.setItem(`educore_fee_structures_${tenantId}`, JSON.stringify(feeStructures))
    localStorage.setItem(`educore_invoices_${tenantId}`, JSON.stringify(invoices))
    localStorage.setItem(`educore_payments_${tenantId}`, JSON.stringify(payments))
  }, [attendanceSessions, attendanceRecords, examinations, examResults, feeStructures, invoices, payments, currentTenant, tenantId])

  const recordAttendance = (data: {
    cohortName: string
    sessionDate: string
    subjectName?: string
    records: { studentId: string; studentName: string; admissionNumber: string; status: StudentAttendanceRecord['status']; remarks?: string }[]
  }) => {
    const sessionId = `0192e85a-0080-7000-8000-${Date.now().toString(16).padStart(12, '0').slice(-12)}`
    const newSession: AttendanceSession = {
      id: sessionId,
      institution_id: tenantId,
      session_date: data.sessionDate,
      cohort_name: data.cohortName,
      subject_name: data.subjectName,
      recorded_by_name: currentUser?.full_name || 'Staff Member',
      created_at: new Date().toISOString(),
    }

    const newRecords: StudentAttendanceRecord[] = data.records.map((r, i) => ({
      id: `0192e85a-0085-7000-8000-${(Date.now() + i).toString(16).padStart(12, '0').slice(-12)}`,
      institution_id: tenantId,
      session_id: sessionId,
      student_id: r.studentId,
      student_name: r.studentName,
      admission_number: r.admissionNumber,
      status: r.status,
      remarks: r.remarks,
    }))

    setAttendanceSessions((prev) => [newSession, ...prev])
    setAttendanceRecords((prev) => [...newRecords, ...prev])

    if (isLiveSupabaseConfigured) {
      supabase.from('attendance_sessions').insert([{
        id: newSession.id,
        institution_id: newSession.institution_id,
        session_date: newSession.session_date,
        cohort_name: newSession.cohort_name,
        subject_name: newSession.subject_name,
        recorded_by_name: newSession.recorded_by_name,
      }]).then(({ error }) => {
        if (error) console.info('Supabase attendance_session insert notice:', error.message)
      })

      supabase.from('student_attendance').insert(
        newRecords.map((r) => ({
          id: r.id,
          institution_id: r.institution_id,
          session_id: r.session_id,
          student_name: r.student_name,
          admission_number: r.admission_number,
          status: r.status,
          remarks: r.remarks,
        }))
      ).then(({ error }) => {
        if (error) console.info('Supabase student_attendance insert notice:', error.message)
      })
    }
  }

  const createExamination = (name: string, startDate: string, endDate: string) => {
    const examId = `0192e85a-0090-7000-8000-${Date.now().toString(16).padStart(12, '0').slice(-12)}`
    const newExam: Examination = {
      id: examId,
      institution_id: tenantId,
      name,
      academic_year_id: '0192e85a-0010-7000-8000-000000000001',
      start_date: startDate,
      end_date: endDate,
      status: 'published',
      created_at: new Date().toISOString(),
    }
    setExaminations((prev) => [newExam, ...prev])

    if (isLiveSupabaseConfigured) {
      supabase.from('examinations').insert([{
        id: newExam.id,
        institution_id: newExam.institution_id,
        name: newExam.name,
        start_date: newExam.start_date,
        end_date: newExam.end_date,
        status: newExam.status,
      }]).then(({ error }) => {
        if (error) console.info('Supabase examination insert notice:', error.message)
      })
    }
  }

  const recordExamMarks = (data: {
    examId: string
    subjectId: string
    subjectName: string
    studentId: string
    studentName: string
    admissionNumber: string
    cohortName: string
    marksObtained: number
    maxMarks: number
    passingMarks: number
    remarks?: string
  }) => {
    const percentage = (data.marksObtained / data.maxMarks) * 100
    let gradeLetter = 'F'
    if (percentage >= 90) gradeLetter = 'A+'
    else if (percentage >= 80) gradeLetter = 'A'
    else if (percentage >= 70) gradeLetter = 'B'
    else if (percentage >= 50) gradeLetter = 'C'
    else if (percentage >= 40) gradeLetter = 'D'

    const markId = `0192e85a-0095-7000-8000-${Date.now().toString(16).padStart(12, '0').slice(-12)}`
    const newResult: ExamSubjectResult = {
      id: markId,
      exam_id: data.examId,
      subject_id: data.subjectId,
      subject_name: data.subjectName,
      student_id: data.studentId,
      student_name: data.studentName,
      admission_number: data.admissionNumber,
      cohort_name: data.cohortName,
      max_marks: data.maxMarks,
      passing_marks: data.passingMarks,
      marks_obtained: data.marksObtained,
      grade_letter: gradeLetter,
      remarks: data.remarks || 'Evaluated',
    }
    setExamResults((prev) => [newResult, ...prev.filter((r) => !(r.exam_id === data.examId && r.student_id === data.studentId && r.subject_id === data.subjectId))])

    if (isLiveSupabaseConfigured) {
      supabase.from('marks').insert([{
        id: newResult.id,
        institution_id: tenantId,
        exam_id: newResult.exam_id,
        subject_name: newResult.subject_name,
        student_name: newResult.student_name,
        admission_number: newResult.admission_number,
        cohort_name: newResult.cohort_name,
        marks_obtained: newResult.marks_obtained,
        max_marks: newResult.max_marks,
        passing_marks: newResult.passing_marks,
        grade_letter: newResult.grade_letter,
        remarks: newResult.remarks,
      }]).then(({ error }) => {
        if (error) console.info('Supabase marks insert notice:', error.message)
      })
    }
  }

  const createFeeStructure = (data: {
    categoryId: string
    categoryName: string
    cohortName: string
    amountInPaise: number
    dueDate: string
  }) => {
    const fsId = `0192e85a-0110-7000-8000-${Date.now().toString(16).padStart(12, '0').slice(-12)}`
    const newStructure: FeeStructure = {
      id: fsId,
      institution_id: tenantId,
      academic_year_id: '0192e85a-0010-7000-8000-000000000001',
      fee_category_id: data.categoryId,
      fee_category_name: data.categoryName,
      cohort_name: data.cohortName,
      amount_in_paise: data.amountInPaise,
      due_date: data.dueDate,
    }
    setFeeStructures((prev) => [...prev, newStructure])

    if (isLiveSupabaseConfigured) {
      supabase.from('fee_structures').insert([{
        id: newStructure.id,
        institution_id: newStructure.institution_id,
        fee_category_name: newStructure.fee_category_name,
        cohort_name: newStructure.cohort_name,
        amount_in_paise: newStructure.amount_in_paise,
        due_date: newStructure.due_date,
      }]).then(({ error }) => {
        if (error) console.info('Supabase fee_structure insert notice:', error.message)
      })
    }
  }

  const recordPayment = (data: {
    invoiceId: string
    amountInPaise: number
    paymentMethod: PaymentReceipt['payment_method']
    transactionId?: string
  }): PaymentReceipt | null => {
    const targetInvoice = invoices.find((inv) => inv.id === data.invoiceId)
    if (!targetInvoice) return null

    const payId = `0192e85a-0130-7000-8000-${Date.now().toString(16).padStart(12, '0').slice(-12)}`
    const receiptNum = `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`
    const newPayment: PaymentReceipt = {
      id: payId,
      institution_id: tenantId,
      invoice_id: targetInvoice.id,
      invoice_number: targetInvoice.invoice_number,
      receipt_number: receiptNum,
      student_name: targetInvoice.student_name,
      amount_paid_in_paise: data.amountInPaise,
      payment_method: data.paymentMethod,
      gateway_transaction_id: data.transactionId || `TXN-${Date.now()}`,
      recorded_by: currentUser?.full_name || 'Front Desk Cashier',
      payment_date: new Date().toISOString(),
    }

    setPayments((prev) => [newPayment, ...prev])

    // Update the invoice
    const newPaidAmount = targetInvoice.paid_amount_in_paise + data.amountInPaise
    const newStatus: StudentInvoice['status'] =
      newPaidAmount >= targetInvoice.total_amount_in_paise ? 'paid' : 'partially_paid'

    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === data.invoiceId
          ? {
              ...inv,
              paid_amount_in_paise: newPaidAmount,
              status: newStatus,
              updated_at: new Date().toISOString(),
            }
          : inv
      )
    )

    if (isLiveSupabaseConfigured) {
      supabase.from('payments').insert([{
        id: newPayment.id,
        institution_id: newPayment.institution_id,
        invoice_id: newPayment.invoice_id,
        receipt_number: newPayment.receipt_number,
        student_name: newPayment.student_name,
        amount_in_paise: newPayment.amount_paid_in_paise,
        payment_method: newPayment.payment_method,
        reference_id: newPayment.gateway_transaction_id,
        payment_date: newPayment.payment_date,
      }]).then(({ error }) => {
        if (error) console.info('Supabase payment insert notice:', error.message)
      })

      supabase.from('student_invoices').update({
        paid_amount_in_paise: newPaidAmount,
        status: newStatus,
        updated_at: new Date().toISOString(),
      }).eq('id', targetInvoice.id).then()
    }

    return newPayment
  }

  return (
    <OperationsContext.Provider
      value={{
        attendanceSessions,
        attendanceRecords,
        examinations,
        examResults,
        feeCategories,
        feeStructures,
        invoices,
        payments,
        recordAttendance,
        createExamination,
        recordExamMarks,
        createFeeStructure,
        recordPayment,
      }}
    >
      {children}
    </OperationsContext.Provider>
  )
}

export function useOperations() {
  const context = useContext(OperationsContext)
  if (!context) {
    throw new Error('useOperations must be used within an OperationsProvider')
  }
  return context
}
