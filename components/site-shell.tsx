import Link from "next/link"
import { Button } from "@/components/ui/button"
import { buttonVariants } from "@/components/ui/button-variants"
import { SiteHomeLink } from "@/components/site-home-link"
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/theme-toggle"
import { site } from "@/src/lib/site"

const groups = [
  {
    title: "Research",
    links: [{ label: "Opal", href: "/#opal" }],
  },
  { title: "Updates", links: [{ label: "Blog", href: "/blog" }] },
  { title: "Others", links: [{ label: "Opal-Bench", href: "/opal-bench" }] },
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
      { label: "GitHub", href: site.profiles.github },
      { label: "X", href: site.profiles.x },
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
        render={<a href="#main-content">Skip to content</a>}
        className="fixed -top-24 left-4 z-50 focus:top-4"
      />
      <header className="flex items-center justify-between gap-3 px-3 py-2.5 sm:px-7 sm:py-3">
        <SiteHomeLink />
        <NavigationMenu aria-label="Main navigation" className="ml-auto">
          <NavigationMenuList className="flex-wrap justify-end gap-0 sm:gap-1">
            {[
              { label: "About", href: "/#about" },
              { label: "Opal", href: "/#opal" },
              { label: "Blog", href: "/blog" },
            ].map((link) => (
              <NavigationMenuItem key={link.href}>
                <NavigationMenuLink
                  render={<Link href={link.href} />}
                  className={buttonVariants({ variant: "ghost" })}
                >
                  {link.label}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
            <NavigationMenuItem>
              <NavigationMenuTrigger>Others</NavigationMenuTrigger>
              <NavigationMenuContent>
                <NavigationMenuLink render={<Link href="/opal-bench" />}>
                  Opal-Bench
                </NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </header>
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <footer className="mx-auto mt-18 max-w-[1100px] px-2 pb-7 sm:mt-25 sm:px-7">
        <Separator />
        <div className="grid grid-cols-2 gap-3 pt-9 pb-12 sm:grid-cols-5 sm:gap-8">
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
