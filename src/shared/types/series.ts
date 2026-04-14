import type { PostSummary } from "./post";

export type Series = {
	name: string;
	slug: string;
	posts: PostSummary[];
};
