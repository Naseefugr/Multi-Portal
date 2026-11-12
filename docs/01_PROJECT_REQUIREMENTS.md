# EDUCORE — Master Project Requirements Document (PRD)
## Multi-Tenant Education Management SaaS Platform

---

## 1. Document Control & Metadata
- **Product Name:** EduCore
- **Document Version:** 1.0.0
- **Classification:** Production Architecture & Engineering Specification
- **Target Audience:** Platform Architects, Lead Engineers, Database Administrators, Security Auditors, Product Executives
- **Scope:** Complete functional, operational, architectural, and security requirements for a production-grade multi-tenant educational SaaS platform.

---

## 2. Executive Summary & Product Vision

### 2.1 Product Mission
**EduCore** is an enterprise-ready, multi-tenant Education Management Software-as-a-Service (SaaS) platform engineered to serve thousands of autonomous educational institutions—including K-12 private and public schools, tuition centres, competitive coaching institutes, test-preparation academies, and vocational colleges.

Unlike fragmented, legacy, or single-institution school management systems, EduCore provides a unified, highly scalable, and secure cloud operating system where:
1. **The Platform Owner (Founder / Super Admin)** maintains complete oversight over the platform ecosystem, tenant lifecycles, billing, platform-wide feature gates, global usage telemetry, and compliance.
2. **Every Educational Institution** operates within an isolated, white-labeled virtual portal addressed via a dedicated subdomain (e.g., `bright.educore.com`, `greenvalley.educore.com`, `alnoor.educore.com`) or custom domains.
3. **Users (Administrators, Managers, Teachers, Students, and Parents)** access role-tailored dashboards and capabilities through a single unified authentication system, while tenant boundaries are enforced deterministically at the database level.

### 2.2 Core Architectural Axioms
1. **One Central Platform:** Single codebase, single deployment pipeline, zero duplicate tenant application builds.
2. **Global Identity, Local Authority:** A user possesses a single universal authentication identity (`auth.users`), but holds independent, institution-scoped memberships and role permissions across one or multiple institutions.
3. **Strict Zero-Trust Tenant Isolation:** Hostnames, subdomains, and frontend IDs are treated solely as client hints. True authorization and data fencing are strictly enforced by PostgreSQL Row Level Security (RLS) on every query.
4. **Hybrid Academic Structural Flexibility:** The platform natively accommodates divergent institutional taxonomies—supporting traditional school hierarchies (*Grade &rarr; Section &rarr; Subject*) as well as modern coaching/tuition hierarchies (*Course &rarr; Batch &rarr; Subject*).
5. **Configurable Module & Feature Flags:** System features (Live Classes, Fee Management, Class Posting) are toggled globally by the Founder and selectively enabled per tenant by Institution Admins.
6. **Immutable Financial & Audit Records:** Financial records use integer minor units (paise/cents) and immutable append-only ledgers. Administrative mutations generate unalterable audit trails.

---

## 3. Stakeholder Personas & User Classes

| Persona / Role | Scope of Authority | Primary Responsibilities & Needs | Security Boundary |
| :--- | :--- | :--- | :--- |
| **Platform Founder (Super Admin)** | Global Platform Ecosystem | Tenant onboarding, subscription provisioning, global feature gates, system audit logs, storage/compute telemetry, tenant suspension/reactivation. | Global platform tables; zero default access to private academic/student records without audited consent. |
| **Institution Admin (Tenant Owner)** | Single Educational Institution | Institutional profile, branding, academic structure, user invitations, manager delegation, fee policies, exam schedules, attendance policies. | Strictly confined to their own `institution_id`. Cannot see other institutions. |
| **Manager (Delegated Operations)** | Delegated Institution Modules | Operational administration across assigned modules (e.g., Attendance, Fee Collection, Student Records, or Post Approval). | Confined to their `institution_id` AND explicitly granted permission sets. Never has default full access. |
| **Teacher / Faculty** | Assigned Classes & Subjects | Content publishing, assignment creation, student evaluation, submission grading, attendance taking, scheduled live class hosting. | Confined to assigned academic cohorts and subjects within their institution. |
| **Student / Learner** | Enrolled Classes & Subjects | Course material access, assignment submission, grades/report cards review, attendance tracking, live class participation. | Confined strictly to their own submissions, personal performance, and enrolled cohort content. |
| **Parent / Guardian** | Verified Linked Children | Monitoring attendance, viewing published assignment grades and report cards, fee invoice review, teacher announcements. | Strictly restricted to verified child links (`guardian_student_links`) within the institution. |

