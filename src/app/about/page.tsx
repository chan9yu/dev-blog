import type { Metadata } from "next";

import { AboutProfile } from "@/features/about";
import { Container } from "@/shared/components/Container";

export const metadata: Metadata = {
	title: "About",
	description:
		"프론트엔드 개발자 여찬규(chan9yu)의 자기소개. 3년차 실무 경험과 React·TypeScript·Next.js·WebRTC 기반 실시간 통신 프로젝트, 학습 태도와 관심 분야를 정리했습니다.",
	alternates: { canonical: "/about" }
};

export default function AboutPage() {
	return (
		<Container size="prose">
			<div className="py-10 lg:py-14">
				<AboutProfile />
			</div>
		</Container>
	);
}
