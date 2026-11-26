"use client"

import { type ReactNode, useState } from "react"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "@/components/ui/table"

type Budget = {
  k: number
  headers: string[]
  rows: string[][]
  unavailable?: string[]
  unscored?: string[]
}
type Track = {
  id: string
  title: string
  label: string
  group: string
  note: string
  budgets: Budget[]
}
type Split = { id: string; label: string; budgets: Budget[] }
type Footprint = {
  environment: {
    os: string
    cpu: string
    python: string
    numpy: string
    pandas: string
    blas_threads: number
  } | null
  methods: Record<string, string[]>
  reportedParams: Record<string, string>
  auxiliary: string[][]
}

const footprintHeaders = ["Params", "Peak RAM (MiB)", "CPU seconds"]
const apiNote =
  "Opal-v1-API-K562 uses target MID on its source screen, HORLBECK18, and whenever the API abstains. It abstained on every SHEN26 pair."
const apiUnseenNote =
  "Its unseen-gene scores count the checkpoint's training genes as seen and exclude HORLBECK18."
const supplementalTracks = [
  {
    id: "unseen",
    label: "Unseen genes",
    description:
      "Growth MSE for evaluation pairs with at least one, exactly one, or both genes absent from training and the current draw's calibration pairs. Lower is better. Pair counts are summed across draws. An empty cohort has no MSE.",
    empty: "No unseen-gene scores published for this snapshot.",
    unscored: "Training eligibility for unseen-gene scoring wasn’t established",
  },
  {
    id: "hits",
    label: "Top-5% hits",
    description:
      "Precision and recall for the bottom 5% (synergistic) and top 5% (buffering) of pair growth minus additive growth. The predicted and measured tails have equal sizes, so precision and recall are equal.",
    empty: "No top-5% hit scores published for this snapshot.",
    unscored: "Point scores available, hit metrics missing",
  },
  {
    id: "uncertainty",
    label: "Uncertainty",
    description:
      "Compare observed coverage with the 90% target and read mean width in normalized growth units. Target-screen calibration uses held-out target residuals. Training-screen calibration takes the radius from an allowed training screen and gives no nominal coverage guarantee on the target.",
    empty: "No published interval scores for this selection.",
    unscored: "Point scores available, interval scores missing",
  },
  {
    id: "prospective",
    label: "Rolling prospective",
    description:
      "A frozen submission can score only on screens whose pair outcomes first become public after its freeze. Screens the submitter already accessed, duplicates and reissues are excluded.",
    empty:
      "The first score awaits a frozen submission and a later eligible screen.",
    unscored: "",
  },
] as const
type SupplementalKind = (typeof supplementalTracks)[number]["id"]

