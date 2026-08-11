/**
 * Insights.
 *
 * There is no existing article content and none was supplied, so nothing here
 * is invented. The route, index and template are built and styled so that
 * adding a real post is a data change rather than a build, and the single entry
 * below is explicitly marked as a placeholder.
 *
 * Recommendation in QUESTIONS.md item 11: keep this unlinked at launch. An
 * empty blog reads worse than no blog.
 */

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  /** ISO date, or null while unpublished. */
  publishedAt: string | null;
  readingMinutes: number;
  /** Placeholders never render as real articles. */
  placeholder: boolean;
  body: string[];
}

export const posts: Post[] = [
  {
    slug: "what-to-expect-at-your-first-scan",
    title: "What to expect at your first scan",
    excerpt:
      "Placeholder. Awaiting content from the practice. This entry exists so the template can be reviewed, and it is excluded from the sitemap and from search indexing.",
    publishedAt: null,
    readingMinutes: 3,
    placeholder: true,
    body: [
      "This is placeholder text for layout review only. It makes no clinical claim and must be replaced before this page is linked from anywhere.",
      "Article content for this practice has to come from the practice. Nothing on this page may be drafted from general knowledge, because a statement about imaging on a clinic's own website reads as that clinic's clinical advice.",
    ],
  },
];

export const publishedPosts = () =>
  posts.filter((p) => !p.placeholder && p.publishedAt);

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);
