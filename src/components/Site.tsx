import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { REPO } from "#/lib/site";
import { Logo } from "./Logo";

export function SiteNav({ onAccent = false }: { onAccent?: boolean }) {
	return (
		<header className="nav">
			<Logo onAccent={onAccent} />
			<nav className="nav-links" aria-label="Main">
				<Link to="/nodes">Nodes</Link>
				<Link to="/docs">Docs</Link>
				<a href={REPO}>GitHub</a>
				<a className="nav-cta" href="/#start">
					Get started
				</a>
			</nav>
		</header>
	);
}

export function SiteFooter() {
	return (
		<footer className="footer">
			<Logo />
			<nav aria-label="Footer">
				<Link to="/nodes">Nodes</Link>
				<Link to="/docs">Docs</Link>
				<a href={REPO}>GitHub</a>
				<a href={`${REPO}/blob/main/LICENSE`}>AGPL-3.0-only</a>
				<Link to="/docs/$slug" params={{ slug: "install" }}>
					Install
				</Link>
				<a href="https://7angle.com">by 7 Angle</a>
			</nav>
		</footer>
	);
}

/** Top band for inner pages: the nav and a page head over a small gradient wedge. */
export function SubHero({ children }: { children: ReactNode }) {
	return (
		<div className="band sub-band">
			<div className="hero-bg" aria-hidden="true">
				<i />
				<i />
				<i />
			</div>
			<div className="page">
				<SiteNav />
				{children}
			</div>
		</div>
	);
}
