import type { Metadata } from 'next'
import { Baloo_2, Nunito } from 'next/font/google'
import './globals.css'

const baloo2 = Baloo_2({
  subsets: ['latin'],
  weight: ['400', '600', '800'],
  variable: '--font-baloo',
})

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-nunito',
})

export const metadata: Metadata = {
  title: 'Àrìa Learn - Nigeria\'s Gamified STEAM Platform',
  description: "Nigeria's first gamified STEAM platform built for every child in every community.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${baloo2.variable} ${nunito.variable}`}>
      <body>
        <div style={{
          width: '100%',
          height: '8px',
          background: 'repeating-linear-gradient(90deg, #1a7a4a 0px, #1a7a4a 10px, #ffffff 10px, #ffffff 20px, #f0a500 20px, #f0a500 30px, #e84040 30px, #e84040 40px)',
        }} />
        {children}
      </body>
    </html>
  )
}
