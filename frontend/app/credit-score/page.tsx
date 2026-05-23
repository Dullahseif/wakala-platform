export default function CreditScorePage() {
  const agents = [
    { id: 'WK-001', name: 'Juma Ally',    score: 820, risk: 'Low',    transactions: 1240, avgFloat: 850000,  repayment: 98, recommendation: 'TZS 2,000,000' },
    { id: 'WK-002', name: 'Fatuma Said',  score: 760, risk: 'Low',    transactions: 980,  avgFloat: 620000,  repayment: 95, recommendation: 'TZS 1,500,000' },
    { id: 'WK-003', name: 'Hassan Mwita', score: 640, risk: 'Medium', transactions: 540,  avgFloat: 310000,  repayment: 78, recommendation: 'TZS 500,000'   },
    { id: 'WK-004', name: 'Amina Yusuf',  score: 890, risk: 'Low',    transactions: 1850, avgFloat: 1200000, repayment: 99, recommendation: 'TZS 3,000,000' },
    { id: 'WK-005', name: 'Omar Rashid',  score: 510, risk: 'High',   transactions: 320,  avgFloat: 120000,  repayment: 60, recommendation: 'Not Eligible'  },
    { id: 'WK-006', name: 'Zainab Hamid', score: 730, risk: 'Low',    transactions: 870,  avgFloat: 540000,  repayment: 92, recommendation: 'TZS 1,200,000' },
    { id: 'WK-007', name: 'Bakari Juma',  score: 680, risk: 'Medium', transactions: 710,  avgFloat: 480000,  repayment: 85, recommendation: 'TZS 800,000'   },
  ]

  const getScoreColor = (score: number) => {
    if (score >= 800) return 'text-green-400'
    if (score >= 650) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getScoreBg = (score: number) => {
    if (score >= 800) return 'bg-green-400'
    if (score >= 650) return 'bg-yellow-400'
    return 'bg-red-400'
  }

  const getRiskBadge = (risk: string) => {
    if (risk === 'Low')    return 'bg-green-500/10 text-green-400'
    if (risk === 'Medium') return 'bg-yellow-500/10 text-yellow-400'
    return 'bg-red-500/10 text-red-400'
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">AI Credit Scores</h1>
          <p className="text-gray-400 mt-1">Machine learning based credit scoring for all agents</p>
        </div>
        <button className="bg-green-500 hover:bg-green-400 text-black font-semibold px-5 py-2.5 rounded-lg transition text-sm">
          ↻ Recalculate All
        </button>
      </div>

      {/* Score range legend */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-8">
        <p className="text-gray-400 text-sm mb-4 font-medium">Score Range Guide</p>
        <div className="flex gap-8">
          {[
            { range: '800 – 1000', label: 'Excellent',  color: 'bg-green-400',  text: 'text-green-400'  },
            { range: '650 – 799',  label: 'Good',       color: 'bg-yellow-400', text: 'text-yellow-400' },
            { range: '500 – 649',  label: 'Fair',       color: 'bg-orange-400', text: 'text-orange-400' },
            { range: '0 – 499',    label: 'Poor',       color: 'bg-red-400',    text: 'text-red-400'    },
          ].map((r) => (
            <div key={r.range} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${r.color}`} />
              <span className={`text-sm font-medium ${r.text}`}>{r.label}</span>
              <span className="text-gray-500 text-xs">{r.range}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Score cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {agents.slice(0, 3).map((agent) => (
          <div key={agent.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            {/* Agent info */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white font-semibold">{agent.name}</p>
                <p className="text-gray-500 text-xs">{agent.id}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskBadge(agent.risk)}`}>
                {agent.risk} Risk
              </span>
            </div>

            {/* Score circle */}
            <div className="flex items-center gap-4 mb-4">
              <div className={`text-4xl font-bold ${getScoreColor(agent.score)}`}>
                {agent.score}
              </div>
              <div className="flex-1">
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${getScoreBg(agent.score)}`}
                    style={{ width: `${(agent.score / 1000) * 100}%` }}
                  />
                </div>
                <p className="text-gray-500 text-xs mt-1">out of 1000</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                <p className="text-white font-semibold text-sm">{agent.transactions.toLocaleString()}</p>
                <p className="text-gray-500 text-xs mt-0.5">Transactions</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                <p className="text-white font-semibold text-sm">{agent.repayment}%</p>
                <p className="text-gray-500 text-xs mt-0.5">Repayment</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                <p className="text-white font-semibold text-sm">
                  {(agent.avgFloat / 1000).toFixed(0)}K
                </p>
                <p className="text-gray-500 text-xs mt-0.5">Avg Float</p>
              </div>
            </div>

            {/* Loan recommendation */}
            <div className={`rounded-lg p-3 ${
              agent.recommendation === 'Not Eligible'
                ? 'bg-red-500/10 border border-red-500/20'
                : 'bg-green-500/10 border border-green-500/20'
            }`}>
              <p className="text-gray-400 text-xs mb-1">Loan Recommendation</p>
              <p className={`font-semibold text-sm ${
                agent.recommendation === 'Not Eligible' ? 'text-red-400' : 'text-green-400'
              }`}>
                {agent.recommendation}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Full scores table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800">
          <h2 className="text-white font-semibold">All Agent Scores</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-500 border-b border-gray-800 bg-gray-800/50">
              <th className="text-left px-6 py-4">Agent</th>
              <th className="text-left px-6 py-4">Credit Score</th>
              <th className="text-left px-6 py-4">Risk Level</th>
              <th className="text-left px-6 py-4">Transactions</th>
              <th className="text-left px-6 py-4">Avg Float</th>
              <th className="text-left px-6 py-4">Repayment %</th>
              <th className="text-left px-6 py-4">Loan Limit</th>
            </tr>
          </thead>
          <tbody className="text-gray-300">
            {agents.map((agent) => (
              <tr key={agent.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition">
                <td className="px-6 py-4">
                  <p className="text-white font-medium">{agent.name}</p>
                  <p className="text-gray-500 text-xs">{agent.id}</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className={`font-bold text-lg ${getScoreColor(agent.score)}`}>
                      {agent.score}
                    </span>
                    <div className="w-20 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${getScoreBg(agent.score)}`}
                        style={{ width: `${(agent.score / 1000) * 100}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskBadge(agent.risk)}`}>
                    {agent.risk}
                  </span>
                </td>
                <td className="px-6 py-4">{agent.transactions.toLocaleString()}</td>
                <td className="px-6 py-4">TZS {agent.avgFloat.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span>{agent.repayment}%</span>
                    <div className="w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-blue-400"
                        style={{ width: `${agent.repayment}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`font-medium text-sm ${
                    agent.recommendation === 'Not Eligible' ? 'text-red-400' : 'text-green-400'
                  }`}>
                    {agent.recommendation}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}