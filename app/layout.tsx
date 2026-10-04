import type { Metadata, Viewport } from "next"
import localFont from "next/font/local"
import { site } from "@/src/lib/site"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

const inter = localFont({
  src: "../node_modules/@fontsource-variable/inter/files/inter-latin-standard-normal.woff2",
  weight: "100 900",
  variable: "--font-inter",
  display: "swap",
})
const newsreader = localFont({
  src: [
    {
      path: "../node_modules/@fontsource-variable/newsreader/files/newsreader-latin-standard-normal.woff2",
      style: "normal",
      weight: "200 800",
    },
    {
      path: "../node_modules/@fontsource-variable/newsreader/files/newsreader-latin-standard-italic.woff2",
      style: "italic",
      weight: "200 800",
    },
  ],
  variable: "--font-newsreader",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s | ${site.name}` },
  description: site.description,
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: site.name,
    title: site.name,
    description: site.description,
    images: [
      { url: "/opengraph-image", width: 1200, height: 630, alt: site.name },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.description,
    images: ["/opengraph-image"],
  },
  icons: { icon: "/logo.png", apple: "/logo.png" },
}
export const viewport: Viewport = { themeColor: "#ffffff" }
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${newsreader.variable} antialiased`}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
