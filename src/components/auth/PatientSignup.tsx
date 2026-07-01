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
  districts as bangladeshDistricts
} from '@/components/data/bangladesh-location'

import {

  User,
  Mail,
  Phone,
  Calendar,
  Droplets,
  MapPin,
  Lock

} from 'lucide-react'





interface PatientSignupForm {


  name:string


  email:string


  phone:string


  whatsapp:string


  date_of_birth:string


  blood_group:string


  district:string


  upazila:string


  password:string


  confirmPassword:string


}





interface District {

  id:number

  name:string

  upazilas:string[]

}


interface Upazila {

  id:number

  name:string

}






const bloodGroups=[

'A+',
'A-',
'B+',
'B-',
'O+',
'O-',
'AB+',
'AB-'

]









export default function PatientSignup({

onClose

}:{

onClose:()=>void

}){





const router = useRouter()





const [isLoading,setIsLoading]=useState(false)





const [districts,setDistricts]=useState<District[]>([])


const [upazilas,setUpazilas]=useState<Upazila[]>([])



const [selectedDistrict,setSelectedDistrict]=useState('')





// =====================
// OTP STATES
// =====================


const [otpSent,setOtpSent]=useState(false)


const [otpVerified,setOtpVerified]=useState(false)


const [otp,setOtp]=useState('')


const [sendingOtp,setSendingOtp]=useState(false)


const [verifyingOtp,setVerifyingOtp]=useState(false)







const {

register,

handleSubmit,

getValues,

formState:{
errors
}

}=useForm<PatientSignupForm>()






const phone = getValues('phone')









// ===============================
// PHONE FORMAT
// RT Communication
// 8801XXXXXXXXX
// ===============================



const formatPhoneNumber=(number:string)=>{


const phoneNumber =
number.replace(/\D/g,'')





// already 880 format

if(phoneNumber.startsWith('880')){


return phoneNumber


}






// Bangladesh local format

if(phoneNumber.startsWith('01')){


return `880${phoneNumber}`


}




return phoneNumber


}












// ===============================
// LOAD DISTRICTS
// ===============================














useEffect(()=>{

setDistricts(
bangladeshDistricts
)

},[])









useEffect(()=>{


if(!selectedDistrict){

setUpazilas([])

return

}



const district =
districts.find(
item=>item.id===Number(selectedDistrict)
)



if(district){


setUpazilas(

district.upazilas.map(
(item,index)=>({

id:index+1,

name:item

})
)

)


}


},[
selectedDistrict,
districts
])












// ===============================
// SEND OTP
// ===============================



const sendOTP = async()=>{


const phoneNumber = getValues('phone')



if(!phoneNumber){


toast.error(
'Enter phone number first'
)


return


}





const formattedPhone = 
formatPhoneNumber(phoneNumber)





console.log(
"Formatted Phone:",
formattedPhone
)






if(
!formattedPhone.startsWith('8801') ||
formattedPhone.length !== 13
){


toast.error(
'Enter valid phone number'
)


return


}







try{


setSendingOtp(true)






const response = await fetch(

'/api/send-otp',

{

method:'POST',

headers:{

'Content-Type':
'application/json'

},


body:JSON.stringify({

phone:formattedPhone

})


}

)







const result = await response.json()





console.log(
"OTP API Response:",
result
)







if(
result.success === true ||
result.status === 'success'
){


setOtpSent(true)


toast.success(
'OTP sent successfully'
)


}

else{


toast.error(

result.message ||

'OTP send failed'

)


}




}

catch(error){


console.error(
"OTP Error:",
error
)


toast.error(
'OTP service error'
)


}


finally{


setSendingOtp(false)


}


}
// ===============================
// VERIFY OTP
// ===============================


const verifyOTP=async()=>{


if(!otp){


toast.error(
'Enter OTP'
)


return

}



const formattedPhone =
formatPhoneNumber(phone)





try{


setVerifyingOtp(true)





const response = await fetch(


'/api/verify-otp',


{


method:'POST',


headers:{


'Content-Type':
'application/json'


},



body:JSON.stringify({


phone:formattedPhone,


otp


})



}



)








const result =
await response.json()






if(result.success){



setOtpVerified(true)



toast.success(
'Phone verified successfully'
)



}

else{



toast.error(

result.message ||

'Invalid OTP'

)



}




}


catch(error){


console.error(
error
)


toast.error(
'OTP verification failed'
)



}


finally{


setVerifyingOtp(false)


}



}












// ===============================
// SUBMIT
// ===============================



const onSubmit=async(

data:PatientSignupForm

)=>{





if(!otpVerified){


toast.error(
'Please verify phone number first'
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





// CHECK EMAIL EXIST


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



setIsLoading(false)



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


role:'patient',



phone:
formatPhoneNumber(
data.phone
),



whatsapp:data.whatsapp,



district:data.district,



upazila:data.upazila,



is_approved:true



}



}



})









if(authError){


throw authError


}









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



phone:
formatPhoneNumber(
data.phone
),



whatsapp:data.whatsapp,



role:'patient',



district:data.district,



upazila:data.upazila,



date_of_birth:data.date_of_birth,



blood_group:data.blood_group,



is_approved:true





})







if(profileError){


throw profileError


}









toast.success(

'Account created successfully'

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

'/patient/dashboard'

)



router.refresh()



}

