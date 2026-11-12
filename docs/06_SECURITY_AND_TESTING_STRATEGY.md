# EDUCORE — Security Threat Model & Quality Assurance Strategy
## STRIDE Threat Analysis, Multi-Tenant Defense-in-Depth & Verification Matrix

---

## 1. Multi-Tenant STRIDE Threat Model

EduCore operates under a zero-trust threat model assuming adversaries will attempt to bypass client controls, forge HTTP headers, tamper with parameters, and probe database endpoints directly.

| Threat Category | Potential Attack Vector | EduCore Defense & Countermeasure |
| :--- | :--- | :--- |
| **Spoofing** | Attacker spoofs `Host` header to access a private tenant portal or forge user identity. | Subdomain extracted solely for tenant metadata; user identity derived strictly from cryptographically signed Supabase Auth JWT (`auth.uid()`). Database verifies active tenant membership. |
| **Tampering** | Student tampers with assignment deadline timestamp or modifies submitted marks via API. | Deadlines and evaluation permissions are enforced server-side via PostgreSQL RLS policies and trigger functions; client-submitted timestamps are ignored in favor of `timezone('utc', now())`. |
| **Repudiation** | An administrator or manager deletes financial invoices or modifies exam results without traceability. | Append-only financial ledger (`payments`); immutable `audit_logs` tracking user ID, IP address, previous state, new state, and timestamp for all critical mutations. |
| **Information Disclosure** | Parent scrapes another student's attendance/grades by manipulating sequential IDs (BOLA/IDOR). | Primary keys use UUID v4. PostgreSQL RLS policies mandate an explicit verified relationship in `guardian_student_links` before returning any child data. |
| **Denial of Service** | Malicious tenant floods storage with gigabyte files or exhausts database connection pools. | Supabase Storage pre-signed upload policies enforce maximum file sizes (25MB-50MB) and strict MIME type whitelists; PostgREST connection pooling with transaction timeouts (<5s). |
| **Elevation of Privilege** | Delegated manager sends direct REST update to change their role to `institution_admin`. | Database RLS policy on `institution_memberships` allows updates *only* by users who already possess the `institution_admin` role verified at the database level. |

---

## 2. Ten Immutable Multi-Tenant Security Guardrails

1. **Zero Secret Exposure:**
   The Supabase `service_role` key is strictly forbidden from client bundles, repository commits, or environment variables accessible by Vite (`VITE_*`). Only public anon keys are exposed.
2. **Universal Row Level Security (RLS):**
   100% of tables in the `public` schema have RLS enabled and forced (`ALTER TABLE ... FORCE ROW LEVEL SECURITY`). Zero raw SQL execution without tenant scoping.
3. **Defense Against BOLA & IDOR:**
   Never assume that knowing an entity's UUID grants permission to read it. Every read/write policy verifies that the entity's `institution_id` matches the caller's active membership.
4. **Pre-Signed Storage Policies:**
   Student homework, exam answers, and financial receipts are stored in private storage buckets. Access is mediated through short-lived (60 seconds) cryptographically signed URLs generated only after membership verification.
5. **No Client-Side Authorization Decisions:**
   Hiding a button or menu item in React is a cosmetic convenience, not security. Every protected action is validated at the database policy or Edge Function level.
6. **Immutable Financial Transactions:**
   The `payments` table is append-only. Deletions and in-place updates are prohibited at the database rule level; adjustments must occur through explicit credit notes or refund records.
7. **Safe Subdomain Reservation:**
   System reserved names (`admin`, `api`, `auth`, `billing`, etc.) are blacklisted both at the API boundary and via database check constraints to prevent routing hijacking.
8. **Asynchronous Webhook Signature Verification:**
   Payment webhooks (Razorpay/Stripe) must verify HMAC SHA-256 signatures before reading payloads and record events into an idempotent log table.
9. **Break-Glass Audit Trails:**
   Platform Founder diagnostic access into an institution portal generates high-priority audit logs visible to both platform and institutional governance.
