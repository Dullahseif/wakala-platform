'use client'
import { useEffect, useState } from 'react'
import { getAgentTransactions } from '@/lib/api'

export default function AgentTransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      const u = JSON.parse(stored)
      setUser(u)
      getAgentTransactions(u.agent_id || u.id)
        .then((res) => { setTransactions(res.data.transactions || []); setLoading(false) })
        .catch(() => setLoading(false))
    }
  }, [])

  const totalCashIn = transactions.filter(t => t.transaction_type === 'cash_in').reduce((s, t) => s + t.amount, 0)
  const totalCashOut = transactions.filter(t => t.transaction_type === 'cash_out').reduce((s, t) => s + t.amount, 0)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">My Transactions</h1>
        <p className="text-gray-400 mt-1">Your complete transaction history</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: 'Total Transactions', value: transactions.length,                    color: 'text-white'     },
          { label: 'Total Cash In',      value: `TZS ${totalCashIn.toLocaleString()}`,  color: 'text-green-400' },
          { label: 'Total Cash Out',     value: `TZS ${totalCashOut.toLocaleString()}`, color: 'text-blue-400'  },
        ].map((s) => (
          <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="text-gray-400 text-sm mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="text-center py-12"><p className="text-gray-500">Loading...</p></div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-12"><p className="text-gray-500">No transactions yet.</p></div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 border-b border-gray-800 bg-gray-800/50">
                <th className="text-left px-6 py-4">Txn ID</th>
                <th className="text-left px-6 py-4">Type</th>
                <th className="text-left px-6 py-4">Amount</th>
                <th className="text-left px-6 py-4">Float After</th>
                <th className="text-left px-6 py-4">Provider</th>
                <th className="text-left px-6 py-4">Date</th>
                <th className="text-left px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              {transactions.map((txn) => (
                <tr key={txn.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition">
                  <td className="px-6 py-4 text-green-400 font-mono text-xs">{txn.id}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      txn.transaction_type === 'cash_in'  ? 'bg-green-500/10 text-green-400' :
                      txn.transaction_type === 'cash_out' ? 'bg-blue-500/10 text-blue-400' :
                      'bg-purple-500/10 text-purple-400'
                    }`}>{txn.transaction_type.replace('_', ' ')}</span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-white">TZS {txn.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-gray-400">TZS {txn.float_after.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className="bg-blue-500/10 text-blue-400 px-2 py-1 rounded text-xs">{txn.provider}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-xs">
                    {new Date(txn.created_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      txn.status === 'success' ? 'bg-green-500/10 text-green-400' :
                      txn.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' :
                      'bg-red-500/10 text-red-400'
                    }`}>{txn.status}</span>
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