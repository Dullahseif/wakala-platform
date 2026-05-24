<div>
  <label className="text-gray-400 text-sm mb-2 block">Role</label>
  <select
    value={form.role}
    onChange={(e) => setForm({ ...form, role: e.target.value })}
    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition"
  >
    <option value="admin">Admin</option>
    <option value="agent">Wakala Agent</option>
    <option value="loan_officer">Loan Officer</option>
    <option value="analyst">Analyst</option>
  </select>
</div>