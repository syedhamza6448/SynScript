import { NeoLoader } from '@/components/neo-loader'

export default function RootLoading() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center p-8">
      <NeoLoader message="Loading…" />
    </div>
  )
}