---

## 4. Functional Requirements by Module

### Module 01: Institution Management & Multi-Tenant Onboarding
- **FR-01.1 Institutional Registration:** Self-service registration flow capturing institution name, institution type (School, Tuition Centre, Coaching Academy, College), contact details, and desired subdomain.
- **FR-01.2 Subdomain Reservation & Validation:** Validation of subdomain slug against a strict reserved wordlist (`www`, `admin`, `api`, `support`, `billing`, `auth`, `static`, etc.), ensuring uniqueness, regex validation (`^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$`), and normalization.
- **FR-01.3 Institutional Profile & White-Labeling:** Configuration of institution logo, favicon, brand primary/accent colors, time zone, locale, official registration numbers, and digital stamp/signature for certificates.
- **FR-01.4 Tenant Status Lifecycle:** Support for states: `pending_verification`, `active`, `suspended`, `grace_period`, `archived`. Suspended institutions immediately lock non-founder access across all modules.
- **FR-01.5 Plan & Module Configuration:** Tenant-level tracking of active subscription plans, user quotas, storage limits, and feature toggles dictated by platform billing.

### Module 02: Hybrid Academic Structure
- **FR-02.1 Academic Years & Terms:** Multi-year support with active/archived statuses, start and end dates, term/semester subdivisions, and year-transition migration utilities.
- **FR-02.2 Dual Taxonomy Engine:**
  - *Model A (Traditional K-12):* Department &rarr; Grade (e.g., Grade 10) &rarr; Section (e.g., Section A, B) &rarr; Subject.
  - *Model B (Tuition / Coaching):* Department / Stream &rarr; Course (e.g., IIT-JEE Prep, NEET Biology) &rarr; Batch (e.g., Morning Alpha, Weekend Batch) &rarr; Subject.
- **FR-02.3 Subject Cataloging:** Subject codes, credit hours, subject type (Core, Elective, Practical, Co-curricular), and grading criteria.
- **FR-02.4 Faculty Cohort Allocations:** Explicit many-to-many mappings binding teachers to specific classes/batches and specific subjects (`teacher_assignments`).

### Module 03: Student Information System (SIS)
- **FR-03.1 Student Admission & Registration:** Unique institutional admission/enrollment number, date of admission, official identification records, and comprehensive student profile.
- **FR-03.2 Enrollment Lifecycle:** Tracking academic progression: `enrolled`, `promoted`, `graduated`, `transferred`, `suspended`, `withdrawn`. Retention of historical class enrollment records across academic years.
- **FR-03.3 Guardian Relationships:** Multi-parent/guardian association per student with relationship type (Father, Mother, Legal Guardian, Sponsor), emergency contact flags, and verification statuses.
- **FR-03.4 Bulk Operations:** CSV/Excel bulk import with schema validation, dry-run parsing, conflict resolution, and background worker execution.

### Module 04: Teacher & Staff Management
- **FR-04.1 Faculty Directory:** Staff identification number, date of joining, qualifications, department allocations, emergency contacts, and professional certifications.
- **FR-04.2 Workload & Allocation Tracking:** Dynamic view of assigned subjects, total active student count, weekly schedule, and current class responsibilities.
- **FR-04.3 Employment Status Lifecycle:** Active, On Leave, Resigned, Terminated. Immediate revocation of tenant session privileges upon deactivation.

