// Build src/data/docs.json from the markdown docs of the zerodot repo.
// Usage: node scripts/sync-docs.mjs [path-to-zerodot-repo]   (default: ../zerodot)
import { readFile, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";
import { Marked } from "marked";

const ROOT = process.argv[2] ?? join(import.meta.dirname, "../../zerodot");
const BLOB = "https://github.com/zerodot-io/zerodot/blob/main";

/** Site pages, in sidebar order. `file` is relative to the repo root. */
const PAGES = [
	{ slug: "quick-start", group: "Start here", title: "Quick start", file: "README.md", summary: "Run zerodot with Docker on your computer, or from the source code." },
	{ slug: "install", group: "Start here", title: "Install on a server", file: "docs/deploy-vps.md", summary: "Install zerodot on an Ubuntu or Debian server, with HTTPS." },
	{ slug: "credentials", group: "Reference", file: "docs/reference/credentials.md", summary: "The secret key, credential tests, and OAuth2." },
	{ slug: "core-nodes", group: "Reference", file: "docs/reference/core-nodes.md", summary: "Data, file, and Code nodes. Sandbox scaling." },
	{ slug: "node-packages", group: "Reference", file: "docs/reference/node-packages.md", summary: "Polling triggers, install, and versions." },
	{ slug: "webhooks", group: "Reference", file: "docs/reference/webhooks.md", summary: "The Webhook node." },
	{ slug: "api", group: "Reference", file: "docs/reference/api.md", summary: "The REST API, the MCP server, keys, and roles." },
	{ slug: "editor", group: "Reference", file: "docs/reference/editor.md", summary: "Loops, test runs, import, and export." },
	{ slug: "scaling", group: "Reference", file: "docs/reference/scaling.md", summary: "Queues, fair share, blobs, and Valkey modes." },
	{ slug: "operations", group: "Reference", file: "docs/reference/operations.md", summary: "The System page and data retention." },
];

const slugByFile = new Map(PAGES.map((p) => [basename(p.file), p.slug]));
slugByFile.set("README.md", "quick-start");

const idOf = (text) =>
	text
		.toLowerCase()
		.replace(/<[^>]+>/g, "")
		.replace(/&[a-z]+;/g, "")
		.replace(/[^\w\s-]/g, "")
		.trim()
		.replace(/\s+/g, "-");

/** Point links to other docs at their site page. Point other repo files at GitHub. */
function rewrite(href, fromFile) {
	if (/^(https?:|mailto:|#)/.test(href)) return href;
	const [path, hash] = href.split("#");
	const name = basename(path);
	if (name === "README.md" && path.includes("reference")) return "/docs";
	if (name.endsWith(".md") && slugByFile.has(name) && name !== "README.md") {
		return `/docs/${slugByFile.get(name)}${hash ? `#${hash}` : ""}`;
	}
	const dir = fromFile.includes("/") ? fromFile.slice(0, fromFile.lastIndexOf("/") + 1) : "";
	const resolved = new URL(path, `https://x/${dir}`).pathname.slice(1);
	return `${BLOB}/${resolved}${hash ? `#${hash}` : ""}`;
}

const out = [];
for (const page of PAGES) {
	let md = await readFile(join(ROOT, page.file), "utf8");
	// The README starts with a cover image and a logo title. The site has its own.
	md = md.replace(/^!\[[^\]]*\]\([^)]*\)\s*/m, "");

	let title = page.title;
	const toc = [];
	const marked = new Marked({
		renderer: {
			heading({ tokens, depth }) {
				const html = this.parser.parseInline(tokens);
				if (depth === 1) {
					title ??= html.replace(/<[^>]+>/g, "");
					return "";
				}
				const id = idOf(html);
				if (depth <= 3) toc.push({ id, text: html.replace(/<[^>]+>/g, ""), depth });
				return `<h${depth} id="${id}"><a class="anchor" href="#${id}" aria-hidden="true">#</a>${html}</h${depth}>\n`;
			},
			link({ href, title: t, tokens }) {
				const text = this.parser.parseInline(tokens);
				const url = rewrite(href, page.file);
				const external = url.startsWith("http");
				return `<a href="${url}"${t ? ` title="${t}"` : ""}${external ? ' rel="noreferrer"' : ""}>${text}</a>`;
			},
		},
	});
	const html = await marked.parse(md);
	out.push({ ...page, title, html, toc });
}

await writeFile(
	join(import.meta.dirname, "../src/data/docs.json"),
	`${JSON.stringify(out, null, 2)}\n`,
);
console.log(`${out.length} docs pages`);
