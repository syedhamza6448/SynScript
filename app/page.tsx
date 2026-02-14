import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-neo-bg">
      <h1 className="text-5xl font-black uppercase mb-6 border-b-[5px] border-neo-black pb-4">SynScript</h1>
      <p className="text-lg font-medium text-muted-foreground mb-8 text-center max-w-lg">
        Collaborative Research & Citation Engine. Build Knowledge Vaults with verified sources and cross-referenced citations.
      </p>
      <div className="flex gap-4 flex-wrap justify-center">
        <Button asChild>
          <Link href="/login">Sign In</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/vaults">View Vaults</Link>
        </Button>
      </div>
    </main>
  )
}
