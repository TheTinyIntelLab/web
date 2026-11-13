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
  title: "Blog & announcements",
  description:
    "Research, model releases, and announcements from The Tiny Intelligence Lab.",
  alternates: { canonical: "/blog" },
  twitter: {
    card: "summary_large_image",
    title: "Blog & announcements",
    description:
      "Research, model releases, and announcements from The Tiny Intelligence Lab.",
    images: ["/opengraph-image"],
  },
  openGraph: {
    title: "Blog & announcements",
    description:
      "Research, model releases, and announcements from The Tiny Intelligence Lab.",
    url: "/blog",
  },
}
export const revalidate = 60
export default async function Blog() {
  const posts = await getPosts()
  return (
    <SiteShell>
      <div className="mx-auto w-[calc(100%-40px)] max-w-[660px] sm:w-[calc(100%-48px)]">
        <header className="pt-13 pb-20 sm:pt-22 sm:pb-24">
          <Link href="/" className="font-heading text-xs text-muted-foreground">
            The Tiny Intelligence Lab
          </Link>
          <h1 className="mt-6 text-[clamp(2.2rem,5vw,3rem)] leading-[1.15] font-normal tracking-[-0.06em]">
            Blog &amp; announcements
          </h1>
          <p className="mt-5 text-lg leading-relaxed">
            Research, model releases, and announcements from the lab.
          </p>
        </header>
        {posts.length ? (
          posts.map((post) => (
            <article key={post._id}>
              <Separator />
              <Link
                href={`/blog/${post.slug}`}
                className="group flex flex-col gap-3 py-7"
              >
                <time
                  className="font-heading text-xs text-muted-foreground"
                  dateTime={post.publishedAt}
                >
                  {formatDate(post.publishedAt)}
                </time>
                <h2 className="text-lg font-medium tracking-tight group-hover:underline">
                  {post.title} <span aria-hidden="true">↗</span>
                </h2>
                <p className="text-lg leading-relaxed">{post.summary}</p>
              </Link>
            </article>
          ))
        ) : (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No posts yet.</EmptyTitle>
              <EmptyDescription>
                Research and announcements will appear here. For now, read about
                Opal.
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
