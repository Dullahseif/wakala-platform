import Sidebar from '@/components/Sidebar'
import AuthGuard from '@/components/AuthGuard'

export default function AgentsLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-gray-950">
        <Sidebar />
        <main className="flex-1 p-8 overflow-auto">{children}</main>
      </div>
    </AuthGuard>
  )
}