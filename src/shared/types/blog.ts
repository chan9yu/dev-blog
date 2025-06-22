export interface BlogTagFilterItem {
	id: string;
	name: string;
	count: number;
}

export interface BlogPost {
	id: string;
	title: string;
	description?: string;
	coverImage?: string;
	tags?: string[];
	author?: string;
	date?: string;
	modifiedDate?: string;
	slug: string;
}
