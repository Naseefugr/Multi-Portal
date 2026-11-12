-- ============================================================================
-- EDUCORE — PHASE 5: COMMUNICATIONS & LIVE VIRTUAL CLASSES
-- ============================================================================

-- 1. ANNOUNCEMENTS
CREATE TABLE IF NOT EXISTS announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES auth.users(id),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    scope VARCHAR(20) NOT NULL DEFAULT 'all' CHECK (scope IN ('all', 'students', 'teachers', 'parents', 'cohort')),
    section_id UUID,
    batch_id UUID,
    is_urgent BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 2. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(30) NOT NULL DEFAULT 'general',
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 3. LIVE VIRTUAL CLASSES
CREATE TABLE IF NOT EXISTS live_classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    host_teacher_id UUID NOT NULL REFERENCES auth.users(id),
    section_id UUID,
    batch_id UUID,
    subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    agenda TEXT,
    start_time TIMESTAMPTZ NOT NULL,
    duration_minutes INT NOT NULL DEFAULT 45,
    provider VARCHAR(30) NOT NULL DEFAULT 'jitsi' CHECK (provider IN ('zoom', 'google_meet', 'jitsi')),
    encrypted_host_token TEXT, -- Private host secret; NEVER exposed to students
    public_join_url TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- Enable RLS
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_classes ENABLE ROW LEVEL SECURITY;

-- Notifications Self Policy
CREATE POLICY "Users view own notifications"
ON notifications FOR SELECT TO authenticated
USING (user_id = auth.uid());
