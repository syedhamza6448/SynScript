import type { Metadata } from 'next'
import { Space_Grotesk, DM_Mono } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { SiteFooter } from '@/components/site-footer'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-heading',
})
const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-body',
})

export const metadata: Metadata = {
  title: 'SynScript - Collaborative Research & Citation Engine',
  description: 'Build Knowledge Vaults with verified sources and cross-referenced citations',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${spaceGrotesk.variable} ${dmMono.variable}`}>
      <body className={`${dmMono.className} min-h-screen flex flex-col`}>
        <Providers>
          <div className="flex-1 flex flex-col">{children}</div>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  )
}
