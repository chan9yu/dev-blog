export type PostFrontmatter = {
	title: string;
	description: string;
	slug: string;
	date: string;
	private: boolean;
	tags: string[];
	thumbnail: string | null;
	series: string | null;
	seriesOrder: number | null;
};

export type PostSummary = PostFrontmatter & {
	readingTimeMinutes: number;
};

export type TocItem = {
	id: string;
	level: 1 | 2 | 3;
	text: string;
};

export type PostDetail = PostSummary & {
	contentMdx: string;
	toc: TocItem[];
};
