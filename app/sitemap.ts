import type { MetadataRoute } from "next"
import { site } from "@/src/lib/site"
import { getPosts, postModificationDate } from "@/src/sanity/posts"
export const revalidate = 60
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!site.indexable) return []

  const posts = await getPosts()
  return [
    { url: site.url },
    { url: new URL("/blog", site.url).href },
    { url: new URL("/opal-bench", site.url).href },
    ...posts.map((post) => ({
      url: new URL(`/blog/${post.slug}`, site.url).href,
      lastModified: postModificationDate(post) ?? post.publishedAt,
    })),
  ]
}
