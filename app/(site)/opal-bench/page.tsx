import type { Metadata } from "next"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowDown01Icon, ArrowUpRight01Icon } from "@hugeicons/core-free-icons"
import { ArticleBody } from "@/components/article-body"
import { OpalLeaderboard } from "@/components/opal-leaderboard"
import data from "@/src/content/opal-bench.json"

const description =
  "Test how well a method predicts CRISPR pair growth in a new lab. Compare the results, get the data or submit your own method."
export const metadata: Metadata = {
  title: "Opal-Bench",
  description,
  alternates: { canonical: "/opal-bench" },
}

export default function OpalBench() {
  const source = `${data.repo}/blob/${data.sha ?? "main"}`

  return (
    <article className="mx-auto w-[calc(100%-40px)] max-w-[660px] text-[17px] leading-relaxed sm:w-[calc(100%-48px)] sm:text-lg">
      <header className="pt-13 pb-12 sm:pt-22 sm:pb-16">
        <h1 className="text-[clamp(2.2rem,5vw,3rem)] leading-[1.15] font-normal tracking-[-0.06em]">
          Opal-Bench
        </h1>
        <p className="mt-5 text-lg leading-relaxed">{data.tagline}</p>
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 font-heading text-sm">
          <a
            href={data.repo}
            className="inline-flex items-center gap-1 underline"
          >
            Code on GitHub{" "}
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
            Get the dataset{" "}
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
          {data.sha
            ? "Synced from GitHub on "
            : "Local working-tree snapshot synced on "}
          <time dateTime={data.syncedAt}>{data.syncedAt}</time>
          {data.sha && (
            <>
              {" · "}
              <a href={`${data.repo}/commit/${data.sha}`} className="underline">
                View source commit
              </a>
            </>
          )}
        </p>
      </header>
      <p>
        You get a new screen&apos;s single-gene scores and a few measured pairs,
        then predict the rest. Whole labs are held out of training. Every method
        gets the same calibration pairs, and those pairs are excluded from
        scoring.
      </p>
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
        <a href="#run" className="hover:text-foreground hover:underline">
          Run it locally
        </a>
        <a href="#submit" className="hover:text-foreground hover:underline">
          Submit a method
        </a>
        <a href="#data" className="hover:text-foreground hover:underline">
          Data and citation
        </a>
      </nav>
      <section id="leaderboard" className="mt-10 scroll-mt-8">
        <h2 className="mb-5 text-[22px] leading-snug">Leaderboard</h2>
        <p>
          Few-shot scores compare each method&apos;s mean squared error with
          MID, a baseline built from single-gene scores. Lower is better, and
          each lab gets equal weight. Select a supplemental track to see its own
          metrics.{" "}
          <a
            href={`${source}/leaderboard/LEADERBOARD.md`}
            className="underline"
          >
            Method definitions and scoring details
          </a>
          .
        </p>
        <OpalLeaderboard
          tracks={data.tracks}
          defaultTrack={data.defaultTrack}
          footprint={data.footprint}
          supplemental={data.supplemental}
          prospectiveProtocol={
            data.prospective ? (
              <ArticleBody body={data.prospective} />
            ) : undefined
          }
        />
      </section>
      <section id="run" className="mt-12 scroll-mt-8">
        <h2 className="mb-5 text-[22px] leading-snug">Run it locally</h2>
        <p className="mb-6">
          Clone the repository and run these commands in a Python environment.
          The shipped baselines run on a CPU with NumPy and pandas. See the
          <a href={`${data.repo}#install`} className="underline">
            {" "}
            full setup instructions
          </a>{" "}
          to prepare additional data or reproduce the published tables.
        </p>
        <ArticleBody body={`\`\`\`bash\n${data.quickstart}\n\`\`\``} />
      </section>
      <section id="submit" className="mt-12 scroll-mt-8">
        <h2 className="mb-5 text-[22px] leading-snug">Benchmark your method</h2>
        <p className="mb-6">
          Expose a factory that receives allowed training pairs and returns a
          predictor. It gets calibration pairs and evaluation inputs with
          outcomes removed. Return one prediction per row, or abstain at an
          unsupported budget.
        </p>
        <ArticleBody body={`\`\`\`bash\n${data.submission}\n\`\`\``} />
        <p className="mt-6">
          Tune only on allowed training labs, never on the locked test or
          SHEN26. Keep the published splits, draws, budgets and metric.
          <a href={`${data.repo}#submit-a-method`} className="underline">
            {" "}
            Submit a pull request
          </a>{" "}
          with the required rows and a link to your code.
        </p>
      </section>
      <section id="data" className="mt-12 scroll-mt-8">
        <h2 className="mb-5 text-[22px] leading-snug">Data and citation</h2>
        <p>
          The code is MIT licensed. Data keep their
          <a
            href={`${data.repo}/blob/main/DATA_LICENSES.md`}
            className="underline"
          >
            {" "}
            source licences
          </a>
          , and restricted screen tables aren&apos;t included. Published
          aggregate errors aren&apos;t the underlying screen data.
        </p>
        <p className="mt-6">
          Some methods improve the locked test but fail to beat MID on fresh
          SHEN26. The{" "}
          <a
            href={`${data.repo}/blob/main/NEGATIVE_RESULTS.md`}
            className="underline"
          >
            negative results
          </a>{" "}
          record those comparisons.
        </p>
        <p className="mt-6">
          <a href="/opal-bench/CITATION.cff" download className="underline">
            Cite Opal-Bench
          </a>{" "}
          and the original data sources you use.
        </p>
      </section>
    </article>
  )
}
