'use client'
import { useEffect, useState } from 'react'
import { getLoans, approveLoan, rejectLoan } from '@/lib/api'

export default function LoansPage() {
  const [loans, setLoans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchLoans = () => {
    getLoans()
      .then((res) => { setLoans(res.data.loans); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { fetchLoans() }, [])

  const handleApprove = async (id: string) => { await approveLoan(id); fetchLoans() }
  const handleReject = async (id: string) => { await rejectLoan(id); fetchLoans() }
  const getProgress = (repaid: number, total: number) => Math.round((repaid / total) * 100)

  const pendingLoans = loans.filter(l => l.status === 'pending')
  const activeLoans = loans.filter(l => l.status === 'active')
  const overdueLoans = loans.filter(l => l.status === 'overdue')
  const totalDisbursed = loans.filter(l => l.status !== 'pending' && l.status !== 'rejected').reduce((sum, l) => sum + l.amount, 0)

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
          <h1 className="text-2xl font-bold text-white">Micro-Loan Management</h1>
          <p className="text-gray-400 mt-1">Track loan disbursements, repayments and eligibility</p>
        </div>
        <button className="bg-green-500 hover:bg-green-400 text-black font-semibold px-5 py-2.5 rounded-lg transition text-sm">
          + New Loan Application
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Disbursed', value: `TZS ${totalDisbursed.toLocaleString()}`, color: 'text-white'      },
          { label: 'Active Loans',    value: activeLoans.length,                       color: 'text-green-400'  },
          { label: 'Pending Review',  value: pendingLoans.length,                      color: 'text-yellow-400' },
          { label: 'Overdue',         value: overdueLoans.length,                      color: 'text-red-400'    },
        ].map((s) => (
          <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="text-gray-400 text-sm mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {pendingLoans.length > 0 && (
        <div className="bg-gray-900 border border-yellow-500/20 rounded-xl p-6 mb-8">
          <h2 className="text-white font-semibold mb-4">Pending Approvals</h2>
          {pendingLoans.map((loan) => (
            <div key={loan.id} className="flex items-center justify-between bg-gray-800/50 rounded-lg p-4 mb-2">
              <div>
                <p className="text-white font-medium">{loan.agent_name}</p>
                <p className="text-gray-500 text-xs">{loan.agent_id} · {loan.duration_months} months · {loan.interest_rate}% interest</p>
              </div>
              <p className="text-white font-semibold">TZS {loan.amount.toLocaleString()}</p>
              <div className="flex gap-2">
                <button onClick={() => handleApprove(loan.id)} className="bg-green-500 hover:bg-green-400 text-black text-xs font-semibold px-4 py-2 rounded-lg transition">Approve</button>
                <button onClick={() => handleReject(loan.id)} className="bg-red-500/10 text-red-400 text-xs font-semibold px-4 py-2 rounded-lg border border-red-500/20 transition">Reject</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800">
          <h2 className="text-white font-semibold">All Loans</h2>
        </div>
        {loading ? (
          <div className="text-center py-12"><p className="text-gray-500">Loading loans...</p></div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 border-b border-gray-800 bg-gray-800/50">
                <th className="text-left px-6 py-4">Loan ID</th>
                <th className="text-left px-6 py-4">Agent</th>
                <th className="text-left px-6 py-4">Amount</th>
                <th className="text-left px-6 py-4">Repayment</th>
                <th className="text-left px-6 py-4">Rate</th>
                <th className="text-left px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              {loans.map((loan) => (
                <tr key={loan.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition">
                  <td className="px-6 py-4 text-green-400 font-mono text-xs">{loan.id}</td>
                  <td className="px-6 py-4">
                    <p className="text-white font-medium">{loan.agent_name}</p>
                    <p className="text-gray-500 text-xs">{loan.agent_id}</p>
                  </td>
                  <td className="px-6 py-4 font-semibold text-white">TZS {loan.amount.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-green-400" style={{ width: `${getProgress(loan.amount_repaid, loan.amount)}%` }} />
                      </div>
                      <span className="text-xs text-gray-400">{getProgress(loan.amount_repaid, loan.amount)}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{loan.interest_rate}%</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(loan.status)}`}>{loan.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && loans.length === 0 && (
          <div className="text-center py-12"><p className="text-gray-500">No loans yet.</p></div>
        )}
      </div>
    </div>
  )
}