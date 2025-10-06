import type { ReactNode } from "react";
import { createElement } from "react";

import { slugify } from "@/shared/utils";

export function createHeading(level: number) {
	const Heading = ({ children }: { children: ReactNode }) => {
		const slug = slugify(String(children));
		return createElement(`h${level}`, { id: slug }, children);
	};

	Heading.displayName = `Heading${level}`;

	return Heading;
}
