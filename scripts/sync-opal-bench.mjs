import { readFile, writeFile } from "node:fs/promises"
import { resolve } from "node:path"

const root = new URL("../", import.meta.url)
const repo = "https://github.com/TheTinyIntelLab/opal-bench"
const api = "https://api.github.com/repos/TheTinyIntelLab/opal-bench"

async function get(url, { optional = false } = {}) {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(30000),
    headers:
      url.startsWith(api) && process.env.GITHUB_TOKEN
        ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
        : undefined,
  })
  if (optional && response.status === 404) return null
  if (!response.ok)
    throw new Error(`Opal-Bench sync: ${response.status} ${url}`)
  return response
}

const localSource = process.env.OPAL_BENCH_SOURCE?.trim()
const githubRef = process.env.OPAL_BENCH_REF?.trim()
if (localSource && githubRef) {
  throw new Error("Set either OPAL_BENCH_SOURCE or OPAL_BENCH_REF")
}
// Remote files share one immutable commit. An explicit local source reads its working tree.
const sha = localSource
  ? null
  : (
      await (
        await get(`${api}/commits/${encodeURIComponent(githubRef || "main")}`)
      ).json()
    ).sha
if (!localSource && !/^[a-f0-9]{40}$/.test(sha))
  throw new Error("Invalid GitHub commit")

const raw = `https://raw.githubusercontent.com/TheTinyIntelLab/opal-bench/${sha}/`
async function sourceFile(path, optional = false) {
  if (!localSource) return (await get(raw + path, { optional }))?.text() ?? null
  const file = resolve(localSource, path)
  try {
    return await readFile(file, "utf8")
  } catch (error) {
    if (optional && error.code === "ENOENT") return null
    throw error
  }
}

const [
  readme,
  leaderboard,
  citation,
  shippedJson,
  footprintJson,
  trackJson,
  prospective,
] = await Promise.all([
  sourceFile("README.md"),
  sourceFile("leaderboard/LEADERBOARD.md"),
  sourceFile("CITATION.cff"),
  sourceFile("leaderboard/shipped-fewshot.json", true),
  sourceFile("leaderboard/footprint.json", true),
  sourceFile("leaderboard/track-scores.json", true),
  sourceFile("PROSPECTIVE.md", true),
])

const metricHeaders = [
  "method",
  "ratio vs MID",
  "rank [95% CI]",
  "P(rank 1)",
  "units better than MID",
]
const decimal = /^\d+(?:\.\d+)?$/
const retiredOpal = /^v1[FOR](?:\s+[¹²³]+)?$/u

