'use client'

import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FolderOpen } from 'lucide-react'

interface Vault {
  id: string
  name: string
  description: string | null
  created_at: string
}

export function VaultList({ vaults }: { vaults: Vault[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {vaults.map((vault) => (
        <Link key={vault.id} href={`/vaults/${vault.id}`}>
          <Card className="hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-neo-xl transition-all cursor-pointer h-full">
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div className="space-y-1.5">
                <CardTitle className="flex items-center gap-2">
                  <FolderOpen className="h-5 w-5" />
                  {vault.name}
                </CardTitle>
                {vault.description && (
                  <CardDescription className="line-clamp-2">
                    {vault.description}
                  </CardDescription>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" size="sm" asChild>
                <span>Open vault</span>
              </Button>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
