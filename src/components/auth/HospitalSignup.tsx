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





interface HospitalSignupForm {


hospital_name:string


dghs_license:string


email:string


phone:string


whatsapp_number:string


district:string


upazila:string


address:string


password:string


confirmPassword:string


}






interface District {


id:number

name:string


}






interface Upazila {


id:number

name:string


}








export default function HospitalSignup({


onClose


}:{


onClose:()=>void


}){







const router = useRouter()






const [isLoading,setIsLoading] =
useState(false)





// =======================
// OTP STATES
// =======================


const [otp,setOtp] =
useState('')



const [otpSent,setOtpSent] =
useState(false)



const [otpVerified,setOtpVerified] =
useState(false)



const [otpLoading,setOtpLoading] =
useState(false)



const [resendTime,setResendTime] =
useState(0)








const [verifiedPhone,setVerifiedPhone] =
useState('')









// =======================
// LOCATION STATES
// =======================



const [districts,setDistricts] =
useState<District[]>([])



const [upazilas,setUpazilas]=useState<Upazila[]>([])



const [selectedDistrict,setSelectedDistrict] =
useState('')









const {


register,


handleSubmit,


formState:{errors}


}=useForm<HospitalSignupForm>()










// =======================
// PHONE FORMAT
// =======================


const formatPhone=(phone:string)=>{


const number =
phone.replace(/\D/g,'')



if(number.startsWith('8801')){


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



const sendOTP=async()=>{


const phoneValue =
formatPhone(
(document.querySelector(
'#hospital-phone'
) as HTMLInputElement)?.value || ''
)





if(!phoneValue.startsWith('8801')){


toast.error(
'Invalid Bangladesh phone number'
)


return

}





setOtpLoading(true)




try{



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


phone:phoneValue


})


}

)






const result =
await response.json()






if(!response.ok){


throw new Error(
result.error ||
'OTP send failed'
)


}





setOtpSent(true)



setVerifiedPhone(phoneValue)



setResendTime(60)



toast.success(
'OTP sent successfully'
)





}

