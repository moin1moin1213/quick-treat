'use client'


import {
useState,
useEffect
} from 'react'


import {
useForm
} from 'react-hook-form'


import {
useRouter
} from 'next/navigation'


import {
supabase
} from '@/lib/supabase/client'


import toast from 'react-hot-toast'



import {
User,
Mail,
Phone,
Stethoscope,
GraduationCap,
MapPin,
Lock,
BadgeCheck,

ShieldCheck
} from 'lucide-react'





interface DoctorSignupForm {


name:string

email:string

phone:string

whatsapp:string

bmdc_number:string

speciality:string

degree:string

experience:string

consultation_fee:string

district:string

upazila:string

password:string

confirmPassword:string


}






interface District{


id:number

name:string


}






interface Upazila{


id:number

name:string


}







const specialities=[


'Cardiologist',

'Neurologist',

'Orthopedic',

'Pediatrician',

'Gynecologist',

'Dermatologist',

'Psychiatrist',

'ENT Specialist',

'Ophthalmologist',

'Dentist',

'Urologist',

'Gastroenterologist'


]







const degrees=[


'MBBS',

'MD',

'MS',

'FCPS',

'BDS',

'MDS',

'PhD',

'FRCS'


]









export default function DoctorSignup({


onClose


}:{


onClose:()=>void


}){





const router = useRouter()






const [isLoading,setIsLoading]=useState(false)





const [districts,setDistricts]=useState<District[]>([])


const [upazilas,setUpazilas]=useState<Upazila[]>([])


const [selectedDistrict,setSelectedDistrict]=useState('')







// OTP STATE


const [otpSent,setOtpSent]=useState(false)


const [otpVerified,setOtpVerified]=useState(false)


const [otp,setOtp]=useState('')


const [otpLoading,setOtpLoading]=useState(false)





const [generatedOtp,setGeneratedOtp]=useState('')









const {


register,


handleSubmit,


getValues,




}=useForm<DoctorSignupForm>()









// ================================
// PHONE FORMAT
// 017XXXXXXXX
// TO
// 88017XXXXXXXX
// ================================



const formatPhoneNumber=(phone:string)=>{


const number = phone.replace(
/\D/g,
''
)


if(number.startsWith('880')){


return number

}



if(number.startsWith('01')){


return '88'+number

}



return number


}












// ================================
// SEND OTP
// ================================


const sendOTP=async()=>{



const phone = getValues('phone')



if(!phone){


toast.error(
'Enter phone number first'
)


return


}





const phoneNumber =
formatPhoneNumber(phone)





setOtpLoading(true)





try{



const otpCode = 
Math.floor(
100000 +
Math.random()*900000
)
.toString()






const response = await fetch(
'/api/send-otp',
{


method:'POST',


headers:{


'Content-Type':'application/json'


},


body:JSON.stringify({


phone:phoneNumber,


otp:otpCode


})


}

)






const result =
await response.json()







if(!response.ok){


throw new Error(
result.message ||
'OTP send failed'
)


}






setGeneratedOtp(
otpCode
)



setOtpSent(true)



toast.success(
'OTP sent successfully'
)





}catch(error){



console.error(error)


toast.error(
'Failed to send OTP'
)



}finally{


setOtpLoading(false)


}



}









// ================================
// VERIFY OTP
// ================================



const verifyOTP=()=>{


if(
otp === generatedOtp
){


setOtpVerified(true)


toast.success(
'Phone verified'
)



}

else{


toast.error(
'Invalid OTP'
)



}


}











// ================================
// LOCATION
// ================================



const fetchDistricts=async()=>{



const {


data,


error


}=await supabase


.from('districts')


.select(
'id,name'
)


.order(
'name'
)






if(!error){


setDistricts(
data || []
)


}



}









const fetchUpazilas=async(


districtId:string


)=>{



const {


data,


error


}=await supabase


.from('upazilas')


.select(
'id,name'
)


.eq(

'district_id',

parseInt(districtId)

)


.order(
'name'
)






if(!error){


setUpazilas(
data || []
)


}




}









useEffect(()=>{


fetchDistricts()


},[])







useEffect(()=>{



if(selectedDistrict){


fetchUpazilas(
selectedDistrict
)


}

else{


setUpazilas([])


}



},[selectedDistrict])
// ================================
// SUBMIT
// ================================


const onSubmit = async(
data:DoctorSignupForm
)=>{


if(!otpVerified){

toast.error(
'Please verify your phone number first'
)

return

}



if(data.password !== data.confirmPassword){


toast.error(
'Passwords do not match'
)


return


}




if(data.password.length < 6){


toast.error(
'Password minimum 6 characters'
)


return


}





setIsLoading(true)





try{



// FORMAT PHONE


const phoneNumber =
formatPhoneNumber(
data.phone
)




const whatsappNumber =
data.whatsapp
?
formatPhoneNumber(
data.whatsapp
)
:
null







// EMAIL CHECK


const {

data:existingUser

}=await supabase


.from('profiles')


.select('email')


.eq(

'email',

data.email

)


.maybeSingle()






if(existingUser){


toast.error(
'Email already registered'
)


return


}









// BMDC CHECK



const {


data:existingDoctor


}=await supabase


.from('doctors')


.select('bmdc_number')


.eq(

'bmdc_number',

data.bmdc_number

)


.maybeSingle()







if(existingDoctor){


toast.error(
'BMDC number already registered'
)


return


}









// CREATE AUTH USER



const {


data:authData,


error:authError


}=await supabase.auth.signUp({



email:data.email,


password:data.password,



options:{



data:{



name:data.name,


role:'doctor',


phone:phoneNumber,


whatsapp:whatsappNumber,


is_approved:false



}



}



})







if(authError)
throw authError









if(authData.user){







// CREATE PROFILE



const {


error:profileError


}=await supabase



.from('profiles')



.insert({



id:authData.user.id,


name:data.name,


email:data.email,


phone:phoneNumber,


whatsapp:whatsappNumber,


role:'doctor',


district:data.district,


upazila:data.upazila,


is_approved:false



})









if(profileError)
throw profileError











// CREATE DOCTOR RECORD



const {


error:doctorError


}=await supabase



.from('doctors')



.insert({



user_id:authData.user.id,


bmdc_number:data.bmdc_number,


speciality:data.speciality,


degree:data.degree,


experience:
Number(data.experience),



consultation_fee:
Number(data.consultation_fee),



is_available:false,


is_approved:false



})








if(doctorError)
throw doctorError







toast.success(
'Registration submitted successfully'
)






onClose()









// AUTO LOGIN



const {


error:loginError


}=await supabase.auth.signInWithPassword({



email:data.email,


password:data.password



})








if(!loginError){


router.push(
'/doctor/pending-approval'
)



router.refresh()


}








}




}catch(error:unknown){



console.error(
'Doctor Signup Error:',
error
)





if(error instanceof Error){


toast.error(
error.message
)


}else{


toast.error(
'Signup failed'
)


}




}finally{


setIsLoading(false)


}



}
return (

<form

onSubmit={
handleSubmit(onSubmit)
}

className="
space-y-6
max-h-[75vh]
overflow-y-auto
px-1
"

>





{/* DOCTOR INFORMATION */}


<div>


<div className="
flex
items-center
gap-2
mb-4
">


<Stethoscope

size={21}

className="text-primary"

/>


<h3 className="
font-semibold
text-teal-dark
">

Doctor Information

</h3>


</div>






<div className="
grid
grid-cols-1
md:grid-cols-2
gap-4
">





<div>

<label className="input-label">

Doctor Name *

</label>



<div className="relative">


<User className="input-icon"/>


<input

type="text"

placeholder="Dr. Md. Rahman"


{...register(

'name',

{
required:'Name required'
}

)}


className="
input-field
pl-10
"

/>


</div>


</div>







<div>


<label className="input-label">

Email *

</label>



<div className="relative">


<Mail className="input-icon"/>


<input

type="email"

placeholder="doctor@email.com"


{...register(

'email',

{
required:'Email required'
}

)}


className="
input-field
pl-10
"

/>


</div>


</div>







<div>


<label className="input-label">

Phone *

</label>



<div className="relative">


<Phone className="input-icon"/>


<input

type="tel"

placeholder="017XXXXXXXX"


{...register(

'phone',

{
required:'Phone required'
}

)}


className="
input-field
pl-10
"

/>


</div>





{
!otpSent &&

<button

type="button"

onClick={sendOTP}

disabled={otpLoading}

className="
mt-3
text-sm
bg-teal-600
text-white
px-4
py-2
rounded-lg
"

>

{

otpLoading

?

'Sending...'

:

'Send OTP'

}


</button>

}





{
otpSent && !otpVerified &&

<div className="
mt-3
flex
gap-2
">


<input

type="text"

maxLength={6}

placeholder="Enter OTP"


value={otp}


onChange={(e)=>
setOtp(e.target.value)
}


className="
input-field
"
/>



<button

type="button"

onClick={verifyOTP}

className="
bg-green-600
text-white
px-4
rounded-lg
"

>

Verify

</button>


</div>

}




{
otpVerified &&

<p className="
text-green-600
text-sm
mt-2
flex
items-center
gap-1
">

<ShieldCheck size={16}/>

Phone Verified

</p>


}





</div>









<div>


<label className="input-label">

WhatsApp Number

</label>



<input

type="tel"

placeholder="8801XXXXXXXXX"


{...register(
'whatsapp'
)}


className="
input-field
"

/>


</div>









<div>


<label className="input-label">

BMDC Number *

</label>



<div className="relative">


<BadgeCheck className="input-icon"/>



<input

type="text"

placeholder="BMDC-12345"


{...register(

'bmdc_number',

{
required:'BMDC required'
}

)}


className="
input-field
pl-10
"

/>


</div>


</div>









<div>


<label className="input-label">

Speciality *

</label>



<select


{...register(

'speciality',

{
required:'Speciality required'
}

)}



className="input-field"


>


<option value="">

Select speciality

</option>



{

specialities.map(item=>(


<option

key={item}

value={item}

>

{item}

</option>


))

}



</select>


</div>





</div>

</div>









{/* PROFESSIONAL DETAILS */}



<div>


<div className="
flex
items-center
gap-2
mb-4
">


<GraduationCap

size={21}

className="text-primary"

/>



<h3 className="
font-semibold
text-teal-dark
">

Professional Details

</h3>


</div>







<div className="
grid
grid-cols-1
md:grid-cols-2
gap-4
">





<select


{...register(

'degree',

{
required:'Degree required'
}

)}


className="input-field"

>


<option value="">

Select Degree

</option>


{

degrees.map(item=>(

<option

key={item}

value={item}

>

{item}

</option>

))

}



</select>







<input


type="number"


placeholder="Experience Years"



{...register(

'experience',

{
required:'Experience required'
}

)}



className="input-field"

/>








<input


type="number"


placeholder="Consultation Fee"



{...register(

'consultation_fee',

{
required:'Fee required'
}

)}



className="input-field"

/>




</div>


</div>









{/* LOCATION */}



<div>


<div className="
flex
items-center
gap-2
mb-4
">


<MapPin

size={21}

className="text-primary"

/>



<h3 className="
font-semibold
text-teal-dark
">

Clinic Location

</h3>



</div>






<div className="
grid
grid-cols-1
md:grid-cols-2
gap-4
">





<select


{...register(

'district',

{
required:'District required'
}

)}



onChange={(e)=>
setSelectedDistrict(
e.target.value
)
}


className="input-field"

>


<option value="">

Select District

</option>


{

districts.map(item=>(

<option

key={item.id}

value={item.id}

>

{item.name}

</option>


))

}


</select>







<select


{...register(

'upazila',

{
required:'Upazila required'
}

)}


disabled={!selectedDistrict}



className="
input-field
disabled:bg-gray-100
"


>


<option value="">

Select Upazila

</option>


{

upazilas.map(item=>(

<option

key={item.id}

value={item.id}

>

{item.name}

</option>


))

}



</select>





</div>

</div>









{/* SECURITY */}



<div>


<div className="
flex
items-center
gap-2
mb-4
">


<Lock

size={21}

className="text-primary"

/>



<h3 className="
font-semibold
text-teal-dark
">

Account Security

</h3>


</div>





<div className="
grid
grid-cols-1
md:grid-cols-2
gap-4
">



<input


type="password"


placeholder="Password"



{...register(

'password',

{
required:'Password required'
}

)}



className="input-field"

/>






<input


type="password"


placeholder="Confirm Password"



{...register(

'confirmPassword',

{
required:'Confirm password required'
}

)}



className="input-field"

/>






</div>


</div>









<button


type="submit"


disabled={isLoading}



className="
w-full
bg-primary
hover:bg-primary-dark
text-white
py-3.5
rounded-xl
font-semibold
shadow-lg
disabled:opacity-50
"

>


{

isLoading

?

'Submitting...'

:

'Submit For Approval'

}


</button>







<p className="
text-center
text-sm
text-text-grey
">


Your account will be reviewed by Quick Treat admin before approval.


</p>






</form>


)

}