declare namespace NodeJS {
	interface ProcessEnv {
		/**
		 * GitHub Personal Access Token
		 * GitHub REST API 호출 시 Rate Limit 증가 (60/h → 5000/h)
		 * @see https://github.com/settings/tokens
		 */
		GITHUB_TOKEN?: string;
	}
}
