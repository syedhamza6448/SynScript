import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-4">SynScript</h1>
      <p className="text-lg text-muted-foreground mb-8 text-center max-w-lg">
        Collaborative Research & Citation Engine. Build Knowledge Vaults with verified sources and cross-referenced citations.
      </p>
      <div className="flex gap-4">
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
