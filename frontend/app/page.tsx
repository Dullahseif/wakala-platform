export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-6">
      <div className="max-w-3xl text-center">
        <div className="mb-6 inline-block bg-green-500/10 border border-green-500/30 text-green-400 text-sm px-4 py-1 rounded-full">
          Tanzania FinTech Platform
        </div>
        <h1 className="text-5xl font-bold mb-6 leading-tight">
          Wakala Ledger & <span className="text-green-400">AI Credit</span> Scoring Platform
        </h1>
        <p className="text-gray-400 text-lg mb-10">
          Empowering mobile money agents across Tanzania with digital transaction records, AI-based credit scores, and micro-loan access.
        </p>
        <div className="flex gap-4 justify-center">
          <a href="/dashboard" className="bg-green-500 hover:bg-green-400 text-black font-semibold px-6 py-3 rounded-lg transition">
            Go to Dashboard
          </a>
          <a href="/agents" className="border border-gray-700 hover:border-gray-500 text-gray-300 px-6 py-3 rounded-lg transition">
            Agent Portal
          </a>
        </div>
      </div>
    </main>
  )
}