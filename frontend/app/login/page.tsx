'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { loginUser } from '@/lib/api'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
  setLoading(true)
  setError('')
  try {
    const res = await loginUser(form)
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('user', JSON.stringify(res.data.user))
    const role = res.data.user.role
    if (role === 'admin') router.push('/dashboard')
    else if (role === 'agent') router.push('/agent/dashboard')
    else if (role === 'loan_officer') router.push('/officer/dashboard')
    else if (role === 'analyst') router.push('/analyst/dashboard')
    else router.push('/dashboard')
  } catch (err: any) {
    setError(err.response?.data?.detail || 'Login failed')
    setLoading(false)
  }
}

  return (
    <main className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-green-400 font-bold text-3xl mb-2">Wakala</h1>
          <p className="text-gray-400">Sign in to your account</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Email address</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="admin@wakala.tz"
                className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-600 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition"
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-2 block">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-600 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition"
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-400 disabled:bg-green-800 text-black font-semibold py-3 rounded-lg transition text-sm"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>

          <p className="text-center text-gray-500 text-sm mt-6">
            Don't have an account?{' '}
            <a href="/register" className="text-green-400 hover:text-green-300 transition">
              Create one
            </a>
          </p>
        </div>
      </div>
    </main>
  )
}