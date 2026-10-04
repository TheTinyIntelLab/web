"use client"
import { defineConfig } from "sanity"
import { structureTool } from "sanity/structure"
import { schemaTypes } from "./studio/schemaTypes"
import { projectId, dataset } from "./src/sanity/env"
export default defineConfig({
  name: "tiny-intelligence-lab",
  title: "The Tiny Intelligence Lab",
  basePath: "/studio",
  projectId: projectId || "unconfigured",
  dataset,
  plugins: [structureTool()],
  schema: { types: schemaTypes },
})
