-- ============================================================================
-- EDUCORE — PHASE 3: LMS, CLASS POSTING & ASSIGNMENT WORKFLOW
-- ============================================================================

-- 1. CLASS POSTS & LEARNING MATERIALS
CREATE TABLE IF NOT EXISTS class_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES auth.users(id),
    section_id UUID,
    batch_id UUID,
    subject_id UUID,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    is_pinned BOOLEAN NOT NULL DEFAULT false,
    status VARCHAR(20) NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'scheduled', 'published', 'archived')),
    scheduled_for TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    FOREIGN KEY (institution_id, subject_id) REFERENCES subjects(institution_id, id) ON DELETE SET NULL,
    CONSTRAINT chk_post_cohort CHECK ((section_id IS NOT NULL AND batch_id IS NULL) OR (section_id IS NULL AND batch_id IS NOT NULL))
);

CREATE TABLE IF NOT EXISTS class_post_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    post_id UUID NOT NULL REFERENCES class_posts(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 2. ASSIGNMENTS
CREATE TABLE IF NOT EXISTS assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES auth.users(id),
    section_id UUID,
    batch_id UUID,
    subject_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    instructions TEXT NOT NULL,
    max_marks INT NOT NULL CHECK (max_marks > 0),
    deadline TIMESTAMPTZ NOT NULL,
    allow_late_submissions BOOLEAN NOT NULL DEFAULT false,
    status VARCHAR(20) NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'closed', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    FOREIGN KEY (institution_id, subject_id) REFERENCES subjects(institution_id, id) ON DELETE RESTRICT,
    CONSTRAINT chk_assignment_cohort CHECK ((section_id IS NOT NULL AND batch_id IS NULL) OR (section_id IS NULL AND batch_id IS NOT NULL))
);

-- 3. ASSIGNMENT SUBMISSIONS & GRADING
CREATE TABLE IF NOT EXISTS assignment_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    student_membership_id UUID NOT NULL,
    submission_text TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'late', 'under_review', 'evaluated', 'returned_for_correction')),
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    UNIQUE(assignment_id, student_membership_id),
    FOREIGN KEY (institution_id, student_membership_id) REFERENCES institution_memberships(institution_id, id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS assignment_grades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    submission_id UUID NOT NULL UNIQUE REFERENCES assignment_submissions(id) ON DELETE CASCADE,
    evaluator_id UUID NOT NULL REFERENCES auth.users(id),
    marks_obtained NUMERIC(6, 2) NOT NULL CHECK (marks_obtained >= 0),
    feedback TEXT,
    graded_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- Enable RLS
ALTER TABLE class_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_post_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_grades ENABLE ROW LEVEL SECURITY;

-- Policies for Class Posts
CREATE POLICY "Class posts tenant read"
ON class_posts FOR SELECT TO authenticated
USING (
    institution_id IN (
        SELECT im.institution_id FROM institution_memberships im
        WHERE im.user_id = auth.uid() AND im.status = 'active'
    )
);

-- Policies for Assignment Submissions (Anti-BOLA)
CREATE POLICY "Assignment submissions scoped access"
ON assignment_submissions FOR SELECT TO authenticated
USING (
    -- Submitting student
    student_membership_id IN (
        SELECT id FROM institution_memberships WHERE user_id = auth.uid()
    )
    OR
    -- Verified Guardian
    student_membership_id IN (
        SELECT gsl.student_membership_id FROM guardian_student_links gsl
        JOIN institution_memberships im ON gsl.guardian_membership_id = im.id
        WHERE im.user_id = auth.uid() AND gsl.verification_status = 'verified'
    )
    OR
    -- Faculty & Administration
    EXISTS (
        SELECT 1 FROM institution_memberships im
        WHERE im.institution_id = assignment_submissions.institution_id
          AND im.user_id = auth.uid()
          AND im.role IN ('institution_admin', 'manager', 'teacher')
          AND im.status = 'active'
    )
);
