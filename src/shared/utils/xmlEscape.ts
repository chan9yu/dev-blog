/**
 * XML/RSS 본문에 사용자 입력(frontmatter title, description 등)을 삽입할 때
 * `&`·`<`·`>`·`"`·`'`를 엔티티로 이스케이프. 미처리 시 RSS reader 파싱 깨짐 또는 인젝션.
 *
 * 사용처: `src/app/rss/route.ts`, 향후 M5 sitemap 동적 생성 등.
 */

const ENTITIES: Record<string, string> = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	'"': "&quot;",
	"'": "&apos;"
};

export function escapeXml(input: string) {
	return input.replace(/[&<>"']/g, (char) => ENTITIES[char] ?? char);
}
