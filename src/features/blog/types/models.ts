export type Metadata = {
	title: string;
	publishedAt: string;
	summary: string;
	image?: string;
};

export type BlogPost = {
	metadata: Metadata;
	slug: string;
	content: string;
};
