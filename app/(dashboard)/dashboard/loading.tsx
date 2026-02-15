import { NeoLoader } from '@/components/neo-loader'

export default function DashboardLoading() {
  return (
    <div className="container mx-auto py-12 px-4 flex justify-center min-h-[40vh]">
      <NeoLoader message="Loading dashboard…" />
    </div>
  )
}