else{



router.push(

'/login'

)



}





}






}



catch(error:unknown){



console.error(

'Signup Error:',

error

)





toast.error(



error instanceof Error


?


error.message


:


'Signup failed'



)



}




finally{



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



{/* PERSONAL INFORMATION */}

<div>


<div className="
flex items-center gap-2 mb-4
">


<User
size={20}
className="text-primary"
/>


<h3 className="
font-semibold
text-teal-dark
">

Personal Information

</h3>


</div>






<div className="
grid
grid-cols-1
md:grid-cols-2
gap-4
">





{/* NAME */}

<div>


<label className="input-label">

Full Name *

</label>


<div className="relative">


<User className="input-icon"/>



<input

type="text"

placeholder="Md. Rahman"


{...register(

'name',

{

required:'Name is required'

}

)}


className="
input-field
pl-10
"

/>


</div>



{
errors.name &&

<p className="error-text">

{errors.name.message}

</p>

}


</div>









{/* EMAIL */}


<div>


<label className="input-label">

Email Address *

</label>



<div className="relative">


<Mail className="input-icon"/>



<input

type="email"


placeholder="patient@email.com"



{...register(

'email',

{

required:'Email is required'

}

)}



className="
input-field
pl-10
"

/>


</div>


</div>









{/* PHONE + OTP */}


<div>


<label className="input-label">

Phone Number *

</label>



<div className="
flex gap-2
">


<div className="
relative flex-1
">


<Phone className="input-icon"/>



<input


type="tel"


placeholder="01712345678"



{...register(

'phone',

{

required:'Phone is required'

}

)}



disabled={otpVerified}



className="
input-field
pl-10
"

/>


</div>





<button


type="button"


onClick={sendOTP}


disabled={
sendingOtp || otpVerified
}



className="
bg-teal-600
text-white
px-4
rounded-xl
text-sm
"


>



{

otpVerified

?

'Verified'

:

sendingOtp

?

'Sending'

:

'Send OTP'


}



</button>



</div>


</div>








{/* OTP BOX */}


{

otpSent && !otpVerified &&

<div>


<label className="input-label">

Enter OTP

</label>



<div className="
flex gap-2
">



<input


type="text"


maxLength={6}


value={otp}


onChange={(e)=>

setOtp(e.target.value)

}


placeholder="123456"


className="
input-field
"

/>





<button


type="button"


onClick={verifyOTP}


disabled={verifyingOtp}



className="
bg-green-600
text-white
px-5
rounded-xl
"


>



{

verifyingOtp

?

'Checking'

:

'Verify'

}



</button>




</div>



</div>


}









{/* WHATSAPP */}


<div>


<label className="input-label">

WhatsApp Number

</label>



<div className="relative">


<Phone className="input-icon"/>



<input


type="tel"


placeholder="01712345678"


{...register(

'whatsapp'

)}



className="
input-field
pl-10
"

/>


</div>


</div>




</div>


</div>









{/* MEDICAL INFORMATION */}


<div>



<div className="
flex items-center gap-2 mb-4
">


<Droplets

size={20}

className="text-primary"

/>


<h3 className="
font-semibold
text-teal-dark
">

Medical Information

</h3>


</div>





<div className="
grid
md:grid-cols-2
gap-4
">



<div>


<label className="input-label">

Date of Birth

</label>


<div className="relative">


<Calendar className="input-icon"/>



<input


type="date"



{...register(

'date_of_birth'

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

Blood Group

</label>



<select


{...register(

'blood_group'

)}



className="
input-field
"



>


<option value="">

Select Blood Group

</option>


{

bloodGroups.map(bg=>(


<option

key={bg}

value={bg}

>

{bg}

</option>


))

}


</select>



</div>



</div>


</div>









{/* LOCATION */}



<div>



<div className="
flex items-center gap-2 mb-4
">


<MapPin

size={20}

className="text-primary"

/>


<h3 className="
font-semibold
text-teal-dark
">

Location

</h3>


</div>





<div className="
grid
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



onChange={(e)=>{


setSelectedDistrict(
e.target.value
)


}}



className="
input-field
"


>


<option value="">

Select District

</option>


{

districts.map(d=>(


<option

key={d.id}

value={d.id}

>


{d.name}


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

upazilas.map(u=>(


<option

key={u.id}

value={u.id}

>

{u.name}

</option>


))


}



</select>




</div>



</div>









{/* SECURITY */}



<div>



<div className="
flex items-center gap-2 mb-4
">


<Lock

size={20}

className="text-primary"

/>


<h3 className="
font-semibold
text-teal-dark
">

Security

</h3>


</div>







<div className="
grid
md:grid-cols-2
gap-4
">





<input


type="password"



placeholder="Password"



{...register(

'password',

{

required:'Password required',

minLength:{

value:6,

message:'Minimum 6 characters'

}

}

)}



className="
input-field
"



/>







<input


type="password"



placeholder="Confirm Password"



{...register(

'confirmPassword',

{

required:'Confirm password'

}

)}



className="
input-field
"



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
transition
disabled:opacity-50
shadow-lg
"


>


{

isLoading

?

'Creating Account...'

:

'Create Patient Account'


}



</button>







<p className="
text-center
text-sm
text-text-grey
">


By registering you agree with Quick Treat terms & privacy policy.


</p>





</form>

)

}