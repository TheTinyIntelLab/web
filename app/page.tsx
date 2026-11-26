import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SiteShell } from "@/components/site-shell"
import {
  about,
  opal,
  opalBench,
  thesis,
  stoneNote,
  importantSentences,
} from "@/src/content/home"
import { labOrganization, site } from "@/src/lib/site"
import { JsonLd } from "@/components/json-ld"

export const metadata: Metadata = {
  alternates: { canonical: site.url },
  verification: { google: process.env.GOOGLE_SITE_VERIFICATION },
}

function CopyParagraph({ text }: { text: string }) {
  const sentence = importantSentences.find((sentence) =>
    text.includes(sentence)
  )
  if (!sentence) return <p>{text}</p>
  const position = text.indexOf(sentence)
  return (
    <p>
      {text.slice(0, position)}
      <em>{sentence}</em>
      {text.slice(position + sentence.length)}
    </p>
  )
}

export default function Home() {
  return (
    <SiteShell home>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebSite",
              "@id": `${site.url}#website`,
              name: site.name,
              url: site.url,
              publisher: { "@id": labOrganization["@id"] },
              inLanguage: "en",
            },
            {
              ...labOrganization,
              logo: site.logo,
              description: site.description,
              sameAs: Object.values(site.profiles),
            },
          ],
        }}
      />
      <section
        className="flex flex-col items-center px-6 pb-24 text-center sm:pb-28"
        aria-labelledby="lab-name"
      >
        <Image
          src="/logo.png"
          alt="A faceted stone with a warm amber center"
          width={512}
          height={512}
          sizes="(min-width: 640px) 210px, 180px"
          preload
          className="size-[180px] object-contain [clip-path:polygon(50%_32%,65%_41%,65%_58%,50%_68%,35%_58%,35%_41%)] sm:size-[210px]"
        />
        <div className="w-min max-w-full">
          <h1
            id="lab-name"
            className="-mt-3 text-[clamp(2.3rem,5vw,3.4rem)] leading-[1.15] font-normal tracking-[-0.065em] whitespace-nowrap lowercase"
          >
            The Tiny <span className="block">Intelligence Lab</span>
          </h1>
          <p className="mt-6 w-full text-lg leading-[1.45] text-balance">
            {thesis}
          </p>
        </div>
        <Button
          nativeButton={false}
          role="link"
          variant="ghost"
          render={<Link href="#opal" />}
          className="mt-7"
        >
          <Badge variant="secondary">v1 released</Badge> Meet Opal
          <HugeiconsIcon
            icon={ArrowUpRight01Icon}
            strokeWidth={1.5}
            aria-hidden="true"
            data-icon="inline-end"
          />
        </Button>
      </section>
      <article
        className="mx-auto w-[calc(100%-40px)] max-w-[660px] text-[17px] leading-relaxed sm:w-[calc(100%-48px)] sm:text-lg"
        id="about"
      >
        <div className="flex flex-col gap-6">
          <h2 className="text-lg leading-snug font-medium tracking-tight">
            About the lab
          </h2>
          {about.introduction.map((text) => (
            <CopyParagraph key={text} text={text} />
          ))}
        </div>
        {about.sections.map((section) => (
          <section
            key={section.title}
            className="mt-11 flex scroll-mt-6 flex-col gap-5"
          >
            <h2 className="text-lg leading-snug font-medium tracking-tight">
              {section.title}
            </h2>
            {section.paragraphs.map((text) => (
              <CopyParagraph key={text} text={text} />
            ))}
          </section>
        ))}
        <p className="mt-8 text-base leading-relaxed text-muted-foreground">
          {stoneNote}
        </p>
        <section id="opal" className="mt-14 flex scroll-mt-6 flex-col gap-5">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-lg leading-snug font-medium tracking-tight">
              Opal
            </h2>
            <Badge variant="secondary">v1 released</Badge>
          </div>
          {opal.map((text) => (
            <p key={text}>{text}</p>
          ))}
          <Button
            nativeButton={false}
            role="link"
            variant="outline"
            className="mt-1 self-start"
            render={<Link href="/blog" />}
          >
            Read the blog
            <HugeiconsIcon
              icon={ArrowUpRight01Icon}
              strokeWidth={1.5}
              aria-hidden="true"
              data-icon="inline-end"
            />
          </Button>
        </section>
        <section
          id="opal-bench"
          className="mt-14 flex scroll-mt-6 flex-col gap-5"
        >
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-lg leading-snug font-medium tracking-tight">
              Opal-Bench
            </h2>
            <Badge variant="secondary">Released</Badge>
          </div>
          {opalBench.map((text) => (
            <p key={text}>{text}</p>
          ))}
          <Button
            nativeButton={false}
            role="link"
            variant="outline"
            className="mt-1 self-start"
            render={<Link href="/opal-bench" />}
          >
            Explore Opal-Bench
            <HugeiconsIcon
              icon={ArrowUpRight01Icon}
              strokeWidth={1.5}
              aria-hidden="true"
              data-icon="inline-end"
            />
          </Button>
        </section>
      </article>
    </SiteShell>
  )
}
