import type {
  Institution,
  InstitutionMembership,
  Profile,
  AcademicYear,
  SchoolClass,
  SchoolSection,
  CoachingCourse,
  CoachingBatch,
  Subject,
  TeacherAssignment,
  StudentRecord,
  PermissionOverride,
  ClassPost,
  Assignment,
  AssignmentSubmission,
  AttendanceSession,
  StudentAttendanceRecord,
  Examination,
  ExamSubjectResult,
  FeeCategory,
  FeeStructure,
  StudentInvoice,
  PaymentReceipt,
  Announcement,
  AppNotification,
  LiveClassSession,
} from '@/types/database.types'

export const BRIGHT_TENANT_ID = '0192e85a-0001-7000-8000-000000000001'
export const APEX_TENANT_ID = '0192e85a-0002-7000-8000-000000000002'
export const ALNOOR_TENANT_ID = '0192e85a-0003-7000-8000-000000000003'

export const INITIAL_INSTITUTIONS: Institution[] = [
  {
    id: BRIGHT_TENANT_ID,
    slug: 'bright',
    name: 'Bright Valley International School',
    institution_type: 'school',
    status: 'active',
    primary_color: '#2563eb',
    timezone: 'Asia/Kolkata',
    currency: 'INR',
    contact_email: 'admin@brightvalley.edu',
    contact_phone: '+91 98765 43210',
    address: '42 Knowledge Park, Tech Corridor, Bangalore',
    created_at: '2026-01-15T10:00:00Z',
    updated_at: '2026-01-15T10:00:00Z',
  },
  {
    id: APEX_TENANT_ID,
    slug: 'apex-prep',
    name: 'Apex Competitive Coaching Academy',
    institution_type: 'coaching_institute',
    status: 'active',
    primary_color: '#0891b2',
    timezone: 'Asia/Kolkata',
    currency: 'INR',
    contact_email: 'director@apexprep.com',
    contact_phone: '+91 91234 56789',
    address: '15 Scholar Avenue, Kota, Rajasthan',
    created_at: '2026-02-01T08:30:00Z',
    updated_at: '2026-02-01T08:30:00Z',
  },
  {
    id: ALNOOR_TENANT_ID,
    slug: 'alnoor',
    name: 'Al-Noor Grammar School',
    institution_type: 'school',
    status: 'suspended',
    primary_color: '#16a34a',
    timezone: 'Asia/Kolkata',
    currency: 'INR',
    contact_email: 'contact@alnoor.edu',
    contact_phone: '+91 99887 76655',
    address: 'Old Fort Road, Hyderabad',
    created_at: '2026-01-20T12:00:00Z',
    updated_at: '2026-02-10T14:00:00Z',
  },
]

export const INITIAL_PROFILES: Profile[] = [
  {
    id: 'usr-founder',
    full_name: 'Dr. Vikram Malhotra (Founder)',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    phone_number: '+91 90000 00001',
    is_platform_founder: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'usr-admin-bright',
    full_name: 'Principal Anita Sharma',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    phone_number: '+91 98765 11111',
    is_platform_founder: false,
    created_at: '2026-01-15T10:00:00Z',
    updated_at: '2026-01-15T10:00:00Z',
  },
  {
    id: 'usr-mgr-bright',
    full_name: 'Rohan Mehra (Academic Supervisor)',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    phone_number: '+91 98765 22222',
    is_platform_founder: false,
    created_at: '2026-01-16T10:00:00Z',
    updated_at: '2026-01-16T10:00:00Z',
  },
  {
    id: 'usr-teacher-bright',
    full_name: 'Prof. David Wilson (Senior Math Faculty)',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    phone_number: '+91 98765 33333',
    is_platform_founder: false,
    created_at: '2026-01-17T10:00:00Z',
    updated_at: '2026-01-17T10:00:00Z',
  },
  {
    id: 'usr-student-bright',
    full_name: 'Aarav Patel (Student, Grade 10-A)',
    avatar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
    phone_number: '+91 98765 44444',
    is_platform_founder: false,
    created_at: '2026-01-20T10:00:00Z',
    updated_at: '2026-01-20T10:00:00Z',
  },
  {
    id: 'usr-parent-bright',
    full_name: 'Rajesh Patel (Verified Guardian)',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    phone_number: '+91 98765 55555',
    is_platform_founder: false,
    created_at: '2026-01-20T10:00:00Z',
    updated_at: '2026-01-20T10:00:00Z',
  },
]

