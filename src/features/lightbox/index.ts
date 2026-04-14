/**
 * MOD-lightbox Public API — PRD_TECHNICAL §7.8
 *
 * 현재(M1): LightboxProvider Context + useLightbox 훅 + ImageLightbox 오버레이.
 *
 * 향후:
 * - M3-15~16: MdxImage와 연동 (클릭 시 open 호출)
 * - 페이지 단위 LightboxProvider 루트 배치 (레이아웃 수준)
 *
 * 규칙: 다른 feature를 import하지 않는다 (Law 3).
 */

export { ImageLightbox, LightboxProvider, useLightbox } from "./components";
