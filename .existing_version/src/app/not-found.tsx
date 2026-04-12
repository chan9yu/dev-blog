import type { Metadata } from "next";
import Link from "next/link";

import { SITE } from "@/shared/config";

export const metadata: Metadata = {
	title: "404 - 페이지를 찾을 수 없습니다",
	description: "요청하신 페이지를 찾을 수 없습니다. 홈페이지나 다른 페이지를 방문해보세요.",
	openGraph: {
		title: "404 - 페이지를 찾을 수 없습니다 · chan9yu",
		description: "요청하신 페이지를 찾을 수 없습니다",
		type: "website",
		url: `${SITE.url}/404`,
		images: [
			{
				url: SITE.defaultOG,
				width: 1200,
				height: 630,
				alt: "404 - 페이지를 찾을 수 없습니다"
			}
		]
	},
	robots: {
		index: false,
		follow: true
	}
};

export default function NotFound() {
	return (
		<div className="flex min-h-[60vh] flex-col items-center justify-center">
			<div className="text-center">
				{/* 404 아이콘 */}
				<div className="mb-8">
					<h1 className="text-accent text-9xl font-bold">404</h1>
				</div>

				{/* 메시지 */}
				<div className="mb-8 space-y-3">
					<h2 className="text-primary text-2xl font-bold tracking-tight sm:text-3xl">페이지를 찾을 수 없습니다</h2>
					<p className="text-secondary text-sm leading-relaxed sm:text-base">
						요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
					</p>
				</div>

				{/* 액션 버튼 */}
				<div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
					<Link
						href="/"
						className="bg-accent hover:bg-accent/90 inline-flex min-h-[44px] items-center justify-center rounded-lg px-6 py-3 text-sm font-medium text-white transition-colors sm:min-h-0"
					>
						홈으로 돌아가기
					</Link>
					<Link
						href="/posts"
						className="bg-secondary text-primary border-primary hover:bg-tertiary inline-flex min-h-[44px] items-center justify-center rounded-lg border px-6 py-3 text-sm font-medium transition-colors sm:min-h-0"
					>
						포스트 보기
					</Link>
				</div>

				{/* 추가 링크 */}
				<div className="mt-12">
					<p className="text-tertiary mb-4 text-sm">다른 페이지를 둘러보세요</p>
					<div className="flex flex-wrap justify-center gap-4 text-sm">
						<Link href="/series" className="text-accent hover:underline">
							시리즈
						</Link>
						<span className="text-tertiary">·</span>
						<Link href="/tags" className="text-accent hover:underline">
							태그
						</Link>
						<span className="text-tertiary">·</span>
						<Link href="/about" className="text-accent hover:underline">
							About
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