function ResultsTable({
  budget,
  title,
  footprint,
  id = "opal-leaderboard-results",
}: {
  budget: Pick<Budget, "headers" | "rows"> & { k?: number }
  title: string
  footprint?: Footprint
  id?: string
}) {
  const rows = budget.rows.map(([method, ...scores]) => {
    const name = method.replace(/\s+[¹²³]+$/u, "")
    const profile =
      footprint && Object.hasOwn(footprint.methods, name)
        ? footprint.methods[name]
        : undefined
    const reported =
      footprint && Object.hasOwn(footprint.reportedParams, name)
        ? footprint.reportedParams[name]
        : undefined
    return { method, scores, profile, reported }
  })
  const columns = footprintHeaders
    .map((header, index) => ({ header, index }))
    .filter(({ index }) =>
      rows.some(({ profile, reported }) => profile || (index === 0 && reported))
    )
  const headers = [...budget.headers, ...columns.map(({ header }) => header)]

  return (
    <div className="relative left-1/2 mt-4 w-[calc(100vw-40px)] max-w-[1080px] -translate-x-1/2 sm:w-[calc(100vw-48px)]">
      <p className="mb-3 font-heading text-sm text-muted-foreground lg:hidden">
        Scroll sideways to see more columns.
      </p>
      <Table
        id={id}
        className="w-full border-collapse text-left font-heading text-base tabular-nums"
      >
        <TableCaption className="sr-only">
          {title}
          {budget.k !== undefined && `, k = ${budget.k}`}
        </TableCaption>
        <TableHeader>
          <TableRow className="border-y">
            {headers.map((header) => (
              <TableHead
                key={header}
                scope="col"
                className="px-3 py-3 font-medium first:pl-0"
              >
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map(({ method, scores, profile, reported }) => (
            <TableRow
              key={
                id === "opal-auxiliary-footprint"
                  ? `${method}:${scores[0]}`
                  : method
              }
              className={method === "MID" ? "border-b bg-muted" : "border-b"}
            >
              <TableHead scope="row" className="py-3 pr-3 pl-1 font-normal">
                {method}
              </TableHead>
              {scores.map((cell, index) => (
                <TableCell key={headers[index + 1]} className="px-3 py-3">
                  {cell}
                </TableCell>
              ))}
              {columns.map(({ header, index }) => (
                <TableCell
                  key={header}
                  className="px-3 py-3"
                  title={
                    !profile && index === 0 && reported
                      ? "Parameter count from the original benchmark run"
                      : undefined
                  }
                >
                  {profile?.[index] ??
                    (index === 0 && reported ? reported : "n/a")}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function UnavailableScores({
  budget,
  reason,
}: {
  budget: Budget
  reason: string
}) {
  const { unavailable = [], unscored = [] } = budget
  const count = unavailable.length + unscored.length
  if (!count) return null

  return (
    <details className="mt-5 border-y py-3 text-base">
      <summary className="cursor-pointer font-heading text-sm">
        Scores unavailable for {count} {count === 1 ? "method" : "methods"}
      </summary>
      {unavailable.length > 0 && (
        <p className="mt-3">
          <strong>Original model or run inputs unavailable.</strong> These
          methods retain their published few-shot scores.{" "}
          {unavailable.join(", ")}.
        </p>
      )}
      {unscored.length > 0 && (
        <p className="mt-3">
          <strong>{reason}.</strong> {unscored.join(", ")}.
        </p>
      )}
    </details>
  )
}

function FootprintNote({
  footprint,
  historical,
}: {
  footprint: Footprint
  historical: boolean
}) {
  const environment = footprint.environment

  return (
    <p className="mt-4 text-base text-muted-foreground">
      {environment
        ? `Footprint is measured per method across the shipped few-shot splits and budgets on ${environment.cpu} (${environment.os}, Python ${environment.python}, NumPy ${environment.numpy}, pandas ${environment.pandas}, BLAS threads ${environment.blas_threads}). For embedding methods, Params counts the fitted growth head. RAM and CPU also cover bank loading, any projection and interval generation. An n/a marks an unavailable measurement.`
        : "No footprint measurements published for this snapshot."}
      {historical &&
        Object.keys(footprint.reportedParams).length > 0 &&
        " NET_ATT and NET_MLP parameter counts come from the original run."}
    </p>
  )
}

function LeaderboardResults({
  title,
  budget,
  footprint,
  empty,
  unseen = false,
}: {
  title: string
  budget?: Budget
  footprint?: Footprint
  empty?: string
  unseen?: boolean
}) {
  const scored = budget?.rows.length ?? 0
  const summary = scored
    ? `${scored} ${scored === 1 ? "method" : "methods"} scored.`
    : empty
  const hasApi = budget?.rows.some(([method]) => method === "Opal-v1-API-K562")

  return (
    <>
      <p className="mt-4 text-base text-muted-foreground" aria-live="polite">
        {summary}
      </p>
      {scored > 0 && budget && (
        <ResultsTable budget={budget} title={title} footprint={footprint} />
      )}
      {hasApi && (
        <p className="mt-4 text-base text-muted-foreground">
          {apiNote}
          {unseen && ` ${apiUnseenNote}`}
        </p>
      )}
    </>
  )
}

function FewShotResults({
  track,
  budget,
  footprint,
}: {
  track: Track
  budget: Budget
  footprint: Footprint
}) {
  const historical = track.group === "Historical few-shot"

  return (
    <>
      <p className="mt-4">{track.title}</p>
      {track.note && (
        <p className="mt-2 text-base text-muted-foreground">{track.note}</p>
      )}
      {historical && (
        <p className="mt-2 text-base text-muted-foreground">
          Ranks use the original published comparison set, so they may skip
          positions.
        </p>
      )}
      <LeaderboardResults
        title={track.title}
        budget={budget}
        footprint={footprint}
      />
      <FootprintNote footprint={footprint} historical={historical} />
      {footprint.auxiliary.length > 0 && (
        <details className="mt-5 border-y py-3">
          <summary className="cursor-pointer font-heading text-sm">
            Auxiliary task footprint
          </summary>
          <p className="mt-4 text-base text-muted-foreground">
            Each row measures one pass of the named task on the shipped data.
          </p>
          <ResultsTable
            id="opal-auxiliary-footprint"
            title="Auxiliary task footprint"
            budget={{
              headers: ["Method", "Task", ...footprintHeaders],
              rows: footprint.auxiliary,
            }}
          />
        </details>
      )}
    </>
  )
}

function SupplementalResults({
  details,
  split,
  budget,
  prospectiveProtocol,
}: {
  details: (typeof supplementalTracks)[number]
  split?: Split
  budget?: Budget
  prospectiveProtocol?: ReactNode
}) {
  return (
    <>
      <p className="mt-4">{details.description}</p>
      <LeaderboardResults
        title={split ? `${details.label}, ${split.label}` : details.label}
        budget={budget}
        empty={details.empty}
        unseen={details.id === "unseen"}
      />
      {prospectiveProtocol && details.id === "prospective" && (
        <details className="mt-5 border-y py-3">
          <summary className="cursor-pointer font-heading text-sm">
            Read the prospective protocol
          </summary>
          {prospectiveProtocol}
        </details>
      )}
      {budget && (
        <UnavailableScores
          key={`${details.id}-${split?.id}-${budget.k}`}
          budget={budget}
          reason={details.unscored}
        />
      )}
    </>
  )
}

function selectBudget(budgets: Budget[], k: number) {
  return (
    budgets.find((item) => item.k === k) ??
    budgets.find((item) => item.k === 20) ??
    budgets[0]
  )
}

export function OpalLeaderboard({
  tracks,
  defaultTrack,
  footprint,
  supplemental,
  prospectiveProtocol,
}: {
  tracks: Track[]
  defaultTrack: string
  footprint: Footprint
  supplemental: Record<Exclude<SupplementalKind, "prospective">, Split[]>
  prospectiveProtocol?: ReactNode
}) {
  const [trackId, setTrackId] = useState(defaultTrack)
  const [splitId, setSplitId] = useState("test")
  const [k, setK] = useState(20)
  const supplementalSplits = { ...supplemental, prospective: [] }
  function getSelection(trackId: string, splitId: string) {
    const track = tracks.find((item) => item.id === trackId)
    const details = supplementalTracks.find((item) => item.id === trackId)
    const splits = details ? supplementalSplits[details.id] : []
    const split = splits.find((item) => item.id === splitId) ?? splits[0]
    const budgets = (track ?? split)?.budgets ?? []
    return { track, details, splits, split, budgets }
  }

  function changeSelection(trackId: string, splitId: string) {
    const { budgets } = getSelection(trackId, splitId)
    const budget = selectBudget(budgets, k)
    setTrackId(trackId)
    setSplitId(splitId)
    if (budget) setK(budget.k)
  }

  const { track, details, splits, split, budgets } = getSelection(
    trackId,
    splitId
  )
  const fewShotGroups = [...new Set(tracks.map((item) => item.group))]
  const budget = selectBudget(budgets, k)

  return (
    <div className="my-8 min-w-0 text-[17px] leading-relaxed sm:text-lg">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
        <label className="flex min-w-0 flex-1 flex-col gap-2 font-heading text-sm">
          Track
          <NativeSelect
            id="opal-track"
            className="w-full"
            value={trackId}
            onChange={(event) => changeSelection(event.target.value, splitId)}
          >
            {fewShotGroups.map((group) => (
              <optgroup key={group} label={group}>
                {tracks
                  .filter((item) => item.group === group)
                  .map((item) => (
                    <NativeSelectOption key={item.id} value={item.id}>
                      {item.label}
                    </NativeSelectOption>
                  ))}
              </optgroup>
            ))}
            <optgroup label="Supplemental tracks">
              {supplementalTracks.map((item) => (
                <NativeSelectOption key={item.id} value={item.id}>
                  {item.label}
                </NativeSelectOption>
              ))}
            </optgroup>
          </NativeSelect>
        </label>
        {split && (
          <label className="flex min-w-0 flex-col gap-2 font-heading text-sm">
            Data split
            <NativeSelect
              id="opal-split"
              className="w-full"
              value={split.id}
              onChange={(event) => changeSelection(trackId, event.target.value)}
            >
              {splits.map((item) => (
                <NativeSelectOption key={item.id} value={item.id}>
                  {item.label}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </label>
        )}
        {budget && (
          <label className="flex flex-col gap-2 font-heading text-sm">
            Measured pairs, k
            <NativeSelect
              id="opal-budget"
              className="w-full"
              value={budget.k}
              onChange={(event) => setK(Number(event.target.value))}
            >
              {budgets.map((item) => (
                <NativeSelectOption key={item.k} value={item.k}>
                  {item.k}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </label>
        )}
      </div>
      {track && budget && (
        <FewShotResults track={track} budget={budget} footprint={footprint} />
      )}
      {details && (
        <SupplementalResults
          details={details}
          split={split}
          budget={budget}
          prospectiveProtocol={prospectiveProtocol}
        />
      )}
    </div>
  )
}
