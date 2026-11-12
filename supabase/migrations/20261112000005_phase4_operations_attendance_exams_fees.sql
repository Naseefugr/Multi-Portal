-- ============================================================================
-- EDUCORE — PHASE 4: OPERATIONS (ATTENDANCE, EXAMINATIONS, FEES & LEDGER)
-- ============================================================================

-- 1. ATTENDANCE SESSIONS & STUDENT ATTENDANCE
CREATE TABLE IF NOT EXISTS attendance_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    session_date DATE NOT NULL,
    section_id UUID,
    batch_id UUID,
    subject_id UUID,
    recorded_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    UNIQUE(institution_id, session_date, section_id, batch_id, subject_id)
);

CREATE TABLE IF NOT EXISTS student_attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    session_id UUID NOT NULL REFERENCES attendance_sessions(id) ON DELETE CASCADE,
    student_membership_id UUID NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused', 'sick_leave')),
    remarks VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    UNIQUE(session_id, student_membership_id),
    FOREIGN KEY (institution_id, student_membership_id) REFERENCES institution_memberships(institution_id, id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_student_attendance_student ON student_attendance(institution_id, student_membership_id);

-- 2. EXAMINATIONS & RESULTS
CREATE TABLE IF NOT EXISTS examinations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    academic_year_id UUID NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'published',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS marks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    exam_id UUID NOT NULL REFERENCES examinations(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    student_membership_id UUID NOT NULL,
    marks_obtained NUMERIC(6, 2) NOT NULL CHECK (marks_obtained >= 0),
    max_marks INT NOT NULL DEFAULT 100,
    passing_marks INT NOT NULL DEFAULT 40,
    grade_letter VARCHAR(5) NOT NULL,
    remarks TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    FOREIGN KEY (institution_id, student_membership_id) REFERENCES institution_memberships(institution_id, id) ON DELETE CASCADE
);

-- 3. FEES & MINOR-UNIT FINANCIAL LEDGER
CREATE TABLE IF NOT EXISTS fee_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    UNIQUE(institution_id, name)
);

CREATE TABLE IF NOT EXISTS fee_structures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    academic_year_id UUID NOT NULL,
    fee_category_id UUID NOT NULL REFERENCES fee_categories(id) ON DELETE CASCADE,
    class_id UUID REFERENCES classes(id),
    course_id UUID REFERENCES courses(id),
    amount_in_paise BIGINT NOT NULL CHECK (amount_in_paise > 0),
    due_date DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS student_invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    invoice_number VARCHAR(60) NOT NULL,
    student_membership_id UUID NOT NULL,
    total_amount_in_paise BIGINT NOT NULL CHECK (total_amount_in_paise >= 0),
    discount_in_paise BIGINT NOT NULL DEFAULT 0 CHECK (discount_in_paise >= 0),
    paid_amount_in_paise BIGINT NOT NULL DEFAULT 0 CHECK (paid_amount_in_paise >= 0),
    due_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'unpaid' CHECK (status IN ('unpaid', 'partially_paid', 'paid', 'cancelled', 'refunded')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    UNIQUE(institution_id, invoice_number),
    FOREIGN KEY (institution_id, student_membership_id) REFERENCES institution_memberships(institution_id, id) ON DELETE CASCADE
);

-- Immutable Payments Table (Append-Only)
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    invoice_id UUID NOT NULL REFERENCES student_invoices(id) ON DELETE RESTRICT,
    receipt_number VARCHAR(60) NOT NULL,
    amount_paid_in_paise BIGINT NOT NULL CHECK (amount_paid_in_paise > 0),
    payment_method VARCHAR(30) NOT NULL CHECK (payment_method IN ('cash', 'upi', 'credit_card', 'net_banking', 'cheque', 'bank_transfer')),
    gateway_transaction_id VARCHAR(100),
    payment_date TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    recorded_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    UNIQUE(institution_id, receipt_number)
);

-- Enable RLS
ALTER TABLE attendance_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE examinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE marks ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
