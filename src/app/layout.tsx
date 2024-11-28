import { MainNav } from '@/components/ui/main-nav'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Law Discussion Platform',
  description: 'A platform for discussing and voting on laws',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="border-b">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Law Discussion Platform</h1>
            <MainNav />
          </div>
        </header>
        <main>
          {children}
        </main>
      </body>
    </html>
  )
}