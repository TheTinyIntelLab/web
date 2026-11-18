const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL
const origin = URL.parse(
  process.env.NEXT_PUBLIC_SITE_URL ||
    (productionHost ? `https://${productionHost}` : "http://localhost:3000")
)

if (
  !origin ||
  !["http:", "https:"].includes(origin.protocol) ||
  origin.href !== `${origin.origin}/`
) {
  throw new Error("NEXT_PUBLIC_SITE_URL must be an HTTP(S) origin")
}

const name = "The Tiny Intelligence Lab"
const url = `${origin.origin}/`
export const site = {
  name,
  title: `${name} | Small models for science`,
  description:
    "The Tiny Intelligence Lab is an independent research lab building small models for science. Read about our research and releases, including Opal v1.",
  url,
  indexable:
    process.env.NODE_ENV === "production" &&
    (!process.env.VERCEL_ENV || process.env.VERCEL_ENV === "production") &&
    origin.protocol === "https:" &&
    origin.hostname !== "localhost",
  logo: new URL("/logo.png", url).href,
  socialImage: {
    url: "/og.png",
    width: 1600,
    height: 900,
    type: "image/png",
    alt: `${name}. Small models for science, built around the problem.`,
  },
  profiles: {
    github: "https://github.com/TheTinyIntelLab",
    x: "https://x.com/TheTinyIntelLab",
  },
}

export const labOrganization = {
  "@type": "ResearchOrganization",
  "@id": `${site.url}#organization`,
  name: site.name,
  url: site.url,
}
