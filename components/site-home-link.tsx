"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"

export function SiteHomeLink() {
  const pathname = usePathname()
  if (pathname === "/") return null
  return (
    <Button
      nativeButton={false}
      role="link"
      variant="ghost"
      size="icon"
      render={<Link href="/" />}
      aria-label="The Tiny Intelligence Lab home"
      className="relative size-11 shrink-0 overflow-hidden"
    >
      <Image
        src="/logo.png"
        alt=""
        width={512}
        height={512}
        className="absolute top-1/2 left-1/2 size-28 max-w-none -translate-x-1/2 -translate-y-1/2 [clip-path:polygon(50%_32%,65%_41%,65%_58%,50%_68%,35%_58%,35%_41%)]"
      />
    </Button>
  )
}
