'use client'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'

const transactionData = [
  { month: 'Oct', cashIn: 42, cashOut: 35, transfers: 18 },
  { month: 'Nov', cashIn: 48, cashOut: 38, transfers: 22 },
  { month: 'Dec', cashIn: 55, cashOut: 44, transfers: 28 },
  { month: 'Jan', cashIn: 60, cashOut: 50, transfers: 30 },
  { month: 'Feb', cashIn: 58, cashOut: 47, transfers: 27 },
  { month: 'Mar', cashIn: 72, cashOut: 58, transfers: 35 },
  { month: 'Apr', cashIn: 80, cashOut: 63, transfers: 40 },
]

const agentGrowthData = [
  { month: 'Oct', agents: 820  },
  { month: 'Nov', agents: 890  },
  { month: 'Dec', agents: 950  },
  { month: 'Jan', agents: 1050 },
  { month: 'Feb', agents: 1120 },
  { month: 'Mar', agents: 1200 },
  { month: 'Apr', agents: 1284 },
]

const providerData = [
  { name: 'M-Pesa',    value: 45, color: '#22c55e' },
  { name: 'Airtel',    value: 28, color: '#3b82f6' },
  { name: 'Tigo Pesa', value: 18, color: '#a855f7' },
  { name: 'HaloPesa',  value: 9,  color: '#f59e0b' },
]

const creditData = [
  { range: '800-1000', count: 320, label: 'Excellent' },
  { range: '650-799',  count: 480, label: 'Good'      },
  { range: '500-649',  count: 290, label: 'Fair'      },
  { range: '0-499',    count: 194, label: 'Poor'      },
]

export default function AnalyticsPage() {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics Dashboard</h1>
          <p className="text-gray-400 mt-1">Platform performance and financial insights</p>
        </div>
        <select className="bg-gray-900 border border-gray-800 text-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-500 transition">
          <option>Last 7 months</option>
          <option>Last 30 days</option>
          <option>Last year</option>
        </select>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Volume',    value: 'TZS 2.4B', change: '+18%', up: true  },
          { label: 'Active Agents',   value: '1,284',    change: '+12%', up: true  },
          { label: 'Loans Disbursed', value: 'TZS 45M',  change: '+22%', up: true  },
          { label: 'Fraud Rate',      value: '0.08%',    change: '-31%', up: false },
        ].map((k) => (
          <div key={k.label} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="text-gray-400 text-sm mb-1">{k.label}</p>
            <p className="text-2xl font-bold text-white">{k.value}</p>
            <p className={`text-xs mt-2 font-medium ${k.up ? 'text-green-400' : 'text-red-400'}`}>
              {k.change} vs last period
            </p>
          </div>
        ))}
      </div>

      {/* Transaction volume chart */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
        <h2 className="text-white font-semibold mb-1">Transaction Volume (Millions TZS)</h2>
        <p className="text-gray-500 text-xs mb-6">Monthly breakdown by transaction type</p>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={transactionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="month" stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 12 }} />
            <YAxis stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 12 }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }}
              labelStyle={{ color: '#fff' }}
            />
            <Legend />
            <Line type="monotone" dataKey="cashIn"    stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e' }}    name="Cash In"   />
            <Line type="monotone" dataKey="cashOut"   stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }}    name="Cash Out"  />
            <Line type="monotone" dataKey="transfers" stroke="#a855f7" strokeWidth={2} dot={{ fill: '#a855f7' }}    name="Transfers" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom row — 3 charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Agent growth */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-white font-semibold mb-1">Agent Growth</h2>
          <p className="text-gray-500 text-xs mb-6">Total registered agents per month</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={agentGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="month" stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 11 }} />
              <YAxis stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#fff' }}
              />
              <Bar dataKey="agents" fill="#22c55e" radius={[4, 4, 0, 0]} name="Agents" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Provider share */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-white font-semibold mb-1">Provider Share</h2>
          <p className="text-gray-500 text-xs mb-4">Transaction volume by provider</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={providerData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {providerData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }}
                formatter={(value) => [`${value}%`, 'Share']}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {providerData.map((p) => (
              <div key={p.name} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                <span className="text-gray-400 text-xs">{p.name}</span>
                <span className="text-white text-xs font-medium ml-auto">{p.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Credit score distribution */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-white font-semibold mb-1">Credit Distribution</h2>
          <p className="text-gray-500 text-xs mb-6">Agents by credit score range</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={creditData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis type="number" stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 11 }} />
              <YAxis type="category" dataKey="range" stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 11 }} width={70} />
              <Tooltip
                contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#fff' }}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]} name="Agents">
                {creditData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={
                      index === 0 ? '#22c55e' :
                      index === 1 ? '#f59e0b' :
                      index === 2 ? '#f97316' :
                      '#ef4444'
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  )
}