export const INITIAL_MEMBERSHIPS: InstitutionMembership[] = [
  {
    id: 'mem-admin-bright',
    institution_id: BRIGHT_TENANT_ID,
    user_id: 'usr-admin-bright',
    role: 'institution_admin',
    status: 'active',
    created_at: '2026-01-15T10:00:00Z',
    updated_at: '2026-01-15T10:00:00Z',
  },
  {
    id: 'mem-mgr-bright',
    institution_id: BRIGHT_TENANT_ID,
    user_id: 'usr-mgr-bright',
    role: 'manager',
    status: 'active',
    created_at: '2026-01-16T10:00:00Z',
    updated_at: '2026-01-16T10:00:00Z',
  },
  {
    id: 'mem-teacher-bright',
    institution_id: BRIGHT_TENANT_ID,
    user_id: 'usr-teacher-bright',
    role: 'teacher',
    status: 'active',
    created_at: '2026-01-17T10:00:00Z',
    updated_at: '2026-01-17T10:00:00Z',
  },
  {
    id: 'mem-student-bright',
    institution_id: BRIGHT_TENANT_ID,
    user_id: 'usr-student-bright',
    role: 'student',
    status: 'active',
    created_at: '2026-01-20T10:00:00Z',
    updated_at: '2026-01-20T10:00:00Z',
  },
  {
    id: 'mem-parent-bright',
    institution_id: BRIGHT_TENANT_ID,
    user_id: 'usr-parent-bright',
    role: 'parent',
    status: 'active',
    created_at: '2026-01-20T10:00:00Z',
    updated_at: '2026-01-20T10:00:00Z',
  },
]

export const INITIAL_MANAGER_OVERRIDES: PermissionOverride[] = [
  {
    id: 'ovr-1',
    institution_id: BRIGHT_TENANT_ID,
    membership_id: 'mem-mgr-bright',
    permission_key: 'attendance.record',
    is_granted: true,
    granted_by: 'usr-admin-bright',
    created_at: '2026-01-16T11:00:00Z',
  },
  {
    id: 'ovr-2',
    institution_id: BRIGHT_TENANT_ID,
    membership_id: 'mem-mgr-bright',
    permission_key: 'attendance.view_summary',
    is_granted: true,
    granted_by: 'usr-admin-bright',
    created_at: '2026-01-16T11:00:00Z',
  },
  {
    id: 'ovr-3',
    institution_id: BRIGHT_TENANT_ID,
    membership_id: 'mem-mgr-bright',
    permission_key: 'students.view_list',
    is_granted: true,
    granted_by: 'usr-admin-bright',
    created_at: '2026-01-16T11:00:00Z',
  },
  {
    id: 'ovr-4',
    institution_id: BRIGHT_TENANT_ID,
    membership_id: 'mem-mgr-bright',
    permission_key: 'class_posts.create',
    is_granted: true,
    granted_by: 'usr-admin-bright',
    created_at: '2026-01-16T11:00:00Z',
  },
]

export const INITIAL_ACADEMIC_YEARS: AcademicYear[] = [
  {
    id: 'ay-2026',
    institution_id: BRIGHT_TENANT_ID,
    name: 'Academic Year 2026–2027',
    start_date: '2026-04-01',
    end_date: '2027-03-31',
    is_current: true,
    created_at: '2026-01-15T10:00:00Z',
  },
]

export const INITIAL_CLASSES: SchoolClass[] = [
  {
    id: 'cls-g9',
    institution_id: BRIGHT_TENANT_ID,
    academic_year_id: 'ay-2026',
    name: 'Grade 9',
    display_order: 1,
    created_at: '2026-01-15T10:00:00Z',
  },
  {
    id: 'cls-g10',
    institution_id: BRIGHT_TENANT_ID,
    academic_year_id: 'ay-2026',
    name: 'Grade 10',
    display_order: 2,
    created_at: '2026-01-15T10:00:00Z',
  },
]

