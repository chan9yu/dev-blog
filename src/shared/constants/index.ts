import type { GiscusProps } from "@giscus/react";

import { SITE } from "@/shared/config";

export const baseUrl = SITE.url;

// Giscus 댓글 설정
export const giscusConfig: Omit<GiscusProps, "theme"> = {
	repo: process.env.NEXT_PUBLIC_GISCUS_REPO as `${string}/${string}`,
	repoId: process.env.NEXT_PUBLIC_GISCUS_REPO_ID,
	category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY,
	categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID,
	mapping: "pathname",
	strict: "0",
	reactionsEnabled: "1",
	emitMetadata: "0",
	inputPosition: "bottom",
	lang: "ko",
	loading: "lazy"
};
