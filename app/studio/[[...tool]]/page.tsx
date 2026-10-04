import type { Metadata } from "next"
import { metadata as studioMetadata, viewport } from "next-sanity/studio"
import { isSanityConfigured } from "@/src/sanity/env"
import EmbeddedStudio from "@/studio/embedded"
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty"
export { viewport }
export const dynamic = "force-static"
export const metadata: Metadata = {
  ...studioMetadata,
  title: "Studio",
  robots: { index: false, follow: false },
  alternates: { canonical: null },
  openGraph: null,
  twitter: null,
}
export default function StudioPage() {
  if (!isSanityConfigured)
    return (
      <main className="flex min-h-svh items-center justify-center p-6">
        <Empty>
          <EmptyHeader>
            <EmptyTitle>Connect your Sanity project</EmptyTitle>
            <EmptyDescription>
              Set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET
              in .env.local, then restart the app. The README has the setup
              steps.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </main>
    )
  return <EmbeddedStudio />
}
