'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userStr = localStorage.getItem('user')

    if (!token || !userStr) {
      router.push('/login')
      return
    }

    const user = JSON.parse(userStr)
    const role = user.role

    // Redirect to correct dashboard if on wrong one
    if (pathname === '/dashboard' && role !== 'admin') {
      if (role === 'agent') router.push('/agent/dashboard')
      else if (role === 'loan_officer') router.push('/officer/dashboard')
      else if (role === 'analyst') router.push('/analyst/dashboard')
      return
    }

    setChecking(false)
  }, [pathname])

  if (checking) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-green-400 font-bold text-xl mb-2">Wakala</p>
          <p className="text-gray-400 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}