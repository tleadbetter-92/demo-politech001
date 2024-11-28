'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function MainNav() {
  const pathname = usePathname()

  return (
    <nav className="flex space-x-4 lg:space-x-6">
      <Link
        href="/"
        className={`text-sm font-medium transition-colors hover:text-primary ${
          pathname === '/' ? 'text-primary' : 'text-muted-foreground'
        }`}
      >
        Home
      </Link>
      <Link
        href="/laws"
        className={`text-sm font-medium transition-colors hover:text-primary ${
          pathname === '/laws' ? 'text-primary' : 'text-muted-foreground'
        }`}
      >
        All Laws
      </Link>
      <Link
        href="/mp"
        className={`text-sm font-medium transition-colors hover:text-primary ${
          pathname === '/mp' ? 'text-primary' : 'text-muted-foreground'
        }`}
      >
        MP Page
      </Link>
    </nav>
  )
}