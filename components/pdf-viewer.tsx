'use client'

import { useState, useCallback } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react'
import { AddAnnotationDialog } from './add-annotation-dialog'
import { NeoLoader } from './neo-loader'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

interface Annotation {
  id: string
  note: string
  user_id: string
  created_at: string
  page_number?: number | null
}

interface PdfViewerProps {
  pdfUrl: string
  sourceId: string
  sourceTitle: string
  vaultId: string
  canEdit: boolean
  annotations?: Annotation[]
}

export function PdfViewer({
  pdfUrl,
  sourceId,
  sourceTitle,
  vaultId,
  canEdit,
  annotations = [],
}: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number>(0)
  const [pageNumber, setPageNumber] = useState(1)
  const [error, setError] = useState<string | null>(null)

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
    setError(null)
  }, [])

  const onDocumentLoadError = useCallback((err: Error) => {
    setError(err.message || 'Failed to load PDF')
  }, [])

  const pageAnnotations = annotations.filter(
    (a) => a.page_number == null || a.page_number === pageNumber
  )

  if (error) {
    return (
      <div className="border-[4px] border-destructive bg-card p-8 text-center">
        <p className="text-destructive font-bold mb-4">{error}</p>
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-neo-cyan underline"
        >
          Open PDF in new tab
        </a>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h2 className="text-xl font-black uppercase truncate">{sourceTitle}</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
            disabled={pageNumber <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-bold text-sm min-w-[80px] text-center">
            {pageNumber} / {numPages || '—'}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPageNumber((p) => Math.min(numPages, p + 1))}
            disabled={pageNumber >= numPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          {canEdit && (
            <AddAnnotationDialog
              sourceId={sourceId}
              vaultId={vaultId}
              pageNumber={pageNumber}
            />
          )}
        </div>
      </div>

      <div className="border-[4px] border-neo-black bg-card shadow-neo-lg overflow-auto max-h-[80vh] flex justify-center">
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={<NeoLoader message="Loading PDF…" />}
        >
          <Page
            pageNumber={pageNumber}
            renderTextLayer
            renderAnnotationLayer
            className="shadow-neo-md"
          />
        </Document>
      </div>

      {pageAnnotations.length > 0 && (
        <div className="border-[4px] border-neo-black bg-secondary/50 p-4">
          <h3 className="font-black uppercase mb-2 flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Annotations (page {pageNumber})
          </h3>
          <ul className="space-y-2">
            {pageAnnotations.map((ann) => (
              <li
                key={ann.id}
                className="text-sm p-2 font-medium bg-card border-l-4 border-neo-cyan"
              >
                {ann.note}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
