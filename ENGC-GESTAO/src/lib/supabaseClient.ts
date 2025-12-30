import { createClient } from '@supabase/supabase-js'

// Hardcoded fallbacks for Vercel deployment without manual env setup
// Note: In a strict production environment, always use Environment Variables.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://swttlthgoutcsogdakuk.supabase.co"
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3dHRsdGhnb3V0Y3NvZ2Rha3VrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwNzMzMTEsImV4cCI6MjA4MjY0OTMxMX0.CcRCrZV_LOLtEOSjxU5fAWxVAFwvPsMcRsSpwlkzcXI"

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase environment variables.")
}

export const supabase = createClient(
    supabaseUrl,
    supabaseAnonKey
)
