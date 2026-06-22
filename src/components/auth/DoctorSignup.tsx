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
 Wallet
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




const {

register,

handleSubmit,

formState:{errors}

}=useForm<DoctorSignupForm>()





// ============================
// LOCATION
// ============================



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







// ============================
// SUBMIT
// ============================


const onSubmit=async(

data:DoctorSignupForm

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


// email check


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





// BMDC check


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




// create auth


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

whatsapp:data.whatsapp,

is_approved:false

}

}

})



if(authError)
throw authError





if(authData.user){



// profile


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

role:'doctor',

district:data.district,

upazila:data.upazila,

is_approved:false

})



if(profileError)
throw profileError




// doctor record


const {

error:doctorError

}=await supabase

.from('doctors')

.insert({

user_id:authData.user.id,

bmdc_number:data.bmdc_number,

speciality:data.speciality,

degree:data.degree,

experience:parseInt(data.experience),

consultation_fee:parseFloat(data.consultation_fee),

is_available:false,

is_approved:false

})



if(doctorError)
throw doctorError





toast.success(
'Registration submitted'
)



onClose()





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



} catch (error: unknown) {
  console.error(error)

  if (error instanceof Error) {
    toast.error(error.message)
  } else {
    toast.error('Signup failed')
  }
}

finally{


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


{/* Doctor Information */}

<div>


<div className="
flex items-center gap-2 mb-4
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
required:'Email is required'
}
)}


className="
input-field
pl-10
"

/>


</div>



{
errors.email &&

<p className="error-text">

{errors.email.message}

</p>

}



</div>






<div>


<label className="input-label">
Phone *
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


className="
input-field
pl-10
"

/>


</div>



{
errors.phone &&

<p className="error-text">

{errors.phone.message}

</p>

}



</div>





<div>


<label className="input-label">
WhatsApp Number
</label>



<input

type="tel"

placeholder="01712-345678"


{...register(
'whatsapp'
)}


className="input-field"

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
required:'BMDC number required'
}
)}


className="
input-field
pl-10
"

/>



</div>



{
errors.bmdc_number &&

<p className="error-text">

{errors.bmdc_number.message}

</p>

}



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







{/* Professional Details */}



<div>


<div className="
flex items-center gap-2 mb-4
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



<div>


<label className="input-label">
Degree *
</label>



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
Select degree
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


</div>





<div>


<label className="input-label">
Experience (Years) *
</label>


<input

type="number"

placeholder="5"


{...register(
'experience',
{
required:'Experience required'
}
)}


className="input-field"

/>



</div>





<div>


<label className="input-label">
Consultation Fee (৳) *
</label>



<div className="relative">

<Wallet className="input-icon"/>


<input

type="number"

placeholder="800"


{...register(
'consultation_fee',
{
required:'Fee required'
}
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








{/* Location */}



<div>


<div className="
flex items-center gap-2 mb-4
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


</div>








{/* Security */}



<div>


<div className="
flex items-center gap-2 mb-4
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
required:'Confirm password'
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

transition

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