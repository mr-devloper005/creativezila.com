import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Filter, Search } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { fetchSiteFeed } from '@/lib/site-connector'
import { getPostTaskKey } from '@/lib/task-data'
import { getMockPostsForTask } from '@/lib/mock-posts'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { pagesContent } from '@/editable/content/pages.content'
import { Ads } from '@/lib/ads'

export const revalidate = 3

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/search',
    title: pagesContent.search.metadata.title,
    description: pagesContent.search.metadata.description,
  })
}

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ')
const compactText = (value: unknown) => typeof value === 'string' ? stripHtml(value).replace(/\s+/g, ' ').trim().toLowerCase() : ''
const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const compactRaw = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const getImage = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.find((item) => typeof item?.url === 'string')?.url : ''
  const images = Array.isArray(content.images) ? content.images.find((item) => typeof item === 'string') as string | undefined : ''
  return media || compactRaw(content.featuredImage) || compactRaw(content.image) || compactRaw(content.thumbnail) || images || ''
}
const summaryOf = (post: SitePost) => post.summary || compactRaw(getContent(post).description) || compactRaw(getContent(post).excerpt) || ''

const matches = (post: SitePost, query: string, category: string, task: string) => {
  const content = getContent(post)
  const typeText = compactText(content.type)
  if (typeText === 'comment') return false
  const derivedTask = getPostTaskKey(post) || typeText
  if (task && derivedTask !== task) return false
  const categoryText = compactText(content.category)
  const tagsText = compactText(Array.isArray(post.tags) ? post.tags.join(' ') : '')
  if (category && !(categoryText || tagsText).includes(category)) return false
  if (!query) return true
  return [post.title, post.summary, content.description, content.body, content.excerpt, content.category, Array.isArray(post.tags) ? post.tags.join(' ') : '']
    .some((value) => compactText(value).includes(query))
}

function SearchResultCard({ post, index }: { post: SitePost; index: number }) {
  const task = getPostTaskKey(post) as TaskKey | null
  const taskRoute = SITE_CONFIG.tasks.find((item) => item.key === task)?.route
  const href = `${taskRoute || `/${task || 'article'}`}/${post.slug}`
  const image = getImage(post)
  const summary = summaryOf(post)
  const taskLabel = SITE_CONFIG.tasks.find((item) => item.key === task)?.label || 'Post'
  const variant = index % 3

  if (variant === 1) {
    return (
      <Link href={href} className="group flex flex-col justify-between rounded-2xl bg-[var(--slot4-cream)] p-6 transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(28,36,52,0.14)]">
        <div>
          <span className="inline-block rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-[var(--slot4-accent)]">{taskLabel}</span>
          <h2 className="editable-display mt-4 line-clamp-3 text-[24px] font-semibold leading-[1.15] text-[var(--slot4-page-text)] group-hover:text-[var(--slot4-accent)]">{post.title}</h2>
          {summary ? <p className="mt-3 line-clamp-3 text-[14px] leading-[1.6] text-[var(--slot4-muted-text)]">{summary}</p> : null}
        </div>
        <span className="mt-6 inline-flex items-center gap-1 text-[13px] font-semibold text-[var(--slot4-accent)]">Open result <ArrowRight className="h-4 w-4" /></span>
      </Link>
    )
  }
  if (variant === 2) {
    return (
      <Link href={href} className="group flex gap-4 rounded-2xl border border-[var(--editable-border)] bg-white p-3 transition hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(28,36,52,0.12)]">
        <div className="relative aspect-square h-24 shrink-0 overflow-hidden rounded-xl bg-[var(--slot4-media-bg)]">
          {image ? <img src={image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" /> : null}
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-center pr-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--slot4-accent)]">{taskLabel}</p>
          <h2 className="mt-1 line-clamp-2 text-[15px] font-semibold text-[var(--slot4-page-text)] group-hover:text-[var(--slot4-accent)]">{post.title}</h2>
          {summary ? <p className="mt-1 line-clamp-1 text-[13px] text-[var(--slot4-muted-text)]">{summary}</p> : null}
        </div>
      </Link>
    )
  }
  return (
    <Link href={href} className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--editable-border)] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(28,36,52,0.14)]">
      {image ? (
        <div className="relative aspect-[5/3] overflow-hidden bg-[var(--slot4-media-bg)]">
          <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold text-[var(--slot4-accent)]">{taskLabel}</span>
        </div>
      ) : (
        <div className="border-b border-[var(--editable-border)] bg-[var(--slot4-cream)] px-5 py-3">
          <span className="inline-block rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-[var(--slot4-accent)]">{taskLabel}</span>
        </div>
      )}
      <div className="p-5">
        <h2 className="editable-display line-clamp-2 text-[19px] font-semibold text-[var(--slot4-page-text)] group-hover:text-[var(--slot4-accent)]">{post.title}</h2>
        {summary ? <p className="mt-2 line-clamp-2 text-[14px] leading-[1.6] text-[var(--slot4-muted-text)]">{summary}</p> : null}
        <span className="mt-4 inline-flex items-center gap-1 text-[13px] font-semibold text-[var(--editable-cta-bg)]">Open result <ArrowRight className="h-4 w-4" /></span>
      </div>
    </Link>
  )
}

