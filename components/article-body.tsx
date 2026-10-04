import Image from "next/image"
import { PortableText, type PortableTextComponents } from "@portabletext/react"
import type { PortableTextBlock } from "@portabletext/types"
import { imageUrl } from "@/src/sanity/images"
const components: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      const url = imageUrl(value)
      return url ? (
        <figure>
          <Image
            src={url}
            alt={value.alt || ""}
            width={1320}
            height={880}
            sizes="(max-width: 700px) 100vw, 660px"
            className="article-cover"
          />
          {value.caption && <figcaption>{value.caption}</figcaption>}
        </figure>
      ) : null
    },
    codeBlock: ({ value }) => (
      <pre>
        <code>{value.code}</code>
      </pre>
    ),
  },
  marks: {
    link: ({ value, children }) => {
      const href =
        typeof value?.href === "string" &&
        /^(https?:\/\/|mailto:)/i.test(value.href)
          ? value.href
          : undefined
      return href ? (
        <a href={href} rel="noopener noreferrer">
          {children}
        </a>
      ) : (
        <>{children}</>
      )
    },
  },
}
export function ArticleBody({ body }: { body: PortableTextBlock[] }) {
  return (
    <div className="article-body">
      <PortableText value={body} components={components} />
    </div>
  )
}
