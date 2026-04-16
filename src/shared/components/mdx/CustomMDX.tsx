"use cache";

import rehypeShikiFromHighlighter from "@shikijs/rehype/core";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Children, type ComponentProps, isValidElement } from "react";
import rehypeSlug from "rehype-slug";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";

import { getShikiHighlighter } from "@/shared/libs/shiki";

import { Callout } from "./Callout";
import { MdxHeading } from "./MdxHeading";
import { MdxImage } from "./MdxImage";
import { MdxLink } from "./MdxLink";
import { MdxPre } from "./MdxPre";
import { MdxTable } from "./MdxTable";

type CustomMDXProps = {
	source: string;
};

/** MDXRemote heading 슬롯 props. id는 rehype-slug 플러그인이 주입. */
type HeadingSlotProps = ComponentProps<"h2"> & { id?: string };

// # → <h2>, ## → <h3>, ### → <h4> (+1 시프트)
// 이유: 페이지 <h1>은 PostMetaHeader의 포스트 제목이 담당
function MdxH1(props: HeadingSlotProps) {
	return <MdxHeading level={2} {...props} />;
}

function MdxH2(props: HeadingSlotProps) {
	return <MdxHeading level={3} {...props} />;
}

function MdxH3(props: HeadingSlotProps) {
	return <MdxHeading level={4} {...props} />;
}

/**
 * MDX는 standalone 이미지를 `<p>`로 감싸는데, MdxImage가 `<figure>`를 렌더하면
 * `<p><figure>...</figure></p>` — 유효하지 않은 HTML → 하이드레이션 오류.
 *
 * remarkBreaks가 연속 이미지 사이 개행을 `<br>`로 변환하므로
 * children이 [MdxImage, br, MdxImage] 형태가 될 수 있다.
 * 단일 자식 체크(only.length === 1) 대신 any child 체크로 모든 케이스를 커버한다.
 */
function MdxP({ children, ...props }: ComponentProps<"p">) {
	const hasBlockChild = Children.toArray(children).some((child) => isValidElement(child) && child.type === MdxImage);
	if (hasBlockChild) {
		return <>{children}</>;
	}
	return <p {...props}>{children}</p>;
}

/** MDXRemote components 맵. 모듈 상수로 선언해 "use cache" 경계에서 안정적 참조 보장. */
const MDX_COMPONENTS = {
	h1: MdxH1,
	h2: MdxH2,
	h3: MdxH3,
	p: MdxP,
	pre: MdxPre,
	img: MdxImage,
	a: MdxLink,
	table: MdxTable,
	Callout
} as const;

/**
 * MDX 렌더러 (M2-19~21, ADR-001).
 * next-mdx-remote/rsc의 MDXRemote로 MDX를 서버에서 렌더하며,
 * Shiki 듀얼 테마(github-light/github-dark) + remarkGfm + remarkBreaks 파이프라인을 주입한다.
 *
 * - rehypeShikiFromHighlighter: CSS 변수 방식 듀얼 테마(defaultColor: false)로
 *   span에 --shiki-light / --shiki-dark 를 주입. 색상 표시는 shiki.css가 담당.
 * - remarkGfm: GFM 테이블·체크박스·취소선 지원.
 * - remarkBreaks: 개행 문자를 <br>로 변환 (한국어 블로그 특성).
 */
export async function CustomMDX({ source }: CustomMDXProps) {
	const highlighter = await getShikiHighlighter();

	return (
		<MDXRemote
			source={source}
			components={MDX_COMPONENTS}
			options={{
				mdxOptions: {
					remarkPlugins: [remarkGfm, remarkBreaks],
					rehypePlugins: [
						rehypeSlug,
						() =>
							rehypeShikiFromHighlighter(highlighter, {
								themes: { light: "github-light", dark: "github-dark" },
								defaultColor: false
							})
					]
				}
			}}
		/>
	);
}
