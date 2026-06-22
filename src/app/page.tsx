'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function Home() {

  return (
    <main className="bg-white text-gray-800">

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/assets/icons/logo.png"
              width={45}
              height={45}
              alt="Quick Treat"
            />

            <span className="text-xl font-bold text-teal-700">
              Quick Treat
            </span>
          </Link>


          <nav className="hidden md:flex gap-8 text-sm font-medium">

            <Link href="/">
              Home
            </Link>

            <a href="#features">
              Features
            </a>

            <a href="#how">
              How It Works
            </a>

            <a href="#pricing">
              Pricing
            </a>

            <a href="#contact">
              Contact
            </a>

          </nav>


          <div className="flex gap-3">

            <Link
              href="/login"
              className="px-6 py-2 border border-teal-600 text-teal-700 rounded-lg"
            >
              Login
            </Link>


            <Link
              href="/register"
              className="px-6 py-2 bg-teal-600 text-white rounded-lg"
            >
              Get Started
            </Link>


          </div>

        </div>
      </header>



      {/* HERO */}

      <section className="bg-gradient-to-b from-teal-50 to-white">

        <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">


          <div>

            <span className="inline-block bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm">
              #1 Healthcare Management Platform
            </span>


            <h1 className="text-5xl font-bold mt-6 leading-tight">

              Healthcare
              <span className="text-teal-600">
                {" "}Without Waiting.
              </span>

            </h1>


            <p className="mt-6 text-gray-600 text-lg">

              Book appointments, manage queues, track patients
              and grow your practice. Everything in one
              powerful platform.

            </p>



            <div className="flex gap-4 mt-8">

              <Link
                href="/register"
                className="bg-teal-600 text-white px-8 py-4 rounded-xl"
              >
                Get Started Free →
              </Link>


              <button
                className="border border-teal-600 px-8 py-4 rounded-xl text-teal-700"
              >
                ▶ Watch Demo
              </button>

            </div>



            <div className="flex gap-8 mt-10 text-sm">

              <div>
                👨‍⚕️
                <b>50+</b>
                <p>Doctors</p>
              </div>

              <div>
                🏥
                <b>100+</b>
                <p>Clinics</p>
              </div>


              <div>
                👥
                <b>10,000+</b>
                <p>Patients</p>
              </div>


            </div>


          </div>



          {/* HERO IMAGE */}

          <div className="flex justify-center">

            <div className="bg-white shadow-xl rounded-3xl p-5">

              <Image
                src="/assets/dashboard-preview.png"
                width={600}
                height={500}
                alt="Dashboard Preview"
              />

            </div>

          </div>



        </div>

      </section>





      {/* USER TYPES */}

      <section className="py-20">

        <div className="max-w-7xl mx-auto px-6">


          <h2 className="text-4xl text-center font-bold">

            Who Uses
            <span className="text-teal-600">
              {" "}Quick Treat?
            </span>

          </h2>


          <p className="text-center text-gray-500 mt-3">
            Designed for patients, doctors and hospitals
          </p>



          <div className="grid md:grid-cols-3 gap-8 mt-12">


            {/* PATIENT */}

            <div className="rounded-2xl border p-8">

              <h3 className="text-xl font-bold">
                👤 For Patients
              </h3>


              <ul className="mt-5 space-y-3 text-gray-600">

                <li>✓ Find trusted doctors</li>
                <li>✓ Book appointments</li>
                <li>✓ Track queue live</li>
                <li>✓ Digital prescriptions</li>

              </ul>


              <Link
                href="/patient-register"
                className="block mt-6 bg-teal-600 text-white text-center py-3 rounded-lg"
              >
                Book Now →
              </Link>


            </div>





            {/* DOCTOR */}

            <div className="rounded-2xl border p-8">

              <h3 className="text-xl font-bold">
                👨‍⚕️ For Doctors
              </h3>


              <ul className="mt-5 space-y-3 text-gray-600">

                <li>✓ Manage appointments</li>
                <li>✓ Live queue management</li>
                <li>✓ Digital prescriptions</li>
                <li>✓ Track earnings</li>

              </ul>


              <Link
                href="/doctor-hospital-register"
                className="block mt-6 bg-blue-600 text-white text-center py-3 rounded-lg"
              >
                Join as Doctor →
              </Link>


            </div>






            {/* HOSPITAL */}

            <div className="rounded-2xl border p-8">

              <h3 className="text-xl font-bold">
                🏥 For Hospitals
              </h3>


              <ul className="mt-5 space-y-3 text-gray-600">

                <li>✓ Manage doctors</li>
                <li>✓ Bed management</li>
                <li>✓ Reports & analytics</li>
                <li>✓ Revenue tracking</li>

              </ul>


              <Link
                href="/doctor-hospital-register"
                className="block mt-6 bg-purple-600 text-white text-center py-3 rounded-lg"
              >
                Join Hospital →
              </Link>


            </div>



          </div>


        </div>

      </section>






      {/* FEATURES */}

      <section id="features" className="py-20 bg-gray-50">


        <div className="max-w-7xl mx-auto px-6">


          <h2 className="text-4xl font-bold text-center">
            Everything You Need In One Platform
          </h2>


          <div className="grid md:grid-cols-6 gap-5 mt-12">


            {
              [
                "Smart Queue",
                "Online Booking",
                "Digital Payments",
                "Analytics",
                "Digital Invoice",
                "Notifications"
              ].map((item)=>(
                <div
                  key={item}
                  className="bg-white p-6 rounded-xl text-center shadow"
                >
                  <p className="font-semibold">
                    {item}
                  </p>
                </div>
              ))
            }


          </div>


        </div>


      </section>







      {/* CTA */}

      <section className="py-20">

        <div className="max-w-5xl mx-auto bg-teal-600 rounded-3xl p-12 text-white text-center">

          <h2 className="text-4xl font-bold">
            Ready To Transform Your Healthcare Practice?
          </h2>


          <p className="mt-5">
            Join thousands of doctors and hospitals using Quick Treat
          </p>


          <Link
            href="/register"
            className="inline-block mt-8 bg-white text-teal-700 px-8 py-3 rounded-xl"
          >
            Get Started Free
          </Link>


        </div>


      </section>





      {/* FOOTER */}

      <footer className="bg-teal-800 text-white py-10">

        <div className="max-w-7xl mx-auto px-6 flex justify-between">

          <div>
            <h3 className="font-bold text-xl">
              Quick Treat
            </h3>

            <p className="text-sm mt-2">
              Smart Healthcare Management Platform
            </p>

          </div>


          <div>
            © 2026 Quick Treat
          </div>


        </div>

      </footer>


    </main>
  )
}