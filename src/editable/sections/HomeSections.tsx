import Link from 'next/link'
import {
  ArrowRight, Bookmark, Building2, FileText, Image as ImageIcon,
  Megaphone, UserRound, Infinity as InfinityIcon, Smartphone, ThumbsUp,
  BookOpen, Bell, Lock, Maximize2, Bookmark as BookmarkIcon,
  Monitor, Tablet, Star,
} from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { getEditablePostImage, postHref } from '@/editable/cards/PostCards'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

const taskIcon: Record<TaskKey, typeof FileText> = {
  article: FileText,
  listing: Building2,
  classified: Megaphone,
  image: ImageIcon,
  sbm: Bookmark,
  pdf: FileText,
  profile: UserRound,
}

function excerpt(post?: SitePost | null, limit = 120) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    post?.summary || ''
  const clean = raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return clean.length > limit ? `${clean.slice(0, limit).trim()}…` : clean
}

function categoryOf(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || ''
}

function dedupePosts(posts: SitePost[]) {
  const seen = new Set<string>()
  const out: SitePost[] = []
  for (const post of posts) {
    const key = post.slug || post.id || post.title
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(post)
  }
  return out
}

function firstRealImage(posts: SitePost[]) {
  for (const post of posts) {
    const img = getEditablePostImage(post)
    if (img && !img.includes('placeholder')) return img
  }
  return ''
}

const container = 'mx-auto w-full max-w-[var(--editable-container)] px-5 sm:px-8 lg:px-10'

