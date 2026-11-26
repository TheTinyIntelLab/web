import { mkdir, writeFile } from "node:fs/promises"

const root = new URL("../", import.meta.url)
const repo = "https://github.com/TheTinyIntelLab/opal-bench"
const api = "https://api.github.com/repos/TheTinyIntelLab/opal-bench"

async function get(url) {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(30000),
    headers:
      url.startsWith(api) && process.env.GITHUB_TOKEN
        ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
        : undefined,
  })
  if (!response.ok)
    throw new Error(`Opal-Bench sync: ${response.status} ${url}`)
  return response
}

// Resolve main once so documents, results and figures come from one snapshot.
const { sha } = await (await get(`${api}/commits/main`)).json()
if (!/^[a-f0-9]{40}$/.test(sha)) throw new Error("Invalid GitHub commit")
const raw = `https://raw.githubusercontent.com/TheTinyIntelLab/opal-bench/${sha}/`
const files = ["README.md", "leaderboard/LEADERBOARD.md", "CITATION.cff"]
const [readme, leaderboard, citation] = await Promise.all(
  files.map(async (path) => (await get(raw + path)).text())
)

const tracks = []
let group = ""
let track
let budget
let headers
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
    headers = undefined
  } else if (budget && line.startsWith("|")) {
    const cells = line
      .slice(1, line.lastIndexOf("|"))
      .split("|")
      .map((cell) => cell.trim())
    if (cells.every((cell) => /^:?-+:?$/.test(cell))) continue
    if (!headers) {
      headers = cells
      budget.headers = cells
    } else {
      if (
        cells.length !== headers.length ||
        !Number.isFinite(Number(cells[1]))
      ) {
        throw new Error(`Invalid leaderboard row: ${line}`)
      }
      budget.rows.push(cells)
    }
  } else if (track && !budget && line.trim()) track.note += `${line}\n`
}
if (!tracks.some((item) => item.budgets.some((item) => item.rows.length))) {
  throw new Error("Opal-Bench sync found no leaderboard rows")
}
if (tracks.some((item) => item.budgets.some((item) => !item.rows.length))) {
  throw new Error("Opal-Bench sync found an empty leaderboard budget")
}
const defaultTrack = tracks.find((track) => /Locked test/i.test(track.title))
if (!defaultTrack?.budgets.some((budget) => budget.k === 20))
  throw new Error("Missing locked test k = 20")

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
await mkdir(new URL("public/opal-bench/", root), { recursive: true })
await mkdir(new URL("src/content/", root), { recursive: true })
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
      tracks,
      defaultTrack: defaultTrack.id,
    },
    null,
    2
  ) + "\n"
)
console.log(`Synced Opal-Bench ${sha.slice(0, 7)}: ${tracks.length} tracks`)
