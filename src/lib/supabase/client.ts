import { createClient } from '@supabase/supabase-js'


const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL


const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY



if (!supabaseUrl) {

  throw new Error(
    'Missing environment variable: NEXT_PUBLIC_SUPABASE_URL'
  )

}



if (!supabaseAnonKey) {

  throw new Error(
    'Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY'
  )

}



export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {

    auth: {

      // Browser এ session save করবে
      persistSession: true,


      // Token expire হলে automatic refresh করবে
      autoRefreshToken: true,


      // OAuth callback handle করবে
      detectSessionInUrl: true,


      // Login browser storage এ থাকবে
      storage:
        typeof window !== 'undefined'
          ? window.localStorage
          : undefined,

    },

  }
)