export const INITIAL_SECTIONS: SchoolSection[] = [
  {
    id: 'sec-g10-a',
    institution_id: BRIGHT_TENANT_ID,
    class_id: 'cls-g10',
    name: 'Section A (Newton)',
    capacity: 35,
    created_at: '2026-01-15T10:00:00Z',
  },
  {
    id: 'sec-g10-b',
    institution_id: BRIGHT_TENANT_ID,
    class_id: 'cls-g10',
    name: 'Section B (Einstein)',
    capacity: 35,
    created_at: '2026-01-15T10:00:00Z',
  },
]

export const INITIAL_COURSES: CoachingCourse[] = [
  {
    id: 'crs-jee-adv',
    institution_id: 'inst-002-apex',
    academic_year_id: 'ay-2026',
    name: 'IIT-JEE Advanced Mastery',
    code: 'JEE-ADV-26',
    created_at: '2026-02-01T09:00:00Z',
  },
]

export const INITIAL_BATCHES: CoachingBatch[] = [
  {
    id: 'btc-jee-alpha',
    institution_id: 'inst-002-apex',
    course_id: 'crs-jee-adv',
    name: 'Morning Alpha Super-30',
    capacity: 30,
    created_at: '2026-02-01T09:00:00Z',
  },
]

export const INITIAL_SUBJECTS: Subject[] = [
  {
    id: 'sbj-math',
    institution_id: BRIGHT_TENANT_ID,
    code: 'MTH-101',
    name: 'Pure & Applied Mathematics',
    description: 'Algebra, Geometry, Trigonometry, and Calculus foundations',
    created_at: '2026-01-15T10:00:00Z',
  },
  {
    id: 'sbj-phys',
    institution_id: BRIGHT_TENANT_ID,
    code: 'PHY-101',
    name: 'Physics & Mechanics',
    description: 'Kinematics, Thermodynamics, Optics, and Electromagnetism',
    created_at: '2026-01-15T10:00:00Z',
  },
]

export const INITIAL_TEACHER_ASSIGNMENTS: TeacherAssignment[] = [
  {
    id: 'tas-1',
    institution_id: BRIGHT_TENANT_ID,
    teacher_membership_id: 'mem-teacher-bright',
    subject_id: 'sbj-math',
    section_id: 'sec-g10-a',
    teacher_name: 'Prof. David Wilson',
    subject_name: 'Mathematics',
    cohort_name: 'Grade 10 - Section A',
    created_at: '2026-01-17T11:00:00Z',
  },
]

export const INITIAL_STUDENTS: StudentRecord[] = [
  {
    id: 'std-001',
    institution_id: BRIGHT_TENANT_ID,
    student_membership_id: 'mem-student-bright',
    admission_number: 'BVIS-2026-0104',
    full_name: 'Aarav Patel',
    email: 'aarav.patel@student.brightvalley.edu',
    phone: '+91 98765 44444',
    section_id: 'sec-g10-a',
    cohort_name: 'Grade 10 - Section A',
    roll_number: '10-A-01',
    status: 'enrolled',
    guardian_name: 'Rajesh Patel',
    guardian_phone: '+91 98765 55555',
    guardian_relationship: 'father',
    created_at: '2026-01-20T10:00:00Z',
  },
  {
    id: 'std-002',
    institution_id: BRIGHT_TENANT_ID,
    student_membership_id: 'mem-student-002',
    admission_number: 'BVIS-2026-0105',
    full_name: 'Diya Sengupta',
    email: 'diya.s@student.brightvalley.edu',
    phone: '+91 98765 44445',
    section_id: 'sec-g10-a',
    cohort_name: 'Grade 10 - Section A',
    roll_number: '10-A-02',
    status: 'enrolled',
    guardian_name: 'Anirban Sengupta',
    guardian_phone: '+91 98765 55556',
    guardian_relationship: 'father',
    created_at: '2026-01-21T10:00:00Z',
  },
  {
    id: 'std-003',
    institution_id: BRIGHT_TENANT_ID,
    student_membership_id: 'mem-student-003',
    admission_number: 'BVIS-2026-0106',
    full_name: 'Kabir Khan',
    email: 'kabir.k@student.brightvalley.edu',
    phone: '+91 98765 44446',
    section_id: 'sec-g10-a',
    cohort_name: 'Grade 10 - Section A',
    roll_number: '10-A-03',
    status: 'enrolled',
    guardian_name: 'Zoya Khan',
    guardian_phone: '+91 98765 55557',
    guardian_relationship: 'mother',
    created_at: '2026-01-22T10:00:00Z',
  },
]

