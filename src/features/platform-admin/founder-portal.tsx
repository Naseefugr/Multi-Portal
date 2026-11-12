import React, { useState } from 'react'
import { useTenant } from '@/contexts/tenant-context'
import {
  Building2,
  CheckCircle,
  AlertTriangle,
  Sliders,
  Search,
  ExternalLink,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

export function FounderPortal() {
  const { allInstitutions, updateTenantStatus, setDevSubdomain } = useTenant()
  const [activeTab, setActiveTab] = useState('institutions')
  const [searchTerm, setSearchTerm] = useState('')

  // Global feature flags controlled by Founder
  const [globalFeatures, setGlobalFeatures] = useState({
    live_classes: true,
    fee_management: true,
    parent_portal: true,
    automated_attendance: true,
  })

  const filteredInstitutions = allInstitutions.filter(
    (i) =>
      i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.slug.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const activeCount = allInstitutions.filter((i) => i.status === 'active').length
  const suspendedCount = allInstitutions.filter((i) => i.status === 'suspended').length

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
              EduCore Platform Governance
            </h1>
            <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
              Super Admin / Founder
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Global ecosystem control, multi-tenant lifecycle management, and platform-wide feature gates.
          </p>
        </div>

        <Button
          variant="outline"
          className="self-start sm:self-auto flex items-center gap-2"
          onClick={() => setDevSubdomain(null)}
        >
          <ExternalLink className="h-4 w-4" /> Go to Platform Root
        </Button>
      </div>

      {/* Global Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Total Tenants</CardDescription>
            <CardTitle className="text-2xl font-bold">{allInstitutions.length}</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Registered organizations
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Active Portals</CardDescription>
            <CardTitle className="text-2xl font-bold text-emerald-600">{activeCount}</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Operational & RLS authorized
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Suspended Portals</CardDescription>
            <CardTitle className="text-2xl font-bold text-destructive">{suspendedCount}</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Tenant access locked
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Database Engine</CardDescription>
            <CardTitle className="text-2xl font-bold text-blue-600">PostgreSQL 15</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Row Level Security (RLS) Enforced
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full sm:w-auto grid-cols-2">
          <TabsTrigger value="institutions" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" /> Registered Institutions ({allInstitutions.length})
          </TabsTrigger>
          <TabsTrigger value="features" className="flex items-center gap-2">
            <Sliders className="h-4 w-4" /> Global Feature Gates
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Institutions Management */}
        <TabsContent value="institutions" className="space-y-4 pt-2">
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Multi-Tenant Portals Directory</CardTitle>
                <CardDescription>
                  Manage tenant activation, enforce administrative suspensions, and monitor institutional slugs.
                </CardDescription>
              </div>

              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Filter by name or slug..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 h-9 text-xs"
                />
              </div>
            </CardHeader>

            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Institution Name</TableHead>
                    <TableHead>Subdomain Slug</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created Date</TableHead>
                    <TableHead className="text-right">Lifecycle Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInstitutions.map((inst) => (
                    <TableRow key={inst.id}>
                      <TableCell className="font-semibold">{inst.name}</TableCell>
                      <TableCell>
                        <code className="bg-muted px-2 py-0.5 rounded text-xs font-mono text-blue-600">
                          {inst.slug}.educore.com
                        </code>
                      </TableCell>
                      <TableCell className="capitalize text-xs text-muted-foreground">
                        {inst.institution_type.replace('_', ' ')}
                      </TableCell>
                      <TableCell>
                        {inst.status === 'active' ? (
                          <Badge variant="success">Active</Badge>
                        ) : (
                          <Badge variant="destructive">Suspended</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(inst.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        {inst.status === 'active' ? (
                          <Button
                            variant="destructive"
                            size="sm"
                            className="h-8 text-xs"
                            onClick={() => updateTenantStatus(inst.id, 'suspended')}
                          >
                            <AlertTriangle className="h-3.5 w-3.5 mr-1" /> Suspend Tenant
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs text-emerald-600 border-emerald-300 hover:bg-emerald-50"
                            onClick={() => updateTenantStatus(inst.id, 'active')}
                          >
                            <CheckCircle className="h-3.5 w-3.5 mr-1" /> Reactivate
                          </Button>
                        )}

                        <Button
                          variant="secondary"
                          size="sm"
                          className="h-8 text-xs"
                          onClick={() => setDevSubdomain(inst.slug)}
                        >
                          <ExternalLink className="h-3.5 w-3.5 mr-1" /> Inspect Portal
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Global Feature Gates */}
        <TabsContent value="features" className="space-y-4 pt-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Platform-Wide Feature Availability Gates</CardTitle>
              <CardDescription>
                Toggling a module here disables it globally across all institutions, regardless of tenant-level settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
                <div>
                  <h4 className="font-semibold text-sm">Virtual Live Class Engine</h4>
                  <p className="text-xs text-muted-foreground">
                    Allows institutions to schedule Zoom, Meet, and Jitsi live classroom sessions.
                  </p>
                </div>
                <Button
                  size="sm"
                  variant={globalFeatures.live_classes ? 'default' : 'secondary'}
                  onClick={() =>
                    setGlobalFeatures((prev) => ({ ...prev, live_classes: !prev.live_classes }))
                  }
                >
                  {globalFeatures.live_classes ? 'Globally Enabled' : 'Disabled'}
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
                <div>
                  <h4 className="font-semibold text-sm">Financial Fees & Minor-Unit Payment Ledger</h4>
                  <p className="text-xs text-muted-foreground">
                    Allows institutions to define fee categories, generate student invoices, and collect payments.
                  </p>
                </div>
                <Button
                  size="sm"
                  variant={globalFeatures.fee_management ? 'default' : 'secondary'}
                  onClick={() =>
                    setGlobalFeatures((prev) => ({ ...prev, fee_management: !prev.fee_management }))
                  }
                >
                  {globalFeatures.fee_management ? 'Globally Enabled' : 'Disabled'}
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
                <div>
                  <h4 className="font-semibold text-sm">Guardian / Parent Portal Module</h4>
                  <p className="text-xs text-muted-foreground">
                    Allows verified parents to monitor attendance, view marks, and access communications.
                  </p>
                </div>
                <Button
                  size="sm"
                  variant={globalFeatures.parent_portal ? 'default' : 'secondary'}
                  onClick={() =>
                    setGlobalFeatures((prev) => ({ ...prev, parent_portal: !prev.parent_portal }))
                  }
                >
                  {globalFeatures.parent_portal ? 'Globally Enabled' : 'Disabled'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
