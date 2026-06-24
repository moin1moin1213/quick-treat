'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import { Lock, Mail } from 'lucide-react'
import { useRouter } from 'next/navigation'


export default function ResetPasswordPage() {


  const router = useRouter()


  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [confirmPassword,setConfirmPassword] = useState('')


  const [loading,setLoading] = useState(false)

  const [showNewPassword,setShowNewPassword] = useState(false)



  // Check reset session

  useEffect(()=>{


    const checkSession = async()=>{


      const {
        data
      } = await supabase.auth.getSession()


      if(data.session){

        setShowNewPassword(true)

      }


    }


    checkSession()


  },[])






  // Send reset email

  const sendResetEmail = async()=>{


    if(!email){

      toast.error(
        'Enter your email address'
      )

      return

    }


    setLoading(true)


    const {
      error
    } = await supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo:
        `${window.location.origin}/reset-password`
      }
    )



    setLoading(false)



    if(error){

      toast.error(
        error.message
      )

      return

    }



    toast.success(
      'Password reset link sent to your email'
    )


  }








  // Update password

  const updatePassword = async()=>{


    if(password.length < 6){

      toast.error(
        'Password must be minimum 6 characters'
      )

      return

    }



    if(password !== confirmPassword){

      toast.error(
        'Passwords do not match'
      )

      return

    }



    setLoading(true)



    const {
      error
    } = await supabase.auth.updateUser({

      password

    })



    setLoading(false)



    if(error){

      toast.error(
        error.message
      )

      return

    }



    toast.success(
      'Password changed successfully'
    )


    router.push('/login')


  }








return (


<div className="
min-h-screen
flex
items-center
justify-center
bg-teal-50
px-4
">


<div className="
bg-white
w-full
max-w-md
rounded-3xl
shadow-xl
p-8
">


<div className="
text-center
mb-8
">


<div className="
mx-auto
w-14
h-14
rounded-full
bg-teal-100
flex
items-center
justify-center
mb-4
">


<Lock
className="text-teal-600"
/>


</div>



<h1 className="
text-2xl
font-bold
text-teal-800
">

Reset Password

</h1>


<p className="
text-gray-500
mt-2
">

Recover your Quick Treat account

</p>


</div>





{
!showNewPassword ?


<>


<label className="
text-sm
font-medium
">

Email Address

</label>



<div className="
relative
mt-2
">


<Mail
className="
absolute
left-3
top-3
text-gray-400
"
size={20}
/>



<input

type="email"

value={email}

onChange={(e)=>
setEmail(e.target.value)
}

placeholder="your@email.com"

className="
w-full
border
rounded-xl
py-3
pl-10
pr-4
outline-none
focus:ring-2
focus:ring-teal-500
"

/>


</div>





<button

onClick={sendResetEmail}

disabled={loading}

className="
w-full
mt-6
bg-teal-600
hover:bg-teal-700
text-white
py-3
rounded-xl
font-semibold
disabled:opacity-50
"

>


{
loading
?
'Sending...'
:
'Send Reset Link'
}


</button>


</>



:

<>


<label className="
text-sm
font-medium
">

New Password

</label>


<input

type="password"

value={password}

onChange={(e)=>
setPassword(e.target.value)
}

placeholder="Minimum 6 characters"

className="
w-full
mt-2
border
rounded-xl
px-4
py-3
outline-none
focus:ring-2
focus:ring-teal-500
"

/>





<label className="
text-sm
font-medium
mt-5
block
">

Confirm Password

</label>



<input

type="password"

value={confirmPassword}

onChange={(e)=>
setConfirmPassword(e.target.value)
}

placeholder="Confirm password"

className="
w-full
mt-2
border
rounded-xl
px-4
py-3
outline-none
focus:ring-2
focus:ring-teal-500
"

/>





<button

onClick={updatePassword}

disabled={loading}

className="
w-full
mt-6
bg-teal-600
hover:bg-teal-700
text-white
py-3
rounded-xl
font-semibold
disabled:opacity-50
"

>


{
loading
?
'Updating...'
:
'Update Password'
}


</button>



</>


}



<button

onClick={()=>
router.push('/login')
}

className="
w-full
mt-4
text-teal-600
text-sm
"

>

Back to Login

</button>



</div>


</div>


)


}