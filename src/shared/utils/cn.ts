import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * 조건부 Tailwind 클래스 병합 유틸.
 * clsx로 문자열 결합 → twMerge로 충돌 유틸 뒤쪽 우선 정규화.
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
