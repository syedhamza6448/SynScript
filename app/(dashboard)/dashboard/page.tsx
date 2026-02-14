import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { DashboardContent } from '@/components/dashboard-content'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: memberships } = await supabase
    .from('vault_members')
    .select(`
      role,
      vaults (
        id,
        name,
        description,
        created_at,
        owner_id
      )
    `)
    .eq('user_id', user.id)
    .order('joined_at', { ascending: false })

  const vaults = (memberships ?? [])
    .map((m: { role: string; vaults: { id: string; name: string; description: string | null; created_at: string; owner_id: string } | null }) =>
      m.vaults ? { ...m.vaults, role: m.role } : null
    )
    .filter(Boolean) as { id: string; name: string; description: string | null; created_at: string; owner_id: string; role: string }[]

  const ownedVaultIds = vaults.filter((v) => v.role === 'owner').map((v) => v.id)
  let sourcesCount: { vault_id: string; count: number }[] = []
  let membersCount: { vault_id: string; count: number }[] = []

  if (ownedVaultIds.length > 0) {
    const { data: sources } = await supabase
      .from('sources')
      .select('vault_id')
      .in('vault_id', ownedVaultIds)
    const byVault = (sources ?? []).reduce<Record<string, number>>((acc, s) => {
      acc[s.vault_id] = (acc[s.vault_id] ?? 0) + 1
      return acc
    }, {})
    sourcesCount = ownedVaultIds.map((id) => ({ vault_id: id, count: byVault[id] ?? 0 }))

    const { data: members } = await supabase
      .from('vault_members')
      .select('vault_id')
      .in('vault_id', ownedVaultIds)
    const membersByVault = (members ?? []).reduce<Record<string, number>>((acc, m) => {
      acc[m.vault_id] = (acc[m.vault_id] ?? 0) + 1
      return acc
    }, {})
    membersCount = ownedVaultIds.map((id) => ({ vault_id: id, count: membersByVault[id] ?? 0 }))
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-black uppercase border-b-[5px] border-neo-cyan pb-3 inline-block">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-2 font-medium">
          Overview of your vaults and activity
        </p>
      </div>
      <DashboardContent
        vaults={vaults}
        sourcesCount={sourcesCount}
        membersCount={membersCount}
        isOwner={ownedVaultIds.length > 0}
      />
    </div>
  )
}
