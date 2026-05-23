'use client'
import { useEffect, useState } from 'react'
import { getFraudAlerts, investigateAlert, resolveAlert } from '@/lib/api'

export default function FraudPage() {
  const [alerts, setAlerts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAlerts = () => {
    getFraudAlerts()
      .then((res) => { setAlerts(res.data.alerts); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { fetchAlerts() }, [])

  const handleInvestigate = async (id: string) => { await investigateAlert(id); fetchAlerts() }
  const handleResolve = async (id: string) => { await resolveAlert(id); fetchAlerts() }

  const getRiskBadge = (risk: string) => {
    if (risk === 'Critical') return 'bg-red-500/20 text-red-400 border border-red-500/30'
    if (risk === 'High') return 'bg-orange-500/10 text-orange-400'
    if (risk === 'Medium') return 'bg-yellow-500/10 text-yellow-400'
    return 'bg-gray-500/10 text-gray-400'
  }

  const getStatusBadge = (status: string) => {
    if (status === 'open') return 'bg-red-500/10 text-red-400'
    if (status === 'investigating') return 'bg-yellow-500/10 text-yellow-400'
    return 'bg-green-500/10 text-green-400'
  }

  const critical = alerts.filter(a => a.risk_level === 'Critical')
  const investigating = alerts.filter(a => a.status === 'investigating')
  const resolved = alerts.filter(a => a.status === 'resolved')

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Fraud Detection</h1>
          <p className="text-gray-400 mt-1">AI-powered anomaly detection across all agent transactions</p>
        </div>
        <button className="bg-red-500 hover:bg-red-400 text-white font-semibold px-5 py-2.5 rounded-lg transition text-sm">
          Run Scan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Alerts',  value: alerts.length,        color: 'text-white'      },
          { label: 'Critical',      value: critical.length,      color: 'text-red-400'    },
          { label: 'Investigating', value: investigating.length,  color: 'text-yellow-400' },
          { label: 'Resolved',      value: resolved.length,      color: 'text-green-400'  },
        ].map((s) => (
          <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="text-gray-400 text-sm mb-1">{s.label}</p>
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {critical.length > 0 && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 mb-8 flex items-center justify-between">
          <div>
            <p className="text-red-400 font-semibold">Critical Alert — {critical[0].id}</p>
            <p className="text-gray-400 text-sm mt-1">{critical[0].agent_name} — {critical[0].description}</p>
          </div>
          <button onClick={() => handleInvestigate(critical[0].id)} className="bg-red-500 hover:bg-red-400 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
            Investigate Now
          </button>
        </div>
      )}

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800">
          <h2 className="text-white font-semibold">All Fraud Alerts</h2>
        </div>
        {loading ? (
          <div className="text-center py-12"><p className="text-gray-500">Loading alerts...</p></div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 border-b border-gray-800 bg-gray-800/50">
                <th className="text-left px-6 py-4">Alert ID</th>
                <th className="text-left px-6 py-4">Agent</th>
                <th className="text-left px-6 py-4">Type</th>
                <th className="text-left px-6 py-4">Amount</th>
                <th className="text-left px-6 py-4">Risk</th>
                <th className="text-left px-6 py-4">Status</th>
                <th className="text-left px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              {alerts.map((alert) => (
                <tr key={alert.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition">
                  <td className="px-6 py-4 text-red-400 font-mono text-xs">{alert.id}</td>
                  <td className="px-6 py-4">
                    <p className="text-white font-medium">{alert.agent_name}</p>
                    <p className="text-gray-500 text-xs">{alert.agent_id} · {alert.provider}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-300">{alert.alert_type}</td>
                  <td className="px-6 py-4 font-medium text-white">TZS {alert.amount.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskBadge(alert.risk_level)}`}>{alert.risk_level}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(alert.status)}`}>{alert.status}</span>
                  </td>
                  <td className="px-6 py-4">
                    {alert.status === 'open' && (
                      <button onClick={() => handleInvestigate(alert.id)} className="text-xs text-yellow-400 border border-yellow-500/20 px-3 py-1 rounded transition">
                        Investigate
                      </button>
                    )}
                    {alert.status === 'investigating' && (
                      <button onClick={() => handleResolve(alert.id)} className="text-xs text-green-400 border border-green-500/20 px-3 py-1 rounded transition">
                        Resolve
                      </button>
                    )}
                    {alert.status === 'resolved' && <span className="text-xs text-gray-500">Closed</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && alerts.length === 0 && (
          <div className="text-center py-12"><p className="text-gray-500">No fraud alerts. System is clean!</p></div>
        )}
      </div>
    </div>
  )
}