import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { VaultList } from '@/components/vault-list'
import { CreateVaultDialog } from '@/components/create-vault-dialog'

export default async function VaultsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: vaults } = await supabase
    .from('vault_members')
    .select(`
      role,
      vaults (
        id,
        name,
        description,
        created_at
      )
    `)
    .eq('user_id', user.id)
    .order('joined_at', { ascending: false })

  const vaultList = (vaults ?? [])
    .map((m: { vaults: unknown }) => m.vaults)
    .filter(Boolean) as { id: string; name: string; description: string | null; created_at: string }[]

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-black uppercase border-b-[5px] border-neo-black pb-3 inline-block">Knowledge Vaults</h1>
          <p className="text-muted-foreground mt-2 font-medium">
            Your shared research repositories
          </p>
        </div>
        <CreateVaultDialog />
      </div>

      {vaultList.length === 0 ? (
        <Card className="shadow-neo-lg">
          <CardHeader>
            <CardTitle>No vaults yet</CardTitle>
            <CardDescription>
              Create your first Knowledge Vault to start collecting and sharing research.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreateVaultDialog />
          </CardContent>
        </Card>
      ) : (
        <VaultList vaults={vaultList} />
      )}
    </div>
  )
}
