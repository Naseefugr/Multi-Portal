import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  ShieldCheck,
  Lock,
  Database,
  FileKey,
  History,
  EyeOff,
  CheckCircle2,
} from 'lucide-react'

interface SecurityPillar {
  id: string
  title: string
  subtitle: string
  icon: React.ElementType
  details: string
  specifications: string[]
  codeSnippet: string
}

const PILLARS: SecurityPillar[] = [
  {
    id: 'rls',
    title: 'PostgreSQL Row-Level Security',
    subtitle: 'Kernel-enforced multi-tenant isolation',
    icon: Database,
    details:
      'Multi-tenant safety is not left to fragile WHERE clauses in web application code. Every table enforces Row-Level Security directly inside PostgreSQL, matching institution_id with cryptographic session tokens.',
    specifications: [
      'Automatic tenant ID injection via Postgres current_setting()',
      'Zero cross-tenant row leakages possible even under application-layer faults',
      'Continuous automated RLS policy regression testing',
    ],
    codeSnippet: `-- Enforced on all tables: students, fees, grades
CREATE POLICY tenant_isolation_policy ON students
  FOR ALL
  TO authenticated
  USING (
    institution_id = NULLIF(
      current_setting('app.current_tenant_id', true), ''
    )::uuid
  );`,
  },
  {
    id: 'minor-units',
    title: 'Minor-Unit Financial Ledger',
    subtitle: 'Zero floating-point rounding errors',
    icon: ShieldCheck,
    details:
      'Educational fee structures involve millions in tuition, scholarships, and installment schedules. EduCore uses integer minor units (cents/paise) with double-entry balanced journaling to guarantee financial integrity.',
    specifications: [
      'All amounts stored as BIGINT integers (cents / paise)',
      'Double-entry balanced debits and credits ledger schema',
      'Automated checksum reconciliation on batch receipts',
    ],
    codeSnippet: `-- Immutable double-entry fee ledger schema
CREATE TABLE fee_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL,
  amount_cents BIGINT NOT NULL CHECK (amount_cents > 0),
  currency VARCHAR(3) DEFAULT 'USD',
  entry_type ledger_entry_type NOT NULL,
  created_at TIMESTAMPTZ DEFAULT clock_timestamp()
);`,
  },
  {
    id: 'signed-storage',
    title: 'Signed URL Document Vault',
    subtitle: 'End-to-end encrypted asset access',
    icon: FileKey,
    details:
      'Student identification cards, medical disclosures, and examination question papers are stored in private Supabase Storage buckets. Direct public URLs do not exist; access requires signed, time-limited tokens.',
    specifications: [
      'Private ACL bucket configuration with zero public traversal',
      'Time-expiring signed URLs (typically 60-second validity)',
      'Virus scan and MIME-type validation upon file upload',
    ],
    codeSnippet: `// Server-side signed URL generation
const { data, error } = await supabase.storage
  .from('institution-private-vault')
  .createSignedUrl(
    \`\${institutionId}/transcripts/\${studentId}.pdf\`,
    60 // 60-second expiration window
  );`,
  },
  {
    id: 'audit',
    title: 'Immutable Event Journaling',
    subtitle: 'Tamper-evident audit logs',
    icon: History,
    details:
      'Every grade modification, role assignment, attendance override, and fee waiver records an append-only audit trail with actor UUID, IP hash, and pre/post mutation deltas.',
    specifications: [
      'Append-only database triggers preventing audit row updates or deletes',
      'Detailed JSONB diff of modified fields for every change',
      'Exportable audit reports for institutional accreditation boards',
    ],
    codeSnippet: `-- Append-only audit trigger on sensitive grade mutations
CREATE TRIGGER audit_examination_results_trigger
  AFTER UPDATE OR DELETE ON examination_results
  FOR EACH ROW
  EXECUTE FUNCTION record_immutable_audit_log();`,
  },
]

export function SecuritySection() {
  const [activePillarId, setActivePillarId] = useState<string>('rls')
  const activePillar = PILLARS.find((p) => p.id === activePillarId) || PILLARS[0]

  return (
    <section id="security" className="py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Background glowing gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[300px] bg-indigo-600/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800/60 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Lock className="w-3.5 h-3.5" />
            Security & Data Sovereignty
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Security engineered into every database query
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed">
            Educational records include child privacy, academic transcripts, and financial records. 
            We architected EduCore with mathematical isolation guarantees from day one.
          </p>
        </div>

        {/* Pillars Switcher Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-10">
          {PILLARS.map((pillar) => {
            const Icon = pillar.icon
            const isSelected = pillar.id === activePillarId
            return (
              <button
                key={pillar.id}
                onClick={() => setActivePillarId(pillar.id)}
                className={`p-4 rounded-2xl text-left transition-all duration-200 border flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-800 border-blue-500/80 shadow-lg ring-1 ring-blue-500/30'
                    : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/40 text-slate-400'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        isSelected ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    {isSelected && (
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/60">
                        ACTIVE SPEC
                      </span>
                    )}
                  </div>
                  <div className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                    {pillar.title}
                  </div>
                </div>
                <div className="text-xs text-slate-500 mt-2 line-clamp-1">{pillar.subtitle}</div>
              </button>
            )
          })}
        </div>

        {/* Detailed Spec & Real SQL/Code Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-950/90 rounded-3xl border border-slate-800 p-6 sm:p-8 md:p-10 shadow-2xl">
          {/* Left: Deep Specification Details */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-xs font-mono text-blue-400 uppercase tracking-wider">
                {activePillar.subtitle}
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                {activePillar.title}
              </h3>
            </div>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {activePillar.details}
            </p>

            <div className="space-y-3 pt-2">
              {activePillar.specifications.map((spec, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-900/50 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs sm:text-sm text-slate-300 font-medium">{spec}</span>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
              <EyeOff className="w-5 h-5 text-indigo-400 shrink-0" />
              <div className="text-xs text-slate-400 leading-snug">
                Student data is never pooled or sold to third-party ad networks. GDPR, FERPA, and COPPA compliant architecture.
              </div>
            </div>
          </div>

          {/* Right: Code / Schema Snippet Window */}
          <div className="lg:col-span-7 bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-inner font-mono text-xs">
            <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-slate-400 text-[11px]">
                  supabase/migrations/{activePillar.id}_enforcement.sql
                </span>
              </div>
              <span className="text-[10px] text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-900">
                PostgreSQL Engine
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activePillar.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-5 text-slate-300 overflow-x-auto leading-relaxed"
              >
                <pre>
                  <code>{activePillar.codeSnippet}</code>
                </pre>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
