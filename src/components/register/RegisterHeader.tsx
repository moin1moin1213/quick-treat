'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface RegisterHeaderProps {
  subtitle?: string
}

export default function RegisterHeader({
  subtitle = 'Smart Digital Queue & Patient Management System'
}: RegisterHeaderProps) {

  const router = useRouter()

  return (
    <header className="w-full bg-white/80 backdrop-blur-md border-b border-teal-100 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">

        <div className="flex items-center justify-between">

          {/* Logo */}
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-3"
          >
            <div className="relative w-11 h-11 sm:w-12 sm:h-12">
              <Image
                src="/assets/icons/logo.png"
                alt="Quick Treat Logo"
                fill
                className="object-contain rounded-xl"
                priority
              />
            </div>

            <div className="text-left">
              <h1 className="text-xl sm:text-2xl font-bold text-teal-700">
                Quick Treat
              </h1>

              <p className="hidden sm:block text-xs text-slate-500">
                {subtitle}
              </p>
            </div>

          </button>


          {/* Actions */}
          <div className="flex items-center gap-3 sm:gap-5">

            <button
              onClick={() => router.push('/login')}
              className="
              text-sm sm:text-base
              font-medium
              text-teal-600
              hover:text-teal-800
              transition
              "
            >
              Login
            </button>


            <button
              onClick={() => router.push('/')}
              className="
              hidden sm:block
              text-sm sm:text-base
              font-medium
              text-slate-500
              hover:text-slate-800
              transition
              "
            >
              Home
            </button>

          </div>

        </div>

      </nav>
    </header>
  )
}