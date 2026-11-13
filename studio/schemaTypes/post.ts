import { defineField, defineType } from "sanity"
export const post = defineType({
  name: "post",
  title: "Article",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (r) => r.required().max(120),
    }),
    defineField({
      name: "slug",
      title: "URL slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) =>
        r
          .required()
          .custom((value) =>
            !value?.current || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.current)
              ? true
              : "Use lowercase letters, numbers, and hyphens."
          ),
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
      description: "A short introduction, also used in search results.",
      validation: (r) => r.required().max(200),
    }),
    defineField({
      name: "publishedAt",
      title: "Publication date",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      description:
        "Future dates keep the article off the public site until that time.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "coverImage",
      title: "Cover image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alternative text",
          type: "string",
          validation: (r) => r.required(),
        }),
      ],
    }),
    defineField({
      name: "markdown",
      title: "Article",
      type: "text",
      rows: 30,
      description:
        "Write or paste Markdown. Supports headings, links, images, lists, tables, and fenced code blocks.",
      validation: (r) =>
        r
          .required()
          .custom((value) =>
            value?.trim() ? true : "Add the article in Markdown."
          ),
    }),
  ],
  orderings: [
    {
      title: "Newest first",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "publishedAt", media: "coverImage" },
  },
})
