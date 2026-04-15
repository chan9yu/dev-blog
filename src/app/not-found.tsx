import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/shared/components/layouts/Container";

export const metadata: Metadata = {
	title: "페이지를 찾을 수 없습니다 | chan9yu",
	description: "요청하신 페이지가 존재하지 않습니다.",
	robots: { index: false, follow: false }
};

export default function NotFound() {
	return (
		<Container className="py-20">
			<div className="flex flex-col items-start gap-4">
				<p className="text-muted-foreground text-sm font-medium">404</p>
				<h1 className="text-h1">페이지를 찾을 수 없습니다</h1>
				<p className="text-muted-foreground max-w-prose">
					요청하신 주소가 이동했거나 삭제되었을 수 있습니다. 주소를 다시 확인하거나 홈으로 돌아가 주세요.
				</p>
				<Link
					href="/"
					className="bg-foreground text-background focus-visible:ring-ring mt-2 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
				>
					홈으로 돌아가기
				</Link>
			</div>
		</Container>
	);
}
