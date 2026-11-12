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
} from '@/services/mock-data'
import { useTenant } from '@/contexts/tenant-context'
import { useAuth } from '@/contexts/auth-context'

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
  const tenantId = currentTenant?.id || 'inst-001-bright'

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
    const sessionId = `att-sess-${Date.now()}`
    const newSession: AttendanceSession = {
      id: sessionId,
      institution_id: tenantId,
      session_date: data.sessionDate,
      cohort_name: data.cohortName,
      subject_name: data.subjectName,
      recorded_by_name: currentUser?.full_name || 'Staff Member',
      created_at: new Date().toISOString(),
    }

    const newRecords: StudentAttendanceRecord[] = data.records.map((r) => ({
      id: `att-rec-${Date.now()}-${r.studentId}`,
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
  }

  const createExamination = (name: string, startDate: string, endDate: string) => {
    const newExam: Examination = {
      id: `ex-${Date.now()}`,
      institution_id: tenantId,
      name,
      academic_year_id: 'ay-2026',
      start_date: startDate,
      end_date: endDate,
      status: 'published',
      created_at: new Date().toISOString(),
    }
    setExaminations((prev) => [newExam, ...prev])
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

    const newResult: ExamSubjectResult = {
      id: `res-${Date.now()}`,
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
  }

  const createFeeStructure = (data: {
    categoryId: string
    categoryName: string
    cohortName: string
    amountInPaise: number
    dueDate: string
  }) => {
    const newStructure: FeeStructure = {
      id: `fs-${Date.now()}`,
      institution_id: tenantId,
      academic_year_id: 'ay-2026',
      fee_category_id: data.categoryId,
      fee_category_name: data.categoryName,
      cohort_name: data.cohortName,
      amount_in_paise: data.amountInPaise,
      due_date: data.dueDate,
    }
    setFeeStructures((prev) => [...prev, newStructure])
  }

  const recordPayment = (data: {
    invoiceId: string
    amountInPaise: number
    paymentMethod: PaymentReceipt['payment_method']
    transactionId?: string
  }): PaymentReceipt | null => {
    const invoice = invoices.find((inv) => inv.id === data.invoiceId)
    if (!invoice) return null

    const receiptNumber = `${currentTenant?.slug.toUpperCase().slice(0, 4) || 'EDU'}-REC-${Date.now().toString().slice(-6)}`
    const newReceipt: PaymentReceipt = {
      id: `pay-${Date.now()}`,
      institution_id: tenantId,
      invoice_id: invoice.id,
      invoice_number: invoice.invoice_number,
      receipt_number: receiptNumber,
      student_name: invoice.student_name,
      amount_paid_in_paise: data.amountInPaise,
      payment_method: data.paymentMethod,
      gateway_transaction_id: data.transactionId || `TXN-${Date.now()}`,
      payment_date: new Date().toISOString(),
      recorded_by: currentUser?.full_name || 'Accounts Clerk',
    }

    const updatedPaid = invoice.paid_amount_in_paise + data.amountInPaise
    const netPayable = invoice.total_amount_in_paise - invoice.discount_in_paise
    const newStatus: StudentInvoice['status'] =
      updatedPaid >= netPayable ? 'paid' : updatedPaid > 0 ? 'partially_paid' : 'unpaid'

    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === data.invoiceId
          ? { ...inv, paid_amount_in_paise: updatedPaid, status: newStatus }
          : inv
      )
    )

    setPayments((prev) => [newReceipt, ...prev])
    return newReceipt
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
