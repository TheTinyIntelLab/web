import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/theme-toggle"

const groups = [
  {
    title: "Research",
    links: [{ label: "Opal", href: "/#opal" }],
  },
  { title: "Writing", links: [{ label: "Notes from the lab", href: "/blog" }] },
  {
    title: "The lab",
    links: [
      { label: "About", href: "/#about" },
      { label: "Email", href: "mailto:thetinyintelligenceproject@gmail.com" },
    ],
  },
  {
    title: "Elsewhere",
    links: [
      { label: "GitHub", href: "https://github.com/TheTinyIntelLab" },
      { label: "X", href: "https://x.com/TheTinyIntelLab" },
    ],
  },
]
export function SiteShell({
  children,
  home = false,
}: {
  children: React.ReactNode
  home?: boolean
}) {
  return (
    <>
      <Button
        nativeButton={false}
        role="link"
        variant="outline"
        render={<a href="#main-content" />}
        className="fixed -top-24 left-4 z-50 focus:top-4"
      >
        Skip to content
      </Button>
      <header className="flex items-center justify-between gap-3 px-3 py-2.5 sm:px-7 sm:py-3">
        {!home && (
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
        )}
        <nav
          aria-label="Main navigation"
          className="ml-auto flex flex-wrap justify-end gap-1 sm:gap-3"
        >
          <Button
            nativeButton={false}
            role="link"
            variant="ghost"
            render={<Link href="/#about" />}
          >
            About
          </Button>
          <Button
            nativeButton={false}
            role="link"
            variant="ghost"
            render={<Link href="/#opal" />}
          >
            Opal
          </Button>
          <Button
            nativeButton={false}
            role="link"
            variant="ghost"
            render={<Link href="/blog" />}
          >
            Journal
          </Button>
        </nav>
      </header>
      <main id="main-content">{children}</main>
      <footer className="mx-auto mt-18 max-w-[1100px] px-2 pb-7 sm:mt-25 sm:px-7">
        <Separator />
        <div className="grid grid-cols-2 gap-3 pt-9 pb-12 sm:grid-cols-4 sm:gap-8">
          {groups.map((group) => (
            <div key={group.title} className="flex flex-col items-start gap-1">
              <h2 className="px-3 pb-3 text-[13px] font-medium">
                {group.title}
              </h2>
              {group.links.map((link) => (
                <Button
                  nativeButton={false}
                  role="link"
                  key={link.href}
                  variant="ghost"
                  render={<Link href={link.href} />}
                >
                  {link.label}
                </Button>
              ))}
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-5 px-3 font-heading text-xs text-muted-foreground">
          <Link href="/">The Tiny Intelligence Lab</Link>
          <span>© {new Date().getFullYear()}</span>
          <ThemeToggle />
        </div>
      </footer>
    </>
  )
}
