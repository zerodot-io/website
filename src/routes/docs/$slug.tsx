import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SiteFooter, SubHero } from "#/components/Site";
import { DOC_GROUPS, docs, findDoc } from "#/lib/docs";
import { REPO } from "#/lib/site";

export const Route = createFileRoute("/docs/$slug")({
	loader: ({ params }) => {
		const doc = findDoc(params.slug);
		if (!doc) throw notFound();
		return doc;
	},
	head: ({ loaderData }) => ({
		meta: [
			{
				title: loaderData
					? `${loaderData.title} | zerodot docs`
					: "Docs | zerodot",
			},
			{ name: "description", content: loaderData?.summary ?? "" },
		],
	}),
	notFoundComponent: NotFound,
	component: DocPage,
});

function NotFound() {
	return (
		<>
			<SubHero>
				<header className="sub-head">
					<p className="eyebrow">Docs</p>
					<h1>No such page.</h1>
					<p>The link may be old, or the page may have a new name.</p>
					<div className="actions">
						<Link className="btn btn-dark btn-pill" to="/docs">
							All docs
							<ChevronRight aria-hidden strokeWidth={2} />
						</Link>
					</div>
				</header>
			</SubHero>
			<div className="page">
				<SiteFooter />
			</div>
		</>
	);
}

function DocPage() {
	const doc = Route.useLoaderData();
	const index = docs.findIndex((d) => d.slug === doc.slug);
	const prev = docs[index - 1];
	const next = docs[index + 1];

	return (
		<>
			<SubHero>
				<header className="sub-head doc-head">
					<Link className="crumb" to="/docs">
						<ChevronLeft aria-hidden strokeWidth={2} />
						All docs
					</Link>
					<p className="eyebrow">{doc.group}</p>
					<h1>{doc.title}</h1>
					<p>{doc.summary}</p>
				</header>
			</SubHero>

			<div className="page docs-layout">
				<nav className="docs-side" aria-label="Docs">
					{DOC_GROUPS.map((group) => (
						<div key={group}>
							<p>{group}</p>
							<ul>
								{docs
									.filter((d) => d.group === group)
									.map((d) => (
										<li key={d.slug}>
											<Link
												to="/docs/$slug"
												params={{ slug: d.slug }}
												aria-current={d.slug === doc.slug ? "page" : undefined}
											>
												{d.title}
											</Link>
										</li>
									))}
							</ul>
						</div>
					))}
				</nav>

				<main className="docs-main">
					<article
						className="prose"
						// The HTML comes from our own docs, rendered at sync time.
						// biome-ignore lint/security/noDangerouslySetInnerHtml: trusted, generated from the zerodot repo.
						dangerouslySetInnerHTML={{ __html: doc.html }}
					/>

					<p className="doc-edit">
						<a href={`${REPO}/blob/main/${doc.file}`}>
							Change this page on GitHub
							<ChevronRight aria-hidden strokeWidth={2} />
						</a>
					</p>

					<nav className="doc-pager" aria-label="Next and previous">
						{prev ? (
							<Link to="/docs/$slug" params={{ slug: prev.slug }}>
								<small>Previous</small>
								<b>
									<ChevronLeft aria-hidden strokeWidth={2} />
									{prev.title}
								</b>
							</Link>
						) : (
							<span />
						)}
						{next && (
							<Link
								className="next"
								to="/docs/$slug"
								params={{ slug: next.slug }}
							>
								<small>Next</small>
								<b>
									{next.title}
									<ChevronRight aria-hidden strokeWidth={2} />
								</b>
							</Link>
						)}
					</nav>
				</main>

				{doc.toc.length > 1 && (
					<nav className="docs-toc" aria-label="On this page">
						<p>On this page</p>
						<ul>
							{doc.toc.map((t) => (
								<li key={t.id} data-depth={t.depth}>
									<a href={`#${t.id}`}>{t.text}</a>
								</li>
							))}
						</ul>
					</nav>
				)}
			</div>

			<div className="page">
				<SiteFooter />
			</div>
		</>
	);
}
