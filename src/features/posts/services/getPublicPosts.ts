import { cache } from "react";

import { getAllPosts } from "./getAllPosts";

/**
 * `private: false`인 공개 포스트를 날짜 내림차순으로 반환한다.
 *
 * React.cache()로 동일 렌더 트리 내 중복 호출을 dedup한다.
 * generateMetadata + page component + findAdjacentPosts + findRelatedPostsByTags 등
 * 동일 렌더 패스 내 모든 호출이 단일 fs 스캔 결과를 공유한다.
 * (generateStaticParams는 렌더 트리 외부 — 별도 호출)
 */
export const getPublicPosts = cache(() => getAllPosts({ includePrivate: false }));
