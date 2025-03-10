"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Header() {
  const pathname = usePathname()

  // Navigation items hashmap
  const navItems = [
    { name: "About Me", href: "/" },
    { name: "Essays", href: "/blog" },
    { name: "Software", href: "/software" },
    { name: "YouTube", href: "/youtube" },
    { name: "Photos", href: "/photos" },
  ]

  // Helper function to check if a route is active
  const isActive = (href: string) => {
    return pathname === href || pathname?.startsWith(`${href}/`)
  }

  // Get nav link class based on active state
  const getNavLinkClass = (href: string) => {
    return `flex items-center justify-center py-2 px-4 border border-dotted uppercase text-md font-medium tracking-wider transition-all duration-300 ease-in-out hover:text-white hover:border-white ${
      isActive(href) ? "text-white border-white" : "text-[#999999] border-[#999999]"
    }`
  }

  return (
    <header className="w-full pb-8">
      <div className="container mx-auto flex flex-col">
        {/* Top row - 2 items */}
        <div className="flex gap-1 mb-1">
          {navItems.slice(0, 2).map((item) => (
            <Link key={item.href} href={item.href} className={`flex-1 ${getNavLinkClass(item.href)}`}>
              {item.name}
            </Link>
          ))}
        </div>

        {/* Bottom row - 3 items */}
        <div className="flex gap-1">
          {navItems.slice(2).map((item) => (
            <Link key={item.href} href={item.href} className={`flex-1 ${getNavLinkClass(item.href)}`}>
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  )
}

