import { Client, type PageObjectResponse, type PersonUserObjectResponse } from "@notionhq/client";

import type { BlogPost } from "@/shared/types/blog";

class NotionService {
	private static instance: NotionService;

	private readonly client: Client;
	private readonly token = process.env.NOTION_TOKEN;
	private readonly databaseId = process.env.NOTION_DATABASE_ID;

	private constructor() {
		if (!this.token || !this.databaseId) {
			throw new Error("NOTION_TOKEN and NOTION_DATABASE_ID are required");
		}

		this.client = new Client({ auth: this.token });
	}

	public static getInstance(): NotionService {
		if (!NotionService.instance) {
			NotionService.instance = new NotionService();
		}

		return NotionService.instance;
	}

	public async getBlogPosts() {
		const response = await this.client.databases.query({
			database_id: this.databaseId,
			filter: {
				property: "Status",
				select: {
					equals: "Published"
				}
			},
			sorts: [
				{
					property: "Date",
					direction: "descending"
				}
			]
		});

		return response.results
			.filter((page): page is PageObjectResponse => "properties" in page)
			.map((page) => this.convertToBlogPost(page));
	}

	private getCoverImage(cover: PageObjectResponse["cover"]) {
		if (!cover) return "";

		switch (cover.type) {
			case "external":
				return cover.external.url;
			case "file":
				return cover.file.url;
			default:
				return "";
		}
	}

	private convertToBlogPost(page: PageObjectResponse): BlogPost {
		const { cover, id, last_edited_time, properties } = page;
		const { Title, Description, Tags, Author, Date, Slug } = properties;

		return {
			id,
			title: Title.type === "title" ? (Title.title[0]?.plain_text ?? "") : "",
			description: Description.type === "rich_text" ? (Description.rich_text[0]?.plain_text ?? "") : "",
			coverImage: this.getCoverImage(cover),
			tags: Tags.type === "multi_select" ? Tags.multi_select.map((tag) => tag.name) : [],
			author: Author.type === "people" ? ((Author.people[0] as PersonUserObjectResponse)?.name ?? "") : "",
			date: Date.type === "date" ? (Date.date?.start ?? "") : "",
			modifiedDate: last_edited_time,
			slug: Slug.type === "rich_text" ? (Slug.rich_text[0]?.plain_text ?? id) : id
		};
	}
}

export const notionService = NotionService.getInstance();
