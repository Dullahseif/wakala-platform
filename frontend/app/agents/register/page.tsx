'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createAgent } from '@/lib/api'

export default function RegisterAgentPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    provider: 'mpesa',
    national_id: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      const res = await createAgent(form)
      setSuccess(`Agent ${res.data.agent.name} registered successfully with ID ${res.data.agent.id}`)
      setForm({ name: '', email: '', phone: '', location: '', provider: 'mpesa', national_id: '' })
      setLoading(false)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed')
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.push('/agents')}
          className="text-gray-400 hover:text-white transition text-sm"
        >
          ← Back to Agents
        </button>
      </div>

      <div className="max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Register New Agent</h1>
          <p className="text-gray-400 mt-1">Add a new wakala agent to the platform</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Juma Ally"
                className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-600 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition"
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-2 block">Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="juma@example.com"
                className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-600 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition"
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-2 block">Phone Number</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+255712345678"
                className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-600 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition"
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-2 block">National ID</label>
              <input
                type="text"
                value={form.national_id}
                onChange={(e) => setForm({ ...form, national_id: e.target.value })}
                placeholder="TZ-19900101-001"
                className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-600 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition"
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-2 block">Location</label>
              <select
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition"
              >
                <option value="">Select location</option>
                <option value="Dar es Salaam">Dar es Salaam</option>
                <option value="Arusha">Arusha</option>
                <option value="Mwanza">Mwanza</option>
                <option value="Zanzibar">Zanzibar</option>
                <option value="Dodoma">Dodoma</option>
                <option value="Tanga">Tanga</option>
                <option value="Mbeya">Mbeya</option>
                <option value="Morogoro">Morogoro</option>
              </select>
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-2 block">Mobile Money Provider</label>
              <select
                value={form.provider}
                onChange={(e) => setForm({ ...form, provider: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition"
              >
                <option value="mpesa">M-Pesa (Vodacom)</option>
                <option value="airtel">Airtel Money</option>
                <option value="tigo">Tigo Pesa</option>
                <option value="halopesa">HaloPesa</option>
              </select>
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-green-500 hover:bg-green-400 disabled:bg-green-800 text-black font-semibold px-8 py-3 rounded-lg transition text-sm"
            >
              {loading ? 'Registering...' : 'Register Agent'}
            </button>
            <button
              onClick={() => router.push('/agents')}
              className="border border-gray-700 hover:border-gray-500 text-gray-300 px-8 py-3 rounded-lg transition text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}