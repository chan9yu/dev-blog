/**
 * MOD-about Public API — PRD_TECHNICAL §7.9
 *
 * - AboutProfile: 프로필 블록 + contents/about/index.md MdxRemote 렌더 (M4-20)
 * - HomeHero: 홈 페이지 저자 인사 섹션
 * - getAboutContent: contents/about/index.md raw string 반환 (M4-20)
 *
 * 규칙: 다른 feature를 import하지 않는다 (Law 3).
 */

export { AboutProfile, HomeHero } from "./components";

// Services (100% 서버 전용)
export { getAboutContent } from "./services";
