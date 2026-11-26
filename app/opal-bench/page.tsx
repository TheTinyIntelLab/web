import type { Metadata } from "next"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowDown01Icon, ArrowUpRight01Icon } from "@hugeicons/core-free-icons"
import { SiteShell } from "@/components/site-shell"
import { ArticleBody } from "@/components/article-body"
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
          <Link href="/" className="font-heading text-xs text-muted-foreground">
            The Tiny Intelligence Lab
          </Link>
          <h1 className="mt-6 text-[clamp(2.2rem,5vw,3rem)] leading-[1.15] font-normal tracking-[-0.06em]">
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
        <ArticleBody body={data.intro} />
        <nav
          aria-label="On this page"
          className="mt-8 flex flex-wrap gap-x-5 gap-y-3 border-y py-5 text-xs text-muted-foreground"
        >
          {data.sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="hover:text-foreground hover:underline"
            >
              {section.title}
            </a>
          ))}
        </nav>
        {data.sections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            className="mt-12 scroll-mt-8 border-b pb-12 last:border-0"
          >
            <h2 className="mb-6 text-lg leading-snug font-medium tracking-tight">
              {section.title}
            </h2>
            {section.id === "results" ? (
              <>
                <ArticleBody
                  body={
                    section.body.split(
                      /### Locked test[^\n]*\n\s*(?:\|[^\n]*\n)+/
                    )[0]
                  }
                />
                <div id="leaderboard" className="scroll-mt-8">
                  <OpalLeaderboard
                    tracks={data.tracks}
                    defaultTrack={data.defaultTrack}
                  />
                </div>
                <ArticleBody
                  body={section.body
                    .split(/### Locked test[^\n]*\n\s*(?:\|[^\n]*\n)+/)
                    .slice(1)
                    .join("\n")}
                />
                <details className="mt-6 text-base">
                  <summary className="min-h-11 cursor-pointer font-heading text-sm underline">
                    Metric, method names and provenance
                  </summary>
                  <div className="pt-5">
                    <ArticleBody body={data.leaderboardNotes} />
                  </div>
                </details>
                <details className="mt-4 text-base">
                  <summary className="min-h-11 cursor-pointer font-heading text-sm underline">
                    Read the negative results
                  </summary>
                  <div className="pt-5">
                    <ArticleBody body={data.negative} />
                  </div>
                </details>
              </>
            ) : (
              <ArticleBody body={section.body} />
            )}
            {section.id === "license" && (
              <details className="mt-6">
                <summary className="min-h-11 cursor-pointer font-heading text-sm underline">
                  Per-source data licences and redistribution audit
                </summary>
                <div className="pt-5">
                  <ArticleBody body={data.licenses} />
                </div>
              </details>
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
          </section>
        ))}
      </article>
    </SiteShell>
  )
}
