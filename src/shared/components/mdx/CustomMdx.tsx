import { MDXRemote } from "next-mdx-remote/rsc";
import type { ComponentType } from "react";

import { MdxCode } from "@/shared/components/mdx/MdxCode";
import { createHeading } from "@/shared/components/mdx/MdxHeading";
import { MdxImage } from "@/shared/components/mdx/MdxImage";
import { MdxLink } from "@/shared/components/mdx/MdxLink";
import { MdxTable } from "@/shared/components/mdx/MdxTable";

const components = {
	h1: createHeading(1),
	h2: createHeading(2),
	h3: createHeading(3),
	h4: createHeading(4),
	h5: createHeading(5),
	h6: createHeading(6),
	Image: MdxImage,
	a: MdxLink,
	code: MdxCode,
	Table: MdxTable
};

export function CustomMdx(props: { source: string; components?: Record<string, ComponentType> }) {
	return <MDXRemote {...props} components={{ ...components, ...(props.components || {}) }} />;
}
