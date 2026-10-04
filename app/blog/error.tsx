"use client"
import { Button } from "@/components/ui/button"
import { SiteShell } from "@/components/site-shell"
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty"
export default function BlogError({ reset }: { reset: () => void }) {
  return (
    <SiteShell>
      <div className="mx-auto w-[calc(100%-40px)] max-w-[660px] py-24 sm:w-[calc(100%-48px)]">
        <Empty>
          <EmptyHeader>
            <EmptyTitle>The journal couldn&apos;t load.</EmptyTitle>
            <EmptyDescription>Please try again in a moment.</EmptyDescription>
          </EmptyHeader>
          <Button variant="outline" onClick={reset}>
            Try again
          </Button>
        </Empty>
      </div>
    </SiteShell>
  )
}
