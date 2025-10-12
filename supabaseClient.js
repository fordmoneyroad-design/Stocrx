import { createClient } from 'https://esm.sh/@supabase/supabase-js'

const supabaseUrl = "https://bqdkkorreefnoyxftkyw.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxZGtrb3JyZWVmbm95eGZ0a3l3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxODk3MjQsImV4cCI6MjA3NTc2NTcyNH0.Kv1-tm4RCQdL1wBaERB2Oaxjzi1vEnn9HpwErwfeZEI"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
