import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { canReadVault } from '@/lib/auth/rbac'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id: vaultId } = await context.params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const allowed = await canReadVault(vaultId, user.id)
  if (!allowed) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { data: logs, error } = await supabase
    .from('audit_logs')
    .select('id, user_id, action, metadata, created_at')
    .eq('vault_id', vaultId)
    .order('created_at', { ascending: false })
    .limit(500)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const format = request.nextUrl.searchParams.get('format')
  if (format === 'csv') {
    const header = 'id,user_id,action,metadata,created_at\n'
    const rows = (logs ?? []).map(
      (r) =>
        `${r.id},${r.user_id ?? ''},${r.action},"${JSON.stringify(r.metadata ?? {}).replace(/"/g, '""')}",${r.created_at}`
    )
    return new NextResponse(header + rows.join('\n'), {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="audit-logs-${vaultId}.csv"`,
      },
    })
  }

  return NextResponse.json({ audit_logs: logs ?? [] })
}
