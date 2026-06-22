'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import DoctorSignup from '@/components/auth/DoctorSignup'
import HospitalSignup from '@/components/auth/HospitalSignup'

import RegisterHeader from '@/components/register/RegisterHeader'
import RegisterFooter from '@/components/register/RegisterFooter'


export default function DoctorHospitalRegisterPage(){

  const router = useRouter()

  const [type,setType] = useState<'doctor'|'hospital'>('doctor')


  return (

    <div className="
    min-h-screen
    bg-linear-to-b
    from-teal-50
    via-white
    to-white
    ">


      <RegisterHeader
        subtitle="Healthcare Partner Registration"
      />



      <main className="
      px-4
      sm:px-6
      lg:px-8
      py-10
      ">


        <div className="
        max-w-4xl
        mx-auto
        ">



          <div className="
          text-center
          mb-8
          ">


            <div className="
            w-20
            h-20
            mx-auto
            rounded-3xl
            bg-teal-100
            flex
            items-center
            justify-center
            text-4xl
            mb-5
            ">
              🏥
            </div>


            <h1 className="
            text-3xl
            sm:text-4xl
            font-bold
            text-teal-800
            ">
              Join Quick Treat
            </h1>


            <p className="
            mt-3
            text-slate-500
            ">
              Register as doctor or healthcare facility
            </p>


          </div>




          {/* Switch */}

          <div className="
          bg-white
          rounded-2xl
          shadow-md
          border
          border-teal-100
          p-2
          flex
          mb-6
          ">


            <button

              onClick={()=>setType('doctor')}

              className={`
              flex-1
              py-3
              rounded-xl
              font-semibold
              transition

              ${
              type==='doctor'
              ?
              'bg-teal-600 text-white'
              :
              'text-slate-500 hover:bg-teal-50'
              }

              `}

            >

              👨‍⚕️ Doctor

            </button>




            <button

              onClick={()=>setType('hospital')}

              className={`
              flex-1
              py-3
              rounded-xl
              font-semibold
              transition

              ${
              type==='hospital'
              ?
              'bg-teal-600 text-white'
              :
              'text-slate-500 hover:bg-teal-50'
              }

              `}

            >

              🏥 Hospital

            </button>


          </div>





          <div className="
          bg-white
          rounded-3xl
          shadow-xl
          border
          border-teal-100
          p-5
          sm:p-8
          ">


          {
            type==='doctor'
            ?
            <DoctorSignup
              onClose={()=>router.push('/doctor/pending-approval')}
            />

            :

            <HospitalSignup
              onClose={()=>router.push('/hospital/pending-approval')}
            />
          }


          </div>



        </div>


      </main>


      <RegisterFooter/>


    </div>


  )

}