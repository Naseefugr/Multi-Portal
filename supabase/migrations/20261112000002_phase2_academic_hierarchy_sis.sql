-- ============================================================================
-- EDUCORE — PHASE 2: HYBRID ACADEMIC STRUCTURE & STUDENT INFORMATION SYSTEM
-- ============================================================================

-- 1. ACADEMIC YEARS
CREATE TABLE IF NOT EXISTS academic_years (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_current BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    UNIQUE(institution_id, name),
    UNIQUE(institution_id, id),
    CONSTRAINT chk_academic_dates CHECK (end_date > start_date)
);

-- 2. SCHOOL MODEL: CLASSES & SECTIONS
CREATE TABLE IF NOT EXISTS classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    academic_year_id UUID NOT NULL,
    name VARCHAR(100) NOT NULL,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    UNIQUE(institution_id, id),
    FOREIGN KEY (institution_id, academic_year_id) REFERENCES academic_years(institution_id, id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    class_id UUID NOT NULL,
    name VARCHAR(50) NOT NULL,
    capacity INT NOT NULL DEFAULT 40,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    UNIQUE(institution_id, id),
    UNIQUE(class_id, name),
    FOREIGN KEY (institution_id, class_id) REFERENCES classes(institution_id, id) ON DELETE CASCADE
);

-- 3. COACHING / TUITION MODEL: COURSES & BATCHES
CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    academic_year_id UUID NOT NULL,
    name VARCHAR(150) NOT NULL,
    code VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    UNIQUE(institution_id, id),
    FOREIGN KEY (institution_id, academic_year_id) REFERENCES academic_years(institution_id, id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    course_id UUID NOT NULL,
    name VARCHAR(100) NOT NULL,
    capacity INT NOT NULL DEFAULT 60,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    UNIQUE(institution_id, id),
    UNIQUE(course_id, name),
    FOREIGN KEY (institution_id, course_id) REFERENCES courses(institution_id, id) ON DELETE CASCADE
);

-- 4. MASTER SUBJECTS CATALOG
CREATE TABLE IF NOT EXISTS subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    code VARCHAR(30) NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    UNIQUE(institution_id, id),
    UNIQUE(institution_id, code)
);

-- 5. TEACHER ASSIGNMENTS & ALLOCATIONS
CREATE TABLE IF NOT EXISTS teacher_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    teacher_membership_id UUID NOT NULL,
    subject_id UUID NOT NULL,
    section_id UUID,
    batch_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    FOREIGN KEY (institution_id, teacher_membership_id) REFERENCES institution_memberships(institution_id, id) ON DELETE CASCADE,
    FOREIGN KEY (institution_id, subject_id) REFERENCES subjects(institution_id, id) ON DELETE CASCADE,
    CONSTRAINT chk_cohort_target CHECK ((section_id IS NOT NULL AND batch_id IS NULL) OR (section_id IS NULL AND batch_id IS NOT NULL))
);

-- 6. STUDENT ENROLLMENTS
CREATE TABLE IF NOT EXISTS student_enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    student_membership_id UUID NOT NULL,
    section_id UUID,
    batch_id UUID,
    roll_number VARCHAR(50),
    status VARCHAR(20) NOT NULL DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'promoted', 'graduated', 'transferred', 'withdrawn')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    FOREIGN KEY (institution_id, student_membership_id) REFERENCES institution_memberships(institution_id, id) ON DELETE CASCADE,
    CONSTRAINT chk_enrollment_target CHECK ((section_id IS NOT NULL AND batch_id IS NULL) OR (section_id IS NULL AND batch_id IS NOT NULL))
);

CREATE INDEX IF NOT EXISTS idx_student_enrollments_student ON student_enrollments(institution_id, student_membership_id);

-- 7. VERIFIED GUARDIAN-STUDENT RELATIONSHIPS (ANTI-IDOR)
CREATE TABLE IF NOT EXISTS guardian_student_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    guardian_membership_id UUID NOT NULL REFERENCES institution_memberships(id) ON DELETE CASCADE,
    student_membership_id UUID NOT NULL REFERENCES institution_memberships(id) ON DELETE CASCADE,
    relationship_type VARCHAR(30) NOT NULL CHECK (relationship_type IN ('father', 'mother', 'legal_guardian', 'sponsor', 'other')),
    is_emergency_contact BOOLEAN NOT NULL DEFAULT false,
    verification_status VARCHAR(20) NOT NULL DEFAULT 'verified' CHECK (verification_status IN ('pending', 'verified', 'revoked')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    UNIQUE(institution_id, guardian_membership_id, student_membership_id)
);

CREATE INDEX IF NOT EXISTS idx_guardian_links_lookup ON guardian_student_links(institution_id, guardian_membership_id);

-- 8. MANAGER PERMISSION OVERRIDES
CREATE TABLE IF NOT EXISTS member_permission_overrides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    membership_id UUID NOT NULL REFERENCES institution_memberships(id) ON DELETE CASCADE,
    permission_key VARCHAR(100) NOT NULL,
    is_granted BOOLEAN NOT NULL DEFAULT true,
    granted_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    UNIQUE (membership_id, permission_key)
);

-- Enable RLS across all Phase 2 tables
ALTER TABLE academic_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE guardian_student_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_permission_overrides ENABLE ROW LEVEL SECURITY;

-- Phase 2 RLS Policies
CREATE POLICY "Academic years tenant read"
ON academic_years FOR SELECT TO authenticated
USING (
    institution_id IN (
        SELECT im.institution_id FROM institution_memberships im
        WHERE im.user_id = auth.uid() AND im.status = 'active'
    )
);

CREATE POLICY "Classes tenant read"
ON classes FOR SELECT TO authenticated
USING (
    institution_id IN (
        SELECT im.institution_id FROM institution_memberships im
        WHERE im.user_id = auth.uid() AND im.status = 'active'
    )
);

CREATE POLICY "Sections tenant read"
ON sections FOR SELECT TO authenticated
USING (
    institution_id IN (
        SELECT im.institution_id FROM institution_memberships im
        WHERE im.user_id = auth.uid() AND im.status = 'active'
    )
);

CREATE POLICY "Subjects tenant read"
ON subjects FOR SELECT TO authenticated
USING (
    institution_id IN (
        SELECT im.institution_id FROM institution_memberships im
        WHERE im.user_id = auth.uid() AND im.status = 'active'
    )
);