// ============================================================================
// PHASE 3 SEED DATA: CLASS POSTS & ASSIGNMENTS
// ============================================================================

export const INITIAL_CLASS_POSTS: ClassPost[] = [
  {
    id: 'post-1',
    institution_id: BRIGHT_TENANT_ID,
    author_id: 'usr-teacher-bright',
    author_name: 'Prof. David Wilson',
    author_role: 'teacher',
    section_id: 'sec-g10-a',
    cohort_name: 'Grade 10 - Section A',
    subject_id: 'sbj-math',
    subject_name: 'Pure & Applied Mathematics',
    title: 'Trigonometric Identities & Quadratic Systems — Lecture Notes',
    content:
      'Dear Class 10-A, please find the comprehensive lecture handout for Chapter 4 attached below. We will solve exercises 4.1 through 4.4 in tomorrow\'s interactive tutorial session. Be sure to review the identities summary on page 3.',
    attachments: [
      {
        name: 'Trig_Quadratic_Systems_Notes.pdf',
        url: '#',
        size: '2.4 MB',
        type: 'application/pdf',
      },
      {
        name: 'Formula_Quick_Reference.png',
        url: '#',
        size: '480 KB',
        type: 'image/png',
      },
    ],
    is_pinned: true,
    status: 'published',
    created_at: '2026-11-10T09:30:00Z',
  },
  {
    id: 'post-2',
    institution_id: BRIGHT_TENANT_ID,
    author_id: 'usr-mgr-bright',
    author_name: 'Rohan Mehra',
    author_role: 'manager',
    section_id: 'sec-g10-a',
    cohort_name: 'Grade 10 - Section A',
    subject_id: null,
    subject_name: 'General Cohort Update',
    title: 'Mid-Year Laboratory Session Schedule Update',
    content:
      'Please note that Wednesday\'s Physics and Chemistry laboratory timing is shifted to 11:30 AM due to the Science Olympiad qualification briefing in the main auditorium.',
    attachments: [],
    is_pinned: false,
    status: 'published',
    created_at: '2026-11-11T14:15:00Z',
  },
]

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg-1',
    institution_id: BRIGHT_TENANT_ID,
    author_id: 'usr-teacher-bright',
    author_name: 'Prof. David Wilson',
    section_id: 'sec-g10-a',
    cohort_name: 'Grade 10 - Section A',
    subject_id: 'sbj-math',
    subject_name: 'Mathematics',
    title: 'Assignment 03 — Quadratic Applications & Graphing',
    instructions:
      'Solve problems 1 through 10 from the problem set. Show all intermediate factorization steps and clearly mark your vertices and axis of symmetry on the coordinate plane. Upload your scanned work as a single PDF.',
    max_marks: 100,
    deadline: '2026-11-20T23:59:59Z',
    allow_late_submissions: false,
    status: 'published',
    created_at: '2026-11-08T10:00:00Z',
  },
  {
    id: 'asg-2',
    institution_id: BRIGHT_TENANT_ID,
    author_id: 'usr-teacher-bright',
    author_name: 'Prof. David Wilson',
    section_id: 'sec-g10-a',
    cohort_name: 'Grade 10 - Section A',
    subject_id: 'sbj-math',
    subject_name: 'Mathematics',
    title: 'Assignment 04 — Polynomial Remainder Theorem (Mini-Project)',
    instructions:
      'Draft a 2-page exploratory solution analyzing real roots using synthetic division. Ensure proper mathematical typesetting or neat handwritten scans.',
    max_marks: 50,
    deadline: '2026-11-28T18:00:00Z',
    allow_late_submissions: true,
    status: 'published',
    created_at: '2026-11-11T12:00:00Z',
  },
]

