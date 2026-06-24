'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import toast from 'react-hot-toast'


export default function LoginPage(){

const router = useRouter()


const [isLoading,setIsLoading]=useState(false)

const [showPassword,setShowPassword]=useState(false)


const [formData,setFormData]=useState({

email:'',

password:''

})





const handleSubmit = async(
e:React.FormEvent
)=>{


e.preventDefault()



if(
!formData.email ||
!formData.password
){

toast.error(
'Please enter email and password'
)

return

}



setIsLoading(true)



try{


const {

data,

error

}=await supabase.auth.signInWithPassword({

email:
formData.email.trim(),

password:
formData.password

})




if(error){

toast.error(
error.message
)

return

}




if(!data.user){

toast.error(
'Login failed'
)

return

}




const {

data:profile,

error:profileError

}=await supabase

.from('profiles')

.select(
`
role,
is_approved
`
)

.eq(
'id',
data.user.id
)

.maybeSingle()





if(profileError){

console.error(
profileError
)

toast.error(
'Profile loading failed'
)

return

}





if(!profile){


await supabase

.from('profiles')

.upsert({

id:data.user.id,

email:data.user.email,

role:'patient',

is_approved:true

})



toast.success(
'Account created'
)


router.push(
'/patient/dashboard'
)


return

}




toast.success(
'Login successful'
)





switch(profile.role){



case 'patient':

router.push(
'/patient/dashboard'
)

break




case 'doctor':


if(profile.is_approved){

router.push(
'/doctor/dashboard'
)

}

else{

router.push(
'/doctor/pending-approval'
)

}


break





case 'hospital':


if(profile.is_approved){

router.push(
'/hospital/dashboard'
)

}

else{

router.push(
'/hospital/pending-approval'
)

}


break





case 'desk':

router.push(
'/desk/dashboard'
)

break





default:

router.push('/')

}



}

catch(error){

console.error(
'Login Error',
error
)

toast.error(
'Something went wrong'
)


}

finally{

setIsLoading(false)

}


}






return (

<div
className="
min-h-screen
bg-linear-to-b
from-teal-50
to-white
flex
flex-col
"
>



{/* NAVBAR */}


<nav
className="
bg-white
shadow-sm
px-4
py-4
"
>


<div
className="
max-w-7xl
mx-auto
flex
justify-between
items-center
"
>


<Link
href="/"
className="
flex
items-center
gap-3
"
>


<Image

src="/assets/icons/logo.png"

width={45}

height={45}

alt="Quick Treat"

className="
rounded-xl
"

/>



<div>

<h1
className="
text-xl
font-bold
text-teal-700
"
>

Quick Treat

</h1>


<p
className="
text-xs
text-gray-500
hidden
sm:block
"
>

Smart Healthcare Platform

</p>


</div>


</Link>





<div
className="
flex
gap-3
"
>


<Link

href="/patient-register"

className="
bg-teal-600
text-white
px-4
py-2
rounded-lg
"

>

Register

</Link>




<Link

href="/"

className="
text-gray-600
px-3
py-2
"

>

Home

</Link>



</div>


</div>


</nav>





{/* LOGIN CARD */}



<main
className="
flex-1
flex
items-center
justify-center
px-4
py-12
"
>


<div
className="
w-full
max-w-md
"
>


<div
className="
bg-white
rounded-2xl
shadow-xl
border
p-6
sm:p-8
"
>



<div
className="
text-center
mb-6
"
>


<div
className="
w-16
h-16
bg-teal-100
rounded-full
mx-auto
flex
items-center
justify-center
text-3xl
"
>

🔐

</div>



<h1
className="
text-2xl
font-bold
text-teal-700
mt-4
"
>

Welcome Back!

</h1>



<p
className="
text-gray-500
text-sm
mt-2
"
>

Login to your account

</p>


</div>
<form
onSubmit={handleSubmit}
className="
space-y-5
"
>



{/* EMAIL */}


<div>

<label
className="
block
text-sm
font-medium
text-gray-700
mb-2
"
>
Email Address
</label>


<input

type="email"

placeholder="your@email.com"

value={formData.email}

onChange={(e)=>setFormData({

...formData,

email:e.target.value

})}

className="
w-full
px-4
py-3
border
border-teal-100
rounded-lg
focus:outline-none
focus:ring-2
focus:ring-teal-500
"

required

/>


</div>





{/* PASSWORD */}


<div>


<label
className="
block
text-sm
font-medium
text-gray-700
mb-2
"
>

Password

</label>



<div
className="
relative
"
>


<input

type={
showPassword
?
'text'
:
'password'
}

placeholder="Enter your password"

value={formData.password}

onChange={(e)=>setFormData({

...formData,

password:e.target.value

})}


className="
w-full
px-4
py-3
pr-12
border
border-teal-100
rounded-lg
focus:outline-none
focus:ring-2
focus:ring-teal-500
"

required

/>



<button

type="button"

onClick={()=>setShowPassword(!showPassword)}

className="
absolute
right-4
top-1/2
-translate-y-1/2
"

>

{
showPassword
?
'👁️'
:
'👁️‍🗨️'
}


</button>


</div>


</div>







{/* FORGOT PASSWORD */}



<div
className="
text-right
"
>


<Link

href="/forgot-password"

className="
text-sm
text-teal-600
hover:underline
"

>

Forgot Password?

</Link>



</div>






{/* LOGIN BUTTON */}


<button

type="submit"

disabled={isLoading}

className="
w-full
bg-teal-600
hover:bg-teal-700
text-white
py-3
rounded-lg
font-semibold
transition
disabled:opacity-50
"

>


{

isLoading

?

'Logging in...'

:

'Login'

}


</button>



</form>







{/* REGISTER LINK */}


<div
className="
mt-6
text-center
"
>


<p
className="
text-sm
text-gray-500
"
>


Don&apost have an account?

{" "}


<Link

href="/patient-register"

className="
text-teal-600
font-medium
hover:underline
"

>

Register here

</Link>


</p>


</div>







{/* DIVIDER */}


<div
className="
relative
my-6
"
>


<div
className="
absolute
inset-0
flex
items-center
"
>

<div
className="
w-full
border-t
border-gray-200
"

/>

</div>



<div
className="
relative
flex
justify-center
"
>

<span
className="
bg-white
px-3
text-sm
text-gray-400
"
>

or

</span>


</div>



</div>







{/* DOCTOR HOSPITAL REGISTER */}


<Link

href="/doctor-hospital-register"

className="
w-full
flex
items-center
justify-center
gap-2
border-2
border-teal-600
text-teal-700
py-3
rounded-lg
hover:bg-teal-50
transition
"

>


<span>

🖥️

</span>


Doctor / Hospital Registration


</Link>



<p
className="
text-xs
text-center
text-gray-500
mt-3
"
>

Register as a doctor or hospital to manage patients digitally

</p>




</div>


</div>


</main>







{/* FOOTER */}


<footer
className="
bg-teal-800
text-white
py-6
"
>


<div
className="
max-w-7xl
mx-auto
px-4
text-center
text-sm
text-white/70
"
>


© 2026 Quick Treat. All Rights Reserved.


</div>


</footer>




</div>


)

}