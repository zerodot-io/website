import { createFileRoute } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { Accordion, type AccordionEntry } from "#/components/Accordion";
import { SiteFooter, SubHero } from "#/components/Site";
import { LICENSE_URL, REPO } from "#/lib/site";

export const Route = createFileRoute("/pricing")({
	head: () => ({
		meta: [
			{ title: "Pricing | zerodot" },
			{
				name: "description",
				content:
					"zerodot is free under AGPL-3.0. Buy a one-time commercial license to keep your changes private.",
			},
		],
	}),
	component: PricingPage,
});

interface Tier {
	name: string;
	price: string;
	use: string;
	developers: string;
	instances: string;
	checkout: string;
}

const TIERS: Tier[] = [
	{
		name: "Hobby",
		price: "$49",
		use: "Keep your changes private. Internal use only.",
		developers: "1",
		instances: "1",
		checkout:
			"https://buy.polar.sh/polar_cl_UcLtahyBIulIZQ7W43747TDloC5rDYGcYnD2C2N9f5A",
	},
	{
		name: "Team",
		price: "$149",
		use: "Keep your changes private. Use in a product for sale.",
		developers: "Up to 10",
		instances: "Up to 5",
		checkout:
			"https://buy.polar.sh/polar_cl_MTr19tQEIcPxcQZ2FXJoCCwBnrSFsFaFr7zaK0f3iQW",
	},
	{
		name: "Organization",
		price: "$299",
		use: "Keep your changes private. Use in a product for sale.",
		developers: "Unlimited",
		instances: "Unlimited",
		checkout:
			"https://buy.polar.sh/polar_cl_mZMYGqHHZR8loqZnw31mngDA1pDqsDqiP7jYq2G3yz7",
	},
	{
		name: "Extended",
		price: "$499",
		use: "Put zerodot inside a product that you distribute.",
		developers: "Unlimited",
		instances: "1 product",
		checkout:
			"https://buy.polar.sh/polar_cl_6QMymQkGv8mufAK7PfpRkNqzhSqeDM717Vtoq2tmrdL",
	},
];

