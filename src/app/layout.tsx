import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/dashboard/header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PredUp - Sports Intelligence',
  description: 'Professional sports betting intelligence platform',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <div className="min-h-screen bg-background">
          <Header />
          <main className="container mx-auto p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}