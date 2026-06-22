'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
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



const [isLoading,setIsLoading]=useState(false)


const [districts,setDistricts]=useState<District[]>([])


const [upazilas,setUpazilas]=useState<Upazila[]>([])


const [selectedDistrict,setSelectedDistrict]=useState('')




const {

 register,

 handleSubmit,

 formState:{errors}

}=useForm<HospitalSignupForm>()





// Fetch district


const fetchDistricts=async()=>{


const {

 data,

 error

}=await supabase

.from('districts')

.select('id,name')

.order('name')



if(!error){

 setDistricts(data || [])

}


}






// Fetch upazila


const fetchUpazilas=async(

districtId:string

)=>{


const {

data,

error

}=await supabase

.from('upazilas')

.select('id,name')

.eq(
'district_id',
Number(districtId)
)

.order('name')



if(!error){

setUpazilas(data || [])

}



}







useEffect(()=>{

fetchDistricts()

},[])





useEffect(()=>{


if(selectedDistrict){

fetchUpazilas(selectedDistrict)

}else{

setUpazilas([])

}


},[selectedDistrict])









const onSubmit=async(

data:HospitalSignupForm

)=>{



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





// Email check


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







// DGHS check


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









// Create auth user


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
'Account creation failed'
)

}





const userId=authData.user.id








// Insert profile


const {

error:profileError

}=await supabase

.from('profiles')

.insert({


id:userId,


name:data.hospital_name,


email:data.email,


phone:data.phone,


whatsapp:data.whatsapp_number,


role:'hospital',


district:data.district,


upazila:data.upazila,


is_approved:false


})






if(profileError){

throw profileError

}









// Insert hospital data


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

'Registration submitted successfully'

)





onClose()







// Auto login


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






} catch (error: unknown) {

  console.error(error)

  if (error instanceof Error) {
    toast.error(error.message)
  } else {
    toast.error('Registration failed')
  }

} finally {

  setIsLoading(false)

}



}
return (

<form
  onSubmit={handleSubmit(onSubmit)}
  className="space-y-5"
>


<div className="
grid
grid-cols-1
md:grid-cols-2
gap-4
">



{/* Hospital Name */}

<div className="md:col-span-2">

<label className="form-label">
Hospital Name *
</label>


<input

{...register(
'hospital_name',
{
required:'Hospital name is required'
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





{/* DGHS License */}

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

placeholder="hospital@example.com"

className="form-input"

/>


</div>







{/* Phone */}

<div>

<label className="form-label">
Phone Number *
</label>


<input

type="tel"

{...register(
'phone',
{
required:'Phone required'
}
)}

placeholder="02-XXXXXXX"

className="form-input"

/>


</div>








{/* Whatsapp */}

<div>

<label className="form-label">
WhatsApp Number
</label>


<input

type="tel"

{...register(
'whatsapp_number'
)}

placeholder="01712-345678"

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


onChange={(e)=>
setSelectedDistrict(
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
Upazila / Thana *
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


placeholder="Hospital address"


className="form-input resize-none"

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







<p className="
text-center
text-sm
text-gray-500
">


Your hospital registration will be reviewed by admin before approval.


</p>





</form>


)

}