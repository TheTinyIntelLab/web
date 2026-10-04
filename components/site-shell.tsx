import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

const groups = [
  {
    title: "Research",
    links: [
      { label: "Opal", href: "/#opal" },
      { label: "Philosophy", href: "/#philosophy" },
    ],
  },
  { title: "Writing", links: [{ label: "Notes from the lab", href: "/blog" }] },
  {
    title: "The lab",
    links: [
      { label: "About", href: "/#philosophy" },
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
export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Button
        nativeButton={false}
        role="link"
        variant="outline"
        render={<a href="#main-content" />}
        className="skip-link"
      >
        Skip to content
      </Button>
      <header className="site-header">
        <nav
          aria-label="Main navigation"
          className="flex flex-wrap justify-end gap-1 sm:gap-3"
        >
          <Button
            nativeButton={false}
            role="link"
            variant="ghost"
            render={<Link href="/#philosophy" />}
          >
            Philosophy
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
      <footer className="site-footer">
        <Separator />
        <div className="footer-links">
          {groups.map((group) => (
            <div key={group.title} className="flex flex-col items-start gap-1">
              <h2>{group.title}</h2>
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
        <div className="footer-bottom">
          <Link href="/">The Tiny Intelligence Lab</Link>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </footer>
    </>
  )
}
