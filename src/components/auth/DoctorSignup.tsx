'use client'


import {
useState
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
BadgeCheck,
ShieldCheck

} from 'lucide-react'



import {

districts

} from '@/components/data/bangladesh-location'






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


address:string


password:string


confirmPassword:string


}







interface LocationDistrict {


id:number


name:string


upazilas:string[]


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







const router =
useRouter()








const [isLoading,setIsLoading]=
useState(false)








// =======================
// LOCATION
// =======================



const [selectedDistrict,setSelectedDistrict]=
useState<LocationDistrict | null>(null)



const [upazilas,setUpazilas]=
useState<string[]>([])








// =======================
// OTP
// =======================



const [otpSent,setOtpSent]=
useState(false)



const [otpVerified,setOtpVerified]=
useState(false)



const [otp,setOtp]=
useState('')



const [otpLoading,setOtpLoading]=
useState(false)



const [generatedOtp,setGeneratedOtp]=
useState('')

const [,setResendTime] = useState(0)

const [,setVerifiedPhone] = useState('')







const {


register,


handleSubmit,


getValues



}=useForm<DoctorSignupForm>()










// =======================
// PHONE FORMAT
// =======================


const formatPhoneNumber=(phone:string)=>{


const number =
phone.replace(
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












// =======================
// SEND OTP
// =======================



const sendOTP = async()=>{


const phone =
getValues('phone')



if(!phone){


toast.error(
'Enter phone number first'
)


return


}




const phoneNumber =
formatPhoneNumber(phone)





if(
!phoneNumber.startsWith('8801') ||
phoneNumber.length !== 13
){


toast.error(
'Invalid Bangladesh phone number'
)


return


}





try{


setOtpLoading(true)





const otpCode =
Math.floor(
100000 +
Math.random() * 900000
).toString()





const response =
await fetch(

'/api/send-otp',

{

method:'POST',


headers:{

'Content-Type':
'application/json'

},


body:JSON.stringify({

phone:phoneNumber,

otp:otpCode

})


}

)







const result =
await response.json()





console.log(
"OTP STATUS:",
response.status
)


console.log(
"OTP RESULT:",
result
)







// API success check

if(
!response.ok ||
result.success === false
){


throw new Error(

result.error ||

result.message ||

'OTP failed'

)


}







setGeneratedOtp(
otpCode
)



setOtpSent(true)



setVerifiedPhone(
phoneNumber
)



setResendTime(60)






toast.success(
'OTP sent successfully'
)





}

catch(error){



console.error(
"OTP SEND ERROR:",
error
)



toast.error(

error instanceof Error

?

error.message

:

'OTP send failed'

)


}



finally{


setOtpLoading(false)


}



}
// =======================
// VERIFY OTP
// =======================



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












// =======================
// DISTRICT CHANGE
// =======================


const handleDistrictChange=(

e:React.ChangeEvent<HTMLSelectElement>

)=>{



const id =
Number(
e.target.value
)





const district =
districts.find(
item=>item.id===id
)







if(district){



setSelectedDistrict(
district
)



setUpazilas(
district.upazilas
)



}



}






// =======================
// SUBMIT
// =======================


const onSubmit = async(

data:DoctorSignupForm

)=>{





if(!otpVerified){


toast.error(
'Please verify phone first'
)


return


}







if(
data.password !== data.confirmPassword
){


toast.error(
'Password not match'
)


return


}







if(
data.password.length < 6
){


toast.error(
'Password minimum 6 characters'
)


return


}







if(!selectedDistrict){


toast.error(
'Select district'
)


return


}







setIsLoading(true)







try{






// CHECK EMAIL


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
'Email already exists'
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


phone:data.phone,


is_approved:false



}


}



})








if(authError){


throw authError


}








if(!authData.user){


throw new Error(
'Account create failed'
)


}






const userId =
authData.user.id










// PROFILE INSERT



const {

error:profileError

}=await supabase


.from('profiles')


.insert({



id:userId,


name:data.name,


email:data.email,


phone:data.phone,


whatsapp:data.whatsapp,


role:'doctor',


district:data.district,


upazila:data.upazila,


is_approved:false



})








if(profileError){


throw profileError


}











// DOCTOR INSERT



const {

error:doctorError

}=await supabase


.from('doctors')


.insert({



id:userId,


bmdc_number:data.bmdc_number,


speciality:data.speciality,


degree:data.degree,


experience:Number(
data.experience
),


consultation_fee:Number(
data.consultation_fee
),


is_approved:false



})







if(doctorError){


throw doctorError


}








toast.success(

'Doctor registration submitted'

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


}









}

catch(error:unknown){



console.error(error)





if(error instanceof Error){


toast.error(
error.message
)


}

else{


toast.error(
'Registration failed'
)


}




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





{/* NAME */}

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









{/* EMAIL */}


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









{/* PHONE */}


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
bg-teal-600
text-white
px-4
py-2
rounded-lg
text-sm
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

otpSent &&
!otpVerified &&


<div

className="
mt-3
flex
gap-2
"

>


<input

type="text"

maxLength={6}

placeholder="Enter OTP"


value={otp}


onChange={
e=>setOtp(
e.target.value
)
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


<p

className="
text-green-600
text-sm
mt-2
flex
items-center
gap-1
"

>

<ShieldCheck size={16}/>

Phone Verified

</p>


}



</div>













{/* WHATSAPP */}


<div>


<label className="input-label">

WhatsApp Number

</label>


<input


type="tel"


placeholder="88017XXXXXXXX"


{...register(
'whatsapp'
)}


className="
input-field
"

/>


</div>














{/* BMDC */}


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













{/* SPECIALITY */}


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


className="
input-field
"

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


className="
input-field
"

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



className="
input-field
"

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



className="
input-field
"

/>








</div>


</div>















{/* LOCATION SECTION */}



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






{/* DISTRICT */}



<select


{...register(

'district',

{
required:'District required'
}

)}



onChange={
handleDistrictChange
}


className="
input-field
"

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















{/* UPAZILA */}



<select


{...register(

'upazila',

{
required:'Upazila required'
}

)}



disabled={
!selectedDistrict
}



className="
input-field
disabled:bg-gray-100
"

>


<option value="">

Select Upazila

</option>




{

upazilas.map(

(item,index)=>(


<option

key={index}

value={item}

>


{item}


</option>


)


)


}



</select>









</div>


</div>






{/* ADDRESS */}


<div>


<label className="input-label">

Address *

</label>



<textarea


rows={3}



placeholder="Clinic address"



{...register(

'address',

{
required:'Address required'
}

)}



className="
input-field
resize-none
"



/>



</div>







{/* PASSWORD */}



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
required:'Confirm password required'
}

)}



className="
input-field
"



/>



</div>









<button


type="submit"


disabled={isLoading}


className="

w-full

bg-primary

text-white

py-3

rounded-xl

font-semibold

hover:opacity-90

transition

"



>


{

isLoading

?

'Submitting...'

:

'Register Doctor'

}



</button>





<p

className="
text-center
text-sm
text-gray-500
"

>

Your doctor account will be reviewed by Quick Treat admin before approval.

</p>


</form>

)

}