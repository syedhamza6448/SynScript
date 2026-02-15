'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, MessageSquare, ExternalLink, Maximize, Minimize } from 'lucide-react'
import { AddAnnotationDialog } from './add-annotation-dialog'
import { NeoLoader } from './neo-loader'

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

// Declare global pdfjs from CDN
declare global {
  interface Window {
    pdfjsLib: any
  }
}

export function PdfViewer({
  pdfUrl,
  sourceId,
  sourceTitle,
  vaultId,
  canEdit,
  annotations = [],
}: PdfViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [numPages, setNumPages] = useState<number>(0)
  const [pageNumber, setPageNumber] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [pdfDoc, setPdfDoc] = useState<any>(null)
  const [scale, setScale] = useState(1.0) // Changed to 1.0 for 100% default zoom
  const [rendering, setRendering] = useState(false)
  const renderTaskRef = useRef<any>(null)
  const [pdfjsLoaded, setPdfjsLoaded] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [preFullscreenScale, setPreFullscreenScale] = useState<number | null>(null)

  // Load PDF.js from CDN (bypasses webpack completely)
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Check if already loaded
    if (window.pdfjsLib) {
      setPdfjsLoaded(true)
      return
    }

    const PDFJS_VERSION = '4.0.379'

    // Load PDF.js library from CDN
    const script = document.createElement('script')
    script.src = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.min.mjs`
    script.type = 'module'
    
    script.onload = () => {
      // Script loaded, but we need to access it differently for ES modules
      const workerScript = document.createElement('script')
      workerScript.textContent = `
        import * as pdfjsLib from 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.min.mjs';
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.worker.min.mjs';
        window.pdfjsLib = pdfjsLib;
        window.dispatchEvent(new Event('pdfjs-loaded'));
      `
      workerScript.type = 'module'
      document.head.appendChild(workerScript)
    }

    script.onerror = () => {
      setError('Failed to load PDF library from CDN')
      setLoading(false)
    }

    const handlePdfjsLoaded = () => {
      setPdfjsLoaded(true)
    }

    window.addEventListener('pdfjs-loaded', handlePdfjsLoaded)
    document.head.appendChild(script)

    return () => {
      window.removeEventListener('pdfjs-loaded', handlePdfjsLoaded)
    }
  }, [])

  // Load PDF document after PDF.js is loaded
  useEffect(() => {
    if (!pdfjsLoaded || !window.pdfjsLib) return

    let isMounted = true
    let loadedPdfDoc: any = null

    const loadPDF = async () => {
      try {
        setLoading(true)
        setError(null)

        const loadingTask = window.pdfjsLib.getDocument({
          url: pdfUrl,
          verbosity: 0,
        })
        
        loadedPdfDoc = await loadingTask.promise

        if (isMounted) {
          setPdfDoc(loadedPdfDoc)
          setNumPages(loadedPdfDoc.numPages)
          setLoading(false)
        }
      } catch (err: any) {
        console.error('PDF loading error:', err)
        if (isMounted) {
          setError(err?.message || 'Failed to load PDF. Please try opening it in a new tab.')
          setLoading(false)
        }
      }
    }

    loadPDF()

    return () => {
      isMounted = false
      if (loadedPdfDoc) {
        loadedPdfDoc.destroy()
      }
    }
  }, [pdfUrl, pdfjsLoaded])

  // Render current page
  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return

    const renderPage = async () => {
      try {
        if (renderTaskRef.current) {
          try {
            renderTaskRef.current.cancel()
          } catch (e) {
            // Ignore cancellation errors
          }
        }

        setRendering(true)
        
        const page = await pdfDoc.getPage(pageNumber)
        const viewport = page.getViewport({ scale })
        
        const canvas = canvasRef.current
        if (!canvas) return

        const context = canvas.getContext('2d')
        if (!context) return

        canvas.height = viewport.height
        canvas.width = viewport.width

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        }

        renderTaskRef.current = page.render(renderContext)
        await renderTaskRef.current.promise
        
        setRendering(false)
        renderTaskRef.current = null
      } catch (err: any) {
        if (err?.name !== 'RenderingCancelledException') {
          console.error('Error rendering page:', err)
        }
        setRendering(false)
      }
    }

    renderPage()

    return () => {
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel()
        } catch (e) {
          // Ignore cancellation errors
        }
      }
    }
  }, [pdfDoc, pageNumber, scale])

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isNowFullscreen = !!document.fullscreenElement
      setIsFullscreen(isNowFullscreen)
      
      // When exiting fullscreen, restore the previous scale
      if (!isNowFullscreen && preFullscreenScale !== null) {
        setScale(preFullscreenScale)
        setPreFullscreenScale(null)
      }
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [preFullscreenScale])

  const toggleFullscreen = async () => {
    if (!containerRef.current) return

    try {
      if (!document.fullscreenElement) {
        // Save current scale before entering fullscreen
        setPreFullscreenScale(scale)
        // Zoom in for fullscreen (150% zoom for better visibility)
        setScale(1.5)
        await containerRef.current.requestFullscreen()
      } else {
        await document.exitFullscreen()
        // Scale restoration is handled in the fullscreenchange event listener
      }
    } catch (err) {
      console.error('Error toggling fullscreen:', err)
    }
  }

  const pageAnnotations = annotations.filter(
    (a) => a.page_number == null || a.page_number === pageNumber
  )

  if (error) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h2 className="text-xl font-black uppercase truncate">{sourceTitle}</h2>
        </div>
        <div className="border-[4px] border-destructive bg-card p-8 text-center">
          <p className="text-destructive font-bold mb-4">{error}</p>
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-neo-cyan underline hover:text-neo-cyan/80 transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            Open PDF in new tab
          </a>
        </div>
      </div>
    )
  }

  if (loading || !pdfjsLoaded) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h2 className="text-xl font-black uppercase truncate">{sourceTitle}</h2>
        </div>
        <div className="border-[4px] border-neo-black bg-card shadow-neo-lg p-8">
          <NeoLoader message={!pdfjsLoaded ? "Loading PDF library…" : "Loading PDF…"} />
        </div>
      </div>
    )
  }

  return (
    <div className={`flex flex-col gap-4 ${isFullscreen ? 'fixed inset-0 z-50 bg-background p-4' : ''}`} ref={containerRef}>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h2 className="text-xl font-black uppercase truncate">{sourceTitle}</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
            disabled={pageNumber <= 1 || rendering}
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
            disabled={pageNumber >= numPages || rendering}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setScale((s) => Math.max(0.5, s - 0.25))}
          >
            −
          </Button>
          <span className="text-xs font-medium min-w-[45px] text-center">
            {Math.round(scale * 100)}%
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setScale((s) => Math.min(3, s + 0.25))}
          >
            +
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
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

      <div className={`border-[4px] border-neo-black bg-card shadow-neo-lg overflow-auto flex justify-center p-4 relative ${
        isFullscreen ? 'flex-1' : 'max-h-[80vh]'
      }`}>
        {rendering && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
            <NeoLoader message="Rendering page…" />
          </div>
        )}
        <canvas 
          ref={canvasRef} 
          className="shadow-neo-md max-w-full h-auto"
        />
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