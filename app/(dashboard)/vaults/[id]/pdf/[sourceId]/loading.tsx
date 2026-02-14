import { NeoLoader } from '@/components/neo-loader'

export default function PdfLoading() {
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="border-[4px] border-neo-black bg-card shadow-neo-md p-8">
        <NeoLoader message="Loading PDF…" />
      </div>
    </div>
  )
}
