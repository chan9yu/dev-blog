import { getGitHubFileContentRaw, getGitHubMDXFiles } from "./github";

type Metadata = {
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

function parseFrontmatter(fileContent: string) {
	const frontmatterRegex = /---\s*([\s\S]*?)\s*---/;
	const match = frontmatterRegex.exec(fileContent);

	if (!match) {
		throw new Error("Invalid frontmatter format");
	}

	const frontMatterBlock = match[1];
	const content = fileContent.replace(frontmatterRegex, "").trim();
	const frontMatterLines = frontMatterBlock.trim().split("\n");
	const metadata: Partial<Metadata> = {};

	frontMatterLines.forEach((line) => {
		const [key, ...valueArr] = line.split(": ");
		let value = valueArr.join(": ").trim();
		value = value.replace(/^['"](.*)['"]$/, "$1"); // Remove quotes
		metadata[key.trim() as keyof Metadata] = value;
	});

	return { metadata: metadata as Metadata, content };
}

/**
 * GitHub Repository에서 블로그 포스트를 가져옵니다.
 */
export async function getBlogPosts() {
	try {
		// 1. GitHub에서 MDX 파일 목록 가져오기
		const files = await getGitHubMDXFiles();

		// 2. 각 파일의 내용 가져오기 및 파싱
		const posts = await Promise.all<BlogPost>(
			files.map(async (file) => {
				const rawContent = await getGitHubFileContentRaw(file.name);
				const { metadata, content } = parseFrontmatter(rawContent);
				const slug = file.name.replace(/\.mdx$/, "");

				return {
					metadata,
					slug,
					content
				};
			})
		);

		return posts;
	} catch (error) {
		console.error("Failed to fetch blog posts from GitHub:", error);
		return [];
	}
}

export function formatDate(date: string, includeRelative = false) {
	const currentDate = new Date();
	if (!date.includes("T")) {
		date = `${date}T00:00:00`;
	}
	const targetDate = new Date(date);

	const yearsAgo = currentDate.getFullYear() - targetDate.getFullYear();
	const monthsAgo = currentDate.getMonth() - targetDate.getMonth();
	const daysAgo = currentDate.getDate() - targetDate.getDate();

	let formattedDate = "";

	if (yearsAgo > 0) {
		formattedDate = `${yearsAgo}y ago`;
	} else if (monthsAgo > 0) {
		formattedDate = `${monthsAgo}mo ago`;
	} else if (daysAgo > 0) {
		formattedDate = `${daysAgo}d ago`;
	} else {
		formattedDate = "Today";
	}

	const fullDate = targetDate.toLocaleString("en-us", {
		month: "long",
		day: "numeric",
		year: "numeric"
	});

	if (!includeRelative) {
		return fullDate;
	}

	return `${fullDate} (${formattedDate})`;
}
