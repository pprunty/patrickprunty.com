"use client"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

export function Logo() {
  const pathname = usePathname()
  const [shouldAnimate, setShouldAnimate] = useState(false)
  const logoRef = useRef<HTMLSpanElement | null>(null)
  const [isInView, setIsInView] = useState(false)

  // Configure whether to include subpaths ("/blog/*")
  const includeSubPaths = true // Change to false to trigger only on "/blog"

  // Intersection Observer to track visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
      },
      { threshold: 0.1 },
    )

    if (logoRef.current) {
      observer.observe(logoRef.current)
    }

    return () => {
      if (logoRef.current) observer.unobserve(logoRef.current)
    }
  }, [])

  // Trigger animations only when component is in view and matches route
  useEffect(() => {
    const shouldTriggerAnimation = includeSubPaths ? pathname.startsWith("/blog") : pathname === "/blog"

    if (shouldTriggerAnimation && isInView) {
      // Trigger the first animation after 0.8 seconds
      const initialTimer = setTimeout(() => {
        setShouldAnimate(true)
        setTimeout(() => setShouldAnimate(false), 1400)
      }, 900)

      // Set up recurring animation every 4.3 seconds
      const interval = setInterval(() => {
        setShouldAnimate(true)
        setTimeout(() => setShouldAnimate(false), 1400)
      }, 4300)

      // Cleanup both the initial timer and interval
      return () => {
        clearTimeout(initialTimer)
        clearInterval(interval)
      }
    } else {
      setShouldAnimate(false)
    }
  }, [pathname, isInView])

  const animationClass = shouldAnimate ? "animate-custom-pulse" : ""

  return (
    <span
      ref={logoRef}
      className={`text-md md:text-lg whitespace-nowrap font-bold transition-colors ${animationClass}`}
    >
      <Link
        href="/"
        className="hover:bg-gray-200 dark:hover:bg-[#313131] active:bg-gray-300 dark:active:bg-[#242424] p-2 rounded-sm -ml-2 transition-[background-color]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 145 244"
          preserveAspectRatio="xMidYMid meet"
          className="w-6 h-6"
          fill="currentColor"
        >
          <path
            d="M722 1701 l-724 -726 493 -487 493 -488 233 0 c128 0 233 3 233 7 0
          5 -172 180 -382 390 l-383 383 383 0 382 0 0 825 c0 454 -1 824 -2 824 -2 -1
          -329 -328 -726 -728z m358 -331 l0 -200 -200 0 -201 0 198 200 c109 110 199
          200 201 200 1 0 2 -90 2 -200z"
          />
        </svg>
      </Link>
    </span>
  )
}

