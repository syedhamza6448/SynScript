import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { getVaultRole } from '@/lib/auth/rbac'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { PdfViewer } from '@/components/pdf-viewer'
import { RealtimeAnnotations } from '@/components/realtime-annotations'

export default async function PdfViewerPage({
  params,
}: {
  params: Promise<{ id: string; sourceId: string }>
}) {
  const { id: vaultId, sourceId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const role = await getVaultRole(vaultId, user.id)
  if (!role) redirect('/vaults')

  const { data: source } = await supabase
    .from('sources')
    .select('id, title, file_path, vault_id')
    .eq('id', sourceId)
    .eq('vault_id', vaultId)
    .single()

  if (!source || !source.file_path) notFound()

  const { data: signed } = await supabase.storage
    .from('pdfs')
    .createSignedUrl(source.file_path, 3600)

  const pdfUrl = signed?.signedUrl
  if (!pdfUrl) notFound()

  const { data: annotations } = await supabase
    .from('annotations')
    .select('id, note, user_id, created_at, page_number')
    .eq('source_id', sourceId)
    .order('created_at', { ascending: true })

  const canEdit = role === 'owner' || role === 'contributor'

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/vaults/${vaultId}`} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to vault
          </Link>
        </Button>
      </div>
      <RealtimeAnnotations sourceId={sourceId}>
        <PdfViewer
          pdfUrl={pdfUrl}
          sourceId={sourceId}
          sourceTitle={source.title}
          vaultId={vaultId}
          canEdit={canEdit}
          currentUserId={user.id}
          annotations={annotations ?? []}
        />
      </RealtimeAnnotations>
    </div>
  )
}