export const INITIAL_SUBMISSIONS: AssignmentSubmission[] = [
  {
    id: 'sub-1',
    institution_id: BRIGHT_TENANT_ID,
    assignment_id: 'asg-1',
    student_membership_id: 'mem-student-bright',
    student_name: 'Aarav Patel',
    submission_text:
      'Attached is my completed solutions document for Assignment 03. All 10 graphing exercises have been verified with algebraic solutions.',
    attachment_file_name: 'Aarav_Patel_Assignment_03_Work.pdf',
    submitted_at: '2026-11-11T16:20:00Z',
    status: 'evaluated',
    grade: {
      marks_obtained: 94,
      max_marks: 100,
      feedback:
        'Excellent work, Aarav! Your vertex calculations and graphical curves are very precise. Keep up the high standard.',
      evaluator_name: 'Prof. David Wilson',
      graded_at: '2026-11-12T08:00:00Z',
    },
  },
  {
    id: 'sub-2',
    institution_id: BRIGHT_TENANT_ID,
    assignment_id: 'asg-1',
    student_membership_id: 'mem-student-002',
    student_name: 'Diya Sengupta',
    submission_text:
      'Submitted solutions. Graph 7 curve has been verified with synthetic substitution.',
    attachment_file_name: 'Diya_Sengupta_Asg3.pdf',
    submitted_at: '2026-11-11T18:45:00Z',
    status: 'submitted',
  },
]

// ============================================================================
// PHASE 4 SEED DATA: ATTENDANCE, EXAMINATIONS, FEES & LEDGER
// ============================================================================

export const INITIAL_ATTENDANCE_SESSIONS: AttendanceSession[] = [
  {
    id: 'att-sess-1',
    institution_id: BRIGHT_TENANT_ID,
    session_date: '2026-11-12',
    section_id: 'sec-g10-a',
    cohort_name: 'Grade 10 - Section A',
    subject_id: 'sbj-math',
    subject_name: 'Mathematics Period 1',
    recorded_by_name: 'Prof. David Wilson',
    created_at: '2026-11-12T08:30:00Z',
  },
]

export const INITIAL_ATTENDANCE_RECORDS: StudentAttendanceRecord[] = [
  {
    id: 'att-rec-1',
    institution_id: BRIGHT_TENANT_ID,
    session_id: 'att-sess-1',
    student_id: 'std-001',
    student_name: 'Aarav Patel',
    admission_number: 'BVIS-2026-0104',
    status: 'present',
    remarks: 'Active participation in algebra proofs',
  },
  {
    id: 'att-rec-2',
    institution_id: BRIGHT_TENANT_ID,
    session_id: 'att-sess-1',
    student_id: 'std-002',
    student_name: 'Diya Sengupta',
    admission_number: 'BVIS-2026-0105',
    status: 'present',
  },
  {
    id: 'att-rec-3',
    institution_id: BRIGHT_TENANT_ID,
    session_id: 'att-sess-1',
    student_id: 'std-003',
    student_name: 'Kabir Khan',
    admission_number: 'BVIS-2026-0106',
    status: 'late',
    remarks: 'Arrived at 08:42 AM due to transit delay',
  },
]

export const INITIAL_EXAMS: Examination[] = [
  {
    id: 'ex-midterm-26',
    institution_id: BRIGHT_TENANT_ID,
    name: 'Term 1 Mid-Year Examination (October 2026)',
    academic_year_id: 'ay-2026',
    start_date: '2026-10-15',
    end_date: '2026-10-24',
    status: 'published',
    created_at: '2026-09-30T10:00:00Z',
  },
]

export const INITIAL_EXAM_RESULTS: ExamSubjectResult[] = [
  {
    id: 'res-1',
    exam_id: 'ex-midterm-26',
    subject_id: 'sbj-math',
    subject_name: 'Mathematics',
    student_id: 'std-001',
    student_name: 'Aarav Patel',
    admission_number: 'BVIS-2026-0104',
    cohort_name: 'Grade 10 - Section A',
    max_marks: 100,
    passing_marks: 40,
    marks_obtained: 95,
    grade_letter: 'A+',
    remarks: 'Outstanding analytical prowess; top cohort score.',
  },
  {
    id: 'res-2',
    exam_id: 'ex-midterm-26',
    subject_id: 'sbj-phys',
    subject_name: 'Physics',
    student_id: 'std-001',
    student_name: 'Aarav Patel',
    admission_number: 'BVIS-2026-0104',
    cohort_name: 'Grade 10 - Section A',
    max_marks: 100,
    passing_marks: 40,
    marks_obtained: 91,
    grade_letter: 'A+',
    remarks: 'Thorough understanding of kinematics and mechanics.',
  },
  {
    id: 'res-3',
    exam_id: 'ex-midterm-26',
    subject_id: 'sbj-math',
    subject_name: 'Mathematics',
    student_id: 'std-002',
    student_name: 'Diya Sengupta',
    admission_number: 'BVIS-2026-0105',
    cohort_name: 'Grade 10 - Section A',
    max_marks: 100,
    passing_marks: 40,
    marks_obtained: 88,
    grade_letter: 'A',
    remarks: 'Consistent problem solving with good presentation.',
  },
]

