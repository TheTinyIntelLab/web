import { Children, type ReactElement, type ReactNode } from "react"
import { highlightCode } from "@/lib/highlighter"
import {
  CodeBlock,
  CodeBlockHeader,
  CodeBlockTitle,
  CodeBlockActions,
  CodeBlockCopyButton,
  CodeBlockContent,
  CodeBlockLine,
} from "@/components/ui/code-block"

export async function MarkdownCode({ children }: { children?: ReactNode }) {
  const element = Children.only(children) as ReactElement<{
    className?: string
    children?: string
  }>
  const code = (element.props.children ?? "").replace(/\n$/, "")
  const language =
    element.props.className?.match(/language-(\S+)/)?.[1] ?? "text"
  const sourceLines = code.split("\n")
  const highlighted = await highlightCode(code, language)
  const lines = []
  let offset = 0
  for (const [index, line] of sourceLines.entries()) {
    lines.push({ offset, content: highlighted?.[index] ?? line })
    offset += line.length + 1
  }
  return (
    <CodeBlock>
      <CodeBlockHeader>
        <CodeBlockTitle>{language}</CodeBlockTitle>
        <CodeBlockActions>
          <CodeBlockCopyButton value={code} />
        </CodeBlockActions>
      </CodeBlockHeader>
      <CodeBlockContent aria-label={`${language} code`}>
        {lines.map(({ offset, content }) => (
          <CodeBlockLine key={offset}>{content}</CodeBlockLine>
        ))}
      </CodeBlockContent>
    </CodeBlock>
  )
}
