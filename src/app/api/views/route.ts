import { kv } from "@vercel/kv";
import type { NextRequest } from "next/server";

import { validateSlug } from "@/shared/utils/slug";

const NO_STORE_HEADERS = { "cache-control": "no-store" } as const;
const VIEW_KEY_PREFIX = "views:post:";

const isKvConfigured = Boolean(
	process.env.KV_REST_API_URL || process.env.KV_URL || process.env.KV_REST_API_READ_ONLY_TOKEN
);

function viewsKey(slug: string) {
	return `${VIEW_KEY_PREFIX}${slug}`;
}

export async function GET(req: NextRequest) {
	const slug = validateSlug(new URL(req.url).searchParams.get("slug"));
	if (!slug) {
		return Response.json({ error: "invalid slug" }, { status: 400, headers: NO_STORE_HEADERS });
	}

	if (!isKvConfigured) {
		return Response.json({ views: 0 }, { headers: NO_STORE_HEADERS });
	}

	try {
		const stored = await kv.get<number>(viewsKey(slug));
		return Response.json({ views: stored ?? 0 }, { headers: NO_STORE_HEADERS });
	} catch (error) {
		console.warn(`[views] GET ${slug} kv error`, error);
		return Response.json({ views: 0 }, { headers: NO_STORE_HEADERS });
	}
}

export async function POST(req: NextRequest) {
	const raw: unknown = await req.json().catch(() => null);
	if (raw === null || typeof raw !== "object" || Array.isArray(raw)) {
		return Response.json({ error: "invalid JSON body" }, { status: 400, headers: NO_STORE_HEADERS });
	}

	const slug = "slug" in raw ? validateSlug(raw.slug) : null;
	if (!slug) {
		return Response.json({ error: "invalid slug" }, { status: 400, headers: NO_STORE_HEADERS });
	}

	if (!isKvConfigured) {
		return new Response(null, { status: 204, headers: NO_STORE_HEADERS });
	}

	try {
		await kv.incr(viewsKey(slug));
	} catch (error) {
		console.warn(`[views] POST ${slug} kv error`, error);
	}

	return new Response(null, { status: 204, headers: NO_STORE_HEADERS });
}
