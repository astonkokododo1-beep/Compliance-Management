import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { SessionProvider } from 'next-auth/react'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { cn } from '@/lib/utils'
import { Sidebar } from '@/components/layouts/sidebar'
import { TopBar } from '@/components/layouts/topbar'
import { ToastProvider, ToastViewport } from '@/components/ui/toast'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Compliance Management Platform',
  description: 'Enterprise-grade AI-powered compliance management system',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, 'min-h-screen bg-background font-sans antialiased')}>
        <SessionProvider session={session}>
          <ToastProvider>
            <div className="flex h-screen overflow-hidden">
              {session && <Sidebar />}
              <div className="flex flex-1 flex-col overflow-hidden">
                {session && <TopBar />}
                <main className="flex-1 overflow-y-auto p-6">{children}</main>
              </div>
            </div>
            <ToastViewport />
          </ToastProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
