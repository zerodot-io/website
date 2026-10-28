import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { SiteFooter, SubHero } from "#/components/Site";
import { DOC_GROUPS, docs } from "#/lib/docs";

export const Route = createFileRoute("/docs/")({
	head: () => ({
		meta: [
			{ title: "Docs | zerodot" },
			{
				name: "description",
				content: "Install zerodot, run it, and learn how each part works.",
			},
		],
	}),
	component: DocsHome,
});

function DocsHome() {
	return (
		<>
			<SubHero>
				<header className="sub-head">
					<p className="eyebrow">Docs</p>
					<h1>Learn zerodot.</h1>
					<p>
						Start with the quick start, or install zerodot on your own server.
						The reference tells how each part works.
					</p>
					<div className="actions">
						<Link
							className="btn btn-dark btn-pill"
							to="/docs/$slug"
							params={{ slug: "quick-start" }}
						>
							Quick start
							<ChevronRight aria-hidden strokeWidth={2} />
						</Link>
						<Link
							className="link-arrow"
							to="/docs/$slug"
							params={{ slug: "install" }}
						>
							Install on a server
							<ChevronRight aria-hidden strokeWidth={2} />
						</Link>
					</div>
				</header>
			</SubHero>

			<main className="page docs-home">
				{DOC_GROUPS.map((group) => (
					<section key={group} className="node-group" aria-label={group}>
						<header>
							<h2>{group}</h2>
						</header>
						<div
							className={group === "Start here" ? "doc-cards big" : "doc-cards"}
						>
							{docs
								.filter((d) => d.group === group)
								.map((d) => (
									<Link
										key={d.slug}
										to="/docs/$slug"
										params={{ slug: d.slug }}
										className="doc-card"
									>
										<b>{d.title}</b>
										<small>{d.summary}</small>
										<span className="doc-card-go" aria-hidden="true">
											Read
											<ChevronRight strokeWidth={2} />
										</span>
									</Link>
								))}
						</div>
					</section>
				))}
			</main>

			<div className="page">
				<SiteFooter />
			</div>
		</>
	);
}
