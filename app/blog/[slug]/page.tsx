import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { SiteShell } from "@/components/site-shell"
import { ArticleBody } from "@/components/article-body"
import { JsonLd } from "@/components/json-ld"
import { getPost, formatDate } from "@/src/sanity/posts"
import { imageUrl } from "@/src/sanity/images"
import { site } from "@/src/lib/site"
type Props = { params: Promise<{ slug: string }> }
export const revalidate = 60
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return { title: "Article not found", robots: { index: false } }
  const cover = post.coverImage ? imageUrl(post.coverImage, 1200) : null
  return {
    title: post.title,
    description: post.summary,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.summary,
      url: `/blog/${post.slug}`,
      publishedTime: post.publishedAt,
      modifiedTime: post._updatedAt,
      images: cover
        ? [{ url: cover, alt: post.coverImage!.alt }]
        : [{ url: "/opengraph-image" }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary,
      images: [cover || "/opengraph-image"],
    },
  }
}
export default async function Article({ params }: Props) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()
  const cover = post.coverImage ? imageUrl(post.coverImage) : null
  return (
    <SiteShell>
      <article className="reading-column">
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.summary,
            datePublished: post.publishedAt,
            dateModified: post._updatedAt,
            url: `${site.url}/blog/${post.slug}`,
            mainEntityOfPage: `${site.url}/blog/${post.slug}`,
            author: { "@type": "Organization", name: site.name, url: site.url },
            publisher: {
              "@type": "Organization",
              name: site.name,
              logo: { "@type": "ImageObject", url: `${site.url}/logo.png` },
            },
            image: cover || `${site.url}/opengraph-image`,
          }}
        />
        <header className="journal-heading">
          <Link href="/blog" className="post-date">
            ← Back to the journal
          </Link>
          <h1 className="mt-8">{post.title}</h1>
          <p>{post.summary}</p>
          <div className="post-date mt-6">
            <time dateTime={post.publishedAt}>
              {formatDate(post.publishedAt)}
            </time>{" "}
            · The Tiny Intelligence Lab
          </div>
        </header>
        {cover && (
          <Image
            src={cover}
            alt={post.coverImage!.alt}
            width={1320}
            height={880}
            sizes="(max-width: 700px) 100vw, 660px"
            priority
            className="article-cover"
          />
        )}
        <ArticleBody body={post.body} />
      </article>
    </SiteShell>
  )
}
