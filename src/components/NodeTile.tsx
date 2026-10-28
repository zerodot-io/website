import {
	ArrowUpDown,
	CalendarClock,
	CalendarDays,
	Circle,
	Code,
	Combine,
	CopyX,
	Database,
	FileArchive,
	FileCode,
	FileInput,
	FileOutput,
	FilePen,
	FileSearch,
	Filter,
	GitBranch,
	Globe,
	HardDrive,
	Image as ImageIcon,
	KeyRound,
	ListEnd,
	ListPlus,
	type LucideIcon,
	Mail,
	Merge,
	MousePointerClick,
	OctagonX,
	PenLine,
	Plug,
	RefreshCw,
	Repeat,
	Replace,
	Reply,
	Rss,
	Search,
	Send,
	Sigma,
	Split,
	TableProperties,
	Terminal,
	TextCursorInput,
	Timer,
	Trash2,
	TriangleAlert,
	Webhook,
	Workflow,
} from "lucide-react";
import { CATEGORY_COLOR, isTrigger, type NodeEntry } from "#/lib/nodes";

const ICONS: Record<string, LucideIcon> = {
	Database,
	Image: ImageIcon,
	Mail,
	Plug,
	Send,
	ArrowUpDown,
	CalendarClock,
	CalendarDays,
	Circle,
	Code,
	Combine,
	CopyX,
	FileArchive,
	FileCode,
	FileInput,
	FileOutput,
	FilePen,
	FileSearch,
	Filter,
	GitBranch,
	Globe,
	HardDrive,
	KeyRound,
	ListEnd,
	ListPlus,
	Merge,
	MousePointerClick,
	OctagonX,
	PenLine,
	RefreshCw,
	Repeat,
	Replace,
	Reply,
	Rss,
	Search,
	Sigma,
	Split,
	TableProperties,
	Terminal,
	TextCursorInput,
	Timer,
	Trash2,
	TriangleAlert,
	Webhook,
	Workflow,
};

/** The node icon in a bordered square, like a node on the editor canvas. */
export function NodeTile({ node }: { node: NodeEntry }) {
	return (
		<span className="tile" data-trigger={isTrigger(node) ? "true" : undefined}>
			<NodeIconOnly node={node} />
		</span>
	);
}

/** A package icon is a logo image. Other icons are Lucide icons, colored by category. */
export function NodeIconOnly({ node }: { node: NodeEntry }) {
	if (node.iconUrl) {
		return (
			<img src={node.iconUrl} alt="" aria-hidden="true" className="logo-img" />
		);
	}
	const Icon = ICONS[node.icon] ?? Circle;
	return (
		<Icon
			aria-hidden
			strokeWidth={1.5}
			style={{ color: CATEGORY_COLOR[node.category] }}
		/>
	);
}
