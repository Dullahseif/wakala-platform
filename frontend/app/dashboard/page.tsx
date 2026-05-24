'use client'
import { useEffect, useState } from 'react'
import { getAgentTransactions, getAgentCreditScore } from '@/lib/api'

export default function AgentDashboard() {
  const [user, setUser] = useState<any>(null)
  const [transactions, setTransactions] = useState<any[]>([])
  const [creditScore, setCreditScore] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      const u = JSON.parse(stored)
      setUser(u)
      Promise.all([
        getAgentTransactions(u.agent_id || u.id),
        getAgentCreditScore(u.agent_id || u.id),
      ]).then(([txnRes, scoreRes]) => {
        setTransactions(txnRes.data.transactions || [])
        setCreditScore(scoreRes.data)
        setLoading(false)
      }).catch(() => setLoading(false))
    }
  }, [])

  const totalCashIn = transactions.filter(t => t.transaction_type === 'cash_in').reduce((s, t) => s + t.amount, 0)
  const totalCashOut = transactions.filter(t => t.transaction_type === 'cash_out').reduce((s, t) => s + t.amount, 0)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">My Dashboard</h1>
        <p className="text-gray-400 mt-1">Welcome back, {user?.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Transactions', value: transactions.length,                    color: 'text-white'      },
          { label: 'Total Cash In',      value: `TZS ${totalCashIn.toLocaleString()}`,  color: 'text-green-400'  },
          { label: 'Total Cash Out',     value: `TZS ${totalCashOut.toLocaleString()}`, color: 'text-blue-400'   },
          { label: 'Credit Score',       value: creditScore?.score || 'N/A',            color: 'text-yellow-400' },
        ].map((s) => (
          <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="text-gray-400 text-sm mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {creditScore && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
          <h2 className="text-white font-semibold mb-4">My Credit Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className={`text-5xl font-bold ${
                creditScore.score >= 800 ? 'text-green-400' :
                creditScore.score >= 650 ? 'text-yellow-400' : 'text-red-400'
              }`}>{creditScore.score}</p>
              <p className="text-gray-400 text-sm mt-2">Credit Score</p>
              <div className="w-full h-2 bg-gray-700 rounded-full mt-3 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    creditScore.score >= 800 ? 'bg-green-400' :
                    creditScore.score >= 650 ? 'bg-yellow-400' : 'bg-red-400'
                  }`}
                  style={{ width: `${(creditScore.score / 1000) * 100}%` }}
                />
              </div>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-4 text-center">
              <p className={`text-2xl font-bold ${
                creditScore.risk_level === 'Low' ? 'text-green-400' :
                creditScore.risk_level === 'Medium' ? 'text-yellow-400' : 'text-red-400'
              }`}>{creditScore.risk_level}</p>
              <p className="text-gray-400 text-sm mt-1">Risk Level</p>
            </div>
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center">
              <p className="text-green-400 text-2xl font-bold">
                TZS {(creditScore.loan_recommendation || 0).toLocaleString()}
              </p>
              <p className="text-gray-400 text-sm mt-1">Loan Eligibility</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-white font-semibold mb-4">Recent Transactions</h2>
        {loading ? (
          <p className="text-gray-500 text-sm">Loading...</p>
        ) : transactions.length === 0 ? (
          <p className="text-gray-500 text-sm">No transactions yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 border-b border-gray-800">
                <th className="text-left pb-3">ID</th>
                <th className="text-left pb-3">Type</th>
                <th className="text-left pb-3">Amount</th>
                <th className="text-left pb-3">Provider</th>
                <th className="text-left pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              {transactions.slice(0, 5).map((txn: any) => (
                <tr key={txn.id} className="border-b border-gray-800/50">
                  <td className="py-3 text-green-400 font-mono text-xs">{txn.id}</td>
                  <td className="py-3">{txn.transaction_type.replace('_', ' ')}</td>
                  <td className="py-3 font-medium">TZS {txn.amount.toLocaleString()}</td>
                  <td className="py-3">{txn.provider}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      txn.status === 'success' ? 'bg-green-500/10 text-green-400' :
                      'bg-yellow-500/10 text-yellow-400'
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