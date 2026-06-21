'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/store/useAuthStore'


export function Providers({
  children
}: {
  children: React.ReactNode
}) {


  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions:{
          queries:{
            staleTime:60 * 1000,
            refetchOnWindowFocus:false,
            retry:1,
          }
        }
      })
  )



  const {
    setUser,
    setProfile,
    setLoading,
    setHydrated
  } = useAuthStore()



  useEffect(()=>{


    const fetchProfile = async(
      userId:string
    )=>{


      const {
        data,
        error
      } = await supabase
        .from('profiles')
        .select('*')
        .eq(
          'id',
          userId
        )
        .single()



      if(error){

        console.error(
          'Profile error:',
          error
        )

        return

      }


      setProfile(data)

    }



    const initAuth = async()=>{


      try{


        // Existing session check
        const {
          data:{
            session
          }
        } = await supabase.auth.getSession()



        if(session?.user){


          setUser(
            session.user
          )


          await fetchProfile(
            session.user.id
          )


        }
        else{


          setUser(null)
          setProfile(null)


        }



      }
      catch(error){


        console.error(
          'Auth init error:',
          error
        )


      }
      finally{


        setLoading(false)

        setHydrated(true)


      }


    }



    initAuth()



    const {
      data:{
        subscription
      }
    } = supabase.auth.onAuthStateChange(
      async(
        event,
        session
      )=>{


        console.log(
          'Auth event:',
          event
        )



        if(session?.user){


          setUser(
            session.user
          )


          await fetchProfile(
            session.user.id
          )


        }
        else{


          setUser(null)

          setProfile(null)


        }


      }
    )



    return()=>{

      subscription.unsubscribe()

    }



  },[
    setUser,
    setProfile,
    setLoading,
    setHydrated
  ])




  return(

    <QueryClientProvider client={queryClient}>

      {children}

    </QueryClientProvider>

  )

}