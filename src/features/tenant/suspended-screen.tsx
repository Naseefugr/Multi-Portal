import React from 'react'
import { AlertOctagon, ArrowLeft } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useTenant } from '@/contexts/tenant-context'

export function SuspendedScreen() {
  const { currentTenant, setDevSubdomain } = useTenant()

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-destructive/30 shadow-lg">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-2">
            <AlertOctagon className="h-6 w-6" />
          </div>
          <CardTitle className="text-xl text-destructive font-bold">
            Institution Portal Suspended
          </CardTitle>
          <CardDescription>
            Access to <span className="font-semibold text-foreground">{currentTenant?.name}</span> has been temporarily suspended by the EduCore platform administration.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <div className="p-3 bg-muted rounded-md border text-xs space-y-1">
            <p className="font-semibold text-foreground">Enforced Security Boundary:</p>
            <p>
              Under PostgreSQL RLS Policy Section 2.4, all operational reads, student records, and class feeds are locked while a tenant status is marked <code>suspended</code>.
            </p>
          </div>

          <p>
            If you are an institution administrator, please review your subscription status or reach out to EduCore platform support.
          </p>

          <div className="pt-2 flex flex-col gap-2">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={() => setDevSubdomain(null)}
            >
              <ArrowLeft className="h-4 w-4" /> Return to EduCore Home
            </Button>
            <Button
              variant="secondary"
              className="w-full flex items-center justify-center gap-2"
              onClick={() => setDevSubdomain('bright')}
            >
              Switch to Active Tenant (Bright Valley)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
