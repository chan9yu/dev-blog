/**
 * MOD-lightbox Public API — PRD_TECHNICAL §7.8
 *
 * M3-16 Green: multi-image carousel 지원 + app/providers 루트 배치 완료.
 *
 * - Components: ImageLightbox, LightboxProvider
 * - Hooks: useLightbox — `{ open(single), openMany(images, startIndex?), close }` 반환
 * - Types: LightboxImage — `{ src, alt }`
 *
 * Radix Dialog 기반 구현으로 `yet-another-react-lightbox` 의존 없이 carousel 제공.
 * follow-up: `yet-another-react-lightbox` 스왑 (autonomy.md deps 블록 해제 시).
 *
 * 규칙: 다른 feature를 import하지 않는다 (Law 3).
 */

export { ImageLightbox, LightboxProvider } from "./components";
export type { LightboxImage } from "./contexts/LightboxContext";
export { useLightbox } from "./hooks/useLightbox";
