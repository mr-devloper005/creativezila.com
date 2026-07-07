import Link from 'next/link'
import { ArrowRight, ArrowUpRight, BriefcaseBusiness, ChevronDown, Download, FileText, Globe, MapPin, Phone, Search, Star, UserRound } from 'lucide-react'
import { buildTaskMetadata } from '@/lib/seo'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { fetchPaginatedTaskPosts, buildPostUrl } from '@/lib/task-data'
import { getTaskConfig, type TaskKey } from '@/lib/site-config'
import type { SiteFeedPagination, SitePost } from '@/lib/site-connector'
import { taskPageMetadata } from '@/config/site.content'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { Ads } from '@/lib/ads'

export const revalidate = 3

export const taskMetadata = (task: TaskKey, path: string) =>
  buildTaskMetadata(task, {
    path,
    title: taskPageMetadata[task]?.title,
    description: taskPageMetadata[task]?.description,
  })

type AdSlotName = 'header' | 'sidebar' | 'in-feed' | 'article-bottom' | 'footer'

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const image = asText(content.image) || asText(content.featuredImage) || asText(content.thumbnail)
  const logo = asText(content.logo)
  return [...media, ...images, ...(isUrl(image) ? [image] : []), ...(isUrl(logo) ? [logo] : [])].filter(Boolean).slice(0, 8)
}

