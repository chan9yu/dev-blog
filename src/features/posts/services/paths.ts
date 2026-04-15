import { join } from "node:path";

/** contents/posts/ 하위 포스트 디렉토리 기준 경로. */
export const POSTS_DIR = join(process.cwd(), "contents", "posts");