catch(error){



console.error(
error
)



toast.error(
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



const verifyOTP=async()=>{



if(!otp){


toast.error(
'Enter OTP'
)


return


}





try{



const response =
await fetch(
'/api/verify-otp',
{


method:'POST',


headers:{


'Content-Type':
'application/json'


},



body:JSON.stringify({


phone:verifiedPhone,


otp


})


}

)






const result =
await response.json()





if(!response.ok){


throw new Error(
result.error ||
'OTP verification failed'
)


}







setOtpVerified(true)



toast.success(
'Phone verified successfully'
)







}

catch(error){



console.error(
error
)



toast.error(
'Invalid OTP'
)



}



}









// =======================
// RESEND TIMER
// =======================


useEffect(()=>{


if(resendTime<=0)
return




const timer =
setTimeout(()=>{


setResendTime(
prev=>prev-1
)


},1000)





return ()=>clearTimeout(timer)




},[resendTime])









// =======================
// FETCH DISTRICT
// =======================



const fetchDistricts =
async()=>{


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









// =======================
// FETCH UPAZILA
// =======================



const fetchUpazilas =
async(
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
Number(districtId)
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


// =======================
// SUBMIT
// =======================


const onSubmit = async(
data:HospitalSignupForm
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





// =======================
// EMAIL CHECK
// =======================



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









// =======================
// DGHS CHECK
// =======================



const {


data:existingHospital


}=await supabase


.from('hospitals')


.select('dghs_license')


.eq(
'dghs_license',
data.dghs_license
)


.maybeSingle()







if(existingHospital){


toast.error(
'DGHS license already registered'
)


return


}









// =======================
// CREATE AUTH
// =======================



const {


data:authData,


error:authError


}=await supabase.auth.signUp({



email:data.email,


password:data.password,



options:{



data:{



name:data.hospital_name,


role:'hospital',


phone:verifiedPhone,


is_approved:false



}



}



})







if(authError){


throw authError


}








if(!authData.user){


throw new Error(
'Account creation failed'
)


}








const userId =
authData.user.id











// =======================
// PROFILE INSERT
// =======================



const {


error:profileError


}=await supabase


.from('profiles')


.insert({



id:userId,


name:data.hospital_name,


email:data.email,


phone:verifiedPhone,


whatsapp:data.whatsapp_number,


role:'hospital',


district:data.district,


upazila:data.upazila,


is_approved:false



})







if(profileError){


throw profileError


}











// =======================
// HOSPITAL INSERT
// =======================



const {


error:hospitalError


}=await supabase


.from('hospitals')


.insert({



id:userId,



dghs_license:data.dghs_license,



whatsapp_number:data.whatsapp_number,



address:data.address,



total_beds:0,



available_beds:0,



has_oxygen:false,



has_ot:false,



is_approved:false



})








if(hospitalError){


throw hospitalError


}










toast.success(

'Hospital registration submitted'

)








onClose()










// =======================
// AUTO LOGIN
// =======================



const {


error:loginError


}=await supabase.auth.signInWithPassword({



email:data.email,



password:data.password



})







if(!loginError){



router.push(
'/hospital/pending-approval'
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
space-y-5
"
>


<div
className="
grid
grid-cols-1
md:grid-cols-2
gap-4
"
>



{/* Hospital Name */}

<div className="md:col-span-2">


<label className="form-label">
Hospital Name *
</label>


<input

{...register(
'hospital_name',
{
required:'Hospital name required'
}
)}

placeholder="City Hospital Ltd."

className="form-input"

/>


{
errors.hospital_name &&
<p className="error-text">
{errors.hospital_name.message}
</p>
}


</div>








{/* DGHS */}

<div>


<label className="form-label">
DGHS License Number *
</label>


<input


{...register(
'dghs_license',
{
required:'DGHS license required'
}
)}


placeholder="DGHS-12345"


className="form-input"


/>


</div>









{/* Email */}

<div>


<label className="form-label">
Email *
</label>


<input


type="email"


{...register(
'email',
{
required:'Email required'
}
)}


placeholder="hospital@email.com"


className="form-input"


/>


</div>









{/* Phone + OTP */}


<div>


<label className="form-label">
Phone Number *
</label>



<div
className="
flex
gap-2
"
>


<input


id="hospital-phone"


type="tel"


placeholder="8801712345678"


className="
form-input
flex-1
"


{...register(
'phone',
{
required:'Phone required'
}
)}


/>




<button


type="button"


onClick={sendOTP}


disabled={
otpLoading ||
resendTime>0
}


className="
bg-teal-600
text-white
px-4
rounded-lg
text-sm
disabled:opacity-50
"


>


{

otpLoading

?

'Sending'

:

resendTime>0

?

`${resendTime}s`

:

'Send OTP'

}


</button>



</div>



</div>









{/* OTP */}


{
otpSent &&

<div>


<label className="form-label">
Enter OTP *
</label>



<div
className="
flex
gap-2
"
>


<input


type="text"


maxLength={6}


value={otp}


onChange={
e=>setOtp(e.target.value)
}


placeholder="123456"


className="
form-input
flex-1
"


/>




<button


type="button"


onClick={verifyOTP}


disabled={otpVerified}


className="
bg-green-600
text-white
px-4
rounded-lg
disabled:opacity-50
"


>


{

otpVerified

?

'Verified ✓'

:

'Verify'

}


</button>


</div>


</div>

}





{/* Whatsapp */}


<div>


<label className="form-label">
WhatsApp Number
</label>


<input


type="tel"


placeholder="8801712345678"


{...register(
'whatsapp_number'
)}


className="form-input"


/>


</div>








{/* District */}


<div>


<label className="form-label">
District *
</label>


<select


{...register(
'district',
{
required:'District required'
}
)}



onChange={
e=>setSelectedDistrict(
e.target.value
)
}



className="form-input"


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


</div>









{/* Upazila */}


<div>


<label className="form-label">
Upazila *
</label>


<select


{...register(
'upazila',
{
required:'Upazila required'
}
)}


disabled={!selectedDistrict}


className="
form-input
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









{/* Address */}


<div className="md:col-span-2">


<label className="form-label">
Full Address *
</label>


<textarea


rows={3}


{...register(
'address',
{
required:'Address required'
}
)}


placeholder="Hospital full address"


className="
form-input
resize-none
"


/>


</div>









{/* Password */}


<div>


<label className="form-label">
Password *
</label>


<input


type="password"


{...register(
'password',
{
required:'Password required'
}
)}


placeholder="******"


className="form-input"


/>


</div>








{/* Confirm Password */}


<div>


<label className="form-label">
Confirm Password *
</label>


<input


type="password"


{...register(
'confirmPassword',
{
required:'Confirm password required'
}
)}


placeholder="******"


className="form-input"


/>


</div>






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
disabled:opacity-50
"


>


{


isLoading

?

'Submitting...'

:

'Register Hospital'


}


</button>







<p

className="
text-center
text-sm
text-gray-500
"

>


Your hospital account will be reviewed by Quick Treat admin before approval.


</p>






</form>

)

}