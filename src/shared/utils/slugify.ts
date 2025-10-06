export function slugify(str: string): string {
	return str
		.toString()
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9가-힣\s-]/g, "")
		.replace(/\s+/g, "-");
}
