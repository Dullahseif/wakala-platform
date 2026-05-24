'use client'
import { useEffect, useState } from 'react'
import { calculateCreditScore } from '@/lib/api'

export default function AgentCreditScorePage() {
  const [user, setUser] = useState<any>(null)
  const [score, setScore] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      const u = JSON.parse(stored)
      setUser(u)
      calculateCreditScore(u.agent_id || u.id)
        .then((res) => { setScore(res.data.result); setLoading(false) })
        .catch(() => setLoading(false))
    }
  }, [])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">My Credit Score</h1>
        <p className="text-gray-400 mt-1">Your AI-generated credit profile</p>
      </div>

      {loading ? (
        <div className="text-center py-20"><p className="text-gray-400">Calculating your score...</p></div>
      ) : score ? (
        <div className="max-w-2xl">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 mb-6">
            <div className="text-center mb-8">
              <p className={`text-7xl font-bold ${
                score.score >= 800 ? 'text-green-400' :
                score.score >= 650 ? 'text-yellow-400' : 'text-red-400'
              }`}>{score.score}</p>
              <p className="text-gray-400 mt-2">out of 1000</p>
              <div className="w-full h-3 bg-gray-800 rounded-full mt-4 overflow-hidden">
                <div className={`h-full rounded-full transition-all ${
                  score.score >= 800 ? 'bg-green-400' :
                  score.score >= 650 ? 'bg-yellow-400' : 'bg-red-400'
                }`} style={{ width: `${(score.score / 1000) * 100}%` }} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Risk Level',         value: score.risk_level,                            color: score.risk_level === 'Low' ? 'text-green-400' : score.risk_level === 'Medium' ? 'text-yellow-400' : 'text-red-400' },
                { label: 'Total Transactions', value: score.transaction_count,                     color: 'text-white' },
                { label: 'Average Float',      value: `TZS ${(score.avg_float || 0).toLocaleString()}`, color: 'text-blue-400' },
                { label: 'Repayment Rate',     value: `${score.repayment_rate}%`,                  color: 'text-purple-400' },
              ].map((s) => (
                <div key={s.label} className="bg-gray-800/50 rounded-xl p-4">
                  <p className="text-gray-500 text-xs mb-1">{s.label}</p>
                  <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={`rounded-xl p-6 ${
            score.loan_recommendation > 0
              ? 'bg-green-500/10 border border-green-500/20'
              : 'bg-red-500/10 border border-red-500/20'
          }`}>
            <p className="text-gray-400 text-sm mb-2">Loan Eligibility</p>
            <p className={`text-3xl font-bold ${score.loan_recommendation > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {score.loan_recommendation > 0
                ? `TZS ${score.loan_recommendation.toLocaleString()}`
                : 'Not Eligible'
              }
            </p>
            <p className="text-gray-500 text-xs mt-2">
              {score.loan_recommendation > 0
                ? 'You are eligible for a micro-loan based on your transaction history'
                : 'Build more transaction history to become eligible for loans'
              }
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-500">No credit score available yet. Record more transactions to generate your score.</p>
        </div>
      )}
    </div>
  )
}