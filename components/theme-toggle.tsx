"use client"
import { useSyncExternalStore } from "react"
import { useTheme } from "next-themes"
import { HugeiconsIcon } from "@hugeicons/react"
import { Moon02Icon, Sun03Icon } from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"

const subscribe = () => () => {}
export function ThemeToggle() {
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  )
  const { resolvedTheme, setTheme } = useTheme()
  const dark = mounted && resolvedTheme === "dark"
  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={!mounted}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(dark ? "light" : "dark")}
    >
      <HugeiconsIcon
        icon={dark ? Sun03Icon : Moon02Icon}
        strokeWidth={1.5}
        aria-hidden="true"
        data-icon="inline-start"
      />
      {dark ? "Light mode" : "Dark mode"}
    </Button>
  )
}
