import fs from "node:fs";
import path from "node:path";

/**
 * 빌드 타임(RSC)에 public/ 아래 썸네일 파일 존재 여부를 확인하고, 없으면 공용 placeholder로 폴백.
 *
 * **주의 — 이 유틸은 Node.js 런타임 전용**이다.
 * Client Component에서 호출하면 Turbopack이 `node:fs` 모듈을 번들링하지 못해 빌드 실패한다.
 * 상위 Server Component에서 fixture를 소비할 때 한 번 resolve해 자식으로 내려준다.
 *
 * M2에서 `features/posts/services/getAllPosts`가 도입되면 서비스 레이어에서 동일한 정규화를 수행하고
 * 이 유틸은 그대로 재사용된다.
 */
export function resolveThumbnailSrc(thumbnail: string | null): string | null {
	if (!thumbnail) return null;
	const publicPath = path.join(process.cwd(), "public", thumbnail.replace(/^\//, ""));
	return fs.existsSync(publicPath) ? thumbnail : "/posts/placeholder.svg";
}
