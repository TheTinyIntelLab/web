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
    <SiteShell>
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
      <section className="identity" aria-labelledby="lab-name">
        <Image
          src="/logo.png"
          alt="A faceted stone with a warm amber center"
          width={512}
          height={512}
          priority
          className="lab-stone"
        />
        <h1 id="lab-name">
          the tiny
          <br />
          intelligence lab
        </h1>
        <p className="lab-thesis">{thesis}</p>
        {/* <Button
          nativeButton={false}
          role="link"
          variant="ghost"
          render={<Link href="#opal" />}
          className="project-link"
        >
          <Badge variant="secondary">IN RESEARCH</Badge> Meet Opal, our first
          model <span aria-hidden="true">↗</span>
        </Button> */}
      </section>
      <article className="reading-column home-copy" id="about">
        <div className="flex flex-col gap-6">
          {about.introduction.map((text) => (
            <CopyParagraph key={text} text={text} />
          ))}
        </div>
        {about.sections.map((section) => (
          <section key={section.title} className="copy-section">
            <h2>{section.title}</h2>
            {section.paragraphs.map((text) => (
              <CopyParagraph key={text} text={text} />
            ))}
          </section>
        ))}
        <p className="stone-note">{stoneNote}</p>
        <section id="opal" className="copy-section opal-section">
          <div className="flex flex-wrap items-center gap-3">
            <h2>Opal</h2>
            <Badge variant="secondary">in research</Badge>
          </div>
          {opal.map((text) => (
            <p key={text}>{text}</p>
          ))}
          <Button
            nativeButton={false}
            role="link"
            variant="outline"
            render={<Link href="/blog" />}
          >
            Notes from the lab <span aria-hidden="true">↗</span>
          </Button>
        </section>
      </article>
    </SiteShell>
  )
}
