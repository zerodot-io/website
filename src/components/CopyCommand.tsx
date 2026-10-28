import { useEffect, useRef, useState } from "react";

export function CopyCommand({ command }: { command: string }) {
	const [copied, setCopied] = useState(false);
	const timer = useRef<number | undefined>(undefined);

	useEffect(() => () => window.clearTimeout(timer.current), []);

	async function copy() {
		try {
			await navigator.clipboard.writeText(command);
		} catch {
			return;
		}
		setCopied(true);
		window.clearTimeout(timer.current);
		timer.current = window.setTimeout(() => setCopied(false), 1600);
	}

	return (
		<button
			type="button"
			className="btn btn-cmd"
			onClick={copy}
			aria-label={`Copy command: ${command}`}
		>
			{command}
			<span className="copy-label" aria-live="polite">
				{copied ? "Copied" : "Copy"}
			</span>
		</button>
	);
}
