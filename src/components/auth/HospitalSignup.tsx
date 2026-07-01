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

Building2,
Phone,
MapPin,
ShieldCheck,

} from 'lucide-react'



import {

districts

} from '@/components/data/bangladesh-location'







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








interface LocationDistrict {

id:number

name:string

upazilas:string[]

}








export default function HospitalSignup({


onClose


}:{


onClose:()=>void


}){







const router =
useRouter()







const [isLoading,setIsLoading] =
useState(false)









// =======================
// OTP
// =======================


const [otp,setOtp] =
useState('')


const [otpSent,setOtpSent] =
useState(false)


const [otpVerified,setOtpVerified] =
useState(false)


const [otpLoading,setOtpLoading] =
useState(false)


const [verifiedPhone,setVerifiedPhone] =
useState('')


const [resendTime,setResendTime] =
useState(0)











// =======================
// LOCATION
// =======================



const [locationData,setLocationData] =
useState<LocationDistrict[]>([])



const [upazilas,setUpazilas] =
useState<string[]>([])



const [selectedDistrict,setSelectedDistrict] =
useState<number | null>(null)











const {


register,


handleSubmit,


getValues


}=useForm<HospitalSignupForm>()











// =======================
// LOAD LOCATION
// =======================



useEffect(()=>{


setLocationData(
districts as LocationDistrict[]
)


},[])












// =======================
// DISTRICT CHANGE
// =======================


const handleDistrictChange=(

e:React.ChangeEvent<HTMLSelectElement>

)=>{


const id =
Number(e.target.value)



setSelectedDistrict(id)



const district =
locationData.find(
item=>item.id===id
)





if(district){


setUpazilas(
district.upazilas
)


}

else{


setUpazilas([])


}



}












// =======================
// PHONE FORMAT
// =======================


const formatPhone=(phone:string)=>{


const number =
phone.replace(
/\D/g,
''
)





if(
number.startsWith('8801')
){


return number


}





if(
number.startsWith('01')
){


return '88'+number


}





return number


}












// =======================
// SEND OTP
// =======================



const sendOTP=async()=>{



const phone =
getValues('phone')






const phoneNumber =
formatPhone(phone)






if(
!phoneNumber.startsWith('8801')
){


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

phone:phoneNumber

})

}

)







const result =
await response.json()






if(!response.ok){


throw new Error(
result.error ||
'OTP failed'
)


}








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



console.error(error)



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
result.error
)


}








setOtpVerified(true)



toast.success(
'Phone verified successfully'
)





}

catch(error){



console.error(error)


toast.error(
'Invalid OTP'
)


}



}












// =======================
// TIMER
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







if(
data.password !== data.confirmPassword
){


toast.error(
'Passwords do not match'
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
'Please select district'
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


.select(
'dghs_license'
)


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
space-y-6
"

>


{/* =======================
HOSPITAL INFORMATION
======================= */}


<div className="
bg-white
rounded-2xl
border
p-6
space-y-5
">


<div className="
flex
items-center
gap-2
text-xl
font-semibold
text-gray-800
">

<Building2 size={22}/>

Hospital Information

</div>






<div className="
grid
grid-cols-1
md:grid-cols-2
gap-5
">







<div className="md:col-span-2">


<label className="form-label">

Hospital Name *

</label>



<input


{...register(

'hospital_name',

{
required:
'Hospital name required'
}

)}



placeholder="
City Hospital Ltd.
"



className="
form-input
"



/>


</div>









<div>


<label className="form-label">

DGHS License *

</label>


<input


{...register(

'dghs_license',

{
required:
'DGHS license required'
}

)}



placeholder="
DGHS-12345
"



className="
form-input
"



/>


</div>









<div>


<label className="form-label">

Email *

</label>


<input


type="email"



{...register(

'email',

{
required:
'Email required'
}

)}



placeholder="
hospital@email.com
"



className="
form-input
"



/>


</div>







</div>


</div>









{/* =======================
PHONE OTP
======================= */}



<div className="
bg-white
rounded-2xl
border
p-6
space-y-5
">



<div className="
flex
items-center
gap-2
text-xl
font-semibold
">

<Phone size={22}/>

Phone Verification

</div>







<label className="form-label">

Phone Number *

</label>






<div className="
flex
gap-3
">



<input



id="hospital-phone"



type="tel"



placeholder="
01712345678
"




{...register(

'phone',

{
required:
'Phone required'
}

)}



className="
form-input
flex-1
"



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
px-5
rounded-xl
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









{

otpSent &&

<div>



<label className="form-label">

OTP Code

</label>





<div className="
flex
gap-3
">



<input



maxLength={6}



value={otp}



onChange={

e=>
setOtp(e.target.value)

}



placeholder="
123456
"



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
px-5
rounded-xl
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




</div>









{/* =======================
LOCATION
======================= */}




<div className="
bg-white
rounded-2xl
border
p-6
space-y-5
">



<div className="
flex
items-center
gap-2
text-xl
font-semibold
">


<MapPin size={22}/>


Location


</div>







<div className="
grid
grid-cols-1
md:grid-cols-2
gap-5
">






<div>


<label className="form-label">

District *

</label>





<select



{...register(

'district',

{
required:
'District required'
}

)}



onChange={handleDistrictChange}



className="
form-input
"



>



<option value="">

Select District

</option>




{

locationData.map(item=>(


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









<div>


<label className="form-label">

Upazila / Thana *

</label>






<select



{...register(

'upazila',

{
required:
'Upazila required'
}

)}




disabled={
!selectedDistrict
}



className="
form-input
disabled:bg-gray-100
"



>


<option value="">


Select Upazila


</option>






{
upazilas.map((item,index)=>(

<option

key={index}

value={item}

>

{item}

</option>

))
}




</select>



</div>







</div>







<textarea



rows={3}



{...register(

'address',

{
required:
'Address required'
}

)}



placeholder="
Hospital full address
"



className="
form-input
resize-none
"



/>





</div>









{/* =======================
SECURITY
======================= */}




<div className="
bg-white
rounded-2xl
border
p-6
space-y-5
">



<div className="
flex
items-center
gap-2
text-xl
font-semibold
">

<ShieldCheck size={22}/>


Security


</div>







<div className="
grid
grid-cols-1
md:grid-cols-2
gap-5
">





<input



type="password"



{...register(

'password',

{
required:
'Password required'
}

)}



placeholder="
Password
"



className="
form-input
"



/>








<input



type="password"



{...register(

'confirmPassword',

{
required:
'Confirm password required'
}

)}



placeholder="
Confirm Password
"



className="
form-input
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

text-white

py-4

rounded-2xl

font-semibold

text-lg

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

)}