### Module 05: Class Posting & Digital Learning Materials
- **FR-05.1 Content Authoring:** Rich text WYSIWYG editor supporting Markdown, formatted headings, math formula formatting, external resource links, and embedded videos.
- **FR-05.2 Cohort Targeting:** Precise scoping of posts to specific grades, sections, courses, batches, or subjects.
- **FR-05.3 Media & Document Attachments:** Multi-file upload support (PDF, DOCX, PPTX, JPG, PNG) stored in isolated Supabase storage buckets with virus scan/mime-type verification.
- **FR-05.4 Publication Controls:** Post status workflow (`draft`, `scheduled`, `published`, `archived`), pinned posts capability, expiration dates, and notification trigger toggles.

### Module 06: Assignment Management & Evaluation Workflow
- **FR-06.1 Assignment Formulation:** Definition of assignment title, comprehensive brief, attachment resources, submission deadline, maximum marks, and late submission grace policies.
- **FR-06.2 Submission Engine:**
  - Student file submissions (PDF, images, zip files) and rich text responses.
  - Strict deadline enforcement at the PostgreSQL database level preventing late submission unless explicitly flagged as permitted.
  - Resubmission support with historical version tracking prior to deadline.
- **FR-06.3 Evaluation & Grading Workflow:**
  - Dedicated evaluator workspace with side-by-side submission file viewer.
  - Granular rubric grading, numeric marks scoring, and qualitative feedback comments.
  - Status transitions: `draft` &rarr; `published` &rarr; `submitted` &rarr; `under_review` &rarr; `evaluated` &rarr; `returned_for_correction` &rarr; `finalized`.
  - Batch grade publication controlling when students/guardians can inspect results.

### Module 07: Live Classes & Virtual Classroom Architecture
- **FR-07.1 Agnostic Video Provider Architecture:** Abstraction layer decoupling scheduling logic from specific providers (Zoom, Google Meet, Microsoft Teams, Jitsi Meet).
- **FR-07.2 Session Scheduling:** Date/time scheduling, duration estimation, target cohort assignment, host teacher assignment, and meeting agenda.
- **FR-07.3 Secure Credential Isolation:** Zero exposure of host keys, Zoom API secrets, or administrative URLs to students. Students receive solely time-bound secure join URLs or Jitsi embedded session tokens.
- **FR-07.4 Live Attendance Reconciliation:** Capturing entry timestamps, exit timestamps, and total engagement duration to calculate automated presence.

### Module 08: Attendance Management
- **FR-08.1 Attendance Modalities:** Daily homeroom attendance and subject-wise period attendance.
- **FR-08.2 Attendance Statuses:** `present`, `absent`, `late`, `excused`, `sick_leave`, `half_day`.
- **FR-08.3 Conflict & Duplicate Prevention:** Database composite unique constraints `(session_id, student_id)` preventing duplicate records for identical sessions.
- **FR-08.4 Audit & Correction Pipeline:** Controlled correction workflows logging who modified an attendance record, previous state, new state, and mandatory reason for change.

### Module 09: Examination & Performance Analytics
- **FR-09.1 Exam Configuration:** Term exams, class tests, entrance evaluations, mock tests. Definition of maximum score, passing score, weightage percentage, and date/time schedules.
- **FR-09.2 Grade Boundaries:** Institutional grade scale mapping percentages to letter grades (e.g., A+, A, B, C, F) and grade points.
- **FR-09.3 Result Verification Pipeline:** Draft &rarr; Submitted by Teacher &rarr; Verified by Manager &rarr; Approved by Admin &rarr; Published to Students/Parents.
- **FR-09.4 Report Card Generation:** Templated, printable, and exportable PDF report cards featuring performance charts, attendance summaries, teacher remarks, and institutional verification stamps.