export const INITIAL_FEE_CATEGORIES: FeeCategory[] = [
  {
    id: 'fc-tuition',
    institution_id: BRIGHT_TENANT_ID,
    name: 'Tuition Fee (Term 1)',
    description: 'Academic tuition and classroom instruction',
  },
  {
    id: 'fc-lab',
    institution_id: BRIGHT_TENANT_ID,
    name: 'Science & Computer Lab Fee',
    description: 'Laboratory equipment, materials, and digital infrastructure',
  },
  {
    id: 'fc-transport',
    institution_id: BRIGHT_TENANT_ID,
    name: 'Campus Transportation',
    description: 'Quarterly bus pass and transit route fees',
  },
]

export const INITIAL_FEE_STRUCTURES: FeeStructure[] = [
  {
    id: 'fs-1',
    institution_id: BRIGHT_TENANT_ID,
    academic_year_id: 'ay-2026',
    fee_category_id: 'fc-tuition',
    fee_category_name: 'Tuition Fee (Term 1)',
    cohort_name: 'Grade 10',
    amount_in_paise: 2500000, // ₹25,000.00 in minor paise
    due_date: '2026-11-30',
  },
  {
    id: 'fs-2',
    institution_id: BRIGHT_TENANT_ID,
    academic_year_id: 'ay-2026',
    fee_category_id: 'fc-lab',
    fee_category_name: 'Science & Computer Lab Fee',
    cohort_name: 'Grade 10',
    amount_in_paise: 500000, // ₹5,000.00
    due_date: '2026-11-30',
  },
]

export const INITIAL_INVOICES: StudentInvoice[] = [
  {
    id: 'inv-101',
    institution_id: BRIGHT_TENANT_ID,
    invoice_number: 'BVIS-INV-2026-0089',
    student_id: 'std-001',
    student_name: 'Aarav Patel',
    admission_number: 'BVIS-2026-0104',
    cohort_name: 'Grade 10 - Section A',
    total_amount_in_paise: 3000000, // ₹30,000.00
    discount_in_paise: 300000, // ₹3,000.00 Academic Merit Scholarship
    paid_amount_in_paise: 2700000, // ₹27,000.00 Paid in full
    due_date: '2026-11-30',
    status: 'paid',
    created_at: '2026-10-01T10:00:00Z',
  },
  {
    id: 'inv-102',
    institution_id: BRIGHT_TENANT_ID,
    invoice_number: 'BVIS-INV-2026-0090',
    student_id: 'std-002',
    student_name: 'Diya Sengupta',
    admission_number: 'BVIS-2026-0105',
    cohort_name: 'Grade 10 - Section A',
    total_amount_in_paise: 3000000,
    discount_in_paise: 0,
    paid_amount_in_paise: 1500000, // ₹15,000.00 partially paid
    due_date: '2026-11-30',
    status: 'partially_paid',
    created_at: '2026-10-01T10:00:00Z',
  },
  {
    id: 'inv-103',
    institution_id: BRIGHT_TENANT_ID,
    invoice_number: 'BVIS-INV-2026-0091',
    student_id: 'std-003',
    student_name: 'Kabir Khan',
    admission_number: 'BVIS-2026-0106',
    cohort_name: 'Grade 10 - Section A',
    total_amount_in_paise: 3000000,
    discount_in_paise: 0,
    paid_amount_in_paise: 0, // Unpaid
    due_date: '2026-11-30',
    status: 'unpaid',
    created_at: '2026-10-01T10:00:00Z',
  },
]

export const INITIAL_PAYMENTS: PaymentReceipt[] = [
  {
    id: 'pay-001',
    institution_id: BRIGHT_TENANT_ID,
    invoice_id: 'inv-101',
    invoice_number: 'BVIS-INV-2026-0089',
    receipt_number: 'BVIS-REC-2026-0044',
    student_name: 'Aarav Patel',
    amount_paid_in_paise: 2700000,
    payment_method: 'upi',
    gateway_transaction_id: 'UPI-9847291048-AXIS',
    payment_date: '2026-10-10T14:20:00Z',
    recorded_by: 'Online Parent Gateway',
  },
  {
    id: 'pay-002',
    institution_id: BRIGHT_TENANT_ID,
    invoice_id: 'inv-102',
    invoice_number: 'BVIS-INV-2026-0090',
    receipt_number: 'BVIS-REC-2026-0045',
    student_name: 'Diya Sengupta',
    amount_paid_in_paise: 1500000,
    payment_method: 'net_banking',
    gateway_transaction_id: 'HDFC-NET-77821940',
    payment_date: '2026-10-15T11:00:00Z',
    recorded_by: 'Accounts Counter',
  },
]

