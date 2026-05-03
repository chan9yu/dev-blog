const ENTITIES: Record<string, string> = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	'"': "&quot;",
	"'": "&apos;"
};

export function escapeXml(input: string) {
	return input.replace(/[&<>"']/g, (char) => ENTITIES[char] ?? char);
}
