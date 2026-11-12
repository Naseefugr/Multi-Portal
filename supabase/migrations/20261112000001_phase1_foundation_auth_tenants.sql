-- ============================================================================
-- EDUCORE — PHASE 1: FOUNDATION, AUTHENTICATION & MULTI-TENANT ISOLATION
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. PROFILES (Extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(150) NOT NULL,
    avatar_url TEXT,
    phone_number VARCHAR(25),
    is_platform_founder BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 2. INSTITUTIONS (Tenants)
CREATE TABLE IF NOT EXISTS institutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(63) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    institution_type VARCHAR(50) NOT NULL CHECK (institution_type IN ('school', 'tuition_centre', 'coaching_institute', 'academy', 'college')),
    status VARCHAR(30) NOT NULL DEFAULT 'active' CHECK (status IN ('pending_verification', 'active', 'suspended', 'archived')),
    logo_url TEXT,
    favicon_url TEXT,
    primary_color VARCHAR(10) DEFAULT '#2563eb',
    timezone VARCHAR(50) NOT NULL DEFAULT 'Asia/Kolkata',
    currency VARCHAR(3) NOT NULL DEFAULT 'INR',
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(25),
    address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    CONSTRAINT chk_slug_format CHECK (slug ~* '^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$')
);

CREATE INDEX IF NOT EXISTS idx_institutions_slug ON institutions(slug);
CREATE INDEX IF NOT EXISTS idx_institutions_status ON institutions(status);

-- 3. INSTITUTION MEMBERSHIPS & PERMISSIONS
CREATE TABLE IF NOT EXISTS institution_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(30) NOT NULL CHECK (role IN ('institution_admin', 'manager', 'teacher', 'student', 'parent')),
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'invited', 'suspended', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    UNIQUE (institution_id, user_id),
    UNIQUE (institution_id, id)
);

CREATE INDEX IF NOT EXISTS idx_memberships_inst_user ON institution_memberships(institution_id, user_id);
CREATE INDEX IF NOT EXISTS idx_memberships_role ON institution_memberships(institution_id, role);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE institution_memberships ENABLE ROW LEVEL SECURITY;

-- Helper: Platform Founder check
CREATE OR REPLACE FUNCTION is_platform_founder()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid() AND is_platform_founder = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Profiles Policies
CREATE POLICY "Profiles self view or founder"
ON profiles FOR SELECT TO authenticated
USING (id = auth.uid() OR is_platform_founder());

CREATE POLICY "Profiles self update"
ON profiles FOR UPDATE TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Institutions Policies
CREATE POLICY "Institutions public active read"
ON institutions FOR SELECT TO anon, authenticated
USING (status = 'active');

CREATE POLICY "Institutions founder full control"
ON institutions FOR ALL TO authenticated
USING (is_platform_founder())
WITH CHECK (is_platform_founder());

-- Memberships Policies
CREATE POLICY "Memberships tenant view"
ON institution_memberships FOR SELECT TO authenticated
USING (
    institution_id IN (
        SELECT im.institution_id FROM institution_memberships im
        WHERE im.user_id = auth.uid() AND im.status = 'active'
    )
    OR is_platform_founder()
);
