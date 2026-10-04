import type { Metadata } from "next"
import Link from "next/link"
import { SiteShell } from "@/components/site-shell"
import { Separator } from "@/components/ui/separator"
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty"
import { getPosts, formatDate } from "@/src/sanity/posts"
export const metadata: Metadata = {
  title: "Journal",
  description:
    "Research notes, experiments, and updates from The Tiny Intelligence Lab.",
  alternates: { canonical: "/blog" },
  twitter: {
    card: "summary_large_image",
    title: "Journal",
    description:
      "Research notes, experiments, and updates from The Tiny Intelligence Lab.",
    images: ["/opengraph-image"],
  },
  openGraph: {
    title: "Journal",
    description:
      "Research notes, experiments, and updates from The Tiny Intelligence Lab.",
    url: "/blog",
  },
}
export const revalidate = 60
export default async function Blog() {
  const posts = await getPosts()
  return (
    <SiteShell>
      <div className="reading-column">
        <header className="journal-heading">
          <Link href="/" className="post-date">
            The Tiny Intelligence Lab
          </Link>
          <h1 className="mt-6">Notes from the lab</h1>
          <p>
            What we&apos;re trying, what we&apos;re learning, and what still
            needs work.
          </p>
        </header>
        {posts.length ? (
          posts.map((post) => (
            <article key={post._id}>
              <Separator />
              <Link href={`/blog/${post.slug}`} className="post-row group">
                <time className="post-date" dateTime={post.publishedAt}>
                  {formatDate(post.publishedAt)}
                </time>
                <h2 className="group-hover:underline">
                  {post.title} <span aria-hidden="true">↗</span>
                </h2>
                <p>{post.summary}</p>
              </Link>
            </article>
          ))
        ) : (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>We&apos;re still at the bench.</EmptyTitle>
              <EmptyDescription>
                Our first research notes will appear here. Until then, meet Opal
                and read about the questions behind the lab.
              </EmptyDescription>
            </EmptyHeader>
            <Link href="/#opal" className="underline">
              Meet Opal
            </Link>
          </Empty>
        )}
      </div>
    </SiteShell>
  )
}
