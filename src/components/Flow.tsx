import {
	GitBranch,
	Globe,
	type LucideIcon,
	OctagonX,
	Plus,
	Reply,
	Webhook,
	Zap,
} from "lucide-react";
import { type CSSProperties, useEffect, useRef, useState } from "react";

/** One loop of the demo run, in ms. The dot travels for 70% of it. */
const CYCLE = 6000;
const TRAVEL = 0.7;
const RESET_AT = 5600;
/** Share of the dot's path at which each part turns "ran": webhook, edge, if, edge, http, edge, respond. */
const STAGES = [0.02, 0.1, 0.26, 0.42, 0.61, 0.74, 0.94];
const ALL_RAN = STAGES.length;

/** The steps the run card lists, with the stage at which each one is done. */
const RUN_STEPS = [
	{ id: "webhook", label: "New order", ranAt: 1 },
	{ id: "if", label: "Is it paid?", ranAt: 3 },
	{ id: "http", label: "Ship it", ranAt: 5 },
	{ id: "respond", label: "Send reply", ranAt: 7 },
];

type StepState = "idle" | "running" | "succeeded";

const stateOf = (stage: number, ranAt: number): StepState =>
	stage >= ranAt ? "succeeded" : stage === ranAt - 1 ? "running" : "idle";

type Port = { name?: string; y: number };

type NodeSpec = {
	id: string;
	x: number;
	y: number;
	icon: LucideIcon;
	/** Icon color by node category, as in the editor. */
	color?: string;
	name: string;
	subtitle?: string;
	trigger?: boolean;
	hasIn: boolean;
	outs: Port[];
	/** Stage at which the node counts as "ran". */
	ranAt: number;
	stub?: boolean;
};

const NODES: NodeSpec[] = [
	{
		id: "webhook",
		x: 56,
		y: 40,
		icon: Webhook,
		color: "var(--color-amber-500)",
		name: "New order",
		subtitle: "An order arrives",
		trigger: true,
		hasIn: false,
		outs: [{ y: 0.5 }],
		ranAt: 1,
	},
	{
		id: "if",
		x: 216,
		y: 40,
		icon: GitBranch,
		color: "var(--color-violet-500)",
		name: "Is it paid?",
		subtitle: "Paid is yes",
		hasIn: true,
		outs: [
			{ name: "true", y: 1 / 3 },
			{ name: "false", y: 2 / 3 },
		],
		ranAt: 3,
	},
	{
		id: "http",
		x: 376,
		y: 40,
		icon: Globe,
		name: "Ship it",
		subtitle: "Send to shipping",
		hasIn: true,
		outs: [{ y: 0.5 }],
		ranAt: 5,
	},
	{
		id: "respond",
		x: 536,
		y: 40,
		icon: Reply,
		color: "var(--color-emerald-500)",
		name: "Send reply",
		subtitle: "Say it worked",
		hasIn: true,
		outs: [{ y: 0.5 }],
		ranAt: 7,
		stub: true,
	},
	{
		id: "stop",
		x: 376,
		y: 144,
		icon: OctagonX,
		color: "var(--color-emerald-500)",
		name: "Stop",
		subtitle: "Say it failed",
		hasIn: true,
		outs: [],
		ranAt: 99,
	},
];

/** Edges as the editor draws them: a bezier with a horizontal pull. */
const EDGES = [
	{ id: "e1", d: "M120 72 C168 72 168 72 216 72", ranAt: 2 },
	{ id: "e2", d: "M280 61.3 C328 61.3 328 72 376 72", ranAt: 4 },
	{ id: "e3", d: "M280 82.7 C328 82.7 328 176 376 176", ranAt: 99 },
	{ id: "e4", d: "M440 72 C488 72 488 72 536 72", ranAt: 6 },
];

const COUNTS = [
	{ id: "e1", x: 144, y: 66, ranAt: 2 },
	{ id: "e2", x: 352, y: 58, ranAt: 4 },
	{ id: "e4", x: 464, y: 66, ranAt: 6 },
];

