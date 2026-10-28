import { createFileRoute, Link } from "@tanstack/react-router";
import { AppWindow, Bot, Check, ChevronRight, Lock, Pin } from "lucide-react";
import type { CSSProperties } from "react";
import { Flow } from "#/components/Flow";
import { Mark } from "#/components/Logo";
import { NodeTile } from "#/components/NodeTile";
import { SiteFooter, SiteNav } from "#/components/Site";
import { allNodes, type NodeEntry, nodes, packages, slugOf } from "#/lib/nodes";
import { INSTALL_URL, REPO } from "#/lib/site";

export const Route = createFileRoute("/")({ component: Home });

const byType = (types: string[]) =>
	types
		.map((t) => allNodes.find((n) => n.type === t))
		.filter((n): n is NodeEntry => n !== undefined);

/** A mix of built-in nodes and add-on nodes for the node wall. */
const wall = byType([
	"trigger.webhook",
	"trigger.cron",
	"trigger.manual",
	"logic.if",
	"logic.switch",
	"flow.loop",
	"flow.delay",
	"code.js",
	"http.request",
	"data.set",
	"data.filter",
	"data.merge",
	"postgres.database",
	"github.api",
	"telegram.bot",
	"email.send",
]);

const triggers = byType([
	"trigger.webhook",
	"trigger.cron",
	"trigger.manual",
	"trigger.http_poll",
]);

const addonRows = [
	["@zerodot/postgres", "postgresql.svg", "Postgres", true],
	["@zerodot/github", "github.svg", "GitHub", false],
	["@zerodot/telegram", "telegram.svg", "Telegram", false],
	["@zerodot/redis", "redis.svg", "Redis", false],
] as const;

const strip = [
	["@zerodot/github", "github.svg", "GitHub"],
	["@zerodot/telegram", "telegram.svg", "Telegram"],
	["@zerodot/postgres", "postgresql.svg", "Postgres"],
	["@zerodot/mysql", "mysql.svg", "MySQL"],
	["@zerodot/mongodb", "mongodb.svg", "MongoDB"],
	["@zerodot/redis", "redis.svg", "Redis"],
] as const;

const addonSlug = (pkg: string) => {
	const node = packages.find((p) => p.name === pkg)?.nodes[0];
	return node ? slugOf(node) : "";
};

const limits = [
	["20", "workflows run at once on each worker"],
	["1000", "steps at most in one run"],
	["600", "requests a minute for each key"],
	["30 s", "longest wait for a web reply"],
	["7 days", "test runs are kept"],
	["30 days", "real runs are kept"],
];

const leftOut = [
	["A big store of add-ons", "Add only the ones you need."],
	["Editing together", "One person edits at a time."],
	["AI agent steps", "Not yet."],
	["Tracking", "None. Ever."],
];

const steps = [
	"Get a server that runs Ubuntu or Debian, and a web address for it.",
	"Copy the two lines into the terminal of your server.",
	"Answer the questions. The script makes your secret keys and sets up a secure web address.",
	"Open your web address and make an account.",
];

const rise = (i: number) => ({ "--i": i }) as CSSProperties;

