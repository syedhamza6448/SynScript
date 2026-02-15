import { NeoLoader } from '@/components/neo-loader'

export default function AuthLoading() {
  return (
    <div className="min-h-[40vh] flex items-center justify-center p-8">
      <NeoLoader message="Loading…" />
    </div>
  )
}
