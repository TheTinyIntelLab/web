import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"
export function ArticleBody({ body }: { body: string }) {
  return (
    <div className="flex min-w-0 flex-col gap-6 text-[17px] leading-relaxed break-words sm:text-lg [&_a]:underline [&_blockquote]:space-y-4 [&_blockquote]:border-l-2 [&_blockquote]:border-primary [&_blockquote]:pl-6 [&_blockquote]:text-muted-foreground [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:text-[0.85em] [&_h1]:mt-6 [&_h1]:text-3xl [&_h1]:leading-snug [&_h2]:mt-6 [&_h2]:text-[22px] [&_h2]:leading-snug [&_h3]:mt-4 [&_h3]:text-lg [&_h3]:leading-snug [&_h4]:font-medium [&_h5]:font-medium [&_h6]:font-medium [&_hr]:border-border [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-lg [&_li]:my-1 [&_li>p]:my-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_pre]:min-w-0 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-2 [&_th]:border [&_th]:border-border [&_th]:px-3 [&_th]:py-2 [&_ul]:list-disc [&_ul]:pl-6">
      <Markdown
        remarkPlugins={[remarkGfm]}
        skipHtml
        components={{
          pre: ({ children }) => (
            <pre className="overflow-x-auto rounded-lg bg-muted p-5 text-sm">
              {children}
            </pre>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-base">
                {children}
              </table>
            </div>
          ),
        }}
      >
        {body}
      </Markdown>
    </div>
  )
}
