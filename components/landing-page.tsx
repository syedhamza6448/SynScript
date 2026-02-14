'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Button } from '@/components/ui/button'
import { SharedNavbar } from '@/components/shared-navbar'
import {
  Users,
  FileText,
  Link2,
  FolderOpen,
  Plus,
  MessageSquare,
} from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

export function LandingPage() {
  const heroRef = useRef<HTMLElement>(null)
  const heroTitleRef = useRef<HTMLHeadingElement>(null)
  const heroSubRef = useRef<HTMLParagraphElement>(null)
  const heroCtaRef = useRef<HTMLDivElement>(null)
  const float1Ref = useRef<HTMLDivElement>(null)
  const float2Ref = useRef<HTMLDivElement>(null)
  const float3Ref = useRef<HTMLDivElement>(null)
  const stepsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero parallax on load
      gsap.fromTo(
        heroTitleRef.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'back.out(1.2)' }
      )
      gsap.fromTo(
        heroSubRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, delay: 0.2, ease: 'power3.out' }
      )
      gsap.fromTo(
        heroCtaRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, delay: 0.4, ease: 'elastic.out(1, 0.5)' }
      )

      // Floating elements parallax on scroll
      if (heroRef.current) {
        gsap.to(float1Ref.current, {
          y: 60,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          },
        })
        gsap.to(float2Ref.current, {
          y: 100,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          },
        })
        gsap.to(float3Ref.current, {
          y: 40,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          },
        })
      }

      // Feature cards - parallax on scroll
      gsap.utils.toArray<HTMLElement>('.feature-card').forEach((card, i) => {
        gsap.fromTo(
          card,
          { y: 80, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: 'back.out(1.1)',
            scrollTrigger: {
              trigger: card,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
            delay: i * 0.08,
          }
        )
      })

      // Step cards animate on scroll into view
      gsap.utils.toArray<HTMLElement>('.step-card').forEach((card, i) => {
        gsap.fromTo(
          card,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'back.out(1.1)',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              end: 'top 50%',
              toggleActions: 'play none none none',
            },
            delay: i * 0.1,
          }
        )
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <div className="min-h-screen bg-background relative">
      <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none z-0" aria-hidden />
      <div className="relative z-10">
      <SharedNavbar />

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-[85vh] flex flex-col items-center justify-center overflow-hidden px-4 py-20"
      >
        {/* Background parallax shapes */}
        <div
          ref={float1Ref}
          className="absolute top-20 left-[10%] w-24 h-24 border-[4px] border-neo-cyan opacity-20 dark:opacity-15 pointer-events-none"
        />
        <div
          ref={float2Ref}
          className="absolute top-40 right-[15%] w-32 h-32 border-[4px] border-neo-yellow opacity-20 dark:opacity-15 pointer-events-none"
        />
        <div
          ref={float3Ref}
          className="absolute bottom-32 left-[20%] w-20 h-20 border-[4px] border-neo-pink opacity-20 dark:opacity-15 pointer-events-none"
        />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1
            ref={heroTitleRef}
            className="text-5xl md:text-7xl font-black uppercase mb-6 border-b-[6px] border-neo-cyan inline-block pb-4"
          >
            SynScript
          </h1>
          <p
            ref={heroSubRef}
            className="text-xl md:text-2xl text-muted-foreground font-medium max-w-2xl mx-auto mb-10"
          >
            Collaborative Research & Citation Engine. Build Knowledge Vaults with
            verified sources and cross-referenced citations.
          </p>
          <div ref={heroCtaRef} className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" asChild>
              <Link href="/login">Get Started</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="#how-it-works">How it works</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* What SynScript Does */}
      <section className="py-20 px-4 border-t-[5px] border-neo-black">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-black uppercase mb-12 text-center border-l-8 border-neo-yellow pl-4 inline-block">
            What SynScript Does
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="feature-card border-[4px] border-neo-black bg-card p-6 shadow-neo-md hover:-translate-y-1 hover:shadow-neo-lg transition-all duration-200">
              <FolderOpen className="h-12 w-12 mb-4 text-neo-cyan stroke-[2.25]" />
              <h3 className="text-lg font-black uppercase mb-2">Knowledge Vaults</h3>
              <p className="text-muted-foreground font-medium">
                Create shared research repositories. Organize sources, PDFs, and
                annotations in one place.
              </p>
            </div>
            <div className="feature-card border-[4px] border-neo-black bg-card p-6 shadow-neo-md hover:-translate-y-1 hover:shadow-neo-lg transition-all duration-200">
              <Users className="h-12 w-12 mb-4 text-neo-pink stroke-[2.25]" />
              <h3 className="text-lg font-black uppercase mb-2">Collaborate</h3>
              <p className="text-muted-foreground font-medium">
                Invite contributors or viewers. Control who can add sources and
                who can only read.
              </p>
            </div>
            <div className="feature-card border-[4px] border-neo-black bg-card p-6 shadow-neo-md hover:-translate-y-1 hover:shadow-neo-lg transition-all duration-200">
              <Link2 className="h-12 w-12 mb-4 text-neo-green stroke-[2.25]" />
              <h3 className="text-lg font-black uppercase mb-2">Citations</h3>
              <p className="text-muted-foreground font-medium">
                Add sources with URLs and PDFs. Annotate and cross-reference for
                solid research.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How to Use - Step by Step */}
      <section
        id="how-it-works"
        ref={stepsRef}
        className="py-20 px-4 bg-secondary/30 border-t-[5px] border-neo-black"
      >
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-black uppercase mb-12 text-center">
            How to Use SynScript
          </h2>
          <div className="space-y-6">
            <div className="step-card border-[4px] border-neo-black bg-card p-6 shadow-neo-md flex gap-4 items-start">
              <span className="flex-shrink-0 w-12 h-12 border-[3px] border-neo-black bg-neo-yellow flex items-center justify-center font-black text-lg">
                1
              </span>
              <div>
                <h3 className="text-lg font-black uppercase mb-2 flex items-center gap-2">
                  <Plus className="h-5 w-5 stroke-[2.25]" />
                  Create a Vault
                </h3>
                <p className="text-muted-foreground font-medium">
                  Sign up and create your first Knowledge Vault. Give it a name
                  and description.
                </p>
              </div>
            </div>
            <div className="step-card border-[4px] border-neo-black bg-card p-6 shadow-neo-md flex gap-4 items-start">
              <span className="flex-shrink-0 w-12 h-12 border-[3px] border-neo-black bg-neo-cyan flex items-center justify-center font-black text-lg">
                2
              </span>
              <div>
                <h3 className="text-lg font-black uppercase mb-2 flex items-center gap-2">
                  <FileText className="h-5 w-5 stroke-[2.25]" />
                  Add Sources
                </h3>
                <p className="text-muted-foreground font-medium">
                  Add research sources with URLs and titles. Upload PDFs for
                  papers and whitepapers.
                </p>
              </div>
            </div>
            <div className="step-card border-[4px] border-neo-black bg-card p-6 shadow-neo-md flex gap-4 items-start">
              <span className="flex-shrink-0 w-12 h-12 border-[3px] border-neo-black bg-neo-pink flex items-center justify-center font-black text-lg">
                3
              </span>
              <div>
                <h3 className="text-lg font-black uppercase mb-2 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 stroke-[2.25]" />
                  Annotate
                </h3>
                <p className="text-muted-foreground font-medium">
                  Add notes and annotations to your sources. Build a trail of
                  insights and references.
                </p>
              </div>
            </div>
            <div className="step-card border-[4px] border-neo-black bg-card p-6 shadow-neo-md flex gap-4 items-start">
              <span className="flex-shrink-0 w-12 h-12 border-[3px] border-neo-black bg-neo-green flex items-center justify-center font-black text-lg">
                4
              </span>
              <div>
                <h3 className="text-lg font-black uppercase mb-2 flex items-center gap-2">
                  <Users className="h-5 w-5 stroke-[2.25]" />
                  Invite Collaborators
                </h3>
                <p className="text-muted-foreground font-medium">
                  Share your vault with teammates. Set roles: Edit (can add
                  sources) or View-only.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-12 text-center">
            <Button size="lg" asChild>
              <Link href="/login">Start Building Your Vault</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-[5px] border-neo-black py-12 px-4">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-black text-lg uppercase">SynScript</span>
          <div className="flex gap-6">
            <Link
              href="/login"
              className="font-bold text-sm hover:opacity-80 transition-opacity"
            >
              Log in
            </Link>
            <Link
              href="/login?signup=1"
              className="font-bold text-sm hover:opacity-80 transition-opacity"
            >
              Sign up
            </Link>
          </div>
        </div>
      </footer>
      </div>
    </div>
  )
}
