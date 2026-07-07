'use client'

import Link from 'next/link'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableFooter() {
  const year = new Date().getFullYear()
  const { session } = useEditableLocalAuthSession()

  const basics = [
    { label: 'About', href: '/about' },
    { label: 'Support', href: '/contact' },
    { label: 'Search', href: '/search' },
    ...(session ? [{ label: 'Create', href: '/create' }] : [
      { label: 'Sign in', href: '/login' },
      { label: 'Sign up', href: '/signup' },
    ]),
  ]

  return (
    <footer className="bg-[var(--editable-footer-bg)] text-[var(--editable-footer-text)]">
      {/* Warm cream footer band with brand + quick links + socials */}
      <div className="bg-[var(--editable-footer-bg)]">
        <div className="mx-auto grid max-w-[var(--editable-container)] gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[1.2fr_1fr] lg:px-10">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-11 w-11 rounded-lg object-contain" />
              <span className="editable-script whitespace-nowrap text-[24px] leading-none text-[var(--slot4-page-text)]">
                {SITE_CONFIG.name}
              </span>
            </Link>
            <p className="editable-display mt-4 text-[22px] font-semibold text-[var(--slot4-page-text)]">
              The #1 choice for {globalContent.nav?.tagline || 'discovery'}
            </p>
            <p className="mt-3 max-w-md text-sm leading-7 text-[var(--slot4-muted-text)]">
              {globalContent.footer?.description || SITE_CONFIG.description}
            </p>
          </div>

          <div>
            <h4 className="text-[15px] font-semibold text-[var(--slot4-page-text)]">{SITE_CONFIG.name}</h4>
            <div className="mt-4 grid gap-2.5 text-[14px] text-[var(--slot4-muted-text)]">
              {basics.map((item) => (
                <Link key={item.href} href={item.href} className="transition hover:text-[var(--slot4-accent)]">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-[var(--editable-border)]/70">
          <div className="mx-auto flex max-w-[var(--editable-container)] flex-col items-center justify-center px-5 py-6 text-[13px] text-[var(--slot4-muted-text)] sm:px-8 lg:px-10">
            <span>© {year} {SITE_CONFIG.name}. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
