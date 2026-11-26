"use client"

import * as React from "react"
import { cn } from "cn"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { Tick02Icon, Copy01Icon } from "@hugeicons/core-free-icons"

function CodeBlock({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="code-block"
      className={cn(
        "group/code-block relative flex w-full min-w-0 flex-col overflow-hidden rounded-xl border border-input text-sm text-foreground has-[>[data-slot=code-block-content]:focus-visible]:border-ring has-[>[data-slot=code-block-content]:focus-visible]:ring-[3px] has-[>[data-slot=code-block-content]:focus-visible]:ring-ring/50 dark:bg-input/30",
        className
      )}
      {...props}
    />
  )
}

function CodeBlockHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="code-block-header"
      className={cn(
        "flex min-w-0 shrink-0 items-center gap-2 px-4 pt-4 text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function CodeBlockTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="code-block-title"
      className={cn(
        "min-w-0 truncate font-sans text-sm font-medium text-foreground",
        className
      )}
      {...props}
    />
  )
}

function CodeBlockActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="code-block-actions"
      className={cn(
        "-my-1 ms-auto -me-1.5 flex shrink-0 items-center gap-1",
        className
      )}
      {...props}
    />
  )
}

function CodeBlockCopyButton({ value }: { value: string }) {
  const [copied, setCopied] = React.useState(false)
  React.useEffect(() => {
    if (!copied) return
    const timeout = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timeout)
  }, [copied])
  return (
    <>
      <Button
        data-slot="code-block-copy-button"
        variant="ghost"
        size="icon-xs"
        aria-label={copied ? "Copied" : "Copy"}
        onClick={() => {
          navigator.clipboard
            .writeText(value)
            .then(() => setCopied(true))
            .catch(() => {})
        }}
      >
        <HugeiconsIcon
          icon={copied ? Tick02Icon : Copy01Icon}
          strokeWidth={2}
        />
      </Button>
      <span aria-live="polite" className="sr-only">
        {copied ? "Copied" : ""}
      </span>
    </>
  )
}

function CodeBlockContent({
  className,
  children,
  ...props
}: React.ComponentProps<"pre">) {
  return (
    <pre
      data-slot="code-block-content"
      dir="ltr"
      tabIndex={0}
      className={cn(
        "min-h-0 min-w-0 scroll-fade-x scrollbar-thin overflow-auto px-4 pt-2 pb-4 text-start font-mono leading-relaxed outline-none [counter-reset:line]",
        className
      )}
      {...props}
    >
      <code
        data-slot="code-block-code"
        className="grid min-h-lh min-w-max grid-cols-[auto_1fr] content-start [&>[data-empty]+[data-empty]]:hidden"
      >
        {children}
      </code>
    </pre>
  )
}

function CodeBlockLine({ children }: { children: React.ReactNode[] | string }) {
  const empty = children.length === 0
  return (
    <span
      data-slot="code-block-line"
      data-empty={empty || undefined}
      className="relative col-span-2 -mx-4 grid min-h-lh grid-cols-subgrid gap-x-3 px-4 [counter-increment:line] before:min-w-6 before:text-end before:text-muted-foreground before:content-[counter(line)] before:select-none supports-[content:counter(line)_/_'']:before:content-[counter(line)_/_'']"
    >
      <span data-slot="code-block-line-content" className="min-w-0">
        {empty ? "\n" : children}
      </span>
    </span>
  )
}

export {
  CodeBlock,
  CodeBlockHeader,
  CodeBlockTitle,
  CodeBlockActions,
  CodeBlockCopyButton,
  CodeBlockContent,
  CodeBlockLine,
}
