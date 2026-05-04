import { cache } from "react";

import { getAllPosts } from "./getAllPosts";

// React.cache로 동일 렌더 트리(generateMetadata + Page + 인접/관련 lookup)가 단일 fs 스캔 결과 공유.
export const getPublicPosts = cache(() => getAllPosts({ includePrivate: false }));