export default async function SearchPage({ searchParams }: { searchParams?: Promise<{ q?: string; category?: string; task?: string; master?: string }> }) {
  const resolved = (await searchParams) || {}
  const query = (resolved.q || '').trim()
  const normalized = query.toLowerCase()
  const category = (resolved.category || '').trim().toLowerCase()
  const task = (resolved.task || '').trim().toLowerCase()
  const useMaster = resolved.master !== '0'
  const feed = await fetchSiteFeed(useMaster ? 1000 : 300, useMaster ? { fresh: true, category: category || undefined, task: task || undefined } : undefined)
  const posts = feed?.posts?.length ? feed.posts : useMaster ? [] : SITE_CONFIG.tasks.filter((item) => item.enabled).flatMap((item) => getMockPostsForTask(item.key))
  const results = posts.filter((post) => matches(post, normalized, category, task)).slice(0, normalized ? 80 : 36)
  const enabledTasks = SITE_CONFIG.tasks.filter((item) => item.enabled)

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-white text-[var(--slot4-page-text)]">
        <section className="relative overflow-hidden bg-[var(--slot4-cream)]">
          <div className="mx-auto grid max-w-[var(--editable-container)] gap-10 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-14 lg:px-10 lg:py-24">
            <div>
              <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-[var(--slot4-accent)]">
                {pagesContent.search.hero.badge || 'Search'}
              </p>
              <h1 className="editable-display mt-4 text-balance text-[42px] font-semibold leading-[1.05] text-[var(--slot4-page-text)] sm:text-[56px] lg:text-[62px]">
                {pagesContent.search.hero.title || 'Find what you\'re looking for.'}
              </h1>
              <p className="mt-6 max-w-lg text-[17px] leading-[1.6] text-[var(--slot4-muted-text)]">
                {pagesContent.search.hero.description}
              </p>
            </div>

            <form action="/search" className="rounded-2xl border border-[var(--editable-border)] bg-white p-5 shadow-[0_10px_30px_rgba(28,36,52,0.08)] sm:p-6">
              <input type="hidden" name="master" value="1" />
              <label className="flex items-center gap-3 rounded-lg border border-[var(--editable-border)] bg-[var(--slot4-cream)] px-4 py-3">
                <Search className="h-5 w-5 text-[var(--slot4-accent)]" />
                <input
                  name="q"
                  defaultValue={query}
                  placeholder={pagesContent.search.hero.placeholder || 'Search the directory…'}
                  className="min-w-0 flex-1 bg-transparent text-[15px] font-medium text-[var(--slot4-page-text)] outline-none placeholder:text-[var(--slot4-muted-text)]"
                />
              </label>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <label className="flex items-center gap-2 rounded-lg border border-[var(--editable-border)] bg-white px-4 py-3">
                  <Filter className="h-4 w-4 text-[var(--slot4-accent)]" />
                  <input name="category" defaultValue={category} placeholder="Category" className="min-w-0 flex-1 bg-transparent text-[14px] font-medium outline-none placeholder:text-[var(--slot4-muted-text)]" />
                </label>
                <select name="task" defaultValue={task} className="rounded-lg border border-[var(--editable-border)] bg-white px-4 py-3 text-[14px] font-semibold outline-none">
                  <option value="">All types</option>
                  {enabledTasks.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
                </select>
              </div>
              <button className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[var(--editable-cta-bg)] text-sm font-semibold text-white transition hover:brightness-110" type="submit">
                Search now <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[70px] bg-white [clip-path:polygon(0_100%,100%_60%,100%_100%,0_100%)]" />
        </section>

        <section className="mx-auto max-w-[var(--editable-container)] px-5 py-14 sm:px-8 sm:py-20 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-[var(--slot4-accent)]">{results.length} results</p>
                  <h2 className="editable-display mt-2 text-[28px] font-semibold text-[var(--slot4-page-text)] sm:text-[34px]">
                    {query ? `Results for “${query}”` : pagesContent.search.resultsTitle || 'Latest across the directory'}
                  </h2>
                </div>
                <Link href="/article" className="inline-flex items-center gap-2 text-[14px] font-semibold text-[var(--editable-cta-bg)] hover:underline">
                  Browse latest <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {results.length ? (
                <div className="mt-8 grid gap-6 md:grid-cols-2">
                  {results.map((post, index) => <SearchResultCard key={post.id || post.slug} post={post} index={index} />)}
                </div>
              ) : (
                <div className="mt-8 rounded-2xl border border-dashed border-[var(--editable-border)] bg-[var(--slot4-cream)] p-10 text-center">
                  <p className="editable-display text-[24px] font-semibold text-[var(--slot4-page-text)]">No matching posts found.</p>
                  <p className="mt-2 text-[14px] text-[var(--slot4-muted-text)]">Try a different keyword, category, or content type.</p>
                </div>
              )}
            </div>

            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="mx-auto max-w-6xl px-4 py-6">
                <Ads slot="sidebar" showLabel eager className="mx-auto w-full" />
              </div>
              <div className="mt-4 rounded-2xl border border-[var(--editable-border)] bg-[var(--slot4-cream)] p-6">
                <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[var(--slot4-accent)]">Popular sections</p>
                <div className="mt-4 grid gap-2.5">
                  {enabledTasks.slice(0, 6).map((item) => (
                    <Link key={item.key} href={item.route} className="text-[14px] font-semibold text-[var(--slot4-page-text)] underline decoration-[var(--editable-border)] underline-offset-[6px] transition hover:text-[var(--slot4-accent)] hover:decoration-[var(--slot4-accent)]">
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
