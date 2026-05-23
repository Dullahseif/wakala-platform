'use client'
import { useEffect, useState } from 'react'
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from 'recharts'
import {
  getAnalyticsSummary,
  getTransactionsByType,
  getTransactionsByProvider,
  getCreditDistribution,
  getAgentsByLocation,
  getLoansByStatus
} from '@/lib/api'

const COLORS = ['#22c55e', '#3b82f6', '#a855f7', '#f59e0b', '#ef4444']

export default function AnalyticsPage() {
  const [summary, setSummary] = useState<any>(null)
  const [txnByType, setTxnByType] = useState<any[]>([])
  const [txnByProvider, setTxnByProvider] = useState<any[]>([])
  const [creditDist, setCreditDist] = useState<any[]>([])
  const [agentsByLocation, setAgentsByLocation] = useState<any[]>([])
  const [loansByStatus, setLoansByStatus] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getAnalyticsSummary(),
      getTransactionsByType(),
      getTransactionsByProvider(),
      getCreditDistribution(),
      getAgentsByLocation(),
      getLoansByStatus(),
    ]).then(([s, tt, tp, cd, al, ls]) => {
      setSummary(s.data)
      setTxnByType(tt.data)
      setTxnByProvider(tp.data)
      setCreditDist(cd.data)
      setAgentsByLocation(al.data)
      setLoansByStatus(ls.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-400">Loading analytics...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics Dashboard</h1>
          <p className="text-gray-400 mt-1">Real-time platform performance and financial insights</p>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Agents',       value: summary?.agents?.total || 0,                                color: 'text-white'      },
          { label: 'Active Agents',      value: summary?.agents?.active || 0,                               color: 'text-green-400'  },
          { label: 'Total Transactions', value: summary?.transactions?.total || 0,                          color: 'text-blue-400'   },
          { label: 'Total Volume',       value: `TZS ${(summary?.transactions?.volume || 0).toLocaleString()}`, color: 'text-purple-400' },
        ].map((k) => (
          <div key={k.label} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="text-gray-400 text-sm mb-1">{k.label}</p>
            <p className={`text-2xl font-bold ${k.color}`}>{k.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Loans',     value: summary?.loans?.total || 0,                                        color: 'text-white'     },
          { label: 'Active Loans',    value: summary?.loans?.active || 0,                                       color: 'text-green-400' },
          { label: 'Total Disbursed', value: `TZS ${(summary?.loans?.disbursed || 0).toLocaleString()}`,        color: 'text-yellow-400'},
          { label: 'Fraud Alerts',    value: summary?.fraud?.open || 0,                                         color: 'text-red-400'   },
        ].map((k) => (
          <div key={k.label} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="text-gray-400 text-sm mb-1">{k.label}</p>
            <p className={`text-2xl font-bold ${k.color}`}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

        {/* Transactions by type */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-white font-semibold mb-1">Transactions by Type</h2>
          <p className="text-gray-500 text-xs mb-6">Volume and count per transaction type</p>
          {txnByType.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-12">No transaction data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={txnByType}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="type" stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 11 }} />
                <YAxis stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="count" fill="#22c55e" radius={[4, 4, 0, 0]} name="Count" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Transactions by provider */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-white font-semibold mb-1">Provider Share</h2>
          <p className="text-gray-500 text-xs mb-4">Transaction count by mobile money provider</p>
          {txnByProvider.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-12">No provider data yet</p>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={txnByProvider}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="count"
                    nameKey="provider"
                  >
                    {txnByProvider.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {txnByProvider.map((p, i) => (
                  <div key={p.provider} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-gray-400 text-xs">{p.provider}</span>
                    <span className="text-white text-xs font-medium ml-auto">{p.count}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Credit distribution */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-white font-semibold mb-1">Credit Distribution</h2>
          <p className="text-gray-500 text-xs mb-6">Agents by credit score range</p>
          {creditDist.every(c => c.count === 0) ? (
            <p className="text-gray-500 text-sm text-center py-12">No credit score data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={creditDist} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis type="number" stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 11 }} />
                <YAxis type="category" dataKey="range" stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 11 }} width={70} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} name="Agents">
                  {creditDist.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Agents by location */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-white font-semibold mb-1">Agents by Location</h2>
          <p className="text-gray-500 text-xs mb-6">Distribution across Tanzania</p>
          {agentsByLocation.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-12">No location data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={agentsByLocation}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="location" stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 9 }} />
                <YAxis stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Agents" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Loans by status */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-white font-semibold mb-1">Loans by Status</h2>
          <p className="text-gray-500 text-xs mb-6">Current loan portfolio breakdown</p>
          {loansByStatus.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-12">No loan data yet</p>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={loansByStatus}
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="count"
                    nameKey="status"
                  >
                    {loansByStatus.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1 mt-2">
                {loansByStatus.map((l, i) => (
                  <div key={l.status} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="text-gray-400 text-xs capitalize">{l.status}</span>
                    </div>
                    <span className="text-white text-xs font-medium">{l.count}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}