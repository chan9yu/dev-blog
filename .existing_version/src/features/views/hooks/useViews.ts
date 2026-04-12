"use client";

import { useEffect, useState } from "react";

/**
 * 포스트 조회수 훅
 * - 마운트 시 조회수 증가 (POST /api/views)
 * - 현재 조회수 표시
 */
export function useViews(slug: string) {
	const [views, setViews] = useState<number | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		let isMounted = true;

		const incrementAndFetchViews = async () => {
			try {
				setIsLoading(true);

				// 조회수 증가
				const response = await fetch("/api/views", {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({ slug })
				});

				if (!response.ok) {
					throw new Error("Failed to increment views");
				}

				const data = await response.json();

				if (isMounted) {
					setViews(data.views);
					setError(null);
				}
			} catch (err) {
				if (isMounted) {
					setError(err instanceof Error ? err : new Error("Unknown error"));
					setViews(0); // 실패 시 0으로 표시
				}
			} finally {
				if (isMounted) {
					setIsLoading(false);
				}
			}
		};

		incrementAndFetchViews();

		return () => {
			isMounted = false;
		};
	}, [slug]);

	return {
		views,
		isLoading,
		error
	};
}
