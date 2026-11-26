import * as React from "react"
import { createHighlighterCore, type HighlighterCore } from "shiki/core"
import { createJavaScriptRegexEngine } from "shiki/engine/javascript"

// Add the languages you need. Each one loads the first time it is used.
const languages = {
  bash: () => import("shiki/langs/shellscript.mjs"),
  css: () => import("shiki/langs/css.mjs"),
  diff: () => import("shiki/langs/diff.mjs"),
  html: () => import("shiki/langs/html.mjs"),
  javascript: () => import("shiki/langs/javascript.mjs"),
  json: () => import("shiki/langs/json.mjs"),
  jsx: () => import("shiki/langs/jsx.mjs"),
  markdown: () => import("shiki/langs/markdown.mjs"),
  python: () => import("shiki/langs/python.mjs"),
  sql: () => import("shiki/langs/sql.mjs"),
  tsx: () => import("shiki/langs/tsx.mjs"),
  typescript: () => import("shiki/langs/typescript.mjs"),
  yaml: () => import("shiki/langs/yaml.mjs"),
}

const aliases: Partial<Record<string, keyof typeof languages>> = {
  js: "javascript",
  md: "markdown",
  py: "python",
  sh: "bash",
  shell: "bash",
  shellscript: "bash",
  ts: "typescript",
  yml: "yaml",
  zsh: "bash",
}

let highlighter: Promise<HighlighterCore> | undefined

function getHighlighter() {
  highlighter ??= createHighlighterCore({
    themes: [
      import("shiki/themes/github-light.mjs"),
      import("shiki/themes/github-dark.mjs"),
    ],
    langs: [],
    engine: createJavaScriptRegexEngine({ forgiving: true }),
  })

  return highlighter
}

export async function highlightCode(code: string, language: string) {
  const name = language.toLowerCase()
  const lang = aliases[name] ?? name
  if (lang !== "ansi" && !(lang in languages)) return null
  const shiki = await getHighlighter()
  if (lang !== "ansi" && !shiki.getLoadedLanguages().includes(lang)) {
    await shiki.loadLanguage(languages[lang as keyof typeof languages])
  }
  return shiki
    .codeToTokens(code, {
      lang,
      themes: { light: "github-light", dark: "github-dark" },
      defaultColor: false,
    })
    .tokens.map((line) =>
      line.map((token, index) => (
        <span
          key={index}
          style={token.htmlStyle as React.CSSProperties}
          className="text-(--shiki-light) dark:text-(--shiki-dark)"
        >
          {token.content}
        </span>
      ))
    )
}
