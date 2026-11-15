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
    "Opal v1 is released. Meet our first model for biological interventions, from an independent research lab building small models for science.",
  url: parsedUrl.origin,
}
