'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function Home() {

  return (

    <main className="bg-white text-gray-800">


      {/* ================= NAVBAR ================= */}

      <header className="
      sticky
      top-0
      z-50
      bg-white/90
      backdrop-blur
      border-b
      ">

        <div className="
        max-w-7xl
        mx-auto
        px-4
        sm:px-6
        lg:px-8
        py-4
        flex
        items-center
        justify-between
        ">


          {/* LOGO */}

          <Link
            href="/"
            className="
            flex
            items-center
            gap-3
            "
          >

            <Image
              src="/assets/icons/logo.png"
              width={45}
              height={45}
              alt="Quick Treat"
            />


            <span className="
            text-xl
            font-bold
            text-teal-700
            ">
              Quick Treat
            </span>


          </Link>




          {/* DESKTOP MENU */}

          <nav className="
          hidden
          md:flex
          gap-8
          text-sm
          font-medium
          ">


            <a href="#">
              Home
            </a>


            <a href="#features">
              Features
            </a>


            <a href="#how">
              How It Works
            </a>


            <a href="#contact">
              Contact
            </a>


          </nav>





          {/* ACTION BUTTON */}

          <div className="
          flex
          gap-2
          sm:gap-3
          ">


            <Link
              href="/login"
              className="
              px-4
              sm:px-6
              py-2
              border
              border-teal-600
              text-teal-700
              rounded-lg
              text-sm
              "
            >

              Login

            </Link>




            <Link
              href="/patient-register"
              className="
              px-4
              sm:px-6
              py-2
              bg-teal-600
              text-white
              rounded-lg
              text-sm
              "
            >

              Get Started

            </Link>



          </div>


        </div>


      </header>







      {/* ================= HERO ================= */}


      <section className="
      bg-linear-to-b
      from-teal-50
      to-white
      ">


        <div className="
        max-w-7xl
        mx-auto
        px-4
        sm:px-6
        lg:px-8
        py-16
        md:py-24
        grid
        md:grid-cols-2
        gap-12
        items-center
        ">



          {/* LEFT CONTENT */}


          <div>


            <span className="
            inline-block
            bg-teal-100
            text-teal-700
            px-4
            py-2
            rounded-full
            text-sm
            ">

              #1 Healthcare Management Platform

            </span>





            <h1 className="
            text-4xl
            md:text-5xl
            font-bold
            mt-6
            leading-tight
            ">


              Healthcare

              <span className="
              text-teal-600
              ">

                {" "}Without Waiting.

              </span>


            </h1>





            <p className="
            mt-6
            text-gray-600
            text-lg
            ">


              Book appointments, manage queues,
              track patients and grow your healthcare
              service with one powerful platform.


            </p>







            <div className="
            flex
            flex-col
            sm:flex-row
            gap-4
            mt-8
            ">



              <Link

                href="/patient-register"

                className="
                bg-teal-600
                text-white
                px-8
                py-4
                rounded-xl
                text-center
                "

              >

                Get Started Free →

              </Link>





              <button

                className="
                border
                border-teal-600
                px-8
                py-4
                rounded-xl
                text-teal-700
                "

              >

                ▶ Watch Demo

              </button>



            </div>







            {/* STATS */}


            <div className="
            grid
            grid-cols-3
            gap-5
            mt-10
            text-sm
            ">


              <div>

                <h3 className="
                text-xl
                font-bold
                text-teal-700
                ">
                  50+
                </h3>


                <p>
                  Doctors
                </p>


              </div>




              <div>

                <h3 className="
                text-xl
                font-bold
                text-teal-700
                ">
                  100+
                </h3>


                <p>
                  Clinics
                </p>


              </div>





              <div>

                <h3 className="
                text-xl
                font-bold
                text-teal-700
                ">
                  10K+
                </h3>


                <p>
                  Patients
                </p>


              </div>



            </div>



          </div>









          {/* HERO IMAGE */}


          <div className="
          flex
          justify-center
          ">


            <div className="
            relative
            w-full
            max-w-lg
            ">


              <Image

                src="/assets/images/hero.png"

                width={600}

                height={600}

                alt="Healthcare Dashboard"

                className="
                w-full
                h-auto
                object-contain
                "

              />


            </div>


          </div>




        </div>


      </section>









      {/* ================= USER TYPES ================= */}


      <section className="
      py-20
      ">


        <div className="
        max-w-7xl
        mx-auto
        px-4
        sm:px-6
        lg:px-8
        ">


          <h2 className="
          text-3xl
          md:text-4xl
          font-bold
          text-center
          ">


            Who Uses

            <span className="
            text-teal-600
            ">

              {" "}Quick Treat?

            </span>


          </h2>




          <p className="
          text-center
          text-gray-500
          mt-3
          ">

            Designed for patients, doctors and hospitals

          </p>





          <div className="
          grid
          md:grid-cols-3
          gap-8
          mt-12
          ">


            {/* PATIENT CARD */}


            <div className="
            border
            rounded-2xl
            p-8
            hover:shadow-lg
            transition
            ">


              <h3 className="
              text-xl
              font-bold
              ">

                👤 For Patients

              </h3>



              <ul className="
              mt-5
              space-y-3
              text-gray-600
              ">

                <li>
                  ✓ Find trusted doctors
                </li>

                <li>
                  ✓ Book appointments
                </li>

                <li>
                  ✓ Track queue live
                </li>

                <li>
                  ✓ Digital prescriptions
                </li>


              </ul>



              <Link

                href="/patient-register"

                className="
                block
                mt-6
                bg-teal-600
                text-white
                text-center
                py-3
                rounded-lg
                "

              >

                Book Appointment →

              </Link>


            </div>

                        {/* DOCTOR CARD */}


            <div className="
            border
            rounded-2xl
            p-8
            hover:shadow-lg
            transition
            ">


              <h3 className="
              text-xl
              font-bold
              ">

                👨‍⚕️ For Doctors

              </h3>




              <ul className="
              mt-5
              space-y-3
              text-gray-600
              ">


                <li>
                  ✓ Manage appointments
                </li>


                <li>
                  ✓ Live queue management
                </li>


                <li>
                  ✓ Digital prescriptions
                </li>


                <li>
                  ✓ Track earnings
                </li>


              </ul>




              <Link

                href="/doctor-hospital-register"

                className="
                block
                mt-6
                bg-blue-600
                text-white
                text-center
                py-3
                rounded-lg
                "

              >

                Join as Doctor →

              </Link>



            </div>







            {/* HOSPITAL CARD */}



            <div className="
            border
            rounded-2xl
            p-8
            hover:shadow-lg
            transition
            ">


              <h3 className="
              text-xl
              font-bold
              ">

                🏥 For Hospitals

              </h3>




              <ul className="
              mt-5
              space-y-3
              text-gray-600
              ">


                <li>
                  ✓ Manage doctors
                </li>


                <li>
                  ✓ Bed management
                </li>


                <li>
                  ✓ Reports & analytics
                </li>


                <li>
                  ✓ Revenue tracking
                </li>


              </ul>





              <Link

                href="/doctor-hospital-register"

                className="
                block
                mt-6
                bg-purple-600
                text-white
                text-center
                py-3
                rounded-lg
                "

              >

                Join Hospital →

              </Link>



            </div>




          </div>


        </div>


      </section>









      {/* ================= HOW IT WORKS ================= */}



      <section

        id="how"

        className="
        py-20
        bg-teal-50
        "


      >


        <div className="
        max-w-7xl
        mx-auto
        px-4
        sm:px-6
        lg:px-8
        ">



          <h2 className="
          text-3xl
          md:text-4xl
          font-bold
          text-center
          ">


            How Quick Treat Works


          </h2>





          <div className="
          grid
          md:grid-cols-3
          gap-8
          mt-12
          ">


            <div className="
            bg-white
            rounded-2xl
            p-8
            text-center
            ">

              <div className="
              text-4xl
              mb-4
              ">
                1️⃣
              </div>


              <h3 className="
              font-bold
              text-xl
              ">

                Create Account

              </h3>


              <p className="
              text-gray-600
              mt-3
              ">

                Register as patient, doctor or hospital.

              </p>


            </div>






            <div className="
            bg-white
            rounded-2xl
            p-8
            text-center
            ">

              <div className="
              text-4xl
              mb-4
              ">
                2️⃣
              </div>


              <h3 className="
              font-bold
              text-xl
              ">

                Book & Manage

              </h3>


              <p className="
              text-gray-600
              mt-3
              ">

                Book appointments and manage healthcare services easily.

              </p>


            </div>







            <div className="
            bg-white
            rounded-2xl
            p-8
            text-center
            ">

              <div className="
              text-4xl
              mb-4
              ">
                3️⃣
              </div>


              <h3 className="
              font-bold
              text-xl
              ">

                Get Treatment

              </h3>


              <p className="
              text-gray-600
              mt-3
              ">

                Connect with healthcare providers without waiting.

              </p>


            </div>



          </div>



        </div>



      </section>









      {/* ================= FEATURES ================= */



      <section

        id="features"

        className="
        py-20
        "

      >


        <div className="
        max-w-7xl
        mx-auto
        px-4
        sm:px-6
        lg:px-8
        ">



          <h2 className="
          text-3xl
          md:text-4xl
          font-bold
          text-center
          ">

            Everything You Need In One Platform

          </h2>





          <div className="
          grid
          grid-cols-2
          md:grid-cols-3
          lg:grid-cols-6
          gap-5
          mt-12
          ">


            {
              [

                "Smart Queue",
                "Online Booking",
                "Digital Payment",
                "Analytics",
                "Digital Invoice",
                "Notifications"

              ].map((item)=>(


                <div

                  key={item}

                  className="
                  bg-white
                  border
                  rounded-xl
                  p-6
                  text-center
                  hover:shadow-md
                  transition
                  "

                >

                  <p className="
                  font-semibold
                  text-sm
                  ">

                    {item}

                  </p>


                </div>



              ))
            }


          </div>



        </div>


      </section>









      /* ================= CTA ================= */}



      <section className="
      py-20
      ">


        <div className="
        max-w-5xl
        mx-auto
        bg-teal-600
        rounded-3xl
        p-8
        md:p-12
        text-white
        text-center
        ">


          <h2 className="
          text-3xl
          md:text-4xl
          font-bold
          ">

            Ready To Transform Healthcare?

          </h2>




          <p className="
          mt-4
          ">

            Join patients, doctors and hospitals using Quick Treat.

          </p>




          <Link

            href="/patient-register"

            className="
            inline-block
            mt-8
            bg-white
            text-teal-700
            px-8
            py-3
            rounded-xl
            font-semibold
            "

          >

            Get Started Free

          </Link>



        </div>


      </section>









      {/* ================= FOOTER ================= */}



      <footer

        id="contact"

        className="
        bg-teal-900
        text-white
        py-12
        "

      >


        <div className="
        max-w-7xl
        mx-auto
        px-4
        sm:px-6
        lg:px-8
        grid
        md:grid-cols-3
        gap-8
        ">



          <div>


            <h3 className="
            text-2xl
            font-bold
            ">

              Quick Treat

            </h3>


            <p className="
            mt-3
            text-teal-100
            ">

              Smart Healthcare Management Platform.

            </p>


          </div>







          <div>


            <h4 className="
            font-bold
            text-lg
            ">

              Contact

            </h4>


            <p className="
            mt-3
            text-teal-100
            ">

              📧 support@quicktreat.com

            </p>


            <p className="
            mt-2
            text-teal-100
            ">

              📞 +880 1700-000000

            </p>


            <p className="
            mt-2
            text-teal-100
            ">

              📍 Bangladesh

            </p>


          </div>







          <div>


            <h4 className="
            font-bold
            text-lg
            ">

              Quick Links

            </h4>


            <div className="
            mt-3
            space-y-2
            ">


              <Link
                href="/login"
                className="block text-teal-100"
              >
                Login
              </Link>



              <Link
                href="/patient-register"
                className="block text-teal-100"
              >
                Patient Registration
              </Link>



            </div>


          </div>



        </div>





        <div className="
        text-center
        text-sm
        text-teal-200
        mt-10
        ">


          © 2026 Quick Treat. All rights reserved.


        </div>



      </footer>




    </main>

  )

}