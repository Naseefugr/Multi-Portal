import React, { useState } from 'react'
import { useTenant } from '@/contexts/tenant-context'
import { useAuth } from '@/contexts/auth-context'
import {
  Palette,
  Clock,
  MapPin,
  Save,
  CheckCircle2,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'

export function InstitutionProfileView() {
  const { currentTenant, updateInstitutionProfile } = useTenant()
  const { userRole } = useAuth()

  const [form, setForm] = useState({
    name: currentTenant?.name || '',
    primaryColor: currentTenant?.primary_color || '#2563eb',
    timezone: currentTenant?.timezone || 'Asia/Kolkata',
    currency: currentTenant?.currency || 'INR',
    contactEmail: currentTenant?.contact_email || '',
    contactPhone: currentTenant?.contact_phone || '',
    address: currentTenant?.address || '',
  })

  const [savedNotice, setSavedNotice] = useState(false)
  const isAdmin = userRole === 'institution_admin'

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentTenant) return
    await updateInstitutionProfile(currentTenant.id, {
      name: form.name,
      primary_color: form.primaryColor,
      timezone: form.timezone,
      currency: form.currency,
      contact_email: form.contactEmail,
      contact_phone: form.contactPhone || null,
      address: form.address || null,
    })
    setSavedNotice(true)
    setTimeout(() => setSavedNotice(false), 3000)
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          Institution Profile & Configuration
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Manage institutional branding, timezone, minor-currency preferences, and official contact information.
        </p>
      </div>

      {savedNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-md flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>Institutional configurations updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Branding & Visual Identity */}
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Palette className="h-4 w-4 text-primary" /> Visual Identity & Custom Branding
            </CardTitle>
            <CardDescription className="text-xs">
              Personalize primary portal accent colors and brand themes.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Primary Brand Theme Color</Label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={form.primaryColor}
                    onChange={(e) => setForm({ ...form, primaryColor: e.target.value })}
                    disabled={!isAdmin}
                    className="h-9 w-12 rounded border p-1 cursor-pointer"
                  />
                  <Input
                    value={form.primaryColor}
                    onChange={(e) => setForm({ ...form, primaryColor: e.target.value })}
                    disabled={!isAdmin}
                    className="font-mono text-xs w-32"
                  />
                  <div
                    className="h-9 px-3 rounded flex items-center justify-center text-xs text-white font-semibold shadow-sm"
                    style={{ backgroundColor: form.primaryColor }}
                  >
                    Theme Preview
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Subdomain Mapping</Label>
                <div className="flex items-center">
                  <Input
                    value={currentTenant?.slug || 'institution'}
                    disabled
                    className="bg-muted font-mono text-xs rounded-r-none"
                  />
                  <span className="inline-flex items-center px-3 border border-l-0 border-input bg-muted text-muted-foreground text-xs rounded-r-md h-9">
                    .educore.com
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Operational Localization */}
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" /> Regional & Financial Localization
            </CardTitle>
            <CardDescription className="text-xs">
              Timezone for attendance calculations and base ledger currency.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Timezone</Label>
                <Select
                  value={form.timezone}
                  onChange={(e) => setForm({ ...form, timezone: e.target.value })}
                  disabled={!isAdmin}
                >
                  <option value="Asia/Kolkata">Asia/Kolkata (IST +05:30)</option>
                  <option value="Asia/Dubai">Asia/Dubai (GST +04:00)</option>
                  <option value="Europe/London">Europe/London (GMT/BST)</option>
                  <option value="America/New_York">America/New_York (EST/EDT)</option>
                  <option value="Asia/Singapore">Asia/Singapore (SGT +08:00)</option>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Base Currency (Stored in Integer Minor Units)</Label>
                <Select
                  value={form.currency}
                  onChange={(e) => setForm({ ...form, currency: e.target.value })}
                  disabled={!isAdmin}
                >
                  <option value="INR">INR — Indian Rupee (₹ paise)</option>
                  <option value="USD">USD — US Dollar ($ cents)</option>
                  <option value="AED">AED — UAE Dirham (fils)</option>
                  <option value="GBP">GBP — British Pound (£ pence)</option>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Official Contact Coordinates */}
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" /> Official Contact Information
            </CardTitle>
            <CardDescription className="text-xs">
              Displayed on generated PDF report cards, official fee receipts, and admissions communications.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Contact Email</Label>
                <Input
                  type="email"
                  value={form.contactEmail}
                  onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                  disabled={!isAdmin}
                />
              </div>

              <div className="space-y-1.5">
                <Label>Contact Phone</Label>
                <Input
                  value={form.contactPhone}
                  onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                  disabled={!isAdmin}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Campus Physical Address</Label>
              <Input
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                disabled={!isAdmin}
                placeholder="Building, Street, City, State, Postal Code"
              />
            </div>
          </CardContent>
        </Card>

        {isAdmin && (
          <div className="flex justify-end">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
              <Save className="h-4 w-4" /> Save Profile Configurations
            </Button>
          </div>
        )}
      </form>
    </div>
  )
}
