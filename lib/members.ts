import { createServiceClient } from '@/lib/supabase/server'

export type MemberWithEmail = {
  id: string
  role: string
  user_id: string
  email: string | null
}

export async function getMembersWithEmails(
  members: { id: string; role: string; user_id: string }[]
): Promise<MemberWithEmail[]> {
  if (members.length === 0) return []

  const admin = createServiceClient()
  const result: MemberWithEmail[] = []

  for (const m of members) {
    try {
      const { data } = await admin.auth.admin.getUserById(m.user_id)
      result.push({
        ...m,
        email: data?.user?.email ?? null,
      })
    } catch {
      result.push({ ...m, email: null })
    }
  }
  return result
}
