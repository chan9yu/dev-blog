import { postsFixture } from "@/shared/fixtures/posts";

/**
 * `private: false`인 공개 포스트를 날짜 내림차순으로 반환한다.
 * layout·home·posts 목록·adjacent/related 계산이 모두 이 함수로 정규화된 배열을 공유해
 * "공개 포스트 정의"가 단일 진실 공급원이 된다 (리뷰어 Tier 1 #10 대응).
 */
export function getPublicPosts() {
	return postsFixture
		.filter((post) => !post.private)
		.slice()
		.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
