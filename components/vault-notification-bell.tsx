'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { NeoLoader } from '@/components/neo-loader'

const VAULT_ID_REGEX = /^\/vaults\/([a-f0-9-]+)(?:\/|$)/i

interface AuditEntry {
  id: string
  action: string
  metadata: Record<string, unknown>
  created_at: string
  user_id: string | null
}

export function VaultNotificationBell() {
  const pathname = usePathname()
  const match = pathname?.match(VAULT_ID_REGEX)
  const vaultId = match?.[1] ?? null

  const [open, setOpen] = useState(false)
  const [logs, setLogs] = useState<AuditEntry[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open || !vaultId) return
    setLoading(true)
    fetch(`/api/vaults/${vaultId}/audit-logs`)
      .then((res) => (res.ok ? res.json() : { audit_logs: [] }))
      .then((data) => {
        setLogs((data.audit_logs ?? []).slice(0, 20))
      })
      .catch(() => setLogs([]))
      .finally(() => setLoading(false))
  }, [open, vaultId])

  if (!vaultId) return null

  const actionLabel: Record<string, string> = {
    vault_created: 'Vault created',
    source_added: 'Source added',
    source_updated: 'Source updated',
    source_deleted: 'Source deleted',
    sources_bulk_deleted: 'Sources deleted',
    member_added: 'Collaborator added',
    member_removed: 'Collaborator removed',
    member_role_updated: 'Role updated',
    file_uploaded: 'File uploaded',
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="relative h-9 w-9 shrink-0" aria-label="Recent changes">
          <Bell className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-lg font-black uppercase">Recent changes</DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto flex-1 min-h-0 -mx-1 px-1">
          {loading ? (
            <NeoLoader message="Loading activity…" />
          ) : logs.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">No recent activity.</p>
          ) : (
            <ul className="space-y-2">
              {logs.map((log) => (
                <li
                  key={log.id}
                  className="text-sm py-2 px-3 border-[2px] border-neo-black bg-secondary/50"
                >
                  <span className="font-bold">{actionLabel[log.action] ?? log.action}</span>
                  <span className="text-muted-foreground ml-1">
                    {new Date(log.created_at).toLocaleString()}
                  </span>
                  {Object.keys(log.metadata ?? {}).length > 0 && (
                    <pre className="text-xs mt-1 truncate max-w-full" title={JSON.stringify(log.metadata)}>
                      {JSON.stringify(log.metadata)}
                    </pre>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
