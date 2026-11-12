import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://jvylhtbypldyttspkdal.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2eWxodGJ5cGxkeXR0c3BrZGFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM4NTI0OTYsImV4cCI6MjEwOTQyODQ5Nn0.GiknAVaCtYXtAakHrN0E19vtA-N7NP08RtdmG5kMI-E'

export const isLiveSupabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL &&
  import.meta.env.VITE_SUPABASE_ANON_KEY &&
  !import.meta.env.VITE_SUPABASE_URL.includes('demo-educore')
)

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})
