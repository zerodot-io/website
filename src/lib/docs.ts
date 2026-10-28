import raw from "#/data/docs.json";

export type DocPage = {
	slug: string;
	group: string;
	title: string;
	summary: string;
	file: string;
	/** Rendered at sync time from the markdown in the zerodot repo. Refresh with `bun run sync:docs`. */
	html: string;
	toc: { id: string; text: string; depth: number }[];
};

export const docs: DocPage[] = raw as DocPage[];

export const DOC_GROUPS = [...new Set(docs.map((d) => d.group))];

export const findDoc = (slug: string) => docs.find((d) => d.slug === slug);
