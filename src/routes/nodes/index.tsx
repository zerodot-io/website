import { createFileRoute, Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState } from "react";
import { NodeTile } from "#/components/NodeTile";
import { SiteFooter, SubHero } from "#/components/Site";
import {
	allNodes,
	GROUPS,
	type GroupId,
	groupOf,
	type NodeEntry,
	nodes,
	packages,
	slugOf,
} from "#/lib/nodes";
import { NODES_REPO } from "#/lib/site";

export const Route = createFileRoute("/nodes/")({
	head: () => ({
		meta: [
			{ title: "Nodes | zerodot" },
			{
				name: "description",
				content: `${nodes.length} built-in zerodot nodes, and ${packages.length} add-ons to install when you need them.`,
			},
		],
	}),
	component: NodesPage,
});

type Filter = "all" | GroupId | "addons";

const FILTERS: { id: Filter; title: string }[] = [
	{ id: "all", title: "All" },
	...GROUPS.map((g) => ({ id: g.id as Filter, title: g.title as string })),
	{ id: "addons", title: "Add-ons" },
];

function NodeCard({ node }: { node: NodeEntry }) {
	return (
		<Link
			to="/nodes/$slug"
			params={{ slug: slugOf(node) }}
			className="node-card"
		>
			<NodeTile node={node} />
			<span>
				<b>
					{node.label}
					{node.pkg && <em>Add-on</em>}
				</b>
				<small>{node.description}</small>
			</span>
		</Link>
	);
}

function NodesPage() {
	const [query, setQuery] = useState("");
	const [filter, setFilter] = useState<Filter>("all");
	const needle = query.trim().toLowerCase();
	const matches = (n: NodeEntry) =>
		!needle ||
		`${n.label} ${n.description} ${n.type} ${n.pkg?.label ?? ""}`
			.toLowerCase()
			.includes(needle);

	const sections = [
		...GROUPS.map((g) => ({
			id: g.id as Filter,
			title: g.title as string,
			sub: undefined as string | undefined,
			addon: false,
			items: allNodes.filter(
				(n) => !n.pkg && groupOf(n) === g.id && matches(n),
			),
		})),
		...packages.map((p) => ({
			id: "addons" as Filter,
			title: p.label,
			sub: `${p.name} · v${p.version}`,
			addon: true,
			items: allNodes.filter((n) => n.pkg?.name === p.name && matches(n)),
		})),
	].filter((s) => s.items.length > 0 && (filter === "all" || filter === s.id));

	const shown = sections.reduce((sum, s) => sum + s.items.length, 0);

	return (
		<>
			<SubHero>
				<header className="sub-head">
					<p className="eyebrow">Nodes</p>
					<h1>Every step you can use.</h1>
					<p>
						A workflow is a list of steps. Each step is called a node.{" "}
						{nodes.length} nodes are built in. {packages.length} add-ons give
						you more when you need them.
					</p>
					<div className="finder">
						<label className="search-pill">
							<Search aria-hidden strokeWidth={2} />
							<span className="sr-only">Search nodes</span>
							<input
								type="search"
								placeholder="Search nodes, for example Postgres"
								value={query}
								onChange={(e) => setQuery(e.target.value)}
								autoComplete="off"
								spellCheck={false}
							/>
						</label>
						<div className="chips" role="group" aria-label="Filter nodes">
							{FILTERS.map((f) => (
								<button
									key={f.id}
									type="button"
									className="filter-chip"
									aria-pressed={filter === f.id}
									onClick={() => setFilter(f.id)}
								>
									{f.title}
								</button>
							))}
						</div>
					</div>
				</header>
			</SubHero>

			<main className="page node-index">
				<p className="result-count" aria-live="polite">
					{shown === 1 ? "1 node" : `${shown} nodes`}
				</p>

				{sections.length === 0 && (
					<div className="empty-box">
						<b>No node matches “{query}”.</b>
						<p>Try a shorter word, or pick All.</p>
					</div>
				)}

				{sections.map((s) => (
					<section
						className="node-group"
						key={`${s.id}-${s.title}`}
						aria-label={s.title}
					>
						<header>
							<h2>{s.title}</h2>
							{s.sub ? (
								<code>{s.sub}</code>
							) : (
								<span>{s.items.length} built in</span>
							)}
						</header>
						<div className="node-cards">
							{s.items.map((n) => (
								<NodeCard key={n.type} node={n} />
							))}
						</div>
					</section>
				))}

				<div className="callout">
					<div>
						<b>Want to read the code of a node?</b>
						<p>Each add-on lives in the zerodot-nodes repository.</p>
					</div>
					<a className="btn btn-dark btn-pill" href={NODES_REPO}>
						Open zerodot-nodes
					</a>
				</div>
			</main>

			<div className="page">
				<SiteFooter />
			</div>
		</>
	);
}
