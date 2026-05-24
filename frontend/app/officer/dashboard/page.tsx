'use client'
import { useEffect, useState } from 'react'
import { getLoans, getCreditScores } from '@/lib/api'

export default function OfficerDashboard() {
  const [loans, setLoans] = useState<any[]>([])
  const [scores, setScores] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getLoans(), getCreditScores()])
      .then(([l, s]) => {
        setLoans(l.data.loans)
        setScores(s.data.scores)
        setLoading(false)
      }).catch(() => setLoading(false))
  }, [])

  const pending = loans.filter(l => l.status === 'pending')
  const active = loans.filter(l => l.status === 'active')
  const overdue = loans.filter(l => l.status === 'overdue')
  const highRisk = scores.filter(s => s.risk_level === 'High')

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Loan Officer Dashboard</h1>
        <p className="text-gray-400 mt-1">Review and manage loan applications</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Pending Applications', value: pending.length,  color: 'text-yellow-400' },
          { label: 'Active Loans',         value: active.length,   color: 'text-green-400'  },
          { label: 'Overdue Loans',        value: overdue.length,  color: 'text-red-400'    },
          { label: 'High Risk Agents',     value: highRisk.length, color: 'text-orange-400' },
        ].map((s) => (
          <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="text-gray-400 text-sm mb-1">{s.label}</p>
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {pending.length > 0 && (
        <div className="bg-gray-900 border border-yellow-500/20 rounded-xl p-6 mb-8">
          <h2 className="text-white font-semibold mb-4">Pending Loan Applications</h2>
          <div className="space-y-3">
            {pending.map((loan) => (
              <div key={loan.id} className="flex items-center justify-between bg-gray-800/50 rounded-lg p-4">
                <div>
                  <p className="text-white font-medium">{loan.agent_name}</p>
                  <p className="text-gray-500 text-xs">{loan.agent_id} · {loan.duration_months} months</p>
                </div>
                <div className="text-center">
                  <p className="text-white font-semibold">TZS {loan.amount.toLocaleString()}</p>
                  <p className="text-gray-500 text-xs">Requested</p>
                </div>
                <span className="bg-yellow-500/10 text-yellow-400 text-xs px-3 py-1 rounded-full">
                  Pending Review
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-white font-semibold mb-4">Agent Credit Scores</h2>
        {loading ? (
          <p className="text-gray-500 text-sm">Loading...</p>
        ) : scores.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-8">No credit scores yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 border-b border-gray-800">
                <th className="text-left pb-3">Agent ID</th>
                <th className="text-left pb-3">Score</th>
                <th className="text-left pb-3">Risk Level</th>
                <th className="text-left pb-3">Loan Recommendation</th>
                <th className="text-left pb-3">Repayment Rate</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              {scores.slice(0, 8).map((score: any) => (
                <tr key={score.id} className="border-b border-gray-800/50">
                  <td className="py-3 text-green-400 font-mono text-xs">{score.agent_id}</td>
                  <td className="py-3">
                    <span className={`font-bold ${
                      score.score >= 800 ? 'text-green-400' :
                      score.score >= 650 ? 'text-yellow-400' : 'text-red-400'
                    }`}>{score.score}</span>
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      score.risk_level === 'Low'    ? 'bg-green-500/10 text-green-400' :
                      score.risk_level === 'Medium' ? 'bg-yellow-500/10 text-yellow-400' :
                      'bg-red-500/10 text-red-400'
                    }`}>{score.risk_level}</span>
                  </td>
                  <td className="py-3">TZS {(score.loan_recommendation || 0).toLocaleString()}</td>
                  <td className="py-3">{score.repayment_rate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}