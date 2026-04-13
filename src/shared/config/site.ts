/**
 * 사이트 전역 설정 placeholder.
 *
 * 본 작업은 M0-33에서 완성 예정 — title/description/url/author/social/OG 기본값 등 추가.
 * 현 단계는 **임시 데이터 단일 source 역할**:
 *   - Header/MobileMenu가 동일한 navigation 목록을 두 파일에 hardcoded하지 않도록 차단
 *   - site.ts 도입 시 호출자는 import 경로만 갱신
 *
 * project memory: `project_temp_data_single_source.md`
 */

export type NavItem = {
	href: string;
	label: string;
};

export const siteNav: NavItem[] = [
	{ href: "/posts", label: "Posts" },
	{ href: "/tags", label: "Tags" },
	{ href: "/series", label: "Series" },
	{ href: "/about", label: "About" }
];