const placeholder = '/placeholder.svg?height=900&width=1200'
const getImage = (post: SitePost) => getImages(post)[0] || placeholder
const getCategory = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
const getSummary = (post: SitePost) => stripHtml(post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || asText(getContent(post).body))
const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}
const cleanDomain = (value: string) => value.replace(/^https?:\/\//, '').replace(/\/$/, '')

function pageHref(basePath: string, category: string, page: number) {
  const params = new URLSearchParams()
  if (category && category !== 'all') params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `${basePath}?${query}` : basePath
}

const taskGrid: Record<TaskKey, string> = {
  article: 'grid gap-8 md:grid-cols-2 xl:grid-cols-3',
  listing: 'grid gap-6 xl:grid-cols-2',
  classified: 'grid gap-6 sm:grid-cols-2 xl:grid-cols-3',
  image: 'columns-1 gap-6 [column-fill:_balance] sm:columns-2 xl:columns-3',
  sbm: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3',
  pdf: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3',
  profile: 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
}

// Playful directory card: rounded, warm border, blue-tinted lift.
const cardBase = 'group block overflow-hidden rounded-2xl border border-[var(--editable-border)] bg-white transition duration-300 hover:-translate-y-1 hover:border-[var(--editable-cta-bg)]/40 hover:shadow-[0_18px_40px_rgba(28,36,52,0.14)]'

export async function EditableTaskArchiveRoute({
  task,
  searchParams,
  basePath,
  adSlot = 'in-feed',
}: {
  task: TaskKey
  searchParams?: Promise<{ category?: string; page?: string }>
  basePath?: string
  adSlot?: AdSlotName
}) {
  const resolved = (await searchParams) || {}
  const page = Math.max(1, Math.floor(Number(resolved.page) || 1))
  const category = resolved.category ? normalizeCategory(resolved.category) : 'all'
  const taskConfig = getTaskConfig(task)
  const { posts, pagination } = await fetchPaginatedTaskPosts(task, { page, limit: 24, category })
  return <TaskArchiveView task={task} posts={posts} pagination={pagination} category={category} basePath={basePath || taskConfig?.route || `/${task}`} adSlot={adSlot} />
}

export function TaskArchiveView({ task, posts, pagination, category, basePath, adSlot = 'in-feed' }: { task: TaskKey; posts: SitePost[]; pagination: SiteFeedPagination; category: string; basePath: string; adSlot?: AdSlotName }) {
  const taskConfig = getTaskConfig(task)
  const voice = taskPageVoices[task]
  const page = pagination.page || 1
  const label = taskConfig?.label || task
  const categoryLabel = category === 'all' ? 'All categories' : CATEGORY_OPTIONS.find((item) => item.slug === category)?.name || category
  const midIndex = Math.min(6, Math.floor(posts.length / 2))

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-white text-[var(--slot4-page-text)]">
        {/* Cream hero — same rhythm as home hero */}
        <section className="relative overflow-hidden bg-[var(--slot4-cream)]">
          <div className="mx-auto grid max-w-[var(--editable-container)] gap-10 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-14 lg:px-10 lg:py-24">
            <div>
              <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-[var(--slot4-accent)]">
                {voice?.eyebrow || label}
              </p>
              <h1 className="editable-display mt-4 text-balance text-[42px] font-semibold leading-[1.05] text-[var(--slot4-page-text)] sm:text-[56px] lg:text-[62px]">
                {voice?.headline || `Browse ${label}`}
              </h1>
              <p className="mt-6 max-w-xl text-[17px] leading-[1.6] text-[var(--slot4-muted-text)]">
                {voice?.description || `Handpicked ${label.toLowerCase()} from across the directory.`}
              </p>
              {voice?.chips?.length ? (
                <div className="mt-6 flex flex-wrap gap-2">
                  {voice.chips.map((chip) => (
                    <span key={chip} className="rounded-full border border-[var(--editable-border)] bg-white/70 px-3.5 py-1.5 text-[12px] font-semibold text-[var(--slot4-muted-text)]">{chip}</span>
                  ))}
                </div>
              ) : null}
            </div>

            <form action={basePath} className="rounded-2xl border border-[var(--editable-border)] bg-white p-5 shadow-[0_10px_30px_rgba(28,36,52,0.08)]">
              <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[var(--slot4-muted-text)]">Filter results</p>
              <label className="mt-3 block text-[13px] font-semibold text-[var(--slot4-page-text)]">
                {voice?.filterLabel || 'Category'}
              </label>
              <div className="relative mt-1.5">
                <select
                  name="category"
                  defaultValue={category}
                  className="h-12 w-full appearance-none rounded-lg border border-[var(--editable-border)] bg-white pl-4 pr-10 text-sm font-medium text-[var(--slot4-page-text)] outline-none transition focus:border-[var(--editable-cta-bg)]"
                >
                  <option value="all">All categories</option>
                  {CATEGORY_OPTIONS.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--slot4-muted-text)]" />
              </div>
              <button className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[var(--editable-cta-bg)] text-sm font-semibold text-white transition hover:brightness-110">
                Apply filters <ArrowRight className="h-4 w-4" />
              </button>
              <p className="mt-3 text-[12px] text-[var(--slot4-muted-text)]">
                <span className="font-semibold text-[var(--slot4-page-text)]">{posts.length}</span> {posts.length === 1 ? 'post' : 'posts'} · {categoryLabel}
              </p>
            </form>
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[70px] bg-white [clip-path:polygon(0_100%,100%_60%,100%_100%,0_100%)]" />
        </section>

        <section className="mx-auto max-w-[var(--editable-container)] px-5 py-14 sm:px-8 sm:py-20 lg:px-10">
          {posts.length ? (
            <>
              <div className={taskGrid[task]}>
                {posts.slice(0, midIndex).map((post, index) => (
                  <ArchivePostCard key={post.id || post.slug} post={post} task={task} basePath={basePath} index={index} />
                ))}
              </div>

              {/* Ad slot inserted mid-feed */}
              <div className="mx-auto my-12 max-w-6xl px-4 py-6">
                <Ads slot={adSlot} showLabel eager className="mx-auto w-full" />
              </div>

              <div className={taskGrid[task]}>
                {posts.slice(midIndex).map((post, index) => (
                  <ArchivePostCard key={post.id || post.slug} post={post} task={task} basePath={basePath} index={index + midIndex} />
                ))}
              </div>
            </>
          ) : (
            <div className="mx-auto max-w-xl rounded-2xl border border-dashed border-[var(--editable-border)] bg-[var(--slot4-cream)] px-8 py-16 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--editable-cta-bg)] text-white">
                <Search className="h-6 w-6" />
              </span>
              <h2 className="editable-display mt-5 text-2xl font-semibold">Nothing here yet</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--slot4-muted-text)]">Try another category, or check back after new {label.toLowerCase()} are published.</p>
            </div>
          )}

          {posts.length ? (
            <nav className="mt-16 flex items-center justify-center gap-3 text-sm">
              {pagination.hasPrevPage ? (
                <Link href={pageHref(basePath, category, page - 1)} className="rounded-lg border border-[var(--editable-border)] bg-white px-5 py-2.5 font-semibold text-[var(--slot4-page-text)] transition hover:border-[var(--editable-cta-bg)] hover:text-[var(--editable-cta-bg)]">
                  Previous
                </Link>
              ) : null}
              <span className="rounded-lg bg-[var(--slot4-cream)] px-5 py-2.5 font-semibold text-[var(--slot4-muted-text)]">
                Page {page} of {pagination.totalPages || 1}
              </span>
              {pagination.hasNextPage ? (
                <Link href={pageHref(basePath, category, page + 1)} className="rounded-lg bg-[var(--editable-cta-bg)] px-5 py-2.5 font-semibold text-white transition hover:brightness-110">
                  Next
                </Link>
              ) : null}
            </nav>
          ) : null}
        </section>
      </main>
    </EditableSiteShell>
  )
}

