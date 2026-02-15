'use client'

interface Log {
  id: string
  user_id: string | null
  action: string
  metadata: Record<string, unknown>
  created_at: string
}

export function AuditLogTable({ logs }: { logs: Log[] }) {
  if (logs.length === 0) {
    return (
      <div className="border-[4px] border-neo-black bg-card p-8 text-center text-muted-foreground font-medium">
        No audit logs yet.
      </div>
    )
  }

  return (
    <div className="border-[4px] border-neo-black bg-card overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b-2 border-neo-black bg-secondary/50">
            <th className="p-3 font-black uppercase">Time</th>
            <th className="p-3 font-black uppercase">Action</th>
            <th className="p-3 font-black uppercase">User ID</th>
            <th className="p-3 font-black uppercase">Details</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id} className="border-b border-neo-black/20 hover:bg-secondary/30">
              <td className="p-3 font-medium">
                {new Date(log.created_at).toLocaleString()}
              </td>
              <td className="p-3 font-bold">{log.action}</td>
              <td className="p-3 font-mono text-xs truncate max-w-[120px]" title={log.user_id ?? ''}>
                {log.user_id ?? '—'}
              </td>
              <td className="p-3">
                <pre className="text-xs bg-muted/50 p-2 rounded overflow-x-auto max-w-md">
                  {JSON.stringify(log.metadata || {})}
                </pre>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
