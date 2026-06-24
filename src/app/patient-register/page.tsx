'use client'

import { useRouter } from 'next/navigation'

import PatientSignup from '@/components/auth/PatientSignup'

import RegisterHeader from '@/components/register/RegisterHeader'

import RegisterFooter from '@/components/register/RegisterFooter'



export default function PatientRegisterPage(){


const router = useRouter()



return (

<div

className="
min-h-screen
bg-linear-to-b
from-teal-50
via-white
to-white
"

>


{/* HEADER */}

<RegisterHeader

subtitle="
Create your patient account
"

/>






<main

className="
px-4
sm:px-6
lg:px-8
py-10
"

>


<div

className="
max-w-3xl
mx-auto
"

>





{/* PAGE HERO */}


<div

className="
text-center
mb-8
"

>



<div

className="
mx-auto
w-20
h-20
rounded-3xl
bg-teal-100
flex
items-center
justify-center
text-4xl
mb-5
"

>

👤

</div>






<h1

className="
text-3xl
sm:text-4xl
font-bold
text-teal-800
"

>

Create Patient Account

</h1>






<p

className="
mt-3
text-slate-500
max-w-xl
mx-auto
"

>

Register now and book doctor appointments,
manage prescriptions and healthcare records easily.

</p>




</div>









{/* FORM CARD */}



<div

className="
bg-white
rounded-3xl
shadow-xl
border
border-teal-100
p-5
sm:p-8
"

>




<div

className="
flex
items-center
gap-3
mb-6
"

>


<div

className="
w-12
h-12
rounded-xl
bg-teal-50
flex
items-center
justify-center
text-2xl
"

>

📝

</div>





<div>


<h2

className="
font-bold
text-xl
text-teal-800
"

>

Patient Information

</h2>



<p

className="
text-sm
text-slate-500
"

>

Fill your details to create account

</p>



</div>



</div>









<PatientSignup

onClose={()=>{

router.push('/login')

}}

/>






</div>










<p

className="
text-center
text-sm
text-slate-500
mt-6
"

>


Already have an account?



<button


onClick={()=>router.push('/login')}


className="
ml-2
text-teal-600
font-semibold
hover:underline
"


>

Login

</button>



</p>






</div>


</main>






<RegisterFooter/>



</div>


)


}