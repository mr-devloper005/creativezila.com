'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ArrowRight, Search } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()
  // Site is article-primary. Hide the "Article" and "Business Listing" tabs
  // from the nav — article content is surfaced via the homepage instead, and
  // listings live only as backend/task routes.
  const HIDDEN_TASKS = new Set(['article', 'listing'])
  const navItems = useMemo(
    () =>
      SITE_CONFIG.tasks
        .filter((task) => task.enabled && !HIDDEN_TASKS.has(task.key))
        .map((task) => ({ label: task.label, href: task.route })),
    []
  )
  const leftLinks = navItems.slice(0, 3)

  return (
    <header className="sticky top-0 z-50 bg-[var(--editable-nav-bg)] text-[var(--editable-nav-text)] shadow-[0_2px_0_rgba(0,0,0,0.04)]">
      <nav className="mx-auto flex min-h-[72px] w-full max-w-[var(--editable-container)] items-center gap-8 px-5 sm:px-8 lg:px-10">
        {/* Playful script logo — full site name */}
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-8 w-8 object-contain" />
          <span className="editable-script whitespace-nowrap text-[32px] leading-none text-white sm:text-[36px]">
            {SITE_CONFIG.name}
          </span>
        </Link>

        {/* Left-side text links (Penzu-style: "Penzu Pro | Support | Download") */}
        <div className="hidden items-center gap-7 md:flex">
          {leftLinks.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-[15px] font-medium tracking-[0.005em] text-white/95 transition hover:text-white ${
                  active ? 'underline decoration-white/60 decoration-2 underline-offset-[6px]' : ''
                }`}
              >
                {item.label}
              </Link>
            )
          })}
          <Link href="/about" className="text-[15px] font-medium text-white/95 transition hover:text-white">
            About
          </Link>
          <Link href="/contact" className="text-[15px] font-medium text-white/95 transition hover:text-white">
            Support
          </Link>
        </div>

        {/* Right side: Sign In / Sign Up → */}
        <div className="ml-auto flex shrink-0 items-center gap-6">
          <Link href="/search" aria-label="Search" className="hidden text-white/90 transition hover:text-white sm:inline-flex">
            <Search className="h-[18px] w-[18px]" />
          </Link>
          {session ? (
            <>
              <Link href="/create" className="hidden text-[15px] font-medium text-white/95 transition hover:text-white sm:inline-block">
                Create
              </Link>
              <button
                type="button"
                onClick={logout}
                className="hidden text-[15px] font-medium text-white/95 transition hover:text-white sm:inline-block"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden text-[15px] font-medium text-white/95 transition hover:text-white sm:inline-block"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="hidden items-center gap-1.5 text-[15px] font-semibold text-white transition hover:opacity-90 sm:inline-flex"
              >
                Sign Up <ArrowRight className="h-[15px] w-[15px]" />
              </Link>
            </>
          )}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="rounded-md border border-white/40 p-1.5 text-white md:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open ? (
        <div className="border-t border-white/15 bg-[var(--editable-nav-bg)] px-5 py-4 md:hidden">
          <form action="/search" className="mb-4 flex items-center gap-2 rounded-lg bg-white/15 px-3 py-2">
            <Search className="h-4 w-4 text-white/80" />
            <input
              name="q"
              type="search"
              placeholder="Search"
              className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/70"
            />
          </form>
          <div className="grid gap-1">
            {[{ label: 'Home', href: '/' }, ...navItems, { label: 'About', href: '/about' }, { label: 'Support', href: '/contact' }, ...(session ? [{ label: 'Create', href: '/create' }] : [{ label: 'Sign In', href: '/login' }, { label: 'Sign Up', href: '/signup' }])].map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-md px-3 py-2.5 text-[15px] font-medium transition ${
                    active ? 'bg-white text-[var(--slot4-accent)]' : 'text-white hover:bg-white/10'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>
      ) : null}
    </header>
  )
}
