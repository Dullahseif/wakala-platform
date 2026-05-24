'use client'
import { useEffect, useState } from 'react'
import { getLoans, approveLoan, rejectLoan } from '@/lib/api'

export default function OfficerLoansPage() {
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

  const getStatusBadge = (status: string) => {
    if (status === 'active') return 'bg-green-500/10 text-green-400'
    if (status === 'completed') return 'bg-blue-500/10 text-blue-400'
    if (status === 'pending') return 'bg-yellow-500/10 text-yellow-400'
    if (status === 'rejected') return 'bg-gray-500/10 text-gray-400'
    return 'bg-red-500/10 text-red-400'
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Loan Applications</h1>
        <p className="text-gray-400 mt-1">Review and approve loan applications</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading loans...</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 border-b border-gray-800 bg-gray-800/50">
                <th className="text-left px-6 py-4">Loan ID</th>
                <th className="text-left px-6 py-4">Agent</th>
                <th className="text-left px-6 py-4">Amount</th>
                <th className="text-left px-6 py-4">Duration</th>
                <th className="text-left px-6 py-4">Rate</th>
                <th className="text-left px-6 py-4">Status</th>
                <th className="text-left px-6 py-4">Action</th>
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
                  <td className="px-6 py-4">{loan.duration_months} months</td>
                  <td className="px-6 py-4">{loan.interest_rate}%</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(loan.status)}`}>
                      {loan.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {loan.status === 'pending' && (
                      <div className="flex gap-2">
                        <button onClick={() => handleApprove(loan.id)} className="bg-green-500 hover:bg-green-400 text-black text-xs font-semibold px-3 py-1 rounded transition">
                          Approve
                        </button>
                        <button onClick={() => handleReject(loan.id)} className="bg-red-500/10 text-red-400 text-xs px-3 py-1 rounded border border-red-500/20 transition">
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && loans.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No loan applications yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}