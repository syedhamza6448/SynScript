import { NeoLoader } from '@/components/neo-loader'

export default function VaultPageLoading() {
  return (
    <div className="container mx-auto py-6 sm:py-8 px-3 sm:px-4 md:px-6">
      <div className="animate-pulse mb-8">
        <div className="h-8 sm:h-10 w-3/4 max-w-md bg-muted rounded border-l-4 border-neo-cyan" />
        <div className="h-4 w-1/2 mt-2 bg-muted rounded" />
      </div>
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-[1fr,280px]">
        <div className="border-[4px] border-neo-black bg-card shadow-neo-md p-8 min-h-[300px] flex items-center justify-center">
          <NeoLoader message="Loading vault…" />
        </div>
        <div className="border-[4px] border-neo-black bg-card shadow-neo-md p-6 min-h-[200px]" />
      </div>
    </div>
  )
}
