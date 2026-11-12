-- ============================================================================
-- EDUCORE — SEED DATA: MULTI-TENANT INSTITUTIONS & DEMO ACADEMIC STRUCTURE
-- ============================================================================

-- 1. Insert Initial Institutions
INSERT INTO institutions (id, slug, name, institution_type, status, primary_color, timezone, currency, contact_email, address)
VALUES 
(
    '0192e85a-0001-7000-8000-000000000001',
    'bright',
    'Bright Valley International School',
    'school',
    'active',
    '#2563eb',
    'Asia/Kolkata',
    'INR',
    'admin@brightvalley.edu',
    '42 Knowledge Park, Tech Corridor, Bangalore'
),
(
    '0192e85a-0002-7000-8000-000000000002',
    'apex-prep',
    'Apex Competitive Coaching Academy',
    'coaching_institute',
    'active',
    '#0891b2',
    'Asia/Kolkata',
    'INR',
    'director@apexprep.com',
    '15 Scholar Avenue, Kota, Rajasthan'
),
(
    '0192e85a-0003-7000-8000-000000000003',
    'alnoor',
    'Al-Noor Grammar School',
    'school',
    'suspended',
    '#16a34a',
    'Asia/Kolkata',
    'INR',
    'contact@alnoor.edu',
    'Old Fort Road, Hyderabad'
)
ON CONFLICT (slug) DO NOTHING;

-- 2. Insert Academic Year for Bright Valley
INSERT INTO academic_years (id, institution_id, name, start_date, end_date, is_current)
VALUES (
    '0192e85a-0010-7000-8000-000000000001',
    '0192e85a-0001-7000-8000-000000000001',
    'Academic Year 2026–2027',
    '2026-04-01',
    '2027-03-31',
    true
)
ON CONFLICT DO NOTHING;

-- 3. Insert Classes & Sections (School Model)
INSERT INTO classes (id, institution_id, academic_year_id, name, display_order)
VALUES 
('0192e85a-0020-7000-8000-000000000001', '0192e85a-0001-7000-8000-000000000001', '0192e85a-0010-7000-8000-000000000001', 'Grade 9', 1),
('0192e85a-0020-7000-8000-000000000002', '0192e85a-0001-7000-8000-000000000001', '0192e85a-0010-7000-8000-000000000001', 'Grade 10', 2)
ON CONFLICT DO NOTHING;

INSERT INTO sections (id, institution_id, class_id, name, capacity)
VALUES 
('0192e85a-0030-7000-8000-000000000001', '0192e85a-0001-7000-8000-000000000001', '0192e85a-0020-7000-8000-000000000002', 'Section A (Newton)', 35),
('0192e85a-0030-7000-8000-000000000002', '0192e85a-0001-7000-8000-000000000001', '0192e85a-0020-7000-8000-000000000002', 'Section B (Einstein)', 35)
ON CONFLICT DO NOTHING;

-- 4. Insert Master Subjects
INSERT INTO subjects (id, institution_id, code, name, description)
VALUES 
('0192e85a-0040-7000-8000-000000000001', '0192e85a-0001-7000-8000-000000000001', 'MTH-101', 'Mathematics', 'Algebra, Geometry, Trigonometry'),
('0192e85a-0040-7000-8000-000000000002', '0192e85a-0001-7000-8000-000000000001', 'PHY-101', 'Physics', 'Mechanics, Optics, Thermodynamics')
ON CONFLICT DO NOTHING;
