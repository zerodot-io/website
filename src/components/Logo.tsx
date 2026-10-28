export function Mark({
	height = 16,
	onAccent = false,
}: {
	height?: number;
	onAccent?: boolean;
}) {
	const dot = onAccent ? "#FFFFFF" : "#FF6900";
	const dash = onAccent ? "#FFFFFF" : "#0A0A0A";
	return (
		<svg
			width={(54 / 16) * height}
			height={height}
			viewBox="0 0 54 16"
			fill="none"
			aria-hidden="true"
		>
			<circle cx="8" cy="8" r="8" fill={dot} />
			<rect x="22" y="6.5" width="8" height="3" rx="1.5" fill={dash} />
			<rect x="34" y="6.5" width="8" height="3" rx="1.5" fill={dash} />
			<rect x="46" y="6.5" width="8" height="3" rx="1.5" fill={dash} />
		</svg>
	);
}

export function Logo({ onAccent = false }: { onAccent?: boolean }) {
	return (
		<a
			className="logo"
			href="/"
			aria-label="zerodot home"
			data-on-accent={onAccent || undefined}
		>
			<Mark onAccent={onAccent} />
			zerodot
		</a>
	);
}
