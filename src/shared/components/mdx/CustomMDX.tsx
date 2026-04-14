import { Callout } from "./Callout";
import { MdxHeading } from "./MdxHeading";
import { MdxImage } from "./MdxImage";
import { MdxLink } from "./MdxLink";
import { MdxPre } from "./MdxPre";
import { MdxTable } from "./MdxTable";

/**
 * MDX 커스텀 컴포넌트 맵. M2에서 `next-mdx-remote/rsc`의 `components` prop으로 주입.
 * 현재는 본문 렌더가 M2 이후 활성화될 placeholder 맵.
 */
export const customMDXComponents = {
	h2: (props: React.ComponentProps<"h2"> & { id?: string }) => <MdxHeading level={2} {...props} />,
	h3: (props: React.ComponentProps<"h3"> & { id?: string }) => <MdxHeading level={3} {...props} />,
	h4: (props: React.ComponentProps<"h4"> & { id?: string }) => <MdxHeading level={4} {...props} />,
	pre: MdxPre,
	img: MdxImage,
	a: MdxLink,
	table: MdxTable,
	Callout
};
