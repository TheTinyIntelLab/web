import { createImageUrlBuilder } from "@sanity/image-url"
import type { SanityImageSource } from "@sanity/image-url"
import { projectId, dataset, isSanityConfigured } from "./env"
export function imageUrl(source: SanityImageSource, width = 1320) {
  if (!isSanityConfigured) return null
  return createImageUrlBuilder({ projectId, dataset })
    .image(source)
    .width(width)
    .fit("max")
    .auto("format")
    .url()
}