const tracks = []
let group = ""
let track
let budget
for (const line of leaderboard.split(/\r?\n/)) {
  if (line.startsWith("## ")) {
    group = line.slice(3)
    track = undefined
    budget = undefined
    continue
  }
  if (line.startsWith("### ")) {
    track = {
      id: `track-${tracks.length}`,
      title: `${group} — ${line.slice(4)}`,
      label: line.slice(4).split(":")[0],
      group,
      note: "",
      budgets: [],
    }
    budget = undefined
    continue
  }
  const k = line.match(/^#### k = (\d+)\s*$/)
  if (k && track) {
    if (!tracks.includes(track)) tracks.push(track)
    budget = { k: Number(k[1]), headers: [], rows: [] }
    track.budgets.push(budget)
  } else if (budget && line.startsWith("|")) {
    const cells = line
      .slice(1, line.lastIndexOf("|"))
      .split("|")
      .map((cell) => cell.trim())
    if (cells.every((cell) => /^:?-+:?$/.test(cell))) continue
    if (!budget.headers.length) {
      if (
        cells.length !== metricHeaders.length ||
        metricHeaders.some((header, index) => cells[index] !== header)
      ) {
        throw new Error(`Invalid leaderboard headers: ${line}`)
      }
      budget.headers = cells
    } else {
      const [method, ratio, rank, probability, units] = cells
      const interval = rank?.match(/^[1-9]\d* \[([1-9]\d*)[–-]([1-9]\d*)\]$/)
      const counts = units?.match(/^(\d+)\/([1-9]\d*)$/)
      if (
        cells.length !== budget.headers.length ||
        !method ||
        !decimal.test(ratio) ||
        !Number.isFinite(Number(ratio)) ||
        !interval ||
        Number(interval[1]) > Number(interval[2]) ||
        !decimal.test(probability) ||
        Number(probability) > 1 ||
        !counts ||
        Number(counts[1]) > Number(counts[2])
      ) {
        throw new Error(`Invalid leaderboard row: ${line}`)
      }
      if (!retiredOpal.test(method)) budget.rows.push(cells)
    }
  } else if (track && !budget && line.trim()) track.note += `${line}\n`
}
if (!tracks.some((item) => item.budgets.some((item) => item.rows.length))) {
  throw new Error("Opal-Bench sync found no leaderboard rows")
}
if (tracks.some((item) => item.budgets.some((item) => !item.rows.length))) {
  throw new Error("Opal-Bench sync found an empty leaderboard budget")
}
const historicalTest = tracks.find((track) => /Locked test/i.test(track.title))
if (!historicalTest?.budgets.some((budget) => budget.k === 20))
  throw new Error("Missing locked test k = 20")

const number = new Intl.NumberFormat("en-US")
const percent = new Intl.NumberFormat("en-US", {
  style: "percent",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})
const count = (value) => Number.isSafeInteger(value) && value >= 0
const nonnegative = (value) => Number.isFinite(value) && value >= 0
const fraction = (value) => nonnegative(value) && value <= 1
const record = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value)

const splits = [
  ["dev", "Shipped development", "16 development labs."],
  [
    "test",
    "Shipped locked test",
    "One lab and one cell line (BURGOLD25, HT-29).",
  ],
  ["fresh", "Fresh SHEN26", "Two cell lines (HCT116 and GM12878)."],
]

const shipped = []
if (shippedJson !== null) {
  const scores = JSON.parse(shippedJson)
  for (const [id, label, scope] of splits) {
    const budgets = scores?.[id]
    if (!record(budgets) || !Object.keys(budgets).length)
      throw new Error(`Missing shipped few-shot scores for ${id}`)

    shipped.push({
      id: `shipped-${id}`,
      title: label,
      label,
      group: "Shipped few-shot",
      note: scope,
      budgets: Object.entries(budgets).map(([k, ratios]) => {
        if (
          !/^\d+$/.test(k) ||
          !count(Number(k)) ||
          !record(ratios) ||
          ratios.MID !== 1
        )
          throw new Error(`Invalid shipped few-shot budget in ${id}: ${k}`)
        const rows = Object.entries(ratios).map(([method, ratio]) => {
          if (!method.trim() || !nonnegative(ratio))
            throw new Error(
              `Invalid shipped few-shot ratio in ${id}: ${k}:${method}`
            )
          return [method, ratio]
        })
        rows.sort((a, b) => a[1] - b[1])
        return {
          k: Number(k),
          headers: metricHeaders.slice(0, 2),
          rows: rows.map(([method, ratio]) => [method, ratio.toFixed(6)]),
        }
      }),
    })
  }
}
const fewShot = [
  ...shipped,
  ...tracks
    .filter((track) => !shipped.length || !track.group.startsWith("Shipped"))
    .map((track) => ({
      ...track,
      label: track.group.startsWith("Shipped")
        ? `Shipped ${track.label}`
        : `Historical ${track.label.toLowerCase()}`,
      group: track.group.startsWith("Shipped")
        ? "Shipped few-shot"
        : "Historical few-shot",
    })),
]
const defaultTrack =
  shipped.find((track) => track.id === "shipped-test") ?? historicalTest

