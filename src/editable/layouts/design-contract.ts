import type { CSSProperties } from 'react'

// Navy + beige directory palette. Deep navy top bar, warm beige hero, deep
// blue CTA, medium blue-gray accents. Modern-serif display type.
export const editableRootStyle = {
  '--slot4-page-bg': '#ffffff',
  '--slot4-page-text': '#1b3c53',
  '--slot4-panel-bg': '#f4ede6',
  '--slot4-surface-bg': '#ffffff',
  '--slot4-muted-text': '#456882',
  '--slot4-soft-muted-text': '#6b8299',
  '--slot4-accent': '#234c6a',
  '--slot4-accent-fill': '#234c6a',
  '--slot4-accent-soft': '#e4ecf3',
  '--slot4-on-accent': '#ffffff',
  '--slot4-blue': '#456882',
  '--slot4-blue-soft': '#e4ecf3',
  '--slot4-dark-bg': '#1b3c53',
  '--slot4-dark-text': '#ffffff',
  '--slot4-media-bg': '#ece2d6',
  '--slot4-cream': '#e8dccf',
  '--slot4-warm': '#f0e5d8',
  '--slot4-lavender': '#eef2f5',
  '--slot4-gray': '#eef1f4',
  '--slot4-body-gradient': 'none',
  '--editable-page-bg': '#ffffff',
  '--editable-page-text': '#1b3c53',
  '--editable-container': '1240px',
  '--editable-border': '#d2c1b6',
  '--editable-nav-bg': '#1b3c53',
  '--editable-nav-text': '#ffffff',
  '--editable-nav-active': '#d2c1b6',
  '--editable-nav-active-text': '#1b3c53',
  '--editable-cta-bg': '#234c6a',
  '--editable-cta-text': '#ffffff',
  '--editable-search-bg': '#ffffff',
  '--editable-footer-bg': '#d2c1b6',
  '--editable-footer-text': '#1b3c53',
} as CSSProperties

export const editablePalette = {
  pageBg: 'bg-[var(--slot4-page-bg)]',
  pageText: 'text-[var(--slot4-page-text)]',
  panelBg: 'bg-[var(--slot4-panel-bg)]',
  panelText: 'text-[var(--slot4-page-text)]',
  surfaceBg: 'bg-[var(--slot4-surface-bg)]',
  surfaceText: 'text-[var(--slot4-page-text)]',
  mutedText: 'text-[var(--slot4-muted-text)]',
  softMutedText: 'text-[var(--slot4-soft-muted-text)]',
  accentText: 'text-[var(--slot4-accent)]',
  accentBg: 'bg-[var(--slot4-accent-fill)]',
  accentSoftBg: 'bg-[var(--slot4-accent-soft)]',
  accentSoftText: 'text-[var(--slot4-accent-soft)]',
  onAccentText: 'text-[var(--slot4-on-accent)]',
  darkBg: 'bg-[var(--slot4-dark-bg)]',
  darkText: 'text-[var(--slot4-dark-text)]',
  mediaBg: 'bg-[var(--slot4-media-bg)]',
  creamBg: 'bg-[var(--slot4-cream)]',
  warmBg: 'bg-[var(--slot4-warm)]',
  lavenderBg: 'bg-[var(--slot4-lavender)]',
  grayBg: 'bg-[var(--slot4-gray)]',
  border: 'border-[var(--editable-border)]',
  darkBorder: 'border-white/10',
  shadow: 'shadow-[0_1px_2px_rgba(28,36,52,0.06),0_2px_10px_rgba(28,36,52,0.05)]',
  shadowStrong: 'shadow-[0_10px_40px_rgba(28,36,52,0.14)]',
  overlay: 'bg-[linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.55))]',
} as const

export const editableDesignContract = {
  shell: {
    page: `min-h-screen ${editablePalette.pageBg} ${editablePalette.pageText}`,
    section: 'mx-auto w-full max-w-[var(--editable-container)] px-5 sm:px-8 lg:px-10',
    sectionY: 'py-16 sm:py-20 lg:py-24',
  },
  layout: {
    safeGrid: 'grid gap-7 md:grid-cols-2 xl:grid-cols-3',
    featureGrid: 'grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center',
    rail: 'flex snap-x gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
    minRailCard: 'w-[180px] shrink-0 snap-start sm:w-[200px]',
  },
  type: {
    eyebrow: 'text-xs font-semibold uppercase tracking-[0.28em] text-[var(--slot4-accent)]',
    heroTitle: 'editable-display text-5xl leading-[1.02] tracking-[-0.02em] sm:text-6xl lg:text-[4rem]',
    sectionTitle: 'editable-display text-4xl tracking-[-0.02em] sm:text-5xl',
    body: 'text-base leading-relaxed',
  },
  surface: {
    card: `rounded-2xl border ${editablePalette.border} ${editablePalette.surfaceBg} ${editablePalette.shadow}`,
    soft: `rounded-2xl border ${editablePalette.border} ${editablePalette.panelBg}`,
    dark: `rounded-2xl ${editablePalette.darkBg} ${editablePalette.darkText} ${editablePalette.shadowStrong}`,
  },
  button: {
    primary: `inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--editable-cta-bg)] px-7 py-3.5 text-sm font-semibold tracking-[0.01em] text-[var(--editable-cta-text)] transition duration-200 hover:brightness-110 active:scale-[0.98]`,
    secondary: `inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-7 py-3.5 text-sm font-semibold tracking-[0.01em] text-[var(--slot4-page-text)] transition duration-200 hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)] active:scale-[0.98]`,
    accent: `inline-flex items-center justify-center gap-2 rounded-lg ${editablePalette.accentBg} px-7 py-3.5 text-sm font-semibold text-[var(--slot4-on-accent)] transition duration-200 hover:brightness-95 active:scale-[0.98]`,
  },
  media: {
    frame: `relative overflow-hidden rounded-2xl ${editablePalette.mediaBg}`,
    ratio: 'aspect-[4/3]',
  },
  motion: {
    lift: 'transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_44px_rgba(28,36,52,0.16)]',
    fade: 'transition duration-300 hover:opacity-80',
  },
} as const

export const aiLayoutRules = [
  'Change the full site color palette in editableRootStyle first; all homepage sections consume those CSS variables.',
  'Keep page structure in src/editable/sections/HomeSections.tsx so AI can redesign the whole home experience in one file.',
  'Use wide readable grids; never create skinny columns for paragraphs or cards.',
  'Use horizontal rails for dense post browsing.',
  'Keep dynamic post fetching intact; do not replace posts with mock arrays.',
  'Use postHref() for all post links so task-specific routes keep working.',
] as const
