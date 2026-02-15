'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MessageSquare, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getOrCreateThreadForSource, getCommentsForThread, addComment } from '@/app/actions/comments'

interface Comment {
  id: string
  user_id: string
  body: string
  created_at: string
}

export function SourceDiscussion({
  vaultId,
  sourceId,
  canEdit,
}: {
  vaultId: string
  sourceId: string
  canEdit: boolean
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [threadId, setThreadId] = useState<string | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(false)
  const [posting, setPosting] = useState(false)
  const [newBody, setNewBody] = useState('')

  useEffect(() => {
    if (!open) return
    let cancelled = false
    setLoading(true)
    getOrCreateThreadForSource(vaultId, sourceId).then((r) => {
      if (cancelled) return
      if (r.error || !r.threadId) {
        setLoading(false)
        return
      }
      setThreadId(r.threadId)
      getCommentsForThread(r.threadId).then((c) => {
        if (!cancelled) {
          setComments(c.data ?? [])
          setLoading(false)
        }
      })
    })
    return () => { cancelled = true }
  }, [open, vaultId, sourceId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!threadId || !newBody.trim() || posting) return
    setPosting(true)
    try {
      const { error } = await addComment(threadId, newBody, vaultId)
      if (error) throw new Error(error)
      setNewBody('')
      const { data } = await getCommentsForThread(threadId)
      setComments(data ?? [])
      router.refresh()
    } finally {
      setPosting(false)
    }
  }

  return (
    <div className="border-t-2 border-neo-black/20 mt-3 pt-3">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground"
      >
        <MessageSquare className="h-4 w-4" />
        Discussion {comments.length > 0 && `(${comments.length})`}
      </button>
      {open && (
        <div className="mt-2 space-y-2">
          {loading ? (
            <p className="text-xs text-muted-foreground">Loading…</p>
          ) : (
            <>
              <ul className="space-y-1.5 max-h-32 overflow-y-auto">
                {comments.map((c) => (
                  <li key={c.id} className="text-xs py-1.5 px-2 bg-muted/50 border-l-2 border-neo-cyan">
                    <p className="font-medium">{c.body}</p>
                    <span className="text-muted-foreground">{new Date(c.created_at).toLocaleString()}</span>
                  </li>
                ))}
              </ul>
              {canEdit && (
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <input
                    value={newBody}
                    onChange={(e) => setNewBody(e.target.value)}
                    placeholder="Add a comment…"
                    className="flex-1 min-w-0 border-2 border-neo-black px-2 py-1.5 text-sm"
                  />
                  <Button type="submit" size="sm" disabled={posting || !newBody.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
