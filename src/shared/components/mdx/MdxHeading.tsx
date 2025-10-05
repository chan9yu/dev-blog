import { createElement, ReactNode } from "react";

function slugify(str: string): string {
	return str
		.toString()
		.toLowerCase()
		.trim() // Remove whitespace from both ends of a string
		.replace(/\s+/g, "-") // Replace spaces with -
		.replace(/&/g, "-and-") // Replace & with 'and'
		.replace(/[^\w\-]+/g, "") // Remove all non-word characters except for -
		.replace(/\-\-+/g, "-"); // Replace multiple - with single -
}

export function createHeading(level: number) {
	const Heading = ({ children }: { children: ReactNode }) => {
		const slug = slugify(String(children));
		return createElement(
			`h${level}`,
			{ id: slug },
			[
				createElement("a", {
					href: `#${slug}`,
					key: `link-${slug}`,
					className: "anchor"
				})
			],
			children
		);
	};

	Heading.displayName = `Heading${level}`;

	return Heading;
}
