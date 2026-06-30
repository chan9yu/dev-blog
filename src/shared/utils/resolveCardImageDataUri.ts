import { join } from "node:path";

import type { PostSummary } from "@/shared/types";

import { fileToDataUri } from "./fileToDataUri";
import { resolveThumbnailSrc } from "./resolveThumbnail";

const RASTER_EXT = /\.(png|jpe?g|webp|gif)$/i;

// Satori는 svg <img>를 안정적으로 렌더 못 하므로 raster 썸네일만 인라인.
// svg placeholder·미존재는 null → 라우트가 그라디언트+제목 폴백 카드를 렌더.
export function resolveCardImageDataUri(post: PostSummary) {
	const resolved = resolveThumbnailSrc(post.thumbnail, post.slug);
	if (!resolved || !RASTER_EXT.test(resolved)) {
		return null;
	}

	const absolutePath = join(process.cwd(), "public", resolved.replace(/^\//, ""));
	return fileToDataUri(absolutePath);
}
