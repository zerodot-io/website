import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { NodeIconOnly, NodeTile } from "#/components/NodeTile";
import { SiteFooter, SubHero } from "#/components/Site";
import {
	allNodes,
	findNode,
	GROUPS,
	groupOf,
	isTrigger,
	type NodeEntry,
	slugOf,
} from "#/lib/nodes";
import { NODES_REPO } from "#/lib/site";

export const Route = createFileRoute("/nodes/$slug")({
	loader: ({ params }) => {
		const node = findNode(params.slug);
		if (!node) throw notFound();
		return node;
	},
	head: ({ loaderData }) => ({
		meta: [
			{
				title: loaderData
					? `${loaderData.label} node | zerodot`
					: "Node | zerodot",
			},
			{ name: "description", content: loaderData?.description ?? "" },
		],
	}),
	notFoundComponent: NotFound,
	component: NodePage,
});

function NotFound() {
	return (
		<>
			<SubHero>
				<header className="sub-head">
					<p className="eyebrow">Nodes</p>
					<h1>No such node.</h1>
					<p>The link may be old, or the node may have a new name.</p>
					<div className="actions">
						<Link className="btn btn-dark btn-pill" to="/nodes">
							See all nodes
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

/** One node as the editor draws it: icon square, ports, and name. */
function NodeCanvas({ node }: { node: NodeEntry }) {
	const ins = node.ports?.in ?? [];
	const outs = node.ports?.out ?? [];
	const height = Math.max(64, Math.max(ins.length, outs.length) * 24);
	const trigger = isTrigger(node);
	return (
		<div className="app-window" aria-hidden="true">
			<div className="app-bar">
				<span className="app-dots">
					<i />
					<i />
					<i />
				</span>
				<b>{node.label}</b>
			</div>
			<div className="canvas solo">
				<div className="rf-node">
					<div
						className="rf-box"
						data-trigger={trigger ? "true" : undefined}
						style={{ height }}
					>
						{trigger && <ZapMark />}
						<NodeIconOnly node={node} />
					</div>
					{ins.map((p, i) => (
						<span
							key={p}
							className="rf-handle"
							data-side="in"
							style={{ top: ((i + 1) / (ins.length + 1)) * height }}
						/>
					))}
					{outs.map((p, i) => {
						const top = ((i + 1) / (outs.length + 1)) * height;
						return (
							<span key={p}>
								<span className="rf-handle" data-side="out" style={{ top }} />
								{outs.length > 1 && (
									<span className="rf-port" style={{ top }}>
										{p}
									</span>
								)}
							</span>
						);
					})}
					<div className="rf-name" style={{ top: height + 6 }}>
						<b>{node.label}</b>
					</div>
				</div>
			</div>
		</div>
	);
}

function ZapMark() {
	return (
		<svg
			className="rf-zap"
			viewBox="0 0 24 24"
			aria-hidden="true"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
		</svg>
	);
}

const portList = (ports: string[] | undefined, none: string) =>
	ports && ports.length > 0 ? (
		<span className="port-chips">
			{ports.map((p) => (
				<code key={p}>{p}</code>
			))}
		</span>
	) : (
		none
	);

function NodePage() {
	const node = Route.useLoaderData();
	const pkg = node.pkg;
	const group = pkg
		? pkg.label
		: (GROUPS.find((g) => g.id === groupOf(node))?.title ?? "Nodes");

	// Other nodes from the same group or package, for the "more" row.
	const related = allNodes
		.filter((n) =>
			pkg ? n.pkg?.name === pkg.name : !n.pkg && groupOf(n) === groupOf(node),
		)
		.filter((n) => n.type !== node.type)
		.slice(0, 6);

	return (
		<>
			<SubHero>
				<header className="node-hero">
					<div>
						<Link className="crumb" to="/nodes">
							<ChevronLeft aria-hidden strokeWidth={2} />
							All nodes
						</Link>
						<p className="eyebrow">{group}</p>
						<h1>{node.label}</h1>
						<p className="node-lede">{node.description}.</p>
						<div className="meta-row">
							<code className="meta-chip">{node.type}</code>
							<span className="meta-chip">
								{pkg ? `Add-on · v${pkg.version}` : "Built in"}
							</span>
							<a className="link-arrow" href={NODES_REPO}>
								Source
								<ChevronRight aria-hidden strokeWidth={2} />
							</a>
						</div>
					</div>
					<NodeCanvas node={node} />
				</header>
			</SubHero>

			<main className="page node-detail">
				<div className="node-main">
					{pkg && (
						<section className="panel" aria-labelledby="add">
							<h2 id="add">Add it</h2>
							<p>{pkg.description}</p>
							<div className="mock-list install-row">
								<div>
									<NodeTile node={node} />
									<b>{pkg.label}</b>
									<span className="mock-pkg">{pkg.name}</span>
									<span className="mock-btn">Install</span>
								</div>
							</div>
							<ol className="howto">
								<li>
									Open <b>System</b>, then <b>Nodes</b>.
								</li>
								<li>
									Find <b>{pkg.label}</b> and click Install.
								</li>
								<li>Use the new nodes at once. You do not restart.</li>
							</ol>
						</section>
					)}

					<section className="panel" aria-labelledby="settings">
						<h2 id="settings">Options</h2>
						{node.fields.length > 0 ? (
							<ul className="fields">
								{node.fields.map((f) => (
									<li key={f.name}>
										<div className="field-head">
											<code className="field-name">{f.name}</code>
											<span className="field-type">
												{f.type}
												{f.required ? " · required" : ""}
											</span>
										</div>
										{f.description && <p>{f.description}</p>}
										{f.options && (
											<p className="field-opts">
												{f.options.map((o) => (
													<code key={o}>{o}</code>
												))}
											</p>
										)}
										{f.default !== undefined && f.default !== "" && (
											<p className="field-default">
												Starts as <code>{JSON.stringify(f.default)}</code>
											</p>
										)}
									</li>
								))}
							</ul>
						) : (
							<p>
								{pkg
									? "The options show in the editor after you install the add-on."
									: "This node has no options. Add it, and it works."}
							</p>
						)}
					</section>

					{node.credentialTypes.length > 0 && (
						<section className="panel" aria-labelledby="creds">
							<h2 id="creds">Logins it can use</h2>
							<p>
								This node can use these saved logins. zerodot keeps each one
								encrypted.
							</p>
							<span className="port-chips">
								{node.credentialTypes.map((c) => (
									<code key={c}>{c}</code>
								))}
							</span>
						</section>
					)}
				</div>

				<aside className="glance" aria-label="At a glance">
					<h2>At a glance</h2>
					<dl>
						<div>
							<dt>Kind</dt>
							<dd>{pkg ? "Add-on" : "Built in"}</dd>
						</div>
						<div>
							<dt>Group</dt>
							<dd>{group}</dd>
						</div>
						{node.ports && (
							<>
								<div>
									<dt>Starts from</dt>
									<dd>
										{portList(node.ports.in, "Nothing. It starts a workflow.")}
									</dd>
								</div>
								<div>
									<dt>Goes to</dt>
									<dd>
										{portList(node.ports.out, "Nothing. The workflow ends.")}
									</dd>
								</div>
							</>
						)}
						<div>
							<dt>Options</dt>
							<dd>{node.fields.length || "None"}</dd>
						</div>
						{pkg && (
							<div>
								<dt>Package</dt>
								<dd>
									<code>{pkg.name}</code>
								</dd>
							</div>
						)}
					</dl>
				</aside>
			</main>

			{related.length > 0 && (
				<section className="page related" aria-labelledby="more">
					<h2 id="more">
						{pkg ? `More in ${pkg.label}` : `More ${group.toLowerCase()} nodes`}
					</h2>
					<div className="node-cards">
						{related.map((n) => (
							<Link
								key={n.type}
								to="/nodes/$slug"
								params={{ slug: slugOf(n) }}
								className="node-card"
							>
								<NodeTile node={n} />
								<span>
									<b>{n.label}</b>
									<small>{n.description}</small>
								</span>
							</Link>
						))}
					</div>
				</section>
			)}

			<div className="page">
				<SiteFooter />
			</div>
		</>
	);
}
