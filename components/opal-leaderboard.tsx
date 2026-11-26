"use client"

import { useState } from "react"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "@/components/ui/table"
import type data from "@/src/content/opal-bench.json"

type Track = (typeof data.tracks)[number]
const methodNames: Record<string, string> = {
  v1F: "Opal frozen",
  v1R: "Opal refit",
  v1O: "Opal API",
}

export function OpalLeaderboard({
  tracks,
  defaultTrack,
}: {
  tracks: Track[]
  defaultTrack: string
}) {
  const [trackId, setTrackId] = useState(defaultTrack)
  const [k, setK] = useState(20)
  const [expanded, setExpanded] = useState(false)
  const track = tracks.find((item) => item.id === trackId)!
  const budget = track.budgets.find((item) => item.k === k)!
  const rows = expanded
    ? budget.rows
    : budget.rows.filter((row, index) => index < 5 || row[0] === "MID")
  const headers = expanded ? budget.headers : budget.headers.slice(0, 3)

  return (
    <div className="my-8 min-w-0 font-heading text-sm">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
        <label
          className="flex min-w-0 flex-1 flex-col gap-2"
          htmlFor="opal-track"
        >
          Track
          <NativeSelect
            id="opal-track"
            className="w-full"
            value={trackId}
            onChange={(event) => {
              const next = tracks.find(
                (item) => item.id === event.target.value
              )!
              setTrackId(next.id)
              if (!next.budgets.some((item) => item.k === k)) {
                setK(
                  next.budgets.find((item) => item.k === 20)?.k ??
                    next.budgets[0].k
                )
              }
            }}
          >
            {tracks.map((item) => (
              <NativeSelectOption key={item.id} value={item.id}>
                {item.group.startsWith("Shipped") ? "Shipped data · " : ""}
                {item.label}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </label>
        <label className="flex flex-col gap-2" htmlFor="opal-budget">
          Measured pairs, k
          <NativeSelect
            id="opal-budget"
            className="w-full"
            value={k}
            onChange={(event) => setK(Number(event.target.value))}
          >
            {track.budgets.map((item) => (
              <NativeSelectOption key={item.k} value={item.k}>
                {item.k}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </label>
      </div>
      <p className="mt-4 text-sm leading-relaxed">
        {track.title.split(" — ").at(-1)}
      </p>
      {track.note && (
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          {track.note}
        </p>
      )}
      <p className="mt-4 text-sm text-muted-foreground" aria-live="polite">
        Showing {rows.length} of {budget.rows.length} methods. Lower error is
        better.
      </p>
      <div className="mt-4">
        <Table
          id="opal-leaderboard-results"
          data-expanded={expanded}
          className="w-full min-w-[420px] border-collapse text-left text-xs tabular-nums data-[expanded=true]:min-w-[640px] sm:text-sm"
        >
          <TableCaption className="sr-only">
            {track.title}, k = {k}. Error relative to MID and bootstrap rank
            intervals.
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
            {rows.map((row) => (
              <TableRow
                key={row[0]}
                className={row[0] === "MID" ? "border-b bg-muted" : "border-b"}
              >
                {row.slice(0, headers.length).map((cell, index) => {
                  const text =
                    index === 0
                      ? cell.replace(
                          /\bv1[FOR]\b/g,
                          (name) => methodNames[name]
                        )
                      : cell
                  return index === 0 ? (
                    <TableHead
                      scope="row"
                      key={budget.headers[index]}
                      className="py-3 pr-3 pl-1 text-left font-normal whitespace-nowrap"
                    >
                      {text}
                    </TableHead>
                  ) : (
                    <TableCell
                      key={budget.headers[index]}
                      className="px-3 py-3 whitespace-nowrap"
                    >
                      {text}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Button
        variant="ghost"
        className="mt-3"
        aria-expanded={expanded}
        aria-controls="opal-leaderboard-results"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? "Show fewer results" : "See all results"}
      </Button>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground sm:hidden">
        Scroll sideways to see every column.
      </p>
    </div>
  )
}
