import React from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useTenant } from '@/contexts/tenant-context'
import { useAcademic } from '@/contexts/academic-context'
import { useLearning } from '@/contexts/learning-context'
import { useOperations } from '@/contexts/operations-context'
import { useCommunication } from '@/contexts/communication-context'
import { formatPaise } from '@/features/fees/fees-management-view'
import {
  Users,
  CalendarCheck,
  CreditCard,
  Video,
  Award,
  ArrowRight,
  ShieldCheck,
  Megaphone,
  AlertCircle,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface RoleDashboardProps {
  onNavigate: (viewId: string) => void
}

export function RoleDashboardView({ onNavigate }: RoleDashboardProps) {
  const { userRole, currentUser } = useAuth()
  const { currentTenant } = useTenant()
  const { students } = useAcademic()
  const { assignments, submissions, classPosts } = useLearning()
  const { attendanceRecords, invoices, payments, examResults } = useOperations()
  const { announcements, liveClasses } = useCommunication()

  // Aggregations
  const presentCount = attendanceRecords.filter((r) => r.status === 'present').length
  const totalAtt = attendanceRecords.length || 1
  const attendanceRate = Math.round((presentCount / totalAtt) * 100)

  const totalCollectedPaise = payments.reduce((acc, p) => acc + p.amount_paid_in_paise, 0)
  const totalInvoicedPaise = invoices.reduce((acc, i) => acc + i.total_amount_in_paise, 0)
  const pendingCollectionPaise = totalInvoicedPaise - totalCollectedPaise

  // Student specific filters
  const mySubmissions = submissions.filter((s) => s.student_name.includes('Aarav'))
  const myResults = examResults.filter((r) => r.student_name.includes('Aarav'))
  const _myInvoices = invoices.filter((i) => i.student_name.includes('Aarav'))

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-primary rounded-xl p-6 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-semibold mb-2">
            <span className="capitalize">{userRole.replace('_', ' ')} Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {currentUser?.full_name}!
          </h1>
          <p className="text-sm text-blue-100 mt-1">
            {currentTenant?.name} • Academic Year 2026–2027
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur rounded-lg p-3 text-right hidden sm:block">
          <p className="text-xs text-blue-100">Portal Security</p>
          <p className="text-sm font-bold text-white flex items-center gap-1">
            <ShieldCheck className="h-4 w-4 text-emerald-300" /> PostgreSQL RLS Active
          </p>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 1. INSTITUTION ADMIN VIEW                                */}
      {/* ======================================================== */}
      {userRole === 'institution_admin' && (
        <div className="space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate('students')}>
              <CardHeader className="p-4 pb-2">
                <CardDescription className="text-xs flex items-center justify-between">
                  <span>Enrolled Students</span>
                  <Users className="h-4 w-4 text-blue-600" />
                </CardDescription>
                <CardTitle className="text-2xl font-bold">{students.length}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 text-xs text-muted-foreground">
                Active SIS Records
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate('attendance')}>
              <CardHeader className="p-4 pb-2">
                <CardDescription className="text-xs flex items-center justify-between">
                  <span>Today's Attendance</span>
                  <CalendarCheck className="h-4 w-4 text-emerald-600" />
                </CardDescription>
                <CardTitle className="text-2xl font-bold text-emerald-600">{attendanceRate}%</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 text-xs text-muted-foreground">
                Aggregate Presence Rate
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate('fees')}>
              <CardHeader className="p-4 pb-2">
                <CardDescription className="text-xs flex items-center justify-between">
                  <span>Collections Collected</span>
                  <CreditCard className="h-4 w-4 text-indigo-600" />
                </CardDescription>
                <CardTitle className="text-2xl font-bold text-foreground">
                  {formatPaise(totalCollectedPaise)}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 text-xs text-muted-foreground">
                Reconciled Ledger Receipts
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate('fees')}>
              <CardHeader className="p-4 pb-2">
                <CardDescription className="text-xs flex items-center justify-between">
                  <span>Pending Receivables</span>
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                </CardDescription>
                <CardTitle className="text-2xl font-bold text-amber-600">
                  {formatPaise(pendingCollectionPaise)}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 text-xs text-muted-foreground">
                Outstanding Invoice Balance
              </CardContent>
            </Card>
          </div>

          {/* Quick Operations Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Megaphone className="h-4 w-4 text-primary" /> Recent Institutional Broadcasts
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {announcements.slice(0, 2).map((ann) => (
                  <div key={ann.id} className="p-3 bg-muted/40 rounded-md border text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <strong className="text-foreground">{ann.title}</strong>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(ann.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-muted-foreground line-clamp-2">{ann.content}</p>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => onNavigate('communications')}
                >
                  Manage Communications & Announcements <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Video className="h-4 w-4 text-primary" /> Live Virtual Classrooms
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {liveClasses.map((sess) => (
                  <div key={sess.id} className="p-3 bg-muted/40 rounded-md border text-xs flex items-center justify-between">
                    <div>
                      <strong className="text-foreground block">{sess.title}</strong>
                      <span className="text-muted-foreground">
                        {sess.subject_name} • {sess.cohort_name}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-[10px] uppercase font-bold">
                      {sess.provider}
                    </Badge>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => onNavigate('live_classes')}
                >
                  View Virtual Class Schedule <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. TEACHER DASHBOARD                                    */}
      {/* ======================================================== */}
      {userRole === 'teacher' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardDescription className="text-xs">Assigned Cohorts</CardDescription>
                <CardTitle className="text-2xl font-bold">Grade 10 - Section A</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 text-xs text-muted-foreground">
                Mathematics Period 1
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate('assignments')}>
              <CardHeader className="p-4 pb-2">
                <CardDescription className="text-xs">Active Assignments</CardDescription>
                <CardTitle className="text-2xl font-bold text-primary">{assignments.length}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 text-xs text-muted-foreground">
                {submissions.filter((s) => s.status === 'submitted').length} Pending Review
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate('attendance')}>
              <CardHeader className="p-4 pb-2">
                <CardDescription className="text-xs">Today's Attendance</CardDescription>
                <CardTitle className="text-2xl font-bold text-emerald-600">Logged</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 text-xs text-muted-foreground">
                Session verified & locked
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-base font-bold">Pending Assignment Evaluations</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {submissions.map((sub) => (
                  <div key={sub.id} className="p-3 bg-muted/40 rounded-md border text-xs flex items-center justify-between">
                    <div>
                      <strong className="text-foreground block">{sub.student_name}</strong>
                      <span className="text-muted-foreground">
                        {sub.attachment_file_name || 'Written submission'}
                      </span>
                    </div>
                    <Badge variant={sub.status === 'evaluated' ? 'success' : 'default'} className="text-[10px]">
                      {sub.status}
                    </Badge>
                  </div>
                ))}
                <Button size="sm" className="w-full text-xs" onClick={() => onNavigate('assignments')}>
                  Open Evaluator Gradebook
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-base font-bold">Upcoming Live Classes</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {liveClasses.map((sess) => (
                  <div key={sess.id} className="p-3 bg-muted/40 rounded-md border text-xs flex items-center justify-between">
                    <div>
                      <strong className="text-foreground block">{sess.title}</strong>
                      <span className="text-muted-foreground">
                        {new Date(sess.start_time).toLocaleString()}
                      </span>
                    </div>
                    <Button size="sm" className="h-7 text-xs bg-emerald-600 text-white" onClick={() => onNavigate('live_classes')}>
                      Launch
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. STUDENT DASHBOARD                                    */}
      {/* ======================================================== */}
      {userRole === 'student' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate('assignments')}>
              <CardHeader className="p-4 pb-2">
                <CardDescription className="text-xs">Pending Deadlines</CardDescription>
                <CardTitle className="text-2xl font-bold text-amber-600">
                  {assignments.length - mySubmissions.length}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 text-xs text-muted-foreground">
                Assignments to complete
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate('attendance')}>
              <CardHeader className="p-4 pb-2">
                <CardDescription className="text-xs">My Attendance</CardDescription>
                <CardTitle className="text-2xl font-bold text-emerald-600">96%</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 text-xs text-muted-foreground">
                Class 10-A Homeroom
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate('examinations')}>
              <CardHeader className="p-4 pb-2">
                <CardDescription className="text-xs">Term 1 Score</CardDescription>
                <CardTitle className="text-2xl font-bold text-primary">93%</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 text-xs text-muted-foreground">
                Letter Grade: A+
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate('live_classes')}>
              <CardHeader className="p-4 pb-2">
                <CardDescription className="text-xs">Live Virtual Class</CardDescription>
                <CardTitle className="text-xl font-bold text-indigo-600">Saturday</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 text-xs text-muted-foreground">
                10:00 AM • Math
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-base font-bold">Class Feed & Handouts</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {classPosts.map((post) => (
                  <div key={post.id} className="p-3 bg-muted/40 rounded-md border text-xs space-y-1">
                    <strong className="text-foreground block">{post.title}</strong>
                    <p className="text-muted-foreground line-clamp-2">{post.content}</p>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => onNavigate('posts')}>
                  View All Study Notes & Posts
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-base font-bold">Recent Grades & Feedback</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {myResults.map((r) => (
                  <div key={r.id} className="p-3 bg-muted/40 rounded-md border text-xs flex items-center justify-between">
                    <div>
                      <strong className="text-foreground block">{r.subject_name}</strong>
                      <span className="text-muted-foreground font-italic">"{r.remarks}"</span>
                    </div>
                    <Badge variant="success" className="text-xs font-bold">
                      {r.marks_obtained}/{r.max_marks} ({r.grade_letter})
                    </Badge>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => onNavigate('examinations')}>
                  View Full Academic Report Card
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. PARENT DASHBOARD                                     */}
      {/* ======================================================== */}
      {userRole === 'parent' && (
        <div className="space-y-6">
          <Card className="border-2 border-emerald-500/20 shadow-sm">
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                  Verified Linked Child: Aarav Patel (Grade 10 - Section A)
                </CardTitle>
                <Badge variant="success" className="text-xs">
                  Verified Relationship: Father
                </Badge>
              </div>
              <CardDescription className="text-xs">
                Directly authenticated via <code>guardian_student_links</code>. Protected from cross-student IDOR scraping.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-muted rounded-md space-y-1">
                  <span className="text-muted-foreground">Attendance Record</span>
                  <p className="text-xl font-bold text-emerald-600">96% Present</p>
                  <p className="text-[11px] text-muted-foreground">1 Day excused transit delay</p>
                </div>

                <div className="p-3 bg-muted rounded-md space-y-1">
                  <span className="text-muted-foreground">Term 1 Exam Marks</span>
                  <p className="text-xl font-bold text-foreground">93% (Grade A+)</p>
                  <p className="text-[11px] text-muted-foreground">Rank 1 in Mathematics</p>
                </div>

                <div className="p-3 bg-muted rounded-md space-y-1">
                  <span className="text-muted-foreground">Fee Balance</span>
                  <p className="text-xl font-bold text-emerald-600">₹0.00 Outstanding</p>
                  <p className="text-[11px] text-muted-foreground">Term 1 cleared with merit scholarship</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2 border-t">
                <Button size="sm" variant="outline" className="text-xs" onClick={() => onNavigate('examinations')}>
                  <Award className="h-3.5 w-3.5 mr-1" /> View Official Report Card
                </Button>
                <Button size="sm" variant="outline" className="text-xs" onClick={() => onNavigate('attendance')}>
                  <CalendarCheck className="h-3.5 w-3.5 mr-1" /> Detailed Attendance Log
                </Button>
                <Button size="sm" variant="outline" className="text-xs" onClick={() => onNavigate('fees')}>
                  <CreditCard className="h-3.5 w-3.5 mr-1" /> View Fee Invoices & Receipts
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. DELEGATED MANAGER VIEW                               */}
      {/* ======================================================== */}
      {userRole === 'manager' && (
        <div className="space-y-6">
          <Card className="p-4 border-amber-300 bg-amber-50/20">
            <h3 className="font-bold text-base text-foreground">
              Delegated Operational Scope (Rohan Mehra)
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              You are operating under delegated permissions configured by the Institution Admin. You can access Attendance, SIS student records, and Class Posting. Access to financial fee ledgers is restricted.
            </p>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="cursor-pointer hover:shadow-md" onClick={() => onNavigate('attendance')}>
              <CardHeader className="p-4 pb-2">
                <CardDescription className="text-xs">Take Daily Attendance</CardDescription>
                <CardTitle className="text-lg font-bold">Roll Call Sessions</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 text-xs text-primary font-semibold">
                Mark Cohort Presence &rarr;
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md" onClick={() => onNavigate('students')}>
              <CardHeader className="p-4 pb-2">
                <CardDescription className="text-xs">Student Directory</CardDescription>
                <CardTitle className="text-lg font-bold">{students.length} Enrolled</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 text-xs text-primary font-semibold">
                Admissions & Roster &rarr;
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md" onClick={() => onNavigate('posts')}>
              <CardHeader className="p-4 pb-2">
                <CardDescription className="text-xs">Class Posting</CardDescription>
                <CardTitle className="text-lg font-bold">Curriculum Feeds</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 text-xs text-primary font-semibold">
                Publish Handouts &rarr;
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
