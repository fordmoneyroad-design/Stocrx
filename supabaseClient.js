import { createClient } from 'https://esm.sh/@supabase/supabase-js'

const supabaseUrl = "https://tnrxloldwmrlwslftepl.supabase.co"
const supabaseAnonKey = "YOUR_ANON_KEY"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
