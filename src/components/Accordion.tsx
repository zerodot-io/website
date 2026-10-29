import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

export interface AccordionEntry {
	id: string;
	title: string;
	body: ReactNode;
}

export function Accordion({
	items,
	defaultOpen = [],
}: {
	items: AccordionEntry[];
	defaultOpen?: string[];
}) {
	return (
		<AccordionPrimitive.Root
			className="accordion"
			multiple
			defaultValue={defaultOpen}
		>
			{items.map((item) => (
				<AccordionPrimitive.Item
					key={item.id}
					value={item.id}
					className="accordion-item"
				>
					<AccordionPrimitive.Header className="accordion-header">
						<AccordionPrimitive.Trigger className="accordion-trigger">
							<span>{item.title}</span>
							<ChevronDown aria-hidden strokeWidth={2} />
						</AccordionPrimitive.Trigger>
					</AccordionPrimitive.Header>
					<AccordionPrimitive.Panel className="accordion-panel">
						<div className="accordion-body">{item.body}</div>
					</AccordionPrimitive.Panel>
				</AccordionPrimitive.Item>
			))}
		</AccordionPrimitive.Root>
	);
}
