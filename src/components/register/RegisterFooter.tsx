'use client'


export default function RegisterFooter() {

  return (

    <footer className="
    mt-16
    bg-linear-to-r
    from-teal-50
    via-white
    to-teal-50
    border-t
    border-teal-100
    ">

      <div className="
      max-w-7xl
      mx-auto
      px-4
      sm:px-6
      lg:px-8
      py-8
      ">


        <div className="
        grid
        grid-cols-1
        md:grid-cols-3
        gap-6
        items-center
        ">


          {/* Security */}
          <div className="
          flex
          items-center
          gap-4
          justify-center
          md:justify-start
          ">

            <div className="
            w-12
            h-12
            rounded-full
            bg-teal-100
            flex
            items-center
            justify-center
            text-2xl
            ">
              🛡️
            </div>


            <div>
              <h3 className="
              font-semibold
              text-teal-700
              ">
                100% Secure Registration
              </h3>

              <p className="
              text-sm
              text-slate-500
              ">
                Your information is encrypted and protected
              </p>
            </div>

          </div>



          {/* Help */}
          <div className="
          flex
          items-center
          gap-4
          justify-center
          ">

            <div className="
            w-12
            h-12
            rounded-full
            bg-teal-100
            flex
            items-center
            justify-center
            text-2xl
            ">
              🎧
            </div>


            <div>
              <h3 className="
              font-semibold
              text-teal-700
              ">
                Need Help?
              </h3>

              <p className="
              text-sm
              text-slate-500
              ">
                support@quicktreat.com
              </p>
            </div>

          </div>




          {/* Users */}
          <div className="
          flex
          items-center
          justify-center
          md:justify-end
          gap-3
          ">


            <div className="
            flex
            -space-x-3
            ">

              <div className="
              w-10
              h-10
              rounded-full
              bg-teal-200
              border-2
              border-white
              flex
              items-center
              justify-center
              ">
                👨
              </div>


              <div className="
              w-10
              h-10
              rounded-full
              bg-teal-200
              border-2
              border-white
              flex
              items-center
              justify-center
              ">
                👩
              </div>


              <div className="
              w-10
              h-10
              rounded-full
              bg-teal-200
              border-2
              border-white
              flex
              items-center
              justify-center
              ">
                👨
              </div>

            </div>


            <p className="
            text-sm
            font-medium
            text-teal-700
            ">
              Join Thousands of
              <br/>
              Happy Users Today!
            </p>


          </div>


        </div>



        <div className="
        mt-8
        pt-5
        border-t
        border-teal-100
        text-center
        text-sm
        text-slate-400
        ">
          © 2026 Quick Treat. All Rights Reserved.
        </div>


      </div>

    </footer>

  )
}