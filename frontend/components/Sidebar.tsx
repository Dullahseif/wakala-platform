'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const adminLinks = [
  { href: '/dashboard',        label: 'Overview',       icon: '▦' },
  { href: '/agents',           label: 'Agents',         icon: '👤' },
  { href: '/transactions',     label: 'Transactions',   icon: '💳' },
  { href: '/credit-score',     label: 'Credit Scores',  icon: '⭐' },
  { href: '/loans',            label: 'Loans',          icon: '🏦' },
  { href: '/fraud',            label: 'Fraud Alerts',   icon: '🚨' },
  { href: '/analytics',        label: 'Analytics',      icon: '📊' },
  { href: '/reports',          label: 'Reports',        icon: '📄' },
  { href: '/users',            label: 'User Management',icon: '⚙' },
]

const agentLinks = [
  { href: '/agent/dashboard',  label: 'My Dashboard',   icon: '▦' },
  { href: '/agent/transactions',label: 'My Transactions',icon: '💳' },
  { href: '/agent/credit-score',label: 'My Credit Score',icon: '⭐' },
  { href: '/agent/loans',      label: 'My Loans',       icon: '🏦' },
]

const loanOfficerLinks = [
  { href: '/officer/dashboard', label: 'Overview',       icon: '▦' },
  { href: '/officer/loans',     label: 'Loan Applications',icon: '🏦' },
  { href: '/officer/credit-score',label: 'Credit Scores', icon: '⭐' },
  { href: '/officer/agents',    label: 'Agents',         icon: '👤' },
]

const analystLinks = [
  { href: '/analyst/dashboard', label: 'Overview',       icon: '▦' },
  { href: '/analyst/analytics', label: 'Analytics',      icon: '📊' },
  { href: '/analyst/transactions',label: 'Transactions', icon: '💳' },
  { href: '/analyst/fraud',     label: 'Fraud Monitor',  icon: '🚨' },
  { href: '/analyst/reports',   label: 'Reports',        icon: '📄' },
]

const getRoleLinks = (role: string) => {
  if (role === 'admin') return adminLinks
  if (role === 'agent') return agentLinks
  if (role === 'loan_officer') return loanOfficerLinks
  if (role === 'analyst') return analystLinks
  return adminLinks
}

const getRoleLabel = (role: string) => {
  if (role === 'admin') return 'Administrator'
  if (role === 'agent') return 'Wakala Agent'
  if (role === 'loan_officer') return 'Loan Officer'
  if (role === 'analyst') return 'Analyst'
  return role
}

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) setUser(JSON.parse(stored))
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  const links = getRoleLinks(user?.role || 'admin')

  return (
    <aside className="w-64 min-h-screen bg-gray-900 border-r border-gray-800 flex flex-col">
      <div className="px-6 py-5 border-b border-gray-800">
        <h1 className="text-green-400 font-bold text-xl">Wakala</h1>
        <p className="text-gray-500 text-xs mt-1">Ledger & Credit Platform</p>
      </div>

      {user && (
        <div className="px-4 py-3 border-b border-gray-800">
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
            user.role === 'admin'       ? 'bg-purple-500/10 text-purple-400' :
            user.role === 'agent'       ? 'bg-green-500/10 text-green-400' :
            user.role === 'loan_officer'? 'bg-blue-500/10 text-blue-400' :
            'bg-yellow-500/10 text-yellow-400'
          }`}>
            {getRoleLabel(user.role)}
          </span>
        </div>
      )}

      <nav className="flex-1 px-4 py-6 space-y-1">
        {links.map((link) => {
          const active = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition ${
                active
                  ? 'bg-green-500/10 text-green-400 font-medium border border-green-500/20'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <span>{link.icon}</span>
              {link.label}
            </Link>
          )
        })}
      </nav>

      <div className="px-6 py-4 border-t border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-sm font-bold">
              {user?.name?.[0] || 'A'}
            </div>
            <div>
              <p className="text-white text-sm font-medium">{user?.name || 'User'}</p>
              <p className="text-gray-500 text-xs">{getRoleLabel(user?.role || 'admin')}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-gray-500 hover:text-red-400 text-xs transition"
            title="Logout"
          >
            ⏻
          </button>
        </div>
      </div>
    </aside>
  )
}