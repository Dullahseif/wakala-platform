'use client'
import { useEffect, useState } from 'react'
import { getLoans, createLoan, getCreditScores } from '@/lib/api'

export default function AgentLoansPage() {
  const [loans, setLoans] = useState<any[]>([])
  const [score, setScore] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    amount: '',
    interest_rate: '9',
    duration_months: '6',
  })

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      const u = JSON.parse(stored)
      setUser(u)
      Promise.all([
        getLoans(),
        getCreditScores(),
      ]).then(([l, s]) => {
        const myLoans = l.data.loans.filter((loan: any) => loan.agent_id === (u.agent_id || u.id))
        setLoans(myLoans)
        const myScore = s.data.scores.find((sc: any) => sc.agent_id === (u.agent_id || u.id))
        setScore(myScore)
        setLoading(false)
      }).catch(() => setLoading(false))
    }
  }, [])

  const handleApply = async () => {
    setApplying(true)
    setError('')
    setSuccess('')
    try {
      await createLoan({
        agent_id: user.agent_id || user.id,
        amount: parseFloat(form.amount),
        interest_rate: parseFloat(form.interest_rate),
        duration_months: parseInt(form.duration_months),
      })
      setSuccess('Loan application submitted successfully!')
      setShowForm(false)
      setApplying(false)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Application failed')
      setApplying(false)
    }
  }

  const getStatusBadge = (status: string) => {
    if (status === 'active') return 'bg-green-500/10 text-green-400'
    if (status === 'completed') return 'bg-blue-500/10 text-blue-400'
    if (status === 'pending') return 'bg-yellow-500/10 text-yellow-400'
    if (status === 'rejected') return 'bg-gray-500/10 text-gray-400'
    return 'bg-red-500/10 text-red-400'
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">My Loans</h1>
          <p className="text-gray-400 mt-1">Manage your loan applications and repayments</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-500 hover:bg-green-400 text-black font-semibold px-5 py-2.5 rounded-lg transition text-sm"
        >
          + Apply for Loan
        </button>
      </div>

      {success && (
        <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm px-4 py-3 rounded-lg mb-6">
          {success}
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {score && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-8">
          <p className="text-gray-400 text-sm mb-3">Your Credit Profile</p>
          <div className="flex items-center gap-8">
            <div>
              <p className={`text-3xl font-bold ${
                score.score >= 800 ? 'text-green-400' :
                score.score >= 650 ? 'text-yellow-400' : 'text-red-400'
              }`}>{score.score}</p>
              <p className="text-gray-500 text-xs mt-1">Credit Score</p>
            </div>
            <div>
              <p className={`text-lg font-bold ${
                score.risk_level === 'Low' ? 'text-green-400' :
                score.risk_level === 'Medium' ? 'text-yellow-400' : 'text-red-400'
              }`}>{score.risk_level}</p>
              <p className="text-gray-500 text-xs mt-1">Risk Level</p>
            </div>
            <div>
              <p className="text-lg font-bold text-green-400">
                TZS {(score.loan_recommendation || 0).toLocaleString()}
              </p>
              <p className="text-gray-500 text-xs mt-1">Max Loan Limit</p>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="bg-gray-900 border border-green-500/20 rounded-xl p-6 mb-8">
          <h2 className="text-white font-semibold mb-6">New Loan Application</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Loan Amount (TZS)</label>
              <input
                type="number"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                placeholder="500000"
                className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-600 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Interest Rate (%)</label>
              <select
                value={form.interest_rate}
                onChange={(e) => setForm({ ...form, interest_rate: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition"
              >
                <option value="7">7%</option>
                <option value="8">8%</option>
                <option value="9">9%</option>
                <option value="10">10%</option>
                <option value="12">12%</option>
              </select>
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Duration</label>
              <select
                value={form.duration_months}
                onChange={(e) => setForm({ ...form, duration_months: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition"
              >
                <option value="3">3 months</option>
                <option value="6">6 months</option>
                <option value="9">9 months</option>
                <option value="12">12 months</option>
              </select>
            </div>
          </div>
          <div className="flex gap-4 mt-6">
            <button
              onClick={handleApply}
              disabled={applying || !form.amount}
              className="bg-green-500 hover:bg-green-400 disabled:bg-green-800 text-black font-semibold px-6 py-2.5 rounded-lg transition text-sm"
            >
              {applying ? 'Submitting...' : 'Submit Application'}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="border border-gray-700 text-gray-300 px-6 py-2.5 rounded-lg transition text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800">
          <h2 className="text-white font-semibold">My Loan History</h2>
        </div>
        {loading ? (
          <div className="text-center py-12"><p className="text-gray-500">Loading...</p></div>
        ) : loans.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No loans yet. Apply for your first loan!</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 border-b border-gray-800 bg-gray-800/50">
                <th className="text-left px-6 py-4">Loan ID</th>
                <th className="text-left px-6 py-4">Amount</th>
                <th className="text-left px-6 py-4">Repaid</th>
                <th className="text-left px-6 py-4">Rate</th>
                <th className="text-left px-6 py-4">Duration</th>
                <th className="text-left px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              {loans.map((loan) => (
                <tr key={loan.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition">
                  <td className="px-6 py-4 text-green-400 font-mono text-xs">{loan.id}</td>
                  <td className="px-6 py-4 font-semibold text-white">TZS {loan.amount.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-green-400" style={{ width: `${Math.round((loan.amount_repaid / loan.amount) * 100)}%` }} />
                      </div>
                      <span className="text-xs text-gray-400">{Math.round((loan.amount_repaid / loan.amount) * 100)}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{loan.interest_rate}%</td>
                  <td className="px-6 py-4">{loan.duration_months} months</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(loan.status)}`}>
                      {loan.status}
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