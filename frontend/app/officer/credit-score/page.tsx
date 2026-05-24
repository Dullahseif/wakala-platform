'use client'
import { useEffect, useState } from 'react'
import { getCreditScores } from '@/lib/api'

export default function OfficerCreditScorePage() {
  const [scores, setScores] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCreditScores()
      .then((res) => { setScores(res.data.scores); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Credit Score Analysis</h1>
        <p className="text-gray-400 mt-1">Evaluate agent creditworthiness</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: 'Excellent (800+)', value: scores.filter(s => s.score >= 800).length,               color: 'text-green-400'  },
          { label: 'Good (650-799)',   value: scores.filter(s => s.score >= 650 && s.score < 800).length, color: 'text-yellow-400' },
          { label: 'High Risk',        value: scores.filter(s => s.risk_level === 'High').length,       color: 'text-red-400'    },
        ].map((s) => (
          <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="text-gray-400 text-sm mb-1">{s.label}</p>
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800">
          <h2 className="text-white font-semibold">All Credit Scores</h2>
        </div>
        {loading ? (
          <div className="text-center py-12"><p className="text-gray-500">Loading...</p></div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 border-b border-gray-800 bg-gray-800/50">
                <th className="text-left px-6 py-4">Agent ID</th>
                <th className="text-left px-6 py-4">Score</th>
                <th className="text-left px-6 py-4">Risk Level</th>
                <th className="text-left px-6 py-4">Transactions</th>
                <th className="text-left px-6 py-4">Avg Float</th>
                <th className="text-left px-6 py-4">Loan Limit</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              {scores.map((score: any) => (
                <tr key={score.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition">
                  <td className="px-6 py-4 text-green-400 font-mono text-xs">{score.agent_id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold text-lg ${
                        score.score >= 800 ? 'text-green-400' :
                        score.score >= 650 ? 'text-yellow-400' : 'text-red-400'
                      }`}>{score.score}</span>
                      <div className="w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${
                          score.score >= 800 ? 'bg-green-400' :
                          score.score >= 650 ? 'bg-yellow-400' : 'bg-red-400'
                        }`} style={{ width: `${(score.score / 1000) * 100}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      score.risk_level === 'Low'    ? 'bg-green-500/10 text-green-400' :
                      score.risk_level === 'Medium' ? 'bg-yellow-500/10 text-yellow-400' :
                      'bg-red-500/10 text-red-400'
                    }`}>{score.risk_level}</span>
                  </td>
                  <td className="px-6 py-4">{score.transaction_count}</td>
                  <td className="px-6 py-4">TZS {(score.avg_float || 0).toLocaleString()}</td>
                  <td className="px-6 py-4 text-green-400 font-medium">
                    TZS {(score.loan_recommendation || 0).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && scores.length === 0 && (
          <div className="text-center py-12"><p className="text-gray-500">No scores yet.</p></div>
        )}
      </div>
    </div>
  )
}