// ============================================================================
// PHASE 5 SEED DATA: ANNOUNCEMENTS, NOTIFICATIONS & LIVE SESSIONS
// ============================================================================

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    institution_id: BRIGHT_TENANT_ID,
    title: 'Annual Inter-School STEM Innovation Exhibition & Fair 2026',
    content:
      'We are delighted to announce that Bright Valley will host the Regional STEM Fair on December 14th. All high school students wishing to present project prototypes should submit their abstracts to the Science Department by November 25th.',
    author_name: 'Principal Anita Sharma',
    scope: 'all',
    is_urgent: true,
    created_at: '2026-11-09T08:00:00Z',
  },
  {
    id: 'ann-2',
    institution_id: BRIGHT_TENANT_ID,
    title: 'Grade 10 Extra Math Doubt-Clearing Virtual Session',
    content:
      'Prof. David Wilson will conduct a live virtual review session on quadratic equations this Saturday at 10:00 AM. Check the Live Classes tab for the secure join link.',
    author_name: 'Prof. David Wilson',
    scope: 'cohort',
    cohort_name: 'Grade 10 - Section A',
    is_urgent: false,
    created_at: '2026-11-11T16:00:00Z',
  },
]

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    institution_id: BRIGHT_TENANT_ID,
    user_id: 'usr-student-bright',
    title: 'New Assignment Published',
    message: 'Prof. David Wilson published "Assignment 04 — Polynomial Remainder Theorem".',
    type: 'assignment',
    is_read: false,
    created_at: '2026-11-11T12:00:00Z',
  },
  {
    id: 'notif-2',
    institution_id: BRIGHT_TENANT_ID,
    user_id: 'usr-student-bright',
    title: 'Grade Evaluated & Published',
    message: 'Your submission for Assignment 03 scored 94/100 (A+). View feedback.',
    type: 'assignment',
    is_read: false,
    created_at: '2026-11-12T08:00:00Z',
  },
  {
    id: 'notif-3',
    institution_id: BRIGHT_TENANT_ID,
    user_id: 'usr-student-bright',
    title: 'Upcoming Virtual Live Class',
    message: 'Trigonometry & Calculus Masterclass begins Saturday at 10:00 AM.',
    type: 'live_class',
    is_read: true,
    created_at: '2026-11-11T16:05:00Z',
  },
]

export const INITIAL_LIVE_CLASSES: LiveClassSession[] = [
  {
    id: 'live-1',
    institution_id: BRIGHT_TENANT_ID,
    title: 'Trigonometry & Quadratic Systems Masterclass',
    agenda: 'In-depth problem solving for exercises 4.1 to 4.4 and Q&A on graphing symmetry.',
    cohort_name: 'Grade 10 - Section A',
    section_id: 'sec-g10-a',
    subject_name: 'Mathematics',
    host_teacher_name: 'Prof. David Wilson',
    start_time: '2026-11-15T10:00:00Z',
    duration_minutes: 60,
    provider: 'jitsi',
    join_url: 'https://meet.jit.si/EduCore-Bright-G10-Math-2026',
    status: 'scheduled',
    participants_count: 32,
  },
  {
    id: 'live-2',
    institution_id: BRIGHT_TENANT_ID,
    title: 'Physics Mechanics & Newton Laws Discussion',
    agenda: 'Friction, momentum conservation, and projectile motion review.',
    cohort_name: 'Grade 10 - Section A',
    section_id: 'sec-g10-a',
    subject_name: 'Physics',
    host_teacher_name: 'Dr. Radhika Sen',
    start_time: '2026-11-16T14:30:00Z',
    duration_minutes: 45,
    provider: 'google_meet',
    join_url: 'https://meet.google.com/edu-bright-phys',
    status: 'scheduled',
    participants_count: 35,
  },
]
