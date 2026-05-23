'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createTransaction, getAgents } from '@/lib/api'

export default function NewTransactionPage() {
  const router = useRouter()
  const [agents, setAgents] = useState<any[]>([])
  const [form, setForm] = useState({
    agent_id: '',
    transaction_type: 'cash_in',
    amount: '',
    provider: 'mpesa',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getAgents().then((res) => setAgents(res.data.agents))
  }, [])

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      const res = await createTransaction({
        ...form,
        amount: parseFloat(form.amount),
      })
      setSuccess(`Transaction ${res.data.transaction.id} recorded successfully!`)
      setForm({ agent_id: '', transaction_type: 'cash_in', amount: '', provider: 'mpesa' })
      setLoading(false)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Transaction failed')
      setLoading(false)
    }
  }

  const selectedAgent = agents.find(a => a.id === form.agent_id)

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.push('/transactions')}
          className="text-gray-400 hover:text-white transition text-sm"
        >
          ← Back to Transactions
        </button>
      </div>

      <div className="max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Record Transaction</h1>
          <p className="text-gray-400 mt-1">Record a new wakala transaction</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div className="md:col-span-2">
              <label className="text-gray-400 text-sm mb-2 block">Select Agent</label>
              <select
                value={form.agent_id}
                onChange={(e) => setForm({ ...form, agent_id: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition"
              >
                <option value="">Choose an agent...</option>
                {agents.map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.name} — {agent.id} ({agent.location})
                  </option>
                ))}
              </select>
            </div>

            {selectedAgent && (
              <div className="md:col-span-2 bg-gray-800/50 rounded-lg p-4 flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">{selectedAgent.name}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{selectedAgent.location} · {selectedAgent.provider}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-xs">Current Float Balance</p>
                  <p className="text-green-400 font-semibold">
                    TZS {selectedAgent.float_balance.toLocaleString()}
                  </p>
                </div>
              </div>
            )}

            <div>
              <label className="text-gray-400 text-sm mb-2 block">Transaction Type</label>
              <select
                value={form.transaction_type}
                onChange={(e) => setForm({ ...form, transaction_type: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition"
              >
                <option value="cash_in">Cash In</option>
                <option value="cash_out">Cash Out</option>
                <option value="transfer">Transfer</option>
                <option value="bill_payment">Bill Payment</option>
              </select>
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-2 block">Provider</label>
              <select
                value={form.provider}
                onChange={(e) => setForm({ ...form, provider: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition"
              >
                <option value="mpesa">M-Pesa</option>
                <option value="airtel">Airtel Money</option>
                <option value="tigo">Tigo Pesa</option>
                <option value="halopesa">HaloPesa</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="text-gray-400 text-sm mb-2 block">Amount (TZS)</label>
              <input
                type="number"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                placeholder="150000"
                className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-600 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition"
              />
              {form.amount && (
                <p className="text-gray-500 text-xs mt-1">
                  TZS {parseFloat(form.amount).toLocaleString()}
                </p>
              )}
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <button
              onClick={handleSubmit}
              disabled={loading || !form.agent_id || !form.amount}
              className="bg-green-500 hover:bg-green-400 disabled:bg-green-800 disabled:cursor-not-allowed text-black font-semibold px-8 py-3 rounded-lg transition text-sm"
            >
              {loading ? 'Recording...' : 'Record Transaction'}
            </button>
            <button
              onClick={() => router.push('/transactions')}
              className="border border-gray-700 hover:border-gray-500 text-gray-300 px-8 py-3 rounded-lg transition text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}