function formatProfile(profile, label) {
  if (
    !record(profile) ||
    !count(profile.params) ||
    !nonnegative(profile.peak_ram_mib) ||
    !nonnegative(profile.cpu_seconds)
  ) {
    throw new Error(`Invalid Opal-Bench footprint for ${label}`)
  }
  return [
    number.format(profile.params),
    profile.peak_ram_mib.toFixed(2),
    profile.cpu_seconds.toFixed(3),
  ]
}

const footprint = {
  environment: null,
  methods: {},
  reportedParams: {},
  auxiliary: [],
}
if (footprintJson !== null) {
  const report = JSON.parse(footprintJson)
  if (!record(report) || !record(report.environment) || !record(report.methods))
    throw new Error("Invalid Opal-Bench footprint report")
  const { os, cpu, python, numpy, pandas, blas_threads } = report.environment
  if (
    ![os, cpu, python, numpy, pandas].every(
      (value) => typeof value === "string"
    ) ||
    !Number.isSafeInteger(blas_threads) ||
    blas_threads < 1
  ) {
    throw new Error("Invalid Opal-Bench footprint environment")
  }
  footprint.environment = { os, cpu, python, numpy, pandas, blas_threads }
  footprint.methods = Object.fromEntries(
    Object.entries(report.methods).flatMap(([method, profile]) => {
      if (profile === null) return []
      return [[method, formatProfile(profile, method)]]
    })
  )
  if (report.reported_params !== undefined) {
    if (!record(report.reported_params))
      throw new Error("Invalid Opal-Bench reported parameter counts")
    footprint.reportedParams = Object.fromEntries(
      Object.entries(report.reported_params).map(([method, params]) => {
        if (!count(params))
          throw new Error(
            `Invalid Opal-Bench reported parameters for ${method}`
          )
        return [method, number.format(params)]
      })
    )
  }
  if (report.auxiliary !== undefined) {
    if (!record(report.auxiliary))
      throw new Error("Invalid Opal-Bench auxiliary footprint")
    footprint.auxiliary = Object.entries(report.auxiliary).flatMap(
      ([task, methods]) => {
        if (!record(methods))
          throw new Error(`Invalid Opal-Bench footprint for task ${task}`)
        return Object.entries(methods).map(([method, profile]) => [
          method,
          task,
          ...formatProfile(profile, `${task} / ${method}`),
        ])
      }
    )
  }
}

const mse = (value) => value.toFixed(4)
const supplementalMetrics = {
  unseen: [
    ["any_gene_mse", "Any unseen MSE", nonnegative, mse],
    ["one_gene_mse", "One unseen MSE", nonnegative, mse],
    ["both_gene_mse", "Both unseen MSE", nonnegative, mse],
    [
      "any_gene_pairs",
      "Any unseen pairs",
      count,
      (value) => number.format(value),
    ],
    [
      "one_gene_pairs",
      "One unseen pairs",
      count,
      (value) => number.format(value),
    ],
    [
      "both_gene_pairs",
      "Both unseen pairs",
      count,
      (value) => number.format(value),
    ],
  ],
  hits: [
    [
      "synergy_precision",
      "Synergy precision",
      fraction,
      (value) => percent.format(value),
    ],
    [
      "synergy_recall",
      "Synergy recall",
      fraction,
      (value) => percent.format(value),
    ],
    [
      "buffering_precision",
      "Buffering precision",
      fraction,
      (value) => percent.format(value),
    ],
    [
      "buffering_recall",
      "Buffering recall",
      fraction,
      (value) => percent.format(value),
    ],
  ],
  uncertainty: [
    [
      "interval_coverage",
      "90% coverage",
      fraction,
      (value) => percent.format(value),
    ],
    ["interval_width", "Mean width", nonnegative, mse],
  ],
}

