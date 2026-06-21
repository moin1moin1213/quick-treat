'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import toast from 'react-hot-toast'


interface LoginForm {
  email: string
  password: string
}


export default function LoginTab({
  onClose
}: {
  onClose: () => void
}) {


  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()


  const {
    register,
    handleSubmit,
    formState: { errors }

  } = useForm<LoginForm>()



  const onSubmit = async (data: LoginForm) => {


    setIsLoading(true)



    try {


      console.log(
        "Attempting login:",
        data.email
      )



      const {
        data: authData,
        error

      } = await supabase.auth.signInWithPassword({

        email: data.email,

        password: data.password

      })



      if (error) {

        throw error

      }



      if (!authData.user) {

        toast.error(
          "Login failed"
        )

        return

      }



      console.log(
        "LOGIN USER:",
        authData.user.id
      )



      toast.success(
        "Login successful!"
      )

      onClose()




      /*
        Get profile
      */


      let {

        data: profile,

        error: profileError


      } = await supabase

        .from('profiles')

        .select(
          'role, is_approved'
        )

        .eq(
          'id',
          authData.user.id
        )

        .maybeSingle()



      console.log(
        "PROFILE DATA:",
        profile
      )


      console.log(
        "PROFILE ERROR:",
        profileError
      )




      /*
        Create profile if missing
      */


      if (!profile) {


        const userRole =
          authData.user.user_metadata?.role ||
          'patient'



        console.log(
          "Creating missing profile:",
          userRole
        )



        const {
          error: createError

        } = await supabase

          .from('profiles')

          .insert({

            id:
              authData.user.id,


            name:
              authData.user.user_metadata?.name ||
              data.email.split('@')[0],


            email:
              data.email,


            phone:
              authData.user.user_metadata?.phone ||
              '',


            role:
              userRole,


            is_approved:
              userRole === 'patient'


          })




        if (createError) {


          console.error(
            "Profile create error:",
            createError
          )


          toast.error(
            "Profile creation failed"
          )


          return

        }



        profile = {

          role: userRole,

          is_approved:
            userRole === 'patient'

        }


      }





      const role =
        profile?.role



      const approved =
        profile?.is_approved




      console.log(
        "ROLE:",
        role
      )


      console.log(
        "APPROVED:",
        approved
      )






      /*
        Redirect
      */


      if (role === 'doctor') {


        if (approved) {


          router.push(
            '/doctor/dashboard'
          )


        } else {


          router.push(
            '/doctor/pending-approval'
          )


        }



      }



      else if (role === 'hospital') {



        if (approved) {


          router.push(
            '/hospital/dashboard'
          )


        } else {


          router.push(
            '/hospital/pending-approval'
          )


        }



      }



      else if (role === 'patient') {



        router.push(
          '/patient/dashboard'
        )



      }



      else {


        router.push('/')


      }




    }



    catch(error) {



      console.error(
        "LOGIN ERROR:",
        error
      )



      if(error instanceof Error){


        if(
          error.message.includes(
            "Invalid login credentials"
          )
        ){


          toast.error(
            "Invalid email or password"
          )


        }

        else {


          toast.error(
            error.message
          )


        }


      }

      else {


        toast.error(
          "Login failed"
        )


      }


    }



    finally {


      setIsLoading(false)


    }


  }





  return (

    <form
      onSubmit={
        handleSubmit(onSubmit)
      }

      className="space-y-4"

    >


      <div>


        <label className="block text-sm font-medium mb-1">

          Email Address

        </label>


        <input

          type="email"

          placeholder="your@email.com"


          {...register(
            'email',
            {
              required:
                "Email is required"
            }
          )}


          className="w-full px-4 py-3 border rounded-lg"

        />


        {
          errors.email &&
          <p className="text-red-500 text-sm">

            {errors.email.message}

          </p>
        }


      </div>





      <div>


        <label className="block text-sm font-medium mb-1">

          Password

        </label>


        <input

          type="password"

          placeholder="Password"


          {...register(
            'password',
            {
              required:
                "Password is required"
            }
          )}


          className="w-full px-4 py-3 border rounded-lg"

        />


      </div>





      <button

        type="submit"

        disabled={isLoading}


        className="w-full bg-primary text-white py-3 rounded-lg"

      >


        {
          isLoading
          ?
          "Logging in..."
          :
          "Login"
        }


      </button>



    </form>

  )

}