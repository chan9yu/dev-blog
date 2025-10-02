const GITHUB_OWNER = "chan9yu";
const GITHUB_REPO = "blog9yu-content";
const GITHUB_POSTS_PATH = "posts";

type GitHubFile = {
	name: string;
	path: string;
	sha: string;
	size: number;
	url: string;
	html_url: string;
	git_url: string;
	download_url: string;
	type: string;
};

type GitHubFileContent = {
	name: string;
	path: string;
	sha: string;
	size: number;
	content: string;
	encoding: string;
};

/**
 * GitHub API를 통해 posts 디렉토리의 MDX 파일 목록을 가져옵니다.
 */
export async function getGitHubMDXFiles(): Promise<GitHubFile[]> {
	const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_POSTS_PATH}`;

	const response = await fetch(url, {
		headers: {
			Accept: "application/vnd.github+json"
		},
		next: {
			revalidate: 3600 // ISR: 1시간마다 재검증
		}
	});

	if (!response.ok) {
		throw new Error(`Failed to fetch GitHub files: ${response.statusText}`);
	}

	const files: GitHubFile[] = await response.json();

	// .mdx 파일만 필터링
	return files.filter((file) => file.type === "file" && file.name.endsWith(".mdx"));
}

/**
 * GitHub API를 통해 특정 MDX 파일의 내용을 가져옵니다.
 */
export async function getGitHubFileContent(path: string): Promise<string> {
	const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`;

	const response = await fetch(url, {
		headers: {
			Accept: "application/vnd.github+json"
		},
		next: {
			revalidate: 3600 // ISR: 1시간마다 재검증
		}
	});

	if (!response.ok) {
		throw new Error(`Failed to fetch GitHub file content: ${response.statusText}`);
	}

	const data: GitHubFileContent = await response.json();

	// base64로 인코딩된 content를 디코딩
	if (data.encoding === "base64") {
		return Buffer.from(data.content, "base64").toString("utf-8");
	}

	return data.content;
}

/**
 * Raw GitHub URL을 통해 MDX 파일 내용을 가져옵니다. (더 빠름)
 */
export async function getGitHubFileContentRaw(fileName: string): Promise<string> {
	const url = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/main/${GITHUB_POSTS_PATH}/${fileName}`;

	const response = await fetch(url, {
		next: {
			revalidate: 3600 // ISR: 1시간마다 재검증
		}
	});

	if (!response.ok) {
		throw new Error(`Failed to fetch raw GitHub file: ${response.statusText}`);
	}

	return response.text();
}
