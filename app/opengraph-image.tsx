import { ImageResponse } from "next/og"
import { readFile } from "node:fs/promises"
import { join } from "node:path"
export const alt = "The Tiny Intelligence Lab"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"
export default async function OpenGraphImage() {
  const logo = await readFile(join(process.cwd(), "public/logo.png"))
  return new ImageResponse(
    <div
      style={{
        background: "white",
        color: "#171717",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* ImageResponse requires a native image element. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`data:image/png;base64,${logo.toString("base64")}`}
        alt=""
        width={260}
        height={260}
      />
      <div style={{ fontSize: 56, letterSpacing: -2, marginTop: -12 }}>
        the tiny intelligence lab
      </div>
      <div style={{ fontSize: 24, marginTop: 28, color: "#666" }}>
        Scientific questions. Models built around them.
      </div>
    </div>,
    size
  )
}
