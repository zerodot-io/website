import catalog from "#/data/catalog.json";
import raw from "#/data/nodes.json";

export type NodeField = {
	name: string;
	type: string;
	description?: string;
	required: boolean;
	options?: string[];
	default?: unknown;
};

export type NodeInfo = {
	type: string;
	label: string;
	description: string;
	category: "trigger" | "logic" | "data" | "flow" | "code" | "core";
	icon: string;
	app?: string;
	ports: { in: string[]; out: string[] };
	credentialTypes: string[];
	actions: string[];
	fields: NodeField[];
};

export const nodes: NodeInfo[] = raw as NodeInfo[];

export type PackageInfo = {
	name: string;
	label: string;
	summary: string;
	description: string;
	version: string;
	sdk: string;
	icon: string;
	iconUrl?: string;
	nodes: { type: string; label: string; description: string }[];
};

/** Packages from the zerodot-nodes catalog. Refresh with `bun run sync:catalog`. */
export const packages: PackageInfo[] = (catalog as { packages: PackageInfo[] })
	.packages;

/** Any node on the site: a core node, or a node from a package. */
export type NodeEntry = {
	type: string;
	label: string;
	description: string;
	category: NodeInfo["category"];
	icon: string;
	iconUrl?: string;
	/** Core nodes only. The catalog has no port data for package nodes. */
	ports?: NodeInfo["ports"];
	fields: NodeField[];
	credentialTypes: string[];
	/** Set for package nodes. */
	pkg?: PackageInfo;
};

export const coreEntries: NodeEntry[] = nodes;

export const packageEntries: NodeEntry[] = packages.flatMap((pkg) =>
	pkg.nodes.map((n) => ({
		type: n.type,
		label: n.label,
		description: n.description,
		category: n.type.startsWith("trigger.")
			? ("trigger" as const)
			: ("core" as const),
		icon: pkg.icon,
		iconUrl: pkg.iconUrl,
		fields: [],
		credentialTypes: [],
		pkg,
	})),
);

export const allNodes: NodeEntry[] = [...coreEntries, ...packageEntries];

export const isTrigger = (n: NodeEntry) => n.category === "trigger";

export const slugOf = (n: { type: string }) =>
	n.type.toLowerCase().replace(/[._]/g, "-");

export const findNode = (slug: string) =>
	allNodes.find((n) => slugOf(n) === slug);

export const GROUPS = [
	{ id: "trigger", title: "Triggers" },
	{ id: "logic", title: "Logic" },
	{ id: "flow", title: "Flow" },
	{ id: "data", title: "Data" },
	{ id: "file", title: "Files" },
	{ id: "table", title: "Tables" },
	{ id: "other", title: "Other" },
] as const;

export type GroupId = (typeof GROUPS)[number]["id"];

export function groupOf(n: { type: string }): GroupId {
	const prefix = n.type.split(".")[0];
	if (prefix === "trigger") return "trigger";
	if (prefix === "logic") return "logic";
	if (prefix === "flow") return "flow";
	if (prefix === "data") return "data";
	if (prefix === "file") return "file";
	if (prefix === "table") return "table";
	return "other";
}

/** Icon color by node category, as in the editor. Core nodes use the ink color. */
export const CATEGORY_COLOR: Record<NodeInfo["category"], string | undefined> =
	{
		trigger: "var(--color-amber-500)",
		logic: "var(--color-violet-500)",
		data: "var(--color-sky-500)",
		flow: "var(--color-emerald-500)",
		code: "var(--color-rose-500)",
		core: undefined,
	};