10. **Strict Update Semantics (`USING` + `WITH CHECK`):**
    All PostgreSQL `UPDATE` policies must provide both `USING` (who can select the row to modify) and `WITH CHECK` (what the updated row must look like), preventing users from reassigning rows across tenants.

---

## 3. Comprehensive Testing & Verification Matrix

### 3.1 Automated RLS Security Test Suite (pgTAP / Database Testing)
Every database migration is validated against adversarial security assertions:

```sql
-- Example pgTAP Security Test Plan
BEGIN;
SELECT plan(5);

-- Test 1: Cross-Tenant Data Fencing
-- Tenant B User attempts to read Tenant A's classes
SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claim.sub" TO 'user-tenant-b-uuid';
SELECT is_empty(
    $$ SELECT * FROM classes WHERE institution_id = 'tenant-a-uuid' $$,
    'Tenant B user must never see Tenant A classes'
);

-- Test 2: Student cannot see peer submissions
SET LOCAL "request.jwt.claim.sub" TO 'student-1-uuid';
SELECT is_empty(
    $$ SELECT * FROM assignment_submissions WHERE student_membership_id = 'student-2-membership-uuid' $$,
    'Student 1 must never access Student 2 submissions'
);

-- Test 3: Unassigned Teacher cannot grade
SET LOCAL "request.jwt.claim.sub" TO 'teacher-unassigned-uuid';
SELECT throws_ok(
    $$ INSERT INTO assignment_grades (submission_id, marks_obtained, evaluator_id) VALUES ('sub-uuid', 95, 'teacher-unassigned-uuid') $$,
    '42501', -- Insufficient privilege
    'Unassigned teacher cannot insert grades for unassigned classes'
);

-- Test 4: Manager without Fee Permission cannot query financial invoices
SET LOCAL "request.jwt.claim.sub" TO 'manager-no-fees-uuid';
SELECT is_empty(
    $$ SELECT * FROM student_invoices WHERE institution_id = 'tenant-a-uuid' $$,
    'Manager lacking fees.view_summary must receive 0 invoice rows'
);

-- Test 5: Suspended Tenant Blocks All Standard Access
SET LOCAL "request.jwt.claim.sub" TO 'user-suspended-tenant-uuid';
SELECT is_empty(
    $$ SELECT * FROM class_posts WHERE institution_id = 'suspended-tenant-uuid' $$,
    'Members of suspended institutions cannot access class posts'
);

SELECT * FROM finish();
ROLLBACK;
```

---

## 4. Frontend & End-to-End Quality Assurance

### 4.1 Unit & Integration Testing Strategy
- **Zod Runtime Validation:** 100% of form inputs (student registration, assignment creation, fee structure) validated through strict schemas before hitting network requests.
- **Permission Hooks:** Comprehensive unit tests for `usePermission('assignments.grade')` ensuring correct evaluation across role bases, manager overrides, and inactive account states.
- **Tenant Context Hook:** Vitest tests verifying correct subdomain parsing across `bright.educore.com`, `greenvalley.lvh.me:5173`, and root `educore.com`.

### 4.2 End-to-End Critical User Journeys (Playwright)
1. **Onboarding & Provisioning:** User registers `alnoor` &rarr; Subdomain provisioned &rarr; Admin workspace initialized.
2. **Academic Setup:** Admin creates Academic Year &rarr; Adds Grade 10 &rarr; Creates Section A &rarr; Creates Math Subject &rarr; Assigns Teacher.
3. **Student Admission:** Admin admits Student &rarr; Links Guardian with verification &rarr; Student assigned to Section A.
4. **Learning & Evaluation:** Teacher posts PDF lecture note &rarr; Creates Assignment &rarr; Student logs in on mobile viewport &rarr; Submits PDF homework &rarr; Teacher grades submission &rarr; Student receives notification and views marks.
5. **Fee Billing:** Admin creates Tuition Fee structure &rarr; Invoices generated in paise &rarr; Parent logs in &rarr; Views outstanding balance &rarr; Initiates payment &rarr; Receipt ledger updated.
