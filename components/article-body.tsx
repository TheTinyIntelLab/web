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
            className="h-auto w-full rounded-lg"
          />
          {value.caption && (
            <figcaption className="mt-2.5 text-sm text-muted-foreground">
              {value.caption}
            </figcaption>
          )}
        </figure>
      ) : null
    },
    codeBlock: ({ value }) => (
      <pre className="overflow-x-auto rounded-lg bg-muted p-5 text-sm">
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
        <a href={href} rel="noopener noreferrer" className="underline">
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
    <div className="flex flex-col gap-6 text-[17px] leading-relaxed sm:text-lg [&_blockquote]:border-l-2 [&_blockquote]:border-primary [&_blockquote]:pl-6 [&_blockquote]:text-muted-foreground [&_h2]:mt-6 [&_h2]:text-[22px] [&_h2]:leading-snug [&_h3]:mt-4 [&_h3]:text-lg [&_h3]:leading-snug [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6">
      <PortableText value={body} components={components} />
    </div>
  )
}
