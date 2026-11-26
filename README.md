# The Tiny Intelligence Lab

The Tiny Intelligence Lab is an independent research lab. We build models for scientific problems and test whether understanding a problem's structure helps them learn better.

Read [research and announcements on The Tiny Intelligence Lab website](https://thetinyintelligencelab.vercel.app/).

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
- `GOOGLE_SITE_VERIFICATION` is optional. For Search Console HTML tag verification, set it to the value of the tag's `content` attribute and redeploy.
- `NEXT_PUBLIC_SANITY_PROJECT_ID` connects the blog to your Sanity project. Leave it blank to run the site without blog content.
- `NEXT_PUBLIC_SANITY_DATASET` names the collection of content in Sanity. It defaults to `production`.

To use the blog, choose a public dataset in [Sanity Manage](https://www.sanity.io/manage). Add `http://localhost:3000` to the project's allowed origins under CORS settings and enable credentials. Restart the app after changing the variables, then open [/studio](http://localhost:3000/studio) and sign in to edit articles.

Keep `.env.local` on your machine. Git ignores it.

## Search indexing

Set `NEXT_PUBLIC_SITE_URL` to the public HTTPS origin on the production deployment. It controls canonical URLs, structured data, and the sitemap. When the variable is unset on Vercel, the app uses the project's production domain. Local development and Vercel previews send `noindex`.

In [Google Search Console](https://search.google.com/search-console), verify the current site's URL-prefix property, submit `sitemap.xml`, and request indexing for the homepage through URL Inspection. Use the same inspection to check Google's selected canonical and indexing status after it crawls the page. Check that the property is included in Search generative AI features, if that setting is available. [Google's AI search guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)

When the new domain is ready, verify it in Search Console and update `NEXT_PUBLIC_SITE_URL` on the production deployment. Set permanent redirects from the old host to the matching paths on the new host, test the homepage and article redirects, and submit the new sitemap. Use Search Console's Change of Address tool if the properties are eligible. Keep the old redirects active for at least a year. [Google's site move guide](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes)

## Writing articles

In `/studio`, write or paste Markdown into the Article text area. The blog renders headings, emphasis, links, images, lists, quotes, fenced code blocks, tables, and task lists. Raw HTML is ignored.

## Interface icons

Use Hugeicons Stroke Rounded from `@hugeicons/core-free-icons`, rendered with `HugeiconsIcon` from `@hugeicons/react`. Keep a 1.5px stroke and inherit the text color. Standalone icons use 20px; icons inside buttons follow the button's sizing and use `data-icon="inline-start"` or `data-icon="inline-end"` for spacing. Hide decorative icons from screen readers with `aria-hidden="true"` and give icon-only controls an accessible label. The stone artwork remains the lab's logo.

`components.json` configures shadcn to use Hugeicons for newly added components.

## Opal-Bench page sync

`pnpm build` syncs the leaderboard, runnable examples and citation from the Opal-Bench repository's `main` branch. Use `pnpm sync:opal-bench` to refresh them during development. The build fails if GitHub is unavailable or the leaderboard has no valid rows.

Set `GITHUB_TOKEN` to authenticate the sync when GitHub's anonymous API quota is too low for your builds.