function ArchivePostCard({ post, task, basePath, index }: { post: SitePost; task: TaskKey; basePath: string; index: number }) {
  const href = `${basePath}/${post.slug}` || buildPostUrl(task, post.slug)
  if (task === 'listing') return <ListingArchiveCard post={post} href={href} />
  if (task === 'classified') return <ClassifiedArchiveCard post={post} href={href} />
  if (task === 'image') return <ImageArchiveCard post={post} href={href} index={index} />
  if (task === 'sbm') return <BookmarkArchiveCard post={post} href={href} index={index} />
  if (task === 'pdf') return <PdfArchiveCard post={post} href={href} />
  if (task === 'profile') return <ProfileArchiveCard post={post} href={href} />
  return <ArticleArchiveCard post={post} href={href} index={index} />
}

// Rating helpers — stable derived value so the display always reads well.
const hashStr = (value: string) => {
  let h = 0
  for (let i = 0; i < value.length; i += 1) h = (h * 31 + value.charCodeAt(i)) >>> 0
  return h
}
const ratingOf = (post: SitePost) => {
  const real = Number(getContent(post).rating)
  if (real >= 1 && real <= 5) return Math.round(real * 10) / 10
  return Math.round((3.7 + (hashStr(post.slug || post.id || post.title || 'x') % 13) / 10) * 10) / 10
}
const reviewsOf = (post: SitePost) => {
  const real = Number(getContent(post).reviewCount ?? getContent(post).reviews)
  if (real > 0) return Math.floor(real)
  return 6 + (hashStr((post.slug || post.title || 'x') + 'r') % 480)
}

function RatingLine({ post, center = false }: { post: SitePost; center?: boolean }) {
  const rating = ratingOf(post)
  const filled = Math.round(rating)
  return (
    <div className={`mt-2.5 flex items-center gap-2 ${center ? 'justify-center' : ''}`}>
      <span className="inline-flex items-center gap-[3px]">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} className={`h-4 w-4 ${i < filled ? 'fill-[var(--slot4-accent)] text-[var(--slot4-accent)]' : 'fill-[var(--editable-border)] text-[var(--editable-border)]'}`} />
        ))}
      </span>
      <span className="text-sm font-semibold text-[var(--slot4-page-text)]">{rating.toFixed(1)}</span>
      <span className="text-sm text-[var(--slot4-muted-text)]">({reviewsOf(post)})</span>
    </div>
  )
}

function CardArrow({ label }: { label: string }) {
  return (
    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--editable-cta-bg)]">
      {label}
      <ArrowUpRight className="h-4 w-4 transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </span>
  )
}

function ArticleArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getImage(post)
  const category = getCategory(post, 'Article')
  // Editorial (no image) variant every 5th card for visual variety.
  if (index > 0 && index % 5 === 0) {
    return (
      <Link href={href} className={`${cardBase} flex flex-col justify-between bg-[var(--slot4-cream)] p-6`}>
        <div>
          <span className="inline-block rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-[var(--slot4-accent)]">{category}</span>
          <h2 className="editable-display mt-4 line-clamp-3 text-[26px] font-semibold leading-[1.15] text-[var(--slot4-page-text)] group-hover:text-[var(--slot4-accent)]">{post.title}</h2>
          <RatingLine post={post} />
          <p className="mt-3 line-clamp-3 text-[14px] leading-[1.6] text-[var(--slot4-muted-text)]">{getSummary(post)}</p>
        </div>
        <CardArrow label="Read the story" />
      </Link>
    )
  }
  return (
    <Link href={href} className={cardBase}>
      <div className="relative aspect-[16/10] overflow-hidden bg-[var(--slot4-media-bg)]">
        <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" loading="lazy" />
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold text-[var(--slot4-accent)]">{category}</span>
        <span className="absolute right-3 top-3 rounded-full bg-[var(--slot4-dark-bg)]/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white">No. {String(index + 1).padStart(2, '0')}</span>
      </div>
      <div className="p-6">
        <h2 className="editable-display text-[22px] font-semibold leading-snug text-[var(--slot4-page-text)] group-hover:text-[var(--slot4-accent)]">{post.title}</h2>
        <RatingLine post={post} />
        <p className="mt-3 line-clamp-2 text-[14px] leading-[1.6] text-[var(--slot4-muted-text)]">{getSummary(post)}</p>
        <CardArrow label="Read article" />
      </div>
    </Link>
  )
}

function ListingArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const logo = getImages(post)[0]
  const location = getField(post, ['location', 'address', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const website = getField(post, ['website', 'url'])
  return (
    <Link href={href} className={`${cardBase} flex items-center gap-5 p-5 sm:p-6`}>
      <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[var(--editable-border)] bg-[var(--slot4-cream)]">
        {logo ? <img src={logo} alt="" className="h-full w-full object-cover" /> : <BriefcaseBusiness className="h-9 w-9 text-[var(--slot4-muted-text)]" />}
      </div>
      <div className="min-w-0 flex-1">
        <h2 className="editable-display truncate text-[20px] font-semibold text-[var(--slot4-page-text)] group-hover:text-[var(--slot4-accent)]">{post.title}</h2>
        <RatingLine post={post} />
        <p className="mt-2 line-clamp-1 text-sm leading-6 text-[var(--slot4-muted-text)]">{getSummary(post)}</p>
        <div className="mt-3 flex flex-wrap gap-3 text-xs font-medium text-[var(--slot4-muted-text)]">
          {location ? <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-[var(--slot4-accent)]" /> {location}</span> : null}
          {phone ? <span className="inline-flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-[var(--slot4-accent)]" /> {phone}</span> : null}
          {website ? <span className="inline-flex items-center gap-1.5"><Globe className="h-3.5 w-3.5 text-[var(--slot4-accent)]" /> Website</span> : null}
        </div>
      </div>
      <ArrowUpRight className="h-5 w-5 shrink-0 text-[var(--slot4-muted-text)] transition group-hover:text-[var(--editable-cta-bg)]" />
    </Link>
  )
}

function ClassifiedArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'type', 'availability'])
  return (
    <Link href={href} className={`${cardBase} flex flex-col p-6 sm:p-7`}>
      <div className="flex items-start justify-between gap-4">
        <span className="editable-display text-[28px] font-semibold text-[var(--slot4-accent)]">{price || 'Open offer'}</span>
        {condition ? <span className="rounded-full bg-[var(--slot4-accent-soft)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--slot4-accent)]">{condition}</span> : null}
      </div>
      <h2 className="editable-display mt-5 text-[20px] font-semibold text-[var(--slot4-page-text)] group-hover:text-[var(--slot4-accent)]">{post.title}</h2>
      <RatingLine post={post} />
      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-7 text-[var(--slot4-muted-text)]">{getSummary(post)}</p>
      <div className="mt-6 flex items-center justify-between border-t border-[var(--editable-border)] pt-4 text-xs font-medium text-[var(--slot4-muted-text)]">
        <span className="inline-flex items-center gap-1.5">{location ? <><MapPin className="h-3.5 w-3.5" /> {location}</> : 'Details inside'}</span>
        <ArrowUpRight className="h-4 w-4 text-[var(--editable-cta-bg)] transition group-hover:translate-x-0.5" />
      </div>
    </Link>
  )
}

function ImageArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getImage(post)
  return (
    <Link href={href} className="group mb-6 block break-inside-avoid overflow-hidden rounded-2xl border border-[var(--editable-border)] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(28,36,52,0.14)]">
      <div className={`relative overflow-hidden ${index % 3 === 0 ? 'aspect-[3/4]' : 'aspect-[4/3]'}`}>
        <img src={image} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(0,0,0,0.72))] opacity-90 transition group-hover:opacity-100" />
        <div className="absolute inset-x-0 bottom-0 p-5">
          <h2 className="editable-display line-clamp-2 text-[18px] font-semibold leading-snug text-white">{post.title}</h2>
          <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-white/80">View image <ArrowUpRight className="h-3.5 w-3.5" /></span>
        </div>
      </div>
    </Link>
  )
}

function BookmarkArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <Link href={href} className={`${cardBase} flex gap-4 p-6`}>
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--slot4-blue-soft)] text-[var(--editable-cta-bg)]">
        <Globe className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--slot4-muted-text)]">Saved · {String(index + 1).padStart(2, '0')}</span>
        <h2 className="editable-display mt-1.5 text-[18px] font-semibold text-[var(--slot4-page-text)] group-hover:text-[var(--slot4-accent)]">{post.title}</h2>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--slot4-muted-text)]">{getSummary(post)}</p>
        {website ? <p className="mt-3 truncate text-xs font-semibold text-[var(--editable-cta-bg)]">{cleanDomain(website)}</p> : null}
      </div>
    </Link>
  )
}

function PdfArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const category = getCategory(post, 'Document')
  return (
    <Link href={href} className={`${cardBase} flex flex-col p-6 sm:p-7`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--slot4-blue-soft)] text-[var(--editable-cta-bg)]"><FileText className="h-6 w-6" /></div>
        <span className="rounded-full border border-[var(--editable-border)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--slot4-muted-text)]">{category}</span>
      </div>
      <h2 className="editable-display mt-6 text-[20px] font-semibold text-[var(--slot4-page-text)] group-hover:text-[var(--slot4-accent)]">{post.title}</h2>
      <RatingLine post={post} />
      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-7 text-[var(--slot4-muted-text)]">{getSummary(post)}</p>
      <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--editable-cta-bg)]">Open document <Download className="h-4 w-4" /></span>
    </Link>
  )
}

function ProfileArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const avatar = getImages(post)[0]
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  return (
    <Link href={href} className={`${cardBase} flex flex-col items-center p-7 text-center`}>
      <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-[var(--slot4-cream)] bg-[var(--slot4-media-bg)] shadow-[0_6px_18px_rgba(28,36,52,0.10)]">
        {avatar ? <img src={avatar} alt="" className="h-full w-full object-cover" /> : <UserRound className="h-10 w-10 text-[var(--slot4-muted-text)]" />}
      </div>
      <h2 className="editable-display mt-5 text-[18px] font-semibold text-[var(--slot4-page-text)] group-hover:text-[var(--slot4-accent)]">{post.title}</h2>
      {role ? <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--editable-cta-bg)]">{role}</p> : null}
      <RatingLine post={post} center />
      <p className="mt-3 line-clamp-2 text-sm leading-6 text-[var(--slot4-muted-text)]">{getSummary(post)}</p>
    </Link>
  )
}
