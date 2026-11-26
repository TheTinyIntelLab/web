import type { Metadata } from "next"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowDown01Icon, ArrowUpRight01Icon } from "@hugeicons/core-free-icons"
import { SiteShell } from "@/components/site-shell"
import { ArticleBody } from "@/components/article-body"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"
import { OpalLeaderboard } from "@/components/opal-leaderboard"
import data from "@/src/content/opal-bench.json"

const description =
  "Predict combinatorial CRISPR growth in a lab you have never seen. Explore the benchmark, results, data and submission protocol."
export const metadata: Metadata = {
  title: "Opal-Bench",
  description,
  alternates: { canonical: "/opal-bench" },
}

export default function OpalBench() {
  return (
    <SiteShell>
      <article className="mx-auto w-[calc(100%-40px)] max-w-[660px] sm:w-[calc(100%-48px)]">
        <header className="pt-13 pb-12 sm:pt-22 sm:pb-16">
          <h1 className="text-[clamp(2.2rem,5vw,3rem)] leading-[1.15] font-normal tracking-[-0.06em]">
            Opal-Bench
          </h1>
          <p className="mt-5 text-xl leading-relaxed">{data.tagline}</p>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 font-heading text-sm">
            <a
              href={data.repo}
              className="inline-flex items-center gap-1 underline"
            >
              GitHub{" "}
              <HugeiconsIcon
                icon={ArrowUpRight01Icon}
                size={16}
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </a>
            <a
              href="https://huggingface.co/datasets/TheTinyIntelLab/opal-bench"
              className="inline-flex items-center gap-1 underline"
            >
              Dataset on Hugging Face{" "}
              <HugeiconsIcon
                icon={ArrowUpRight01Icon}
                size={16}
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </a>
            <a
              href="#leaderboard"
              className="inline-flex items-center gap-1 underline"
            >
              Leaderboard{" "}
              <HugeiconsIcon
                icon={ArrowDown01Icon}
                size={16}
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </a>
          </div>
          <p className="mt-5 font-heading text-xs text-muted-foreground">
            Synced from GitHub on{" "}
            <time dateTime={data.syncedAt}>{data.syncedAt}</time> ·{" "}
            <a href={`${data.repo}/commit/${data.sha}`} className="underline">
              Source snapshot
            </a>
          </p>
        </header>
        <ArticleBody body={data.intro.split(/\r?\n\r?\n/)[0]} />
        <nav
          aria-label="On this page"
          className="mt-8 flex flex-wrap gap-x-5 gap-y-3 border-y py-5 text-xs text-muted-foreground"
        >
          <a
            href="#leaderboard"
            className="hover:text-foreground hover:underline"
          >
            Leaderboard
          </a>
          <a href="#details" className="hover:text-foreground hover:underline">
            Details and documentation
          </a>
        </nav>
        <section id="leaderboard" className="mt-10 scroll-mt-8">
          <h2 className="text-lg font-medium tracking-tight">Leaderboard</h2>
          <OpalLeaderboard
            tracks={data.tracks}
            defaultTrack={data.defaultTrack}
          />
        </section>
        <section id="details" className="mt-12 scroll-mt-8">
          <h2 className="mb-6 text-lg font-medium tracking-tight">
            Details and documentation
          </h2>
          <Accordion multiple>
            {data.sections.map((section) => (
              <AccordionItem
                key={section.id}
                id={section.id}
                value={section.id}
              >
                <AccordionTrigger>{section.title}</AccordionTrigger>
                <AccordionContent>
                  <ArticleBody body={section.body} />
                  {section.id === "results" && (
                    <Accordion multiple className="mt-6">
                      <AccordionItem value="provenance">
                        <AccordionTrigger>
                          Metric and method provenance
                        </AccordionTrigger>
                        <AccordionContent>
                          <ArticleBody body={data.leaderboardNotes} />
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="negative-results">
                        <AccordionTrigger>Negative results</AccordionTrigger>
                        <AccordionContent>
                          <ArticleBody body={data.negative} />
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  )}
                  {section.id === "data-and-reproduction" && (
                    <div className="mt-6">
                      <ArticleBody
                        body={data.intro
                          .split(/\r?\n\r?\n/)
                          .slice(1)
                          .join("\n\n")}
                      />
                    </div>
                  )}
                  {section.id === "license" && (
                    <div className="mt-6">
                      <ArticleBody body={data.licenses} />
                    </div>
                  )}
                  {section.id === "citation" && (
                    <a
                      href="/opal-bench/CITATION.cff"
                      download
                      className="mt-6 inline-block min-h-11 font-heading text-sm underline"
                    >
                      Download CITATION.cff
                    </a>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </article>
    </SiteShell>
  )
}
