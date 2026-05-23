'use client'
import { useEffect, useState } from 'react'
import { getAgents, getTransactions, getLoans, getFraudAlerts } from '@/lib/api'

export default function DashboardPage() {
  const [stats, setStats] = useState({
    agents: 0,
    transactions: 0,
    loans: 0,
    fraud: 0,
  })
  const [recentTransactions, setRecentTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getAgents(),
      getTransactions(),
      getLoans(),
      getFraudAlerts(),
    ]).then(([agentsRes, txnRes, loansRes, fraudRes]) => {
      setStats({
        agents: agentsRes.data.total,
        transactions: txnRes.data.total,
        loans: loansRes.data.total,
        fraud: fraudRes.data.total,
      })
      setRecentTransactions(txnRes.data.transactions.slice(0, 5))
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
        <p className="text-gray-400 mt-1">Welcome back. Here is what is happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Agents',       value: loading ? '...' : stats.agents,       color: 'text-green-400'  },
          { label: 'Total Transactions', value: loading ? '...' : stats.transactions, color: 'text-blue-400'   },
          { label: 'Active Loans',       value: loading ? '...' : stats.loans,        color: 'text-yellow-400' },
          { label: 'Fraud Alerts',       value: loading ? '...' : stats.fraud,        color: 'text-red-400'    },
        ].map((stat) => (
          <div key={stat.label} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <p className="text-gray-400 text-sm mb-2">{stat.label}</p>
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-white font-semibold mb-4">Recent Transactions</h2>
        {loading ? (
          <p className="text-gray-500 text-sm">Loading transactions...</p>
        ) : recentTransactions.length === 0 ? (
          <p className="text-gray-500 text-sm">No transactions yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 border-b border-gray-800">
                <th className="text-left pb-3">Agent</th>
                <th className="text-left pb-3">Type</th>
                <th className="text-left pb-3">Amount</th>
                <th className="text-left pb-3">Provider</th>
                <th className="text-left pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              {recentTransactions.map((txn: any) => (
                <tr key={txn.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition">
                  <td className="py-3">{txn.agent_name}</td>
                  <td className="py-3">{txn.transaction_type}</td>
                  <td className="py-3 font-medium">TZS {txn.amount.toLocaleString()}</td>
                  <td className="py-3">{txn.provider}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      txn.status === 'success' ? 'bg-green-500/10 text-green-400' :
                      txn.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' :
                      'bg-red-500/10 text-red-400'
                    }`}>
                      {txn.status}
                    </span>
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