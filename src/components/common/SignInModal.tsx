import React, { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useTenant } from '@/contexts/tenant-context'
import type { UserRole } from '@/types/database.types'
import { Lock, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'

interface SignInModalProps {
  isOpen: boolean
  onClose: () => void
  onOpenRegister: () => void
}

export function SignInModal({ isOpen, onClose, onOpenRegister }: SignInModalProps) {
  const { signIn } = useAuth()
  const { allInstitutions, setDevSubdomain } = useTenant()

  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const role: UserRole = 'institution_admin'
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const cleanId = identifier.trim().toLowerCase().replace('.educore.com', '')
    if (!cleanId) {
      setError('Please enter your institution subdomain or email.')
      return
    }

    if (!password) {
      setError('Please enter your password.')
      return
    }

    setIsLoading(true)

    try {
      // 1. Platform Master / Founder Login
      if (cleanId === 'admin' || cleanId === 'founder@educore.com') {
        signIn('founder@educore.com', password, 'platform_founder')
        setDevSubdomain('admin')
        onClose()
        return
      }

      // 2. Institution Tenant Login
      const matched = allInstitutions.find(
        (inst) =>
          inst.slug.toLowerCase() === cleanId ||
          inst.contact_email.toLowerCase() === cleanId
      )

      if (matched) {
        signIn(matched.contact_email, password, role)
        setDevSubdomain(matched.slug)
        onClose()
        return
      }

      // If user registered an institution in this session or Supabase
      if (allInstitutions.length === 0) {
        setError('No registered institutions found. Please create your institution portal first.')
      } else {
        setError('Invalid credentials or institution subdomain not found.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-6 rounded-3xl border-slate-200">
        <div className="text-center space-y-2 mb-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 mb-1">
            <Lock className="h-6 w-6" />
          </div>
          <DialogTitle className="text-xl font-bold text-slate-900">
            Sign In to Your Account
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Enter your institution identifier to access your portal.
          </DialogDescription>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSignIn} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-700">
              Institution Subdomain or Email *
            </Label>
            <div className="flex items-center">
              <Input
                placeholder="e.g. oakridge or admin@school.edu"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-700">Password *</Label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <DialogFooter className="pt-2 sm:pt-4 flex flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </DialogFooter>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onClose()
              onOpenRegister()
            }}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            Don't have an institution portal? Create your institution
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
