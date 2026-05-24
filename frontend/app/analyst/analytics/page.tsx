'use client'
import { useEffect, useState } from 'react'
import { getTransactionsByType, getTransactionsByProvider, getCreditDistribution, getAgentsByLocation } from '@/lib/api'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const COLORS = ['#22c55e', '#3b82f6', '#a855f7', '#f59e0b', '#ef4444']

export default function AnalystAnalyticsPage() {
  const [txnByType, setTxnByType] = useState<any[]>([])
  const [txnByProvider, setTxnByProvider] = useState<any[]>([])
  const [creditDist, setCreditDist] = useState<any[]>([])
  const [agentsByLocation, setAgentsByLocation] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getTransactionsByType(),
      getTransactionsByProvider(),
      getCreditDistribution(),
      getAgentsByLocation(),
    ]).then(([tt, tp, cd, al]) => {
      setTxnByType(tt.data)
      setTxnByProvider(tp.data)
      setCreditDist(cd.data)
      setAgentsByLocation(al.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-center py-20"><p className="text-gray-400">Loading analytics...</p></div>

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Financial Analytics</h1>
        <p className="text-gray-400 mt-1">Deep analysis of platform financial data</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-white font-semibold mb-6">Transactions by Type</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={txnByType}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="type" stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 11 }} />
              <YAxis stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }} />
              <Bar dataKey="volume" fill="#22c55e" radius={[4, 4, 0, 0]} name="Volume (TZS)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-white font-semibold mb-6">Agents by Location</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={agentsByLocation}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="location" stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 10 }} />
              <YAxis stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }} />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Agents" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-white font-semibold mb-4">Provider Distribution</h2>
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
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-white font-semibold mb-6">Credit Score Distribution</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={creditDist} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis type="number" stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 11 }} />
              <YAxis type="category" dataKey="range" stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 11 }} width={70} />
              <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]} name="Agents">
                {creditDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}