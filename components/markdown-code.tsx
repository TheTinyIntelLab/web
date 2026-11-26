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
    children: string
  }>
  const code = element.props.children.replace(/\n$/, "")
  const language =
    element.props.className?.match(/language-(\S+)/)?.[1] ?? "text"
  const lines = (await highlightCode(code, language)) ?? code.split("\n")
  return (
    <CodeBlock>
      <CodeBlockHeader>
        <CodeBlockTitle>{language}</CodeBlockTitle>
        <CodeBlockActions>
          <CodeBlockCopyButton value={code} />
        </CodeBlockActions>
      </CodeBlockHeader>
      <CodeBlockContent lineNumbers aria-label={`${language} code`}>
        {lines.map((line, index) => (
          <CodeBlockLine key={index}>{line}</CodeBlockLine>
        ))}
      </CodeBlockContent>
    </CodeBlock>
  )
}
