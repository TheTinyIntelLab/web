let parsedUrl: URL
try {
  parsedUrl = new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  )
} catch {
  throw new Error("NEXT_PUBLIC_SITE_URL must be a valid absolute URL")
}
if (!["http:", "https:"].includes(parsedUrl.protocol))
  throw new Error("NEXT_PUBLIC_SITE_URL must be an http or https URL")
export const site = {
  name: "The Tiny Intelligence Lab",
  description:
    "An independent research lab studying how the structure of a scientific problem can help models learn. Meet Opal, our first model for biological interventions.",
  url: parsedUrl.origin,
}
