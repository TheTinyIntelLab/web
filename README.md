# The Tiny Intelligence Lab

The Tiny Intelligence Lab is an independent, one-person research lab. We build models for scientific problems and test whether understanding a problem's structure helps them learn better.

"Tiny" means using what the problem needs. We choose smaller models when they work well with less compute. Bigger models need to earn their place. We plan to share open source code, trained models, and experiments that others can repeat.

Our first project is Opal. It studies how cells respond to two biological changes at once, using measurements of each change on its own. Opal is still in research.

## Run locally

You'll need Node.js 22.12 or newer and pnpm 11.

Install the dependencies and copy the example environment file:

```sh
pnpm install
cp .env.example .env.local
```

Edit `.env.local` using the values below, then start the site:

```sh
pnpm dev
```

Open [localhost:3000](http://localhost:3000).

## Environment variables

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
```

- `NEXT_PUBLIC_SITE_URL` is the website's address. Use localhost while developing and your real domain when the site is online.
- `NEXT_PUBLIC_SANITY_PROJECT_ID` connects the blog to your Sanity project. Leave it blank to run the site without blog content.
- `NEXT_PUBLIC_SANITY_DATASET` names the collection of content in Sanity. It defaults to `production`.

To use the blog, choose a public dataset in [Sanity Manage](https://www.sanity.io/manage). Add `http://localhost:3000` to the project's allowed origins under CORS settings and enable credentials. Restart the app after changing the variables, then open [/studio](http://localhost:3000/studio) and sign in to edit articles.

Keep `.env.local` on your machine. Git ignores it.

## Writing articles

In `/studio`, write or paste Markdown into the Article text area. The blog renders headings, emphasis, links, images, lists, quotes, fenced code blocks, tables, and task lists. Raw HTML is ignored.

## Interface icons

Use Hugeicons Stroke Rounded from `@hugeicons/core-free-icons`, rendered with `HugeiconsIcon` from `@hugeicons/react`. Keep a 1.5px stroke and inherit the text color. Standalone icons use 20px; icons inside buttons follow the button's sizing and use `data-icon="inline-start"` or `data-icon="inline-end"` for spacing. Hide decorative icons from screen readers with `aria-hidden="true"` and give icon-only controls an accessible label. The stone artwork remains the lab's logo.

`components.json` configures shadcn to use Hugeicons for newly added components.