const DETAILS: AccordionEntry[] = [
	{
		id: "model",
		title: "How does the license work?",
		body: (
			<>
				<p>
					zerodot is free and open source under AGPL-3.0-only. You can use it,
					change it, and share it at no cost. The AGPL has one main duty: if you
					change zerodot and let other people use it over a network, you must
					offer them your source code under the AGPL.
				</p>
				<p>
					A commercial license removes this duty. You can keep your changes
					private. You pay one time. The code and the features are the same.
				</p>
			</>
		),
	},
	{
		id: "who",
		title: "Who needs a commercial license?",
		body: (
			<ul>
				<li>
					<b>Nobody, if you follow the AGPL.</b> Run zerodot as it is, or share
					your changes under the AGPL. This is free.
				</li>
				<li>
					<b>You want to keep your changes private.</b> Buy Hobby, Team, or
					Organization.
				</li>
				<li>
					<b>You sell a product that uses zerodot.</b> Buy Team or Organization.
				</li>
				<li>
					<b>You put zerodot inside a product that you distribute.</b> This
					includes SDKs, templates, white-label products, and installable
					products. Buy Extended.
				</li>
			</ul>
		),
	},
	{
		id: "tiers",
		title: "What is the difference between the tiers?",
		body: (
			<ul>
				<li>
					<b>Hobby, $49.</b> One developer and one instance. For personal and
					internal use. Not for a product for sale.
				</li>
				<li>
					<b>Team, $149.</b> Up to 10 developers and 5 instances. You can use it
					in a product for sale.
				</li>
				<li>
					<b>Organization, $299.</b> Unlimited developers and instances. You can
					use it in a product for sale.
				</li>
				<li>
					<b>Extended, $499.</b> Unlimited developers and one product. Required
					when zerodot is part of a product that you distribute.
				</li>
			</ul>
		),
	},
	{
		id: "developers",
		title: "Who counts as a developer?",
		body: (
			<>
				<p>
					A developer is a person who changes zerodot code in your applications.
					This includes employees, consultants, and contractors.
				</p>
				<p>
					People who only use zerodot, for example to build workflows, do not
					count. Pricing is per person who changes the code.
				</p>
			</>
		),
	},
	{
		id: "instances",
		title: "What counts as an instance?",
		body: (
			<p>
				An instance is one running deployment of zerodot. Your staging and
				development copies count as one instance together with production.
			</p>
		),
	},
	{
		id: "updates",
		title: "Do I get updates?",
		body: (
			<>
				<p>
					Yes. You get all updates inside the major version that you buy, for
					example 0.x or 1.x, at no extra cost.
				</p>
				<p>
					A new major version needs a new license. If you bought a license in
					the 6 months before a new major version, send us an email and we
					exchange it.
				</p>
			</>
		),
	},
	{
		id: "expiry",
		title: "Does the license expire?",
		body: (
			<p>
				No. You pay one time. The license does not expire and it is not
				exclusive. There is no subscription.
			</p>
		),
	},
	{
		id: "key",
		title: "Do I need a license key?",
		body: (
			<p>
				No. The license is legal only. zerodot does not check a key and does not
				contact a server. After payment you get a receipt and a license
				document. Keep them as proof.
			</p>
		),
	},
	{
		id: "restrictions",
		title: "What can I not do?",
		body: (
			<ul>
				<li>You cannot resell, sublicense, or share the license.</li>
				<li>
					You cannot share zerodot on its own as a separate product, even for
					free.
				</li>
				<li>
					zerodot cannot be the core value of a product that you sell or give
					away.
				</li>
				<li>
					You cannot use the zerodot name or logo, except to say that you use
					zerodot.
				</li>
			</ul>
		),
	},
	{
		id: "growth",
		title: "What if my team grows?",
		body: (
			<p>
				If you go over the limit of your tier, buy the next tier. We credit what
				you paid for the lower tier.
			</p>
		),
	},
	{
		id: "support",
		title: "Is support included?",
		body: (
			<p>
				A commercial license does not include support, setup, or custom work.
				Bug reports and security reports stay free on{" "}
				<a href={`${REPO}/issues`}>GitHub</a>. Community Access is included.
			</p>
		),
	},
	{
		id: "discord",
		title: "Do I get Discord access?",
		body: (
			<p>
				Yes. Every license includes Community Access. After payment you link
				your Discord account and get two roles at once: Community, and a role
				for your license type. You can use the private channels and vote on the
				roadmap. If we refund the license, Discord access ends.
			</p>
		),
	},
	{
		id: "refund",
		title: "Can I get a refund?",
		body: (
			<p>
				Yes, in 14 days of payment. After 14 days we do not refund. Read the{" "}
				<a href={LICENSE_URL}>full license terms</a> for all details.
			</p>
		),
	},
];

function PricingPage() {
	return (
		<>
			<SubHero>
				<header className="sub-head">
					<p className="eyebrow">Pricing</p>
					<h1>Free to use. Pay to keep it private.</h1>
					<p>
						zerodot is free under AGPL-3.0. If you cannot follow the AGPL, buy a
						commercial license. You pay one time. There is no subscription.
					</p>
					<div className="actions">
						<a className="link-arrow" href={LICENSE_URL}>
							Read the license terms
							<ChevronRight aria-hidden strokeWidth={2} />
						</a>
					</div>
				</header>
			</SubHero>

			<main className="page docs-home">
				<section className="node-group" aria-label="License tiers">
					<header>
						<h2>License tiers</h2>
					</header>
					<div className="doc-cards tiers">
						{TIERS.map((tier) => (
							<div
								key={tier.name}
								className={
									tier.name === "Extended" ? "doc-card tier-wide" : "doc-card"
								}
							>
								<b>{tier.name}</b>
								<span className="price">{tier.price}</span>
								<small>{tier.use}</small>
								<small>Developers: {tier.developers}</small>
								<small>Instances: {tier.instances}</small>
								<a className="btn btn-dark btn-pill buy" href={tier.checkout}>
									Buy {tier.name}
								</a>
							</div>
						))}
					</div>
				</section>

				<section className="node-group" aria-label="License details">
					<header>
						<h2>License details</h2>
					</header>
					<Accordion items={DETAILS} defaultOpen={DETAILS.map((d) => d.id)} />
				</section>
			</main>

			<div className="page">
				<SiteFooter />
			</div>
		</>
	);
}
