'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
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



const {

 register,

 handleSubmit,

 formState:{errors}

}=useForm<PatientSignupForm>()





// ===============================
// LOAD DISTRICT
// ===============================


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

parseInt(districtId)

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

}

else{

setUpazilas([])

}


},[selectedDistrict])






// ===============================
// SUBMIT
// ===============================


const onSubmit=async(

data:PatientSignupForm

)=>{


if(data.password !== data.confirmPassword){

toast.error(
'Passwords do not match'
)

return

}



if(data.password.length < 6){

toast.error(
'Password must be minimum 6 characters'
)

return

}



setIsLoading(true)



try{


// Check existing email


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





// Create Auth User


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

phone:data.phone,

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



// Create profile


const {

error:profileError

}=await supabase

.from('profiles')

.insert({


id:authData.user.id,


name:data.name,


email:data.email,


phone:data.phone,


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





// Auto Login


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


router.push('/')

}



}



} catch (error: unknown) {

  console.error(
    'Signup Error:',
    error
  )

  toast.error(
    error instanceof Error
      ? error.message
      : 'Signup failed'
  )

} finally {

  setIsLoading(false)

}

}
return (

<form
onSubmit={handleSubmit(onSubmit)}
className="
space-y-6
max-h-[75vh]
overflow-y-auto
px-1
"
>


{/* Personal Information */}

<div>

<div className="
flex items-center gap-2
mb-4
">

<User size={20} className="text-primary"/>

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

className="input-field pl-10"

/>

</div>


{errors.name &&

<p className="error-text">
{errors.name.message}
</p>

}

</div>





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

className="input-field pl-10"

/>


</div>


{errors.email &&

<p className="error-text">
{errors.email.message}
</p>

}


</div>





<div>

<label className="input-label">
Phone Number *
</label>


<div className="relative">

<Phone className="input-icon"/>


<input

type="tel"

placeholder="01712-345678"

{...register(
'phone',
{
required:'Phone is required'
}
)}

className="input-field pl-10"

/>


</div>


{errors.phone &&

<p className="error-text">
{errors.phone.message}
</p>

}

</div>





<div>

<label className="input-label">
WhatsApp Number
</label>


<div className="relative">

<Phone className="input-icon"/>


<input

type="tel"

placeholder="01712-345678"

{...register(
'whatsapp'
)}

className="input-field pl-10"

/>


</div>


</div>



</div>

</div>





{/* Medical Information */}


<div>


<div className="
flex items-center gap-2
mb-4
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
grid-cols-1
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

className="input-field pl-10"

/>


</div>


</div>





<div>


<label className="input-label">
Blood Group
</label>


<div className="relative">


<Droplets className="input-icon"/>


<select

{...register(
'blood_group'
)}

className="
input-field
pl-10
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


</div>







{/* Location */}


<div>


<div className="
flex items-center gap-2
mb-4
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
grid-cols-1
md:grid-cols-2
gap-4
">


<div>


<label className="input-label">
District *
</label>


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


className="input-field"


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



{errors.district &&

<p className="error-text">

{errors.district.message}

</p>

}


</div>





<div>


<label className="input-label">
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


className="input-field disabled:bg-gray-100"


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


{errors.upazila &&

<p className="error-text">

{errors.upazila.message}

</p>

}



</div>


</div>


</div>






{/* Password */}



<div>


<div className="
flex items-center gap-2
mb-4
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
grid-cols-1
md:grid-cols-2
gap-4
">


<div>


<label className="input-label">
Password *
</label>


<input

type="password"


placeholder="Minimum 6 characters"


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


className="input-field"

/>



{errors.password &&

<p className="error-text">

{errors.password.message}

</p>

}


</div>





<div>


<label className="input-label">
Confirm Password *
</label>


<input

type="password"

placeholder="Confirm password"


{...register(

'confirmPassword',

{

required:'Confirm password'

}

)}


className="input-field"

/>



{errors.confirmPassword &&

<p className="error-text">

{errors.confirmPassword.message}

</p>

}


</div>


</div>


</div>







<button

disabled={isLoading}

type="submit"


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