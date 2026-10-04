import Link from "next/link"
import { SiteShell } from "@/components/site-shell"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty"
export default function NotFound() {
  return (
    <SiteShell>
      <div className="reading-column py-24">
        <Empty>
          <EmptyHeader>
            <EmptyTitle>This page isn&apos;t here.</EmptyTitle>
            <EmptyDescription>
              The link may have changed, or the article may still be a draft.
            </EmptyDescription>
          </EmptyHeader>
          <Button
            nativeButton={false}
            role="link"
            variant="outline"
            render={<Link href="/" />}
          >
            Back to the lab
          </Button>
        </Empty>
      </div>
    </SiteShell>
  )
}
