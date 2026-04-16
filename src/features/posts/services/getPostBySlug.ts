import type { PostSummary } from "@/shared/types";

import { getAllPosts } from "./getAllPosts";

/**
 * slug로 공개 포스트(private: false) 1건을 찾는다. 없거나 private면 null.
 * `getPublicPosts`와 동일한 "공개 포스트 정의"를 공유해 SSOT 원칙을 유지한다 (GC 드리프트 #1 대응).
 */
export function getPostBySlug(slug: string): PostSummary | null {
	const post = getAllPosts({ includePrivate: true }).find((item) => item.slug === slug);
	return !post || post.private ? null : post;
}
