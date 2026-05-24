'use client'
import { useEffect, useState } from 'react'
import { getFraudAlerts } from '@/lib/api'

export default function AnalystFraudPage() {
  const [alerts, setAlerts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getFraudAlerts()
      .then((res) => { setAlerts(res.data.alerts); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Fraud Monitor</h1>
        <p className="text-gray-400 mt-1">Monitor suspicious activities and anomalies</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Alerts',  value: alerts.length,                                    color: 'text-white'      },
          { label: 'Critical',      value: alerts.filter(a => a.risk_level === 'Critical').length, color: 'text-red-400'    },
          { label: 'Investigating', value: alerts.filter(a => a.status === 'investigating').length, color: 'text-yellow-400' },
          { label: 'Resolved',      value: alerts.filter(a => a.status === 'resolved').length,     color: 'text-green-400'  },
        ].map((s) => (
          <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="text-gray-400 text-sm mb-1">{s.label}</p>
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800">
          <h2 className="text-white font-semibold">All Fraud Alerts</h2>
        </div>
        {loading ? (
          <div className="text-center py-12"><p className="text-gray-500">Loading...</p></div>
        ) : alerts.length === 0 ? (
          <div className="text-center py-12"><p className="text-gray-500">No fraud alerts. System is clean!</p></div>
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
              </tr>
            </thead>
            <tbody className="text-gray-300">
              {alerts.map((alert) => (
                <tr key={alert.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition">
                  <td className="px-6 py-4 text-red-400 font-mono text-xs">{alert.id}</td>
                  <td className="px-6 py-4">
                    <p className="text-white font-medium">{alert.agent_name}</p>
                    <p className="text-gray-500 text-xs">{alert.agent_id}</p>
                  </td>
                  <td className="px-6 py-4">{alert.alert_type}</td>
                  <td className="px-6 py-4 font-medium text-white">TZS {alert.amount.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      alert.risk_level === 'Critical' ? 'bg-red-500/20 text-red-400' :
                      alert.risk_level === 'High'     ? 'bg-orange-500/10 text-orange-400' :
                      'bg-yellow-500/10 text-yellow-400'
                    }`}>{alert.risk_level}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      alert.status === 'open'          ? 'bg-red-500/10 text-red-400' :
                      alert.status === 'investigating' ? 'bg-yellow-500/10 text-yellow-400' :
                      'bg-green-500/10 text-green-400'
                    }`}>{alert.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}