const supplemental = { unseen: [], hits: [], uncertainty: [] }
if (trackJson !== null) {
  const scores = JSON.parse(trackJson)
  if (
    !record(scores) ||
    (scores.dev !== undefined && !Array.isArray(scores.dev)) ||
    !Array.isArray(scores.test) ||
    !Array.isArray(scores.fresh)
  )
    throw new Error("Invalid Opal-Bench track scores")

  for (const [split, label] of splits) {
    const byBudget = new Map()
    const seen = new Set()
    const metricFields = Object.values(supplementalMetrics).flat()
    for (const row of scores[split] ?? []) {
      if (
        !record(row) ||
        !count(row.k) ||
        typeof row.method !== "string" ||
        !row.method.trim()
      )
        throw new Error(`Invalid Opal-Bench score row in ${split}`)
      const key = `${row.k}:${row.method}`
      if (seen.has(key))
        throw new Error(`Duplicate Opal-Bench score in ${split}: ${key}`)
      seen.add(key)
      if (row.mse != null && !nonnegative(row.mse))
        throw new Error(`Invalid Opal-Bench mse in ${split}: ${key}`)
      for (const [field, , validate] of metricFields) {
        if (row[field] != null && !validate(row[field]))
          throw new Error(`Invalid Opal-Bench ${field} in ${split}: ${key}`)
      }
      if ((row.interval_coverage == null) !== (row.interval_width == null))
        throw new Error(`Incomplete Opal-Bench interval in ${split}: ${key}`)
      if (
        row.interval_source != null &&
        (row.interval_coverage == null ||
          typeof row.interval_source !== "string" ||
          !row.interval_source.trim())
      )
        throw new Error(
          `Invalid Opal-Bench interval source in ${split}: ${key}`
        )
      if (!byBudget.has(row.k)) byBudget.set(row.k, [])
      byBudget.get(row.k).push(row)
    }

    for (const [kind, metrics] of Object.entries(supplementalMetrics)) {
      const budgets = [...byBudget]
        .sort(([a], [b]) => a - b)
        .map(([k, scores]) => {
          const measured = metrics.filter(([field]) =>
            scores.some((score) => score[field] != null)
          )
          const rows = []
          const unavailable = []
          const unscored = []
          for (const score of scores) {
            if (measured.some(([field]) => score[field] != null)) {
              rows.push([
                score.method,
                ...measured.map(([field, , , format]) =>
                  score[field] == null ? "—" : format(score[field])
                ),
                ...(kind === "uncertainty"
                  ? [
                      score.interval_source === "training_screen"
                        ? "Training screen"
                        : (score.interval_source ?? "Target screen"),
                    ]
                  : []),
              ])
            } else {
              const group = score.mse == null ? unavailable : unscored
              group.push(score.method)
            }
          }
          return {
            k,
            headers: [
              "method",
              ...measured.map(([, header]) => header),
              ...(kind === "uncertainty" && rows.length
                ? ["Calibration source"]
                : []),
            ],
            rows,
            unavailable,
            unscored,
          }
        })
      if (budgets.length)
        supplemental[kind].push({
          id: split,
          label,
          budgets,
        })
    }
  }
}

// Keep the runnable examples in step with the README.
const commands = readme
  .split(/\r?\n/)
  .map((line) => line.replace(/\s+#.*$/, "").trim())
const install = commands.find((line) =>
  line.startsWith("python -m pip install ")
)
const score = commands.find((line) => line === "opal-bench-score fewshot")
const submission = commands.find((line) =>
  line.startsWith("opal-bench-score fewshot --method ")
)
if (!install || !score || !submission)
  throw new Error("Missing README scoring commands")
await writeFile(new URL("public/opal-bench/CITATION.cff", root), citation)
await writeFile(
  new URL("src/content/opal-bench.json", root),
  JSON.stringify(
    {
      repo,
      sha,
      syncedAt: new Date().toISOString().slice(0, 10),
      tagline: readme.match(/<p>([^<]+)<\/p>/)?.[1],
      quickstart: `${install}\n${score}`,
      submission,
      tracks: fewShot,
      defaultTrack: defaultTrack.id,
      footprint,
      supplemental,
      prospective,
    },
    null,
    2
  ) + "\n"
)
console.log(
  `Synced Opal-Bench from ${sha ? sha.slice(0, 7) : "a local snapshot"}`
)
