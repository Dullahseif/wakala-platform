'use client'
import { useEffect, useState } from 'react'
import { getAgents } from '@/lib/api'

interface Agent {
  id: string
  name: string
  location: string
  provider: string
  credit_score: number
  status: string
  created_at: string
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getAgents()
      .then((res) => {
        setAgents(res.data.agents)
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to load agents')
        setLoading(false)
      })
  }, [])

  const getScoreColor = (score: number) => {
    if (score >= 800) return 'text-green-400'
    if (score >= 650) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getScoreBg = (score: number) => {
    if (score >= 800) return 'bg-green-400'
    if (score >= 650) return 'bg-yellow-400'
    return 'bg-red-400'
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Wakala Agents</h1>
          <p className="text-gray-400 mt-1">Manage and monitor all registered agents</p>
        </div>
        <a href="/agents/register" className="bg-green-500 hover:bg-green-400 text-black font-semibold px-5 py-2.5 rounded-lg transition text-sm">
  + Register Agent
</a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: 'Total Agents',  value: agents.length,                                            color: 'text-white'     },
          { label: 'Active Agents', value: agents.filter(a => a.status === 'active').length,         color: 'text-green-400' },
          { label: 'Suspended',     value: agents.filter(a => a.status === 'suspended').length,      color: 'text-red-400'   },
        ].map((s) => (
          <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="text-gray-400 text-sm mb-1">{s.label}</p>
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search agents by name, location or ID..."
          className="w-full bg-gray-900 border border-gray-800 text-gray-300 placeholder-gray-600 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition"
        />
      </div>

      {loading && (
        <div className="text-center py-20">
          <p className="text-gray-400">Loading agents...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 border-b border-gray-800 bg-gray-800/50">
                <th className="text-left px-6 py-4">Agent ID</th>
                <th className="text-left px-6 py-4">Name</th>
                <th className="text-left px-6 py-4">Location</th>
                <th className="text-left px-6 py-4">Provider</th>
                <th className="text-left px-6 py-4">Credit Score</th>
                <th className="text-left px-6 py-4">Status</th>
                <th className="text-left px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              {agents.map((agent) => (
                <tr key={agent.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition">
                  <td className="px-6 py-4 text-green-400 font-mono text-xs">{agent.id}</td>
                  <td className="px-6 py-4 font-medium text-white">{agent.name}</td>
                  <td className="px-6 py-4">{agent.location}</td>
                  <td className="px-6 py-4">
                    <span className="bg-blue-500/10 text-blue-400 px-2 py-1 rounded text-xs">
                      {agent.provider}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${getScoreColor(agent.credit_score)}`}>
                        {agent.credit_score}
                      </span>
                      <div className="w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${getScoreBg(agent.credit_score)}`}
                          style={{ width: `${(agent.credit_score / 1000) * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      agent.status === 'active'    ? 'bg-green-500/10 text-green-400' :
                      agent.status === 'suspended' ? 'bg-red-500/10 text-red-400' :
                      'bg-gray-500/10 text-gray-400'
                    }`}>
                      {agent.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-xs text-green-400 hover:text-green-300 border border-green-500/20 hover:border-green-500/50 px-3 py-1 rounded transition">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {agents.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No agents found. Register your first agent!</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}