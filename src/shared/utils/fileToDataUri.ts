import { readFileSync } from "node:fs";
import { extname } from "node:path";

const MIME_BY_EXT: Record<string, string> = {
	".png": "image/png",
	".jpg": "image/jpeg",
	".jpeg": "image/jpeg",
	".webp": "image/webp",
	".gif": "image/gif"
};

// Node.js 빌드 타임 전용 — Client Component에서 호출 시 node:fs 번들 실패.
export function fileToDataUri(absolutePath: string) {
	const ext = extname(absolutePath).toLowerCase();
	const mime = MIME_BY_EXT[ext];
	if (!mime) {
		throw new Error(`fileToDataUri: 지원하지 않는 확장자 "${ext}" (${absolutePath})`);
	}

	const base64 = readFileSync(absolutePath).toString("base64");
	return `data:${mime};base64,${base64}`;
}
