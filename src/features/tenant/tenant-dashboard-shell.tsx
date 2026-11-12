import React, { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { TenantLoginScreen } from '@/features/tenant/tenant-login-screen'
import { Sidebar } from '@/components/navigation/sidebar'
import { RoleDashboardView } from '@/features/dashboards/role-dashboard-view'
import { AcademicStructureView } from '@/features/academics/academic-structure-view'
import { StudentManagementView } from '@/features/students/student-management-view'
import { TeacherManagementView } from '@/features/teachers/teacher-management-view'
import { ClassPostsView } from '@/features/class-posts/class-posts-view'
import { AssignmentsManagementView } from '@/features/assignments/assignments-management-view'
import { AttendanceManagementView } from '@/features/attendance/attendance-management-view'
import { ExaminationsView } from '@/features/examinations/examinations-view'
import { FeesManagementView } from '@/features/fees/fees-management-view'
import { CommunicationsView } from '@/features/communications/communications-view'
import { LiveClassesView } from '@/features/live-classes/live-classes-view'
import { ManagerDelegationView } from '@/features/managers/manager-delegation-view'
import { InstitutionProfileView } from '@/features/institution/institution-profile-view'

export function TenantDashboardShell() {
  const { isAuthenticated } = useAuth()
  const [currentView, setCurrentView] = useState('dashboard')

  // Sidebar only rendered after user is authenticated / logged in
  if (!isAuthenticated) {
    return <TenantLoginScreen />
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-slate-50/50">
      {/* Navigation Sidebar */}
      <Sidebar currentView={currentView} onSelectView={setCurrentView} />

      {/* Main Workspace Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {currentView === 'dashboard' && <RoleDashboardView onNavigate={setCurrentView} />}
        {currentView === 'academics' && <AcademicStructureView />}
        {currentView === 'students' && <StudentManagementView />}
        {currentView === 'teachers' && <TeacherManagementView />}
        {currentView === 'posts' && <ClassPostsView />}
        {currentView === 'assignments' && <AssignmentsManagementView />}
        {currentView === 'attendance' && <AttendanceManagementView />}
        {currentView === 'examinations' && <ExaminationsView />}
        {currentView === 'fees' && <FeesManagementView />}
        {currentView === 'communications' && <CommunicationsView />}
        {currentView === 'live_classes' && <LiveClassesView />}
        {currentView === 'managers' && <ManagerDelegationView />}
        {currentView === 'settings' && <InstitutionProfileView />}
      </main>
    </div>
  )
}
