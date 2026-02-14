import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BackgroundGrid } from '@/components/background-grid'
import { ThemeToggle } from '@/components/theme-toggle'

export default function Home() {
  return (
    <BackgroundGrid>
    <main className="min-h-screen flex flex-col items-center justify-center p-8 relative z-10">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>
      <h1 className="text-5xl font-black uppercase mb-6 border-b-[5px] border-neo-black dark:border-neo-black pb-4">SynScript</h1>
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
    </BackgroundGrid>
  )
}
