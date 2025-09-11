"use client"

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function ScrollToTop() {
  const pathname = usePathname()

  useEffect(() => {
    // Scroll to top on page refresh
    const handleBeforeUnload = () => {
      window.scrollTo(0, 0)
    }

    // Scroll to top on route change
    window.scrollTo(0, 0)

    // Add event listener for page refresh
    window.addEventListener('beforeunload', handleBeforeUnload)

    // Cleanup
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [pathname])

  return null
}






