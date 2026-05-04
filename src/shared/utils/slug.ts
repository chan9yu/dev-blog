const SLUG_PATTERN = /^[a-z0-9-]+$/;

export const SLUG_MAX_LENGTH = 120;
export const TAG_MAX_LENGTH = 60;

export function normalizeSlug(raw: string, maxLength = SLUG_MAX_LENGTH) {
	try {
		const decoded = decodeURIComponent(raw);
		if (decoded.length === 0 || decoded.length > maxLength) return null;
		if (!SLUG_PATTERN.test(decoded)) return null;
		return decoded;
	} catch {
		return null;
	}
}

export function validateSlug(value: unknown, maxLength = SLUG_MAX_LENGTH) {
	if (typeof value !== "string") return null;
	if (value.length === 0 || value.length > maxLength) return null;
	if (!SLUG_PATTERN.test(value)) return null;
	return value;
}
