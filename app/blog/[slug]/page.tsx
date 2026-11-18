import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons"
import { notFound } from "next/navigation"
import { SiteShell } from "@/components/site-shell"
import { ArticleBody } from "@/components/article-body"
import { JsonLd } from "@/components/json-ld"
import {
  getPost,
  getPosts,
  formatDate,
  postModificationDate,
} from "@/src/sanity/posts"
import { imageUrl } from "@/src/sanity/images"
import { labOrganization, site } from "@/src/lib/site"
type Props = { params: Promise<{ slug: string }> }
export const dynamic = "force-static"
export const revalidate = 60

export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()
  const cover = post.coverImage && imageUrl(post.coverImage, 1200)
  return {
    title: post.title,
    description: post.summary,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      siteName: site.name,
      title: post.title,
      description: post.summary,
      url: `/blog/${post.slug}`,
      publishedTime: post.publishedAt,
      modifiedTime: postModificationDate(post),
      images: cover
        ? [{ url: cover, alt: post.coverImage?.alt }]
        : [site.socialImage],
    },
    twitter: { card: "summary_large_image" },
  }
}
export default async function Article({ params }: Props) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()
  const cover = post.coverImage && imageUrl(post.coverImage)
  const url = new URL(`/blog/${post.slug}`, site.url).href
  const blogUrl = new URL("/blog", site.url).href
  return (
    <SiteShell>
      <article className="mx-auto w-[calc(100%-40px)] max-w-[660px] sm:w-[calc(100%-48px)]">
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.summary,
            datePublished: post.publishedAt,
            dateModified: postModificationDate(post),
            url,
            mainEntityOfPage: url,
            inLanguage: "en",
            author: labOrganization,
            publisher: { "@id": labOrganization["@id"] },
            image: cover || undefined,
          }}
        />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Blog",
                item: blogUrl,
              },
              { "@type": "ListItem", position: 2, name: post.title, item: url },
            ],
          }}
        />
        <header className="pt-13 pb-20 sm:pt-22 sm:pb-24">
          <nav aria-label="Breadcrumb">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 font-heading text-xs text-muted-foreground hover:underline"
            >
              <HugeiconsIcon
                icon={ArrowLeft01Icon}
                size={20}
                strokeWidth={1.5}
                aria-hidden="true"
              />
              Blog
            </Link>
          </nav>
          <h1 className="mt-8 text-[clamp(2.2rem,5vw,3rem)] leading-[1.15] font-normal tracking-[-0.06em]">
            {post.title}
          </h1>
          <p className="mt-5 text-lg leading-relaxed">{post.summary}</p>
          <div className="mt-6 font-heading text-xs text-muted-foreground">
            <Link href="/" className="hover:underline">
              {site.name}
            </Link>
            <span aria-hidden="true" className="mx-2">
              ·
            </span>
            <time dateTime={post.publishedAt}>
              {formatDate(post.publishedAt)}
            </time>
          </div>
        </header>
        {post.coverImage && cover && (
          <Image
            src={cover}
            alt={post.coverImage.alt}
            width={1320}
            height={880}
            sizes="(max-width: 1030px) calc(100vw - 40px), 990px"
            preload
            className="relative left-1/2 mb-9 h-auto w-[min(150%,calc(100vw-40px))] max-w-none -translate-x-1/2 rounded-lg"
          />
        )}
        <ArticleBody body={post.markdown} />
      </article>
    </SiteShell>
  )
}