function CanvasNode({ node, stage }: { node: NodeSpec; stage: number }) {
	const Icon = node.icon;
	return (
		<div className="rf-node" style={{ left: node.x, top: node.y }}>
			<div
				className="rf-box"
				data-ran={stage >= node.ranAt}
				data-trigger={node.trigger ? "true" : undefined}
			>
				{node.trigger && <Zap aria-hidden className="rf-zap" />}
				<Icon
					aria-hidden
					strokeWidth={1.5}
					style={node.color ? { color: node.color } : undefined}
				/>
			</div>
			{node.hasIn && (
				<span
					className="rf-handle"
					data-side="in"
					style={{ top: 32 } as CSSProperties}
				/>
			)}
			{node.outs.map((port) => (
				<span key={port.name ?? "out"}>
					<span
						className="rf-handle"
						data-side="out"
						style={{ top: port.y * 64 }}
					/>
					{port.name && (
						<span className="rf-port" style={{ top: port.y * 64 }}>
							{port.name}
						</span>
					)}
				</span>
			))}
			{node.stub && (
				<div className="rf-stub" aria-hidden>
					<i />
					<Plus strokeWidth={2.5} />
				</div>
			)}
			<div className="rf-name">
				<b>{node.name}</b>
				{node.subtitle && <small>{node.subtitle}</small>}
			</div>
		</div>
	);
}

export function Flow() {
	// Server render and reduced motion show the finished run.
	const [stage, setStage] = useState(ALL_RAN);
	const dotRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const dot = dotRef.current;
		if (!dot) return;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

		const anim = dot.animate(
			[
				{ offsetDistance: "0%", opacity: 0, offset: 0 },
				{ opacity: 1, offset: 0.02 },
				{ offsetDistance: "100%", opacity: 1, offset: TRAVEL },
				{ offsetDistance: "100%", opacity: 0, offset: TRAVEL + 0.04 },
				{ offsetDistance: "100%", opacity: 0, offset: 1 },
			],
			{ duration: CYCLE, iterations: Infinity },
		);

		let frame = 0;
		let last = -1;
		const tick = () => {
			const t = Number(anim.currentTime ?? 0) % CYCLE;
			const p = Math.min(t / (CYCLE * TRAVEL), 1);
			const next = t >= RESET_AT ? 0 : STAGES.filter((s) => p >= s).length;
			if (next !== last) {
				last = next;
				setStage(next);
			}
			frame = requestAnimationFrame(tick);
		};
		frame = requestAnimationFrame(tick);

		return () => {
			cancelAnimationFrame(frame);
			anim.cancel();
		};
	}, []);

	return (
		<div className="flow-wrap">
			<div className="app-window">
				<div className="app-bar" aria-hidden="true">
					<span className="app-dots">
						<i />
						<i />
						<i />
					</span>
					<b>Ship paid orders</b>
					<span className="app-active">
						<i />
						Active
					</span>
				</div>
				<div
					className="canvas"
					role="img"
					aria-label="Example workflow: a new order arrives, zerodot checks if it is paid, ships it, and sends a reply. If it is not paid, the workflow stops."
				>
					<div className="canvas-inner">
						<svg width="680" height="258" aria-hidden>
							{EDGES.map((e) => (
								<path
									key={e.id}
									className="edge"
									d={e.d}
									data-ran={stage >= e.ranAt}
								/>
							))}
						</svg>
						<div className="run-dot" ref={dotRef} aria-hidden />
						{COUNTS.map((c) => (
							<span
								key={c.id}
								className="edge-count"
								style={{ left: c.x, top: c.y }}
								data-ran={stage >= c.ranAt}
							>
								1 item
							</span>
						))}
						{NODES.map((n) => (
							<CanvasNode key={n.id} node={n} stage={stage} />
						))}
					</div>
				</div>
			</div>
			<div className="run-card" aria-hidden="true">
				<div className="run-head">
					<b>Latest run</b>
					<span data-state={stage >= ALL_RAN ? "succeeded" : "running"}>
						{stage >= ALL_RAN ? "Succeeded" : "Running"}
					</span>
				</div>
				<ol>
					{RUN_STEPS.map((step) => {
						const state = stateOf(stage, step.ranAt);
						return (
							<li key={step.id} data-state={state}>
								<i />
								{step.label}
								<small>
									{state === "succeeded"
										? "Done"
										: state === "running"
											? "Running"
											: "Waiting"}
								</small>
							</li>
						);
					})}
				</ol>
			</div>
		</div>
	);
}