### Module 10: Fee Billing & Financial Ledger
- **FR-10.1 Structured Fee Architecture:** Fee categories (Tuition, Laboratory, Transport, Examination, Library) mapped to fee structures per class/batch.
- **FR-10.2 Minor-Unit Currency Accounting:** All monetary values stored as 64-bit integers (`BIGINT`) representing minor currency units (e.g., paise in INR: ₹1,500.00 = 150000). Zero floating-point roundoff errors.
- **FR-10.3 Invoicing & Student Assignments:** Individualized student invoices supporting installment schedules, customized discounts, and scholarship subsidies.
- **FR-10.4 Immutable Transaction Ledger:** Append-only payments table. Every collected payment references an invoice and creates non-destructive allocation records.
- **FR-10.5 Payment Gateway Integration Ready:** Webhook-based asynchronous reconciliation for Razorpay/Stripe with signature validation and idempotency keys to prevent double-charging.

### Module 11: Unified Communications & Notification Engine
- **FR-11.1 Communication Channels:** In-app notification center, institutional push notifications, and transactional emails via Resend.
- **FR-11.2 Announcement Scopes:** Global platform broadcast (Founder), Institution-wide broadcast (Admin), or Cohort/Class-specific updates (Teacher/Manager).
- **FR-11.3 Delivery Queuing:** Decoupled asynchronous delivery pipeline preventing slow third-party SMTP/SMS calls from blocking core database transactions.
- **FR-11.4 User Preferences:** Granular user controls enabling/disabling email or push alerts for specific message categories.

### Module 12: Platform Administration & Founder Governance
- **FR-12.1 Ecosystem Observability:** Real-time metrics across total active tenants, total active seats, aggregate monthly recurring revenue (MRR), and system resource consumption.
- **FR-12.2 Global Feature Toggling:** Master switches to enable/disable modules (e.g., live classes, fee collection) across subscription tiers or specific tenants.
- **FR-12.3 Break-Glass Support Access:** Audited, time-limited, session-recorded administrative impersonation or diagnostic access strictly requiring justification.

---

## 5. Non-Functional Requirements (NFR)

### 5.1 Security & Compliance
- **NFR-SEC-01 Multi-Tenant Data Fencing:** Row Level Security (RLS) enabled on 100% of tenant-associated PostgreSQL tables. Zero raw SQL queries without explicit tenant filtering.
- **NFR-SEC-02 Secret Isolation:** Supabase `service_role` keys prohibited from any client-side JavaScript or public distribution. All elevated operations executed via serverless Edge Functions.
- **NFR-SEC-03 Password & Session Integrity:** Argon2id/Bcrypt password hashing via Supabase Auth; JWT expiry strictly capped at 3600 seconds with secure refresh token rotation.
- **NFR-SEC-04 Auditability:** Immutable audit logging for all permission changes, financial mutations, grade alterations, and administrative status updates.

### 5.2 Performance & Scalability
- **NFR-PERF-01 Database Response Times:** P95 database query latency < 50ms for indexed operational reads; P99 < 150ms.
- **NFR-PERF-02 Cold Start & Bundle Size:** Initial SPA load < 250KB gzipped core bundle size; Vite route-based code-splitting for all domain modules.
- **NFR-PERF-03 Concurrency:** System architected to handle 10,000 concurrent students submitting attendance or viewing assignments without locking deadlocks.

### 5.3 High Availability & Fault Tolerance
- **NFR-HA-01 Availability:** Target 99.9% uptime SLA for institutional portals.
- **NFR-HA-02 Backup & Recovery:** Point-in-time recovery (PITR) for PostgreSQL database with automated continuous WAL archiving and daily snapshot verification.
- **NFR-HA-03 Graceful Degradation:** Read-only cached access for course materials during maintenance windows.

---

## 6. Assumptions, Dependencies & Constraints

1. **Subdomain Infrastructure:** Production deployment assumes Cloudflare DNS with wildcard CNAME (`*.educore.com`) pointing to the hosting edge and SSL wildcard certificate (`*.educore.com`).
2. **Third-Party Gateways:** Payment integration relies on external gateways (Razorpay/Stripe); live video relies on external providers (Zoom/Meet/Jitsi). The platform maintains clean interface boundaries for pluggable implementations.
3. **Client Environments:** Supported browsers include evergreen modern web browsers (Chrome 110+, Safari 16+, Edge 110+, Firefox 110+). Mobile responsive design covers viewport widths from 360px to 4K displays.
