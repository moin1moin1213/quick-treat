'use client'

import {useState} from "react"
import {supabase} from "@/lib/supabase/client"
import toast from "react-hot-toast"
import Link from "next/link"
import {Mail} from "lucide-react"


export default function ForgotPassword(){


const [email,setEmail]=useState("")
const [loading,setLoading]=useState(false)



const sendResetLink=async()=>{


if(!email){

toast.error(
"Please enter your email"
)

return

}


setLoading(true)



const {error}=await supabase.auth.resetPasswordForEmail(

email,

{

redirectTo:
`${window.location.origin}/reset-password`

}

)



if(error){

toast.error(
error.message
)

}

else{

toast.success(
"Password reset link sent to your email"
)

}



setLoading(false)


}



return (

<div
className="
min-h-screen
flex
items-center
justify-center
bg-teal-50
px-4
"
>


<div
className="
bg-white
w-full
max-w-md
rounded-2xl
shadow-xl
p-8
border
"
>


<h1
className="
text-2xl
font-bold
text-center
text-teal-700
"
>

Forgot Password?

</h1>


<p
className="
text-center
text-gray-500
mt-2
"
>

Enter your email to receive reset link

</p>



<div
className="
mt-8
"
>


<label
className="
text-sm
font-medium
"
>

Email Address

</label>


<div
className="
relative
mt-2
"
>

<Mail
className="
absolute
left-3
top-3
text-teal-600
"
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
outline-none
focus:ring-2
focus:ring-teal-500
"

/>


</div>



<button

onClick={sendResetLink}

disabled={loading}

className="
w-full
mt-6
bg-teal-600
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
"Sending..."
:
"Send Reset Link"
}


</button>


</div>



<div
className="
text-center
mt-6
"
>

<Link
href="/login"
className="
text-teal-600
"
>

← Back to Login

</Link>


</div>


</div>


</div>

)


}