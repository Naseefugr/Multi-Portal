export type InstitutionType =
  | 'school'
  | 'tuition_centre'
  | 'coaching_institute'
  | 'academy'
  | 'college'

export type TenantStatus =
  | 'pending_verification'
  | 'active'
  | 'suspended'
  | 'archived'

export type UserRole =
  | 'platform_founder'
  | 'institution_admin'
  | 'manager'
  | 'teacher'
  | 'student'
  | 'parent'

export type MembershipStatus = 'active' | 'invited' | 'suspended' | 'archived'

export interface Profile {
  id: string
  full_name: string
  avatar_url?: string | null
  phone_number?: string | null
  is_platform_founder: boolean
  created_at: string
  updated_at: string
}

export interface Institution {
  id: string
  slug: string
  name: string
  institution_type: InstitutionType
  status: TenantStatus
  logo_url?: string | null
  favicon_url?: string | null
  primary_color: string
  timezone: string
  currency: string
  contact_email: string
  contact_phone?: string | null
  address?: string | null
  created_at: string
  updated_at: string
}

export interface InstitutionMembership {
  id: string
  institution_id: string
  user_id: string
  role: UserRole
  status: MembershipStatus
  created_at: string
  updated_at: string
  profile?: Profile
}

export interface AcademicYear {
  id: string
  institution_id: string
  name: string
  start_date: string
  end_date: string
  is_current: boolean
  created_at: string
}

export interface SchoolClass {
  id: string
  institution_id: string
  academic_year_id: string
  name: string
  display_order: number
  created_at: string
}

export interface SchoolSection {
  id: string
  institution_id: string
  class_id: string
  name: string
  capacity: number
  created_at: string
}

export interface CoachingCourse {
  id: string
  institution_id: string
  academic_year_id: string
  name: string
  code?: string | null
  created_at: string
}

export interface CoachingBatch {
  id: string
  institution_id: string
  course_id: string
  name: string
  capacity: number
  created_at: string
}

export interface Subject {
  id: string
  institution_id: string
  code: string
  name: string
  description?: string | null
  created_at: string
}

export interface TeacherAssignment {
  id: string
  institution_id: string
  teacher_membership_id: string
  subject_id: string
  section_id?: string | null
  batch_id?: string | null
  teacher_name?: string
  subject_name?: string
  cohort_name?: string
  created_at: string
}

export interface StudentRecord {
  id: string
  institution_id: string
  student_membership_id: string
  admission_number: string
  full_name: string
  email: string
  phone?: string | null
  section_id?: string | null
  batch_id?: string | null
  cohort_name?: string
  roll_number?: string | null
  status: 'enrolled' | 'promoted' | 'graduated' | 'transferred' | 'withdrawn'
  guardian_name?: string
  guardian_phone?: string
  guardian_relationship?: string
  created_at: string
}

export interface GuardianStudentLink {
  id: string
  institution_id: string
  guardian_membership_id: string
  student_membership_id: string
  relationship_type: 'father' | 'mother' | 'legal_guardian' | 'sponsor' | 'other'
  is_emergency_contact: boolean
  verification_status: 'pending' | 'verified' | 'revoked'
  created_at: string
}

export interface PermissionOverride {
  id: string
  institution_id: string
  membership_id: string
  permission_key: string
  is_granted: boolean
  granted_by: string
  created_at: string
}

// ============================================================================
// PHASE 3: LEARNING MANAGEMENT SYSTEM (CLASS POSTS & ASSIGNMENTS)
// ============================================================================

export interface ClassPost {
  id: string
  institution_id: string
  author_id: string
  author_name: string
  author_role: string
  section_id?: string | null
  batch_id?: string | null
  cohort_name: string
  subject_id?: string | null
  subject_name?: string | null
  title: string
  content: string
  attachments: { name: string; url: string; size: string; type: string }[]
  is_pinned: boolean
  status: 'draft' | 'published' | 'archived'
  created_at: string
}

