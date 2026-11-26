import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"
import type { Heading, Root } from "mdast"
import { toString } from "mdast-util-to-string"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { MarkdownCode } from "@/components/markdown-code"
function headingNavigation() {
  return (tree: Root) => {
    const headings = tree.children.filter(
      (node): node is Heading =>
        node.type === "heading" &&
        Boolean(toString(node, { includeHtml: false }).trim())
    )
    if (!headings.length) return
    tree.children.unshift({
      type: "paragraph",
      data: {
        hName: "nav",
        hProperties: {
          "aria-label": "On this page",
          className:
            "mb-6 flex flex-wrap gap-x-5 gap-y-3 border-y py-5 font-heading text-xs text-muted-foreground".split(
              " "
            ),
        },
      },
      children: headings.map((heading, index) => {
        const id = `article-section-${index + 1}`
        heading.data = {
          ...heading.data,
          hProperties: { ...heading.data?.hProperties, id },
        }
        return {
          type: "link",
          url: `#${id}`,
          data: {
            hProperties: {
              "data-toc-link": true,
              className: ["hover:text-foreground", "hover:underline"],
            },
          },
          children: [
            { type: "text", value: toString(heading, { includeHtml: false }) },
          ],
        }
      }),
    })
  }
}

export function ArticleBody({
  body,
  navigation = false,
}: {
  body: string
  navigation?: boolean
}) {
  return (
    <div className="flex min-w-0 flex-col gap-6 text-[17px] leading-relaxed break-words sm:text-lg [&_:is(h1,h2,h3,h4,h5,h6)]:scroll-mt-8 [&_a:not([data-toc-link])]:underline [&_blockquote]:space-y-4 [&_blockquote]:border-l-2 [&_blockquote]:border-primary [&_blockquote]:pl-6 [&_blockquote]:text-muted-foreground [&_code:not([data-slot])]:rounded [&_code:not([data-slot])]:bg-muted [&_code:not([data-slot])]:px-1 [&_code:not([data-slot])]:text-[0.85em] [&_h1]:mt-6 [&_h1]:text-3xl [&_h1]:leading-snug [&_h2]:mt-6 [&_h2]:text-[22px] [&_h2]:leading-snug [&_h3]:mt-4 [&_h3]:text-lg [&_h3]:leading-snug [&_h4]:font-medium [&_h5]:font-medium [&_h6]:font-medium [&_hr]:border-border [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-lg [&_li]:my-1 [&_li>p]:my-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_pre]:min-w-0 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-2 [&_th]:border [&_th]:border-border [&_th]:px-3 [&_th]:py-2 [&_ul]:list-disc [&_ul]:pl-6">
      <Markdown
        remarkPlugins={
          navigation ? [remarkGfm, headingNavigation] : [remarkGfm]
        }
        skipHtml
        components={{
          pre: MarkdownCode,
          table: ({ children }) => (
            <Table className="border-collapse text-left text-base">
              {children}
            </Table>
          ),
          thead: ({ children }) => <TableHeader>{children}</TableHeader>,
          tbody: ({ children }) => <TableBody>{children}</TableBody>,
          tr: ({ children }) => <TableRow>{children}</TableRow>,
          th: ({ children, style }) => (
            <TableHead scope="col" style={style}>
              {children}
            </TableHead>
          ),
          td: ({ children, style }) => (
            <TableCell style={style}>{children}</TableCell>
          ),
          hr: () => <Separator />,
        }}
      >
        {body}
      </Markdown>
    </div>
  )
}
