import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SiteShell } from "@/components/site-shell"
import {
  about,
  opal,
  thesis,
  stoneNote,
  importantSentences,
} from "@/src/content/home"
import { site } from "@/src/lib/site"
import { JsonLd } from "@/components/json-ld"

export const metadata = { alternates: { canonical: "/" } }

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
          "@type": "ResearchOrganization",
          name: site.name,
          url: site.url,
          logo: `${site.url}/logo.png`,
          description: site.description,
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
          priority
          className="size-[180px] object-contain [clip-path:polygon(50%_32%,65%_41%,65%_58%,50%_68%,35%_58%,35%_41%)] sm:size-[210px]"
        />
        <div className="w-min max-w-full">
          <h1
            id="lab-name"
            className="-mt-3 text-[clamp(2.3rem,5vw,3.4rem)] leading-[1.15] font-normal tracking-[-0.065em] whitespace-nowrap"
          >
            the tiny
            <br />
            intelligence lab
          </h1>
          <p className="mt-6 w-full text-lg leading-[1.45] text-balance">
            {thesis}
          </p>
        </div>
        {/* <Button
          nativeButton={false}
          role="link"
          variant="ghost"
          render={<Link href="#opal" />}
          className="mt-7"
        >
          <Badge variant="secondary">IN RESEARCH</Badge> Meet Opal, our first
          model <span aria-hidden="true">↗</span>
        </Button> */}
      </section>
      <article
        className="mx-auto w-[calc(100%-40px)] max-w-[660px] text-[17px] leading-relaxed sm:w-[calc(100%-48px)] sm:text-lg"
        id="about"
      >
        <div className="flex flex-col gap-6">
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
            <Badge variant="secondary">in research</Badge>
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
            Notes from the lab <span aria-hidden="true">↗</span>
          </Button>
        </section>
      </article>
    </SiteShell>
  )
}
