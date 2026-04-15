import fs from "node:fs";
import path from "node:path";

const PLACEHOLDER_COUNT = 5;
const DEFAULT_FALLBACK = "/posts/placeholder.svg";

/**
 * 문자열 → 결정론적 양수 hash (FNV-1a 32bit). SSR/CSR 간 값 동일 보장 + 짧은 slug에서 avalanche 품질 양호.
 */
function hashSlug(slug: string): number {
	let hash = 0x811c9dc5;
	for (let index = 0; index < slug.length; index += 1) {
		hash ^= slug.charCodeAt(index);
		hash = (hash + ((hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24))) >>> 0;
	}
	return hash;
}

function placeholderForSlug(slug: string): string {
	const bucket = (hashSlug(slug) % PLACEHOLDER_COUNT) + 1;
	return `/posts/placeholders/cover-${bucket}.svg`;
}

/**
 * 빌드 타임(RSC)에 public/ 아래 썸네일 파일 존재 여부를 확인하고,
 * 없으면 slug 기반 해시로 5개 placeholder 중 하나를 결정론적으로 선택한다.
 *
 * **주의 — 이 유틸은 Node.js 런타임 전용**이다. Client Component에서 호출하면 node:fs 번들 실패.
 * 상위 Server Component에서 fixture를 소비할 때 한 번 resolve해 자식으로 내려준다.
 *
 * M2에서 `features/posts/services/getAllPosts`가 서비스 레이어에서 동일한 정규화를 수행하게 되면
 * 이 유틸은 그대로 재사용된다.
 */
export function resolveThumbnailSrc(thumbnail: string | null, slug?: string): string | null {
	if (!thumbnail) return null;
	const publicPath = path.join(process.cwd(), "public", thumbnail.replace(/^\//, ""));
	if (fs.existsSync(publicPath)) return thumbnail;
	return slug ? placeholderForSlug(slug) : DEFAULT_FALLBACK;
}
