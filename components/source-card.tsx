'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreVertical, ExternalLink, FileText, Trash2 } from 'lucide-react'
import { deleteSource } from '@/app/actions/sources'
import { AddAnnotationDialog } from './add-annotation-dialog'
import { UploadPdfDialog } from './upload-pdf-dialog'

interface Annotation {
  id: string
  note: string
  user_id: string
  created_at: string
}

interface Source {
  id: string
  url: string | null
  title: string
  file_path: string | null
  pdf_url?: string | null
  created_at: string
  annotations?: Annotation[]
}

interface SourceCardProps {
  source: Source
  vaultId: string
  canEdit: boolean
}

export function SourceCard({ source, vaultId, canEdit }: SourceCardProps) {
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    if (!confirm('Delete this source and all annotations?')) return
    setDeleting(true)
    try {
      await deleteSource(vaultId, source.id)
      router.refresh()
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Card className="shadow-neo-md hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-neo-lg transition-all duration-150">
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div className="space-y-1.5 flex-1">
          <CardTitle className="text-lg">{source.title}</CardTitle>
          <div className="flex flex-wrap gap-2">
            {source.url && (
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-bold text-neo-black border-b-2 border-neo-cyan hover:bg-neo-cyan flex items-center gap-1 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                Open URL
              </a>
            )}
            {(source.pdf_url || source.file_path) && (
              <Link
                href={`/vaults/${vaultId}/pdf/${source.id}`}
                prefetch={false}
                className="text-sm font-bold text-neo-black border-b-2 border-neo-cyan hover:bg-neo-cyan flex items-center gap-1 transition-colors"
              >
                <FileText className="h-4 w-4" />
                View PDF
              </Link>
            )}
          </div>
        </div>
        {canEdit && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="text-destructive"
                onClick={handleDelete}
                disabled={deleting}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {source.annotations && source.annotations.length > 0 ? (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Annotations</h4>
            <ul className="space-y-2">
              {source.annotations.map((ann) => (
                <li
                  key={ann.id}
                  className="text-sm p-2 font-medium bg-neo-gray border-l-4 border-neo-cyan"
                >
                  {ann.note}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No annotations yet.</p>
        )}
        <div className="flex gap-2 flex-wrap">
          {canEdit && (
            <>
              <AddAnnotationDialog sourceId={source.id} vaultId={vaultId} />
              {!source.file_path && (
                <UploadPdfDialog vaultId={vaultId} sourceId={source.id} />
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
