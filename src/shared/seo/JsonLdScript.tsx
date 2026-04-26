type JsonLdScriptProps = {
	id: string;
	data: object;
};

/**
 * JSON-LD 구조화 데이터를 `<script type="application/ld+json">`로 인라인 주입.
 *
 * Next.js 16 RSC에서 `next/script`는 strategy 제약(beforeInteractive 등)이 있어
 * JSON-LD처럼 즉시 렌더가 필요한 메타에는 일반 `<script>` 태그가 표준 패턴.
 * (Next.js 공식 문서 권장 방식)
 *
 * data 직렬화 시 `</script>` 끼어드는 XSS 회피 위해 `<` 이스케이프 처리.
 */
export function JsonLdScript({ id, data }: JsonLdScriptProps) {
	const json = JSON.stringify(data).replace(/</g, "\\u003c");
	return <script id={id} type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
