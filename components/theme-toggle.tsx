"use client"
import { useSyncExternalStore } from "react"
import { useTheme } from "next-themes"
import { IconMoon, IconSun } from "@tabler/icons-react"
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
      {dark ? (
        <IconSun data-icon="inline-start" />
      ) : (
        <IconMoon data-icon="inline-start" />
      )}
      {dark ? "Light mode" : "Dark mode"}
    </Button>
  )
}
