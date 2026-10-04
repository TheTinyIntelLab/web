# The Tiny Intelligence Lab

The lab's website, built with Next.js App Router, TypeScript, Tailwind CSS, and the existing shadcn/ui Maia configuration. Inter is used for headings and navigation. Newsreader is used for the reading text. Both fonts are bundled locally through `next/font/local`.

The homepage has a one-line thesis, a short introduction to the lab, and a brief explanation of Opal. The About links point to /#about. Three key sentences use italics, and the stone naming note is visually smaller. The stone logo lives in `public/logo.png`. Opal is described as research in progress.

The site defaults to light mode. The footer switch saves a light or dark preference in the browser. Dark mode uses the original yellow; light mode mixes it with 20% black in OKLCH. Both modes use a subtle purple accent for navigation hover and focus. Opal has no version label, and the introductory announcement remains commented out in `app/page.tsx`.

## Run locally

Use Node.js 22.12 or newer and pnpm 11.

```sh
pnpm install
cp .env.example .env.local
pnpm dev
```

On PowerShell, use `Copy-Item .env.example .env.local` instead of `cp`.

Open [localhost:3000](http://localhost:3000). The homepage and journal empty state work without a Sanity project.

## Connect Sanity

This is one Next.js application. Studio is embedded at `/studio` and deploys with the website, following [Sanity's embedded Studio guide](https://www.sanity.io/docs/nextjs/embedding-sanity-studio-in-nextjs).

1. Create a Sanity project or choose an existing one. Use a public dataset, such as `production`. The site reads published content without an API token.
2. Set `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` in `.env.local`.
3. In [Sanity Manage](https://www.sanity.io/manage), add `http://localhost:3000` to the project's CORS origins and allow credentials. Add the deployed origin the same way when you launch.
4. Restart Next.js and open `/studio`. Sign in with a Sanity account that has access to your project.
5. Create an Article. Add a title, generate its URL slug, write a summary and body, and choose a publication date. Publish it to show it in the journal.

Cover images are optional. Image alternative text is required. The body supports headings, lists, quotes, links, images with captions, and code blocks. Article URLs are `/blog/[slug]`.

Drafts stay out of public queries. A future publication date hides an article until that time. Content refreshes on a 60-second cache interval; the next request after expiry triggers regeneration, so changes can take slightly longer than a minute to appear. Draft preview and webhooks are not configured.

Without a project ID, `/studio` shows setup instructions. A configured project that cannot be reached produces the journal error screen instead of pretending there are no articles. Live publishing still needs to be checked after you connect your project.

## Project structure

```text
app/                       Next.js routes and metadata
  blog/                    Journal index and article pages
  studio/[[...tool]]/       Embedded Studio route
components/                Shared page composition
  ui/                      shadcn/ui components
src/
  content/home.ts          Homepage copy
  lib/site.ts              Lab name, description, and public URL
  sanity/                  Published-content client, queries, and images
studio/
  embedded.tsx             Studio client entry
  schemaTypes/             Article schema
sanity.config.ts           Embedded Studio configuration
sanity.cli.ts              Sanity CLI configuration
public/logo.png            Lab logo
```

Keep routes in the existing root `app/` folder. `src/` holds content and CMS utilities. `studio/` holds Studio code. There is no second application or separate Studio deployment.

## Edit the site

Change homepage text in `src/content/home.ts`, navigation and contact links in `components/site-shell.tsx`, and layout rules in `app/globals.css`. The existing shadcn colors and radius tokens remain in that stylesheet. Interactive site controls use shadcn/ui. Sanity supplies its own editing interface.

The design follows the navigation, centered identity, narrow reading column, and grouped footer of [Thinking Machines Lab](https://thinkingmachines.ai/), with this lab's own logo and copy.

`context.md` is private working context. Git ignores it, and the app never imports or serves it. Local environment files are ignored too; only `.env.example` is tracked.

## SEO and deployment

Set `NEXT_PUBLIC_SITE_URL` to your real production origin, for example `https://your-domain.com`. Without it, local development uses `http://localhost:3000`. Do not ship the localhost fallback or the example domain.

The site includes canonical URLs, page descriptions, Open Graph and Twitter metadata, a generated social image, organization and article JSON-LD, `/sitemap.xml`, and `/robots.txt`. The sitemap includes published articles. Studio has noindex metadata and is excluded from crawling and the sitemap.

Deploy this folder as one Next.js project on Vercel. Add all three variables from `.env.example` to the deployment environment, then build. Public variables are bundled at build time, so changing them requires a new deployment. There are no server API secrets in this setup.

## Checks

```sh
pnpm typecheck
pnpm lint
pnpm build
pnpm start
```

The production build, lint, and TypeScript checks pass with Sanity unconfigured. Browser checks cover desktop and mobile layouts, homepage anchors, journal navigation, the Studio setup screen, and missing article pages. A live Sanity publishing test requires your project credentials.