export interface Assignment {
  id: string
  institution_id: string
  author_id: string
  author_name: string
  section_id?: string | null
  batch_id?: string | null
  cohort_name: string
  subject_id: string
  subject_name: string
  title: string
  instructions: string
  max_marks: number
  deadline: string
  allow_late_submissions: boolean
  status: 'draft' | 'published' | 'closed'
  created_at: string
}

export interface AssignmentSubmission {
  id: string
  institution_id: string
  assignment_id: string
  student_membership_id: string
  student_name: string
  submission_text?: string
  attachment_file_name?: string
  submitted_at: string
  status: 'submitted' | 'late' | 'under_review' | 'evaluated' | 'returned_for_correction'
  grade?: {
    marks_obtained: number
    max_marks: number
    feedback: string
    evaluator_name: string
    graded_at: string
  }
}

// ============================================================================
// PHASE 4: OPERATIONS (ATTENDANCE, EXAMS, FEES & LEDGER)
// ============================================================================

export interface AttendanceSession {
  id: string
  institution_id: string
  session_date: string
  section_id?: string | null
  batch_id?: string | null
  subject_id?: string | null
  cohort_name: string
  subject_name?: string
  recorded_by_name: string
  created_at: string
}

export interface StudentAttendanceRecord {
  id: string
  institution_id: string
  session_id: string
  student_id: string
  student_name: string
  admission_number: string
  status: 'present' | 'absent' | 'late' | 'excused' | 'sick_leave'
  remarks?: string
}

export interface Examination {
  id: string
  institution_id: string
  name: string // e.g. "Term 1 Mid-Year Examination"
  academic_year_id: string
  start_date: string
  end_date: string
  status: 'draft' | 'in_progress' | 'grading' | 'published'
  created_at: string
}

export interface ExamSubjectResult {
  id: string
  exam_id: string
  subject_id: string
  subject_name: string
  student_id: string
  student_name: string
  admission_number: string
  cohort_name: string
  max_marks: number
  passing_marks: number
  marks_obtained: number
  grade_letter: string
  remarks?: string
}

export interface FeeCategory {
  id: string
  institution_id: string
  name: string
  description?: string
}

export interface FeeStructure {
  id: string
  institution_id: string
  academic_year_id: string
  fee_category_id: string
  fee_category_name: string
  cohort_name: string
  amount_in_paise: number // 64-bit integer minor units (paise in INR)
  due_date: string
}

export interface StudentInvoice {
  id: string
  institution_id: string
  invoice_number: string
  student_id: string
  student_name: string
  admission_number: string
  cohort_name: string
  total_amount_in_paise: number
  discount_in_paise: number
  paid_amount_in_paise: number
  due_date: string
  status: 'unpaid' | 'partially_paid' | 'paid' | 'cancelled'
  created_at: string
}

export interface PaymentReceipt {
  id: string
  institution_id: string
  invoice_id: string
  invoice_number: string
  receipt_number: string
  student_name: string
  amount_paid_in_paise: number
  payment_method: 'cash' | 'upi' | 'credit_card' | 'net_banking' | 'cheque'
  gateway_transaction_id?: string
  payment_date: string
  recorded_by: string
}

// ============================================================================
// PHASE 5: COMMUNICATIONS & LIVE VIRTUAL CLASSES
// ============================================================================

export interface Announcement {
  id: string
  institution_id: string
  title: string
  content: string
  author_name: string
  scope: 'all' | 'students' | 'teachers' | 'parents' | 'cohort'
  cohort_name?: string
  is_urgent: boolean
  created_at: string
}

export interface AppNotification {
  id: string
  institution_id: string
  user_id: string
  title: string
  message: string
  type: 'assignment' | 'class_post' | 'fee' | 'exam' | 'live_class' | 'general'
  is_read: boolean
  created_at: string
}

export interface LiveClassSession {
  id: string
  institution_id: string
  title: string
  agenda?: string
  cohort_name: string
  section_id?: string | null
  batch_id?: string | null
  subject_name: string
  host_teacher_name: string
  start_time: string
  duration_minutes: number
  provider: 'zoom' | 'google_meet' | 'jitsi'
  join_url: string
  status: 'scheduled' | 'live' | 'completed' | 'cancelled'
  participants_count?: number
}
