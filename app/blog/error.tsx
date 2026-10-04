"use client"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty"
export default function BlogError({ reset }: { reset: () => void }) {
  return (
    <main className="reading-column py-24">
      <Empty>
        <EmptyHeader>
          <EmptyTitle>The journal couldn&apos;t load.</EmptyTitle>
          <EmptyDescription>Please try again in a moment.</EmptyDescription>
        </EmptyHeader>
        <Button variant="outline" onClick={reset}>
          Try again
        </Button>
      </Empty>
    </main>
  )
}