function Home() {
	return (
		<div className="home">
			{/* ---------- hero ---------- */}
			<div className="band">
				<div className="hero-bg" aria-hidden="true">
					<i />
					<i />
					<i />
				</div>
				<div className="page">
					<SiteNav />
					<section className="hero hero-grid">
						<div className="hero-copy">
							<h1 className="rise" style={rise(0)}>
								Automation
								<br />
								without the bloat.
							</h1>
							<p className="hero-lede rise" style={rise(1)}>
								Install integrations as you need them. Keep your workflows
								lightweight and your setup under control.
							</p>
							<div className="actions rise" style={rise(2)}>
								<a className="btn btn-dark btn-pill" href="#start">
									Get started
									<ChevronRight aria-hidden strokeWidth={2} />
								</a>
								<Link className="link-arrow" to="/nodes">
									See what it can do
									<ChevronRight aria-hidden strokeWidth={2} />
								</Link>
							</div>
						</div>
						<div className="hero-art rise" style={rise(3)}>
							<Flow />
						</div>
					</section>
				</div>
			</div>

			{/* ---------- logos ---------- */}
			<div className="page">
				<section className="strip" aria-label="Apps you can add">
					<p>Connect the apps you already use</p>
					<ul>
						{strip.map(([pkg, file, name]) => (
							<li key={pkg}>
								<Link to="/nodes/$slug" params={{ slug: addonSlug(pkg) }}>
									<img src={`/logos/${file}`} alt="" />
									{name}
								</Link>
							</li>
						))}
					</ul>
				</section>
			</div>

			<main>
				{/* ---------- features ---------- */}
				<section className="block page" aria-labelledby="why">
					<header className="block-head">
						<p className="eyebrow">Why it stays small</p>
						<h2 id="why">Start with the basics. Add the rest later.</h2>
						<p>
							Most automation tools ship hundreds of nodes that you never use.
							zerodot ships {nodes.length}. You add more when a workflow needs
							them.
						</p>
					</header>

					<div className="bento">
						<article className="tile-card span-2">
							<div className="tile-copy">
								<h3>Add only what you need</h3>
								<p>
									Open System, then Nodes, and click Install. zerodot loads the
									add-on at once. You do not restart anything.
								</p>
							</div>
							<ul className="mock-list" aria-hidden="true">
								{addonRows.map(([pkg, file, name, installed]) => (
									<li key={pkg}>
										<img src={`/logos/${file}`} alt="" />
										<b>{name}</b>
										<span className="mock-pkg">{pkg}</span>
										{installed ? (
											<span className="mock-btn done">
												<Check strokeWidth={2.5} />
												Installed
											</span>
										) : (
											<span className="mock-btn">Install</span>
										)}
									</li>
								))}
							</ul>
						</article>

						<article className="tile-card">
							<div className="tile-copy">
								<h3>Your data stays with you</h3>
								<p>zerodot runs on your own server. It sends no data to us.</p>
							</div>
							<ul className="mock-checks" aria-hidden="true">
								<li>
									<Check strokeWidth={2.5} />
									Runs on your server
								</li>
								<li>
									<Check strokeWidth={2.5} />
									No tracking
								</li>
								<li>
									<Check strokeWidth={2.5} />
									Your workflow files
								</li>
							</ul>
						</article>

						<article className="tile-card">
							<div className="tile-copy">
								<h3>Test before you go live</h3>
								<p>Keep the output of one step. Test the next step with it.</p>
							</div>
							<div className="mock-pin" aria-hidden="true">
								<span className="mock-node">
									<Pin strokeWidth={2} />
									New order
								</span>
								<pre>{`{
  "order": 1042,
  "paid": true
}`}</pre>
							</div>
						</article>

						<article className="tile-card">
							<div className="tile-copy">
								<h3>Start a workflow your way</h3>
								<p>
									From a web link, on a schedule, by checking a site, or with
									one click.
								</p>
							</div>
							<ul className="mock-triggers" aria-hidden="true">
								{triggers.map((n) => (
									<li key={n.type}>
										<NodeTile node={n} />
										{n.label}
									</li>
								))}
							</ul>
						</article>

						<article className="tile-card">
							<div className="tile-copy">
								<h3>Your passwords stay safe</h3>
								<p>
									zerodot locks each password with strong encryption. Only you
									hold the key.
								</p>
							</div>
							<div className="mock-secret" aria-hidden="true">
								<Lock strokeWidth={2} />
								<span>Shop login</span>
								<code>••••••••••</code>
							</div>
						</article>

						<article className="tile-card span-3 tile-row">
							<div className="tile-copy">
								<h3>Works with other apps and AI</h3>
								<p>
									zerodot has a built-in API and a built-in MCP connection.
									Other apps and AI assistants use them to run your workflows. A
									key controls what each one can do.
								</p>
							</div>
							<div className="mock-connect" aria-hidden="true">
								<span className="chip">
									<Bot strokeWidth={1.75} />
									AI assistant
								</span>
								<i />
								<span className="chip chip-mark">
									<Mark height={12} />
								</span>
								<i />
								<span className="chip">
									<AppWindow strokeWidth={1.75} />
									Your apps
								</span>
							</div>
						</article>
					</div>
				</section>

				{/* ---------- nodes ---------- */}
				<section className="block page" aria-labelledby="nodes">
					<header className="block-head">
						<p className="eyebrow">Nodes</p>
						<h2 id="nodes">
							{nodes.length} built-in steps. {packages.length} add-ons when you
							need them.
						</h2>
						<p>
							A workflow is a list of steps. Each step is called a node. Pick
							the nodes you need and connect them on the canvas.
						</p>
					</header>
					<ul className="wall">
						{wall.map((n) => (
							<li key={n.type}>
								<Link to="/nodes/$slug" params={{ slug: slugOf(n) }}>
									<NodeTile node={n} />
									<span>
										<b>{n.label}</b>
										{n.pkg && <small>Add-on</small>}
									</span>
								</Link>
							</li>
						))}
					</ul>
					<p className="block-more">
						<Link className="link-arrow" to="/nodes">
							See all nodes and add-ons
							<ChevronRight aria-hidden strokeWidth={2} />
						</Link>
					</p>
				</section>

				{/* ---------- get started ---------- */}
				<section className="dark" id="start" aria-labelledby="start-h">
					<div className="page dark-grid">
						<div>
							<p className="eyebrow">Get started</p>
							<h2 id="start-h">Up and running in four steps.</h2>
							<ol className="steps">
								{steps.map((step) => (
									<li key={step}>{step}</li>
								))}
							</ol>
							<p className="run-note">
								To update zerodot later, run the script again. It keeps your
								settings and secret keys. Want to try it on your own computer
								first? Read the{" "}
								<Link to="/docs/$slug" params={{ slug: "quick-start" }}>
									quick start
								</Link>
								.
							</p>
						</div>
						<div className="terminal">
							<div className="terminal-bar" aria-hidden="true">
								<span className="app-dots">
									<i />
									<i />
									<i />
								</span>
								<span>your-server</span>
							</div>
							<pre>
								<code>
									<span className="prompt">$</span>
									{`curl -fsSL ${INSTALL_URL} -o install.sh`}
									{"\n"}
									<span className="prompt">$</span>
									{"bash install.sh zerodot.example.com"}
									{"\n\n"}
									<span className="dim">
										{
											"# Use your own web address in place of zerodot.example.com."
										}
									</span>
								</code>
							</pre>
						</div>
					</div>
				</section>

				{/* ---------- limits + left out ---------- */}
				<section className="block page" aria-labelledby="limits">
					<header className="block-head">
						<p className="eyebrow">Safe limits</p>
						<h2 id="limits">Sensible limits, set for you.</h2>
						<p>
							If you need more room, add more workers. You can change every
							limit in the settings file.
						</p>
					</header>
					<dl className="stats">
						{limits.map(([value, label]) => (
							<div key={label}>
								<dt>{value}</dt>
								<dd>{label}</dd>
							</div>
						))}
					</dl>

					<div className="left-out-box">
						<h3>What we left out on purpose</h3>
						<dl>
							{leftOut.map(([name, note]) => (
								<div key={name}>
									<dt>{name}</dt>
									<dd>{note}</dd>
								</div>
							))}
						</dl>
					</div>
				</section>

				{/* ---------- close ---------- */}
				<section className="finale" aria-labelledby="finale">
					<div className="finale-bg" aria-hidden="true" />
					<div className="page">
						<h2 id="finale">
							Start with a dot<i>.</i>
						</h2>
						<p>Your server. Your data. No tracking.</p>
						<div className="actions">
							<a className="btn btn-dark btn-pill" href="#start">
								Get started
								<ChevronRight aria-hidden strokeWidth={2} />
							</a>
							<a className="link-arrow" href={REPO}>
								See it on GitHub
								<ChevronRight aria-hidden strokeWidth={2} />
							</a>
						</div>
					</div>
				</section>
			</main>

			<div className="page">
				<SiteFooter />
			</div>
		</div>
	);
}
