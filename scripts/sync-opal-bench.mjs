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
const files = [
  "README.md",
  "leaderboard/LEADERBOARD.md",
  "NEGATIVE_RESULTS.md",
  "DATA_LICENSES.md",
  "CITATION.cff",
]
const [readme, leaderboard, negative, licenses, citation] = await Promise.all(
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

// Preserve new README sections automatically; resolve repository-relative links.
function markdown(text) {
  return text
    .replace(
      /<img\s+[^>]*src="([^"]+)"[^>]*alt="([^"]*)"[^>]*\/?\s*>/g,
      "![$2]($1)"
    )
    .replace(/(!?\[[^\]]*\]\()([^\s)]+)(\))/g, (_, start, path, end) => {
      if (/^(https?:|mailto:|#|\/)/.test(path)) return start + path + end
      return (
        start +
        (start.startsWith("![") && path.startsWith("images/")
          ? `/opal-bench/${path}`
          : `${repo}/blob/main/${path}`) +
        end
      )
    })
    .replace(/Opal v1\b/g, "Opal")
}
const introStart = readme.indexOf("Opal-Bench measures")
if (introStart < 0) throw new Error("Missing README introduction")
const content = markdown(readme.slice(introStart))
const sections = content.split(/^## /m)
const intro = sections.shift().trim()
const parsedSections = sections.map((section) => {
  const newline = section.indexOf("\n")
  const title = section.slice(0, newline).trim()
  return {
    title,
    id: title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/-$/, ""),
    body: section.slice(newline).trim(),
  }
})
const images = [
  ...new Set(
    [...content.matchAll(/\/opal-bench\/(images\/[\w.-]+)/g)].map(
      (match) => match[1]
    )
  ),
]
await mkdir(new URL("public/opal-bench/images/", root), { recursive: true })
await Promise.all(
  images.map(async (path) => {
    const bytes = await (await get(raw + path)).arrayBuffer()
    await writeFile(
      new URL(`public/opal-bench/${path}`, root),
      Buffer.from(bytes)
    )
  })
)
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
      intro,
      sections: parsedSections,
      tracks,
      defaultTrack: defaultTrack.id,
      leaderboardNotes: markdown(
        leaderboard.split(/^## Main track/m)[0].replace(/^# .*\n/, "")
      ),
      negative: markdown(negative.replace(/^# .*\n/, "")),
      licenses: markdown(licenses.replace(/^# .*\n/, "")),
    },
    null,
    2
  ) + "\n"
)
console.log(`Synced Opal-Bench ${sha.slice(0, 7)}: ${tracks.length} tracks`)