/* ============================ HERO (cream bg) ============================ */
export function EditableHomeHero({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((s) => s.posts)])
  const heroImg = firstRealImage(pool)
  const rawTitle = pagesContent.home.hero.title?.join(' ') || `Your private, personal directory.`
  const description = pagesContent.home.hero.description || `Loved by readers around the world.`
  const badge = pagesContent.home.hero.badge || `Welcome`

  return (
    <section className="relative overflow-hidden bg-[var(--slot4-cream)]">
      <div className={`${container} grid gap-10 py-14 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:py-24`}>
        <div>
          <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-[var(--slot4-accent)]">{badge}</p>
          <h1 className="editable-display mt-4 text-balance text-[42px] font-semibold leading-[1.05] text-[var(--slot4-page-text)] sm:text-[56px] lg:text-[64px]">
            {rawTitle}
          </h1>
          <p className="mt-6 max-w-lg text-[17px] leading-[1.6] text-[var(--slot4-muted-text)]">
            {description}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link href={primaryRoute} className="inline-flex items-center gap-2 rounded-lg bg-[var(--editable-cta-bg)] px-7 py-3.5 text-[15px] font-semibold text-white shadow-[0_6px_20px_rgba(37,99,235,0.28)] transition hover:brightness-110 active:scale-[0.98]">
              Start exploring now <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/search" className="inline-flex items-center gap-2 text-[15px] font-semibold text-[var(--slot4-page-text)] underline decoration-[var(--slot4-accent)] decoration-2 underline-offset-[6px] transition hover:text-[var(--slot4-accent)]">
              Or search the directory
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-[6px] border border-[var(--slot4-page-text)]/20" aria-hidden />
          <div className="relative overflow-hidden rounded-[4px] bg-[var(--slot4-media-bg)] shadow-[0_20px_60px_rgba(28,36,52,0.14)]">
            {heroImg ? (
              <img
                src={heroImg}
                alt=""
                className="block aspect-[4/3] w-full object-cover"
                loading="eager"
              />
            ) : (
              <div className="flex aspect-[4/3] w-full items-center justify-center bg-[var(--slot4-warm)] text-[var(--slot4-muted-text)]">
                <BookOpen className="h-16 w-16" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Slant divider into next section */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[70px] bg-white [clip-path:polygon(0_100%,100%_60%,100%_100%,0_100%)]" />
    </section>
  )
}

/* ==================== FEATURE ICON GRID (6 tiles) ==================== */
const featureTiles = [
  { icon: InfinityIcon, title: 'Unlimited entries', body: 'Read as much and as often as you like — the directory keeps growing, all for free.' },
  { icon: Smartphone, title: 'Mobile friendly', body: 'Browse the collection on the go with a layout tuned for every screen.' },
  { icon: ThumbsUp, title: 'Saves as you go', body: 'Never worry about losing your place — your recent picks are here when you return.' },
  { icon: BookOpen, title: 'Custom sections', body: 'Choose from different collections, topics and voices tuned to your interests.' },
  { icon: Bell, title: 'Fresh drops', body: 'Set gentle notifications so you never miss the newest additions to the directory.' },
  { icon: Lock, title: 'So much more…', body: 'Enjoy tagging, search, curated prompts, sharing and a lot more built in.' },
]

export function EditableStoryRail(_props: HomeSectionProps) {
  return (
    <section className="bg-white">
      <div className={`${container} py-16 sm:py-20 lg:py-24`}>
        <div className="grid gap-x-14 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {featureTiles.map((tile) => {
            const Icon = tile.icon
            return (
              <div key={tile.title} className="max-w-[340px]">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--editable-cta-bg)] text-white shadow-[0_6px_18px_rgba(37,99,235,0.22)]">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="editable-display mt-6 text-[22px] font-semibold text-[var(--slot4-page-text)]">
                  {tile.title}
                </h3>
                <p className="mt-3 text-[15px] leading-[1.65] text-[var(--slot4-muted-text)]">
                  {tile.body}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ================ "BUILT FOR ..." tabbed section w/ preview ================ */
const builtForTabs = [
  { icon: Maximize2, label: 'Customize' },
  { icon: BookmarkIcon, label: 'Organize' },
  { icon: Bell, label: 'Remember' },
  { icon: Lock, label: 'Discover' },
]

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((s) => s.posts)])
  const previewImg = firstRealImage(pool)
  const featured = pool.slice(0, 4)

  return (
    <section className="bg-[var(--slot4-lavender)]">
      <div className={`${container} py-16 text-center sm:py-20 lg:py-24`}>
        <h2 className="editable-display mx-auto max-w-3xl text-[36px] font-semibold tracking-[-0.01em] text-[var(--slot4-page-text)] sm:text-[48px]">
          Built for {SITE_CONFIG.tagline?.split(' ')[0].toLowerCase() || 'discovery'}
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-[16px] leading-[1.6] text-[var(--slot4-muted-text)]">
          {SITE_CONFIG.name} was made for exploring{' '}
          <Link href={primaryRoute} className="underline decoration-2 underline-offset-[5px] hover:text-[var(--slot4-accent)]">a wide directory</Link>,
          discovering{' '}
          <Link href={primaryRoute} className="underline decoration-2 underline-offset-[5px] hover:text-[var(--slot4-accent)]">handpicked posts</Link>,
          and following{' '}
          <Link href={primaryRoute} className="underline decoration-2 underline-offset-[5px] hover:text-[var(--slot4-accent)]">topics you love</Link>
          — or just wandering freely.
        </p>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 sm:gap-14">
          {builtForTabs.map((tab, i) => {
            const Icon = tab.icon
            const active = i === 0
            return (
              <div key={tab.label} className="flex flex-col items-center gap-3">
                <span className={`flex h-14 w-14 items-center justify-center rounded-full border transition ${
                  active
                    ? 'border-transparent bg-[var(--editable-cta-bg)] text-white shadow-[0_6px_18px_rgba(37,99,235,0.22)]'
                    : 'border-[var(--editable-border)] bg-white text-[var(--slot4-soft-muted-text)]'
                }`}>
                  <Icon className="h-5 w-5" />
                </span>
                <span className={`text-[15px] font-semibold ${active ? 'text-[var(--slot4-page-text)]' : 'text-[var(--slot4-soft-muted-text)]'}`}>
                  {tab.label}
                </span>
              </div>
            )
          })}
        </div>

        {/* Big preview mock (uses a real post image) */}
        <div className="mx-auto mt-14 max-w-4xl overflow-hidden rounded-2xl border border-[var(--editable-border)] bg-white shadow-[0_30px_80px_rgba(28,36,52,0.16)]">
          <div className="flex items-center gap-2 border-b border-[var(--editable-border)] bg-[var(--slot4-warm)] px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ef3e36]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#f5b400]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#3ac47d]" />
            <span className="ml-3 text-[12px] font-semibold text-[var(--slot4-muted-text)]">{SITE_CONFIG.domain}</span>
          </div>
          <div className="grid gap-0 sm:grid-cols-[220px_1fr]">
            <aside className="hidden border-r border-[var(--editable-border)] bg-[var(--slot4-dark-bg)] p-4 text-white/90 sm:block">
              <div className="rounded-md bg-[var(--slot4-accent)] px-3 py-2 text-[13px] font-semibold text-white">+ New Post</div>
              <div className="mt-4 space-y-2 text-[13px]">
                {featured.map((post, i) => (
                  <div key={post.id || post.slug || i} className="truncate rounded px-2 py-1.5 text-white/80 hover:bg-white/10">
                    {post.title}
                  </div>
                ))}
              </div>
            </aside>
            <div className="p-5 text-left">
              {featured[0] ? (
                <>
                  <p className="editable-display text-[22px] font-semibold text-[var(--slot4-page-text)]">
                    {featured[0].title}
                  </p>
                  <p className="mt-3 text-[14px] leading-[1.65] text-[var(--slot4-muted-text)]">
                    {excerpt(featured[0], 220)}
                  </p>
                  {previewImg ? (
                    <img src={previewImg} alt="" className="mt-4 aspect-[16/9] w-full rounded-lg object-cover" loading="lazy" />
                  ) : null}
                </>
              ) : (
                <p className="text-[14px] text-[var(--slot4-muted-text)]">A preview of the reading experience.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ============ "WITH YOU AT ALL TIMES" — device panel + posts ============ */
const devicePanels = [
  { icon: Monitor, label: 'Desktop', body: 'Perfect for long-form reading — the layout shines on a computer or laptop where you can enjoy the full experience.' },
  { icon: Smartphone, label: 'Phone', body: 'When you\'re not near your desk, keep reading, saving and discovering right from your phone.' },
  { icon: Tablet, label: 'Tablet', body: 'On an iPad or Android tablet you get the same familiar experience with more room to breathe.' },
]

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((s) => s.posts)])
  const previewImg = firstRealImage(pool)
  const listPreview = pool.slice(0, 3)

  return (
    <section className="bg-white">
      <div className={`${container} py-16 sm:py-20 lg:py-24`}>
        <h2 className="editable-display text-center text-[36px] font-semibold leading-[1.1] text-[var(--slot4-page-text)] sm:text-[48px]">
          With you at all times,<br />home or away
        </h2>

        <div className="mt-14 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          {/* Left: Desktop mock */}
          <div className="relative mx-auto w-full max-w-xl">
            <div className="overflow-hidden rounded-t-2xl border-[10px] border-[var(--slot4-page-text)] bg-white">
              <div className="flex items-center gap-1.5 bg-[var(--slot4-page-text)] px-3 py-1.5">
                <span className="h-2 w-2 rounded-full bg-white/60" />
                <span className="h-2 w-2 rounded-full bg-white/60" />
                <span className="h-2 w-2 rounded-full bg-white/60" />
              </div>
              <div className="grid grid-cols-[80px_1fr] gap-0">
                <aside className="bg-[var(--slot4-dark-bg)] p-2 text-white">
                  <div className="rounded bg-[var(--slot4-accent)] px-2 py-1 text-[9px] font-semibold">+ New</div>
                  <div className="mt-2 space-y-1 text-[9px] text-white/80">
                    {listPreview.map((p, i) => (
                      <div key={i} className="truncate">{p.title?.slice(0, 14) || '—'}</div>
                    ))}
                  </div>
                </aside>
                <div className="p-3">
                  {previewImg ? (
                    <img src={previewImg} alt="" className="aspect-[4/3] w-full rounded object-cover" loading="lazy" />
                  ) : (
                    <div className="aspect-[4/3] w-full rounded bg-[var(--slot4-warm)]" />
                  )}
                </div>
              </div>
            </div>
            <div className="mx-auto h-4 w-2/3 rounded-b-lg bg-[var(--slot4-page-text)]" />
            <div className="mx-auto h-2 w-1/3 rounded-b bg-[var(--slot4-page-text)]/70" />
          </div>

          {/* Right: intro + device rows */}
          <div>
            <p className="max-w-md text-[16px] leading-[1.65] text-[var(--slot4-muted-text)]">
              Unlike other platforms, {SITE_CONFIG.name} works well on every device. Read in any browser or use it on the go.
            </p>
            <div className="mt-6 grid gap-4">
              {devicePanels.map((panel, i) => {
                const Icon = panel.icon
                const active = i === 0
                return (
                  <div key={panel.label} className={`flex items-start gap-4 rounded-xl border p-5 transition ${
                    active ? 'border-[var(--editable-cta-bg)] bg-white shadow-[0_6px_24px_rgba(37,99,235,0.10)]' : 'border-[var(--editable-border)] bg-white/60'
                  }`}>
                    <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                      active ? 'bg-[var(--editable-cta-bg)] text-white' : 'bg-[var(--slot4-blue-soft)] text-[var(--editable-cta-bg)]'
                    }`}>
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <p className={`text-[15px] font-semibold ${active ? 'text-[var(--slot4-page-text)]' : 'text-[var(--slot4-soft-muted-text)]'}`}>
                        {panel.label}
                      </p>
                      <p className={`mt-1.5 text-[14px] leading-[1.6] ${active ? 'text-[var(--slot4-muted-text)]' : 'text-[var(--slot4-soft-muted-text)]'}`}>
                        {panel.body}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Fresh directory — small horizontal-card row using real posts */}
        {pool.length ? (
          <div className="mt-20">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--slot4-accent)]">Fresh in the directory</p>
                <h3 className="editable-display mt-2 text-[28px] font-semibold text-[var(--slot4-page-text)] sm:text-[32px]">
                  Handpicked reads
                </h3>
              </div>
              <Link href={primaryRoute} className="hidden items-center gap-1 text-[14px] font-semibold text-[var(--editable-cta-bg)] hover:underline sm:inline-flex">
                See all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {pool.slice(0, 6).map((post, i) => (
                <FeatureVarietyCard key={post.id || post.slug || i} post={post} href={postHref(primaryTask, post, primaryRoute)} variant={i % 3} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}

/* Three visual variants used inline: image-first, editorial, compact side-by-side */
function FeatureVarietyCard({ post, href, variant }: { post: SitePost; href: string; variant: number }) {
  const image = getEditablePostImage(post)
  const category = categoryOf(post)

  if (variant === 0) {
    // Image-first
    return (
      <Link href={href} className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--editable-border)] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(28,36,52,0.14)]">
        <div className="relative aspect-[5/3] overflow-hidden bg-[var(--slot4-media-bg)]">
          <img src={image} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
          {category ? (
            <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold text-[var(--slot4-accent)]">{category}</span>
          ) : null}
        </div>
        <div className="p-5">
          <h4 className="editable-display line-clamp-2 text-[19px] font-semibold text-[var(--slot4-page-text)] group-hover:text-[var(--slot4-accent)]">
            {post.title}
          </h4>
          <p className="mt-2 line-clamp-2 text-[14px] leading-[1.6] text-[var(--slot4-muted-text)]">{excerpt(post, 110)}</p>
        </div>
      </Link>
    )
  }
  if (variant === 1) {
    // Editorial: no image, big serif type on cream
    return (
      <Link href={href} className="group flex flex-col justify-between rounded-2xl bg-[var(--slot4-cream)] p-6 transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(28,36,52,0.12)]">
        <div>
          <span className="inline-block rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-[var(--slot4-accent)]">
            {category || 'Editorial'}
          </span>
          <h4 className="editable-display mt-4 line-clamp-3 text-[24px] font-semibold leading-[1.15] text-[var(--slot4-page-text)] group-hover:text-[var(--slot4-accent)]">
            {post.title}
          </h4>
          <p className="mt-3 line-clamp-3 text-[14px] leading-[1.6] text-[var(--slot4-muted-text)]">{excerpt(post, 140)}</p>
        </div>
        <span className="mt-6 inline-flex items-center gap-1 text-[13px] font-semibold text-[var(--slot4-accent)]">
          Read the story <ArrowRight className="h-4 w-4" />
        </span>
      </Link>
    )
  }
  // Compact horizontal
  return (
    <Link href={href} className="group flex gap-4 rounded-2xl border border-[var(--editable-border)] bg-white p-3 transition hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(28,36,52,0.12)]">
      <div className="relative aspect-square h-24 shrink-0 overflow-hidden rounded-xl bg-[var(--slot4-media-bg)]">
        <img src={image} alt={post.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center pr-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--slot4-accent)]">{category || 'Directory'}</p>
        <h4 className="mt-1 line-clamp-2 text-[15px] font-semibold text-[var(--slot4-page-text)] group-hover:text-[var(--slot4-accent)]">
          {post.title}
        </h4>
        <p className="mt-1 line-clamp-1 text-[13px] text-[var(--slot4-muted-text)]">{excerpt(post, 70)}</p>
      </div>
    </Link>
  )
}

/* ============================== CTA band ============================== */
export function EditableHomeCta() {
  return (
    <section className="bg-[var(--slot4-dark-bg)] text-white">
      <div className={`${container} flex flex-col items-center gap-6 py-16 text-center sm:py-20`}>
        <div className="inline-flex items-center gap-1 rounded-full bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/80">
          <Star className="h-3 w-3" /> Join in
        </div>
        <h2 className="editable-display max-w-2xl text-[36px] font-semibold leading-[1.05] text-white sm:text-[48px]">
          Got something worth sharing?
        </h2>
        <p className="max-w-xl text-[16px] leading-[1.65] text-white/80">
          Add your own post, share a story, or join the {SITE_CONFIG.name} community — it takes less than a minute.
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-4">
          <Link href="/create" className="inline-flex items-center gap-2 rounded-lg bg-[var(--editable-cta-bg)] px-7 py-3.5 text-[15px] font-semibold text-white transition hover:brightness-110">
            Create a post <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/contact" className="inline-flex items-center gap-2 rounded-lg border border-white/40 px-7 py-3.5 text-[15px] font-semibold text-white transition hover:bg-white/10">
            Contact us
          </Link>
        </div>
      </div>
    </section>
  )
}
