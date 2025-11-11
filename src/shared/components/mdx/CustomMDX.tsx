import { MDXRemote, type MDXRemoteProps } from "next-mdx-remote/rsc";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";

import { MdxCode } from "./MdxCode";
import { createHeading } from "./MdxHeading";
import { MdxImage } from "./MdxImage";
import { MdxLink } from "./MdxLink";
import { MdxPre } from "./MdxPre";
import { MdxTable, MdxTbody, MdxTd, MdxTh, MdxThead, MdxTr } from "./MdxTable";

const components = {
	h1: createHeading(1),
	h2: createHeading(2),
	h3: createHeading(3),
	h4: createHeading(4),
	h5: createHeading(5),
	h6: createHeading(6),
	Image: MdxImage,
	a: MdxLink,
	pre: MdxPre,
	code: MdxCode,
	table: MdxTable,
	thead: MdxThead,
	tbody: MdxTbody,
	tr: MdxTr,
	th: MdxTh,
	td: MdxTd
};

type CustomMDXProps = {
	source: string;
	components?: MDXRemoteProps["components"];
};

export function CustomMDX({ source, components: customComponents }: CustomMDXProps) {
	return (
		<MDXRemote
			source={source}
			components={{ ...components, ...customComponents }}
			options={{
				mdxOptions: {
					remarkPlugins: [remarkGfm, remarkBreaks]
				}
			}}
		/>
	);
}
