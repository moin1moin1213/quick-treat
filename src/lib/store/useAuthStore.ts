import { create } from 'zustand'
import { supabase } from '@/lib/supabase/client'
import { Profile } from '@/types'
import { User } from '@supabase/supabase-js'


interface AuthState {

  user: User | null
  profile: Profile | null

  isLoading: boolean
  isHydrated: boolean

  initializeAuth: () => Promise<void>

  setUser: (user: User | null) => void
  setProfile: (profile: Profile | null) => void

  signOut: () => Promise<void>

  signInWithGoogle: () => Promise<void>
}



export const useAuthStore = create<AuthState>((set) => ({


  user:null,
  profile:null,

  isLoading:true,
  isHydrated:false,


  setUser:(user)=>set({
    user
  }),


  setProfile:(profile)=>set({
    profile
  }),



  initializeAuth: async()=>{


    try{


      const {
        data:{
          session
        }
      } = await supabase.auth.getSession()



      if(session?.user){


        set({
          user:session.user
        })


        const {
          data:profile
        } = await supabase
          .from('profiles')
          .select('*')
          .eq(
            'id',
            session.user.id
          )
          .single()



        set({
          profile
        })

      }



      supabase.auth.onAuthStateChange(
        async(
          event,
          session
        )=>{


          if(session?.user){


            set({
              user:session.user
            })


            const {
              data:profile
            } = await supabase
              .from('profiles')
              .select('*')
              .eq(
                'id',
                session.user.id
              )
              .single()


            set({
              profile
            })

          }
          else{


            set({
              user:null,
              profile:null
            })


          }


        }
      )


    }
    catch(error){

      console.error(
        'Auth initialize error:',
        error
      )

    }
    finally{


      set({
        isLoading:false,
        isHydrated:true
      })


    }


  },



  signOut:async()=>{


    await supabase.auth.signOut()


    set({

      user:null,
      profile:null

    })


  },



  signInWithGoogle:async()=>{


    const {
      error
    } = await supabase.auth.signInWithOAuth({

      provider:'google',

      options:{
        redirectTo:
        `${window.location.origin}/auth/callback`
      }

    })


    if(error){

      console.error(error)

    }


  }


}))