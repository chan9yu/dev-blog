import Image from "next/image";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import React from "react";
import { highlight } from "sugar-high";

function Table({ data }: { data: { headers: string[]; rows: string[][] } }) {
	const headers = data.headers.map((header: string, index: number) => <th key={index}>{header}</th>);
	const rows = data.rows.map((row: string[], index: number) => (
		<tr key={index}>
			{row.map((cell: string, cellIndex: number) => (
				<td key={cellIndex}>{cell}</td>
			))}
		</tr>
	));

	return (
		<table>
			<thead>
				<tr>{headers}</tr>
			</thead>
			<tbody>{rows}</tbody>
		</table>
	);
}

function CustomLink(props: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
	const href = props.href || "";

	if (href.startsWith("/")) {
		return (
			<Link href={href} {...props}>
				{props.children}
			</Link>
		);
	}

	if (href.startsWith("#")) {
		return <a {...props} />;
	}

	return <a target="_blank" rel="noopener noreferrer" {...props} />;
}

function RoundedImage({ alt, ...props }: React.ComponentProps<typeof Image>) {
	return <Image className="rounded-lg" alt={alt || ""} {...props} />;
}

function Code({ children, ...props }: { children: string } & React.HTMLAttributes<HTMLElement>) {
	const codeHTML = highlight(children);
	return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />;
}

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

function createHeading(level: number) {
	const Heading = ({ children }: { children: React.ReactNode }) => {
		const slug = slugify(String(children));
		return React.createElement(
			`h${level}`,
			{ id: slug },
			[
				React.createElement("a", {
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

const components = {
	h1: createHeading(1),
	h2: createHeading(2),
	h3: createHeading(3),
	h4: createHeading(4),
	h5: createHeading(5),
	h6: createHeading(6),
	Image: RoundedImage,
	a: CustomLink,
	code: Code,
	Table
};

export function CustomMDX(props: { source: string; components?: Record<string, React.ComponentType> }) {
	return <MDXRemote {...props} components={{ ...components, ...(props.components || {}) }} />;
}
