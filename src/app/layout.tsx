import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Providers } from '@/components/Providers'
import { Toaster } from 'react-hot-toast'


export const metadata: Metadata = {
  title: 'Quick Treat - Healthcare Platform',
  description: 'Your trusted healthcare management platform',
}


export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: true,
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (

    <html lang="en">

      <body className="font-sans antialiased">

        <Providers>

          {children}


          <Toaster

            position="top-right"

            toastOptions={{

              duration: 4000,

              style: {
                background: '#363636',
                color: '#fff',
              },

            }}

          />


        </Providers>

      </body>

    </html>

  )

}