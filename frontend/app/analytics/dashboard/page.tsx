'use client'
import { useEffect, useState } from 'react'
import { getAnalyticsSummary, getTransactionsByType, getTransactionsByProvider } from '@/lib/api'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const COLORS = ['#22c55e', '#3b82f6', '#a855f7', '#f59e0b', '#ef4444']

export default function AnalystDashboard() {
  const [summary, setSummary] = useState<any>(null)
  const [txnByType, setTxnByType] = useState<any[]>([])
  const [txnByProvider, setTxnByProvider] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getAnalyticsSummary(),
      getTransactionsByType(),
      getTransactionsByProvider(),
    ]).then(([s, tt, tp]) => {
      setSummary(s.data)
      setTxnByType(tt.data)
      setTxnByProvider(tp.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Analyst Dashboard</h1>
        <p className="text-gray-400 mt-1">Financial records and platform analytics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Agents',       value: summary?.agents?.total || 0,                                    color: 'text-white'      },
          { label: 'Total Transactions', value: summary?.transactions?.total || 0,                              color: 'text-blue-400'   },
          { label: 'Total Volume',       value: `TZS ${(summary?.transactions?.volume || 0).toLocaleString()}`, color: 'text-green-400'  },
          { label: 'Fraud Alerts',       value: summary?.fraud?.open || 0,                                      color: 'text-red-400'    },
        ].map((s) => (
          <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="text-gray-400 text-sm mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{loading ? '...' : s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-white font-semibold mb-6">Transactions by Type</h2>
          {txnByType.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-12">No data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={txnByType}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="type" stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 11 }} />
                <YAxis stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }} />
                <Bar dataKey="count" fill="#22c55e" radius={[4, 4, 0, 0]} name="Count" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-white font-semibold mb-4">Provider Distribution</h2>
          {txnByProvider.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-12">No data yet</p>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={txnByProvider} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="count" nameKey="provider">
                    {txnByProvider.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }} />
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
    </div>
  )
}