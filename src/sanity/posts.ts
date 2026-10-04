import "server-only"
import { cache } from "react"
import { defineQuery } from "next-sanity"
import type { PortableTextBlock } from "@portabletext/types"
import type { SanityImageSource } from "@sanity/image-url"
import { client } from "./client"
export type Post = {
  _id: string
  _updatedAt: string
  title: string
  slug: string
  summary: string
  publishedAt: string
  coverImage?: SanityImageSource & { alt: string }
  body: PortableTextBlock[]
}
const postsQuery =
  defineQuery(`*[_type == "post" && defined(slug.current) && publishedAt <= now()] | order(publishedAt desc) {
  _id, _updatedAt, title, "slug": slug.current, summary, publishedAt, coverImage
}`)
const postQuery =
  defineQuery(`*[_type == "post" && slug.current == $slug && publishedAt <= now()][0] {
  _id, _updatedAt, title, "slug": slug.current, summary, publishedAt, coverImage, body
}`)
export const getPosts = cache(async (): Promise<Post[]> => {
  if (!client) return []
  return client.fetch(postsQuery, {}, { next: { revalidate: 60 } })
})
export const getPost = cache(async (slug: string): Promise<Post | null> => {
  if (!client) return null
  return client.fetch(postQuery, { slug }, { next: { revalidate: 60 } })
})
const dateFormatter = new Intl.DateTimeFormat("en", {
  dateStyle: "long",
  timeZone: "UTC",
})
export function formatDate(date: string) {
  return dateFormatter.format(new Date(date))
}
