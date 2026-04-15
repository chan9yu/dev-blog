import type { NextRequest } from "next/server";

import { validateSlug } from "@/shared/utils/slug";

// M3에서 Vercel KV 연결 예정. 현재는 placeholder — slug 검증 후 0 반환.

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const slug = validateSlug(searchParams.get("slug"));

	return slug
		? Response.json({ slug, views: 0 }, { status: 200 })
		: Response.json({ error: "invalid slug" }, { status: 400 });
}

export async function POST(req: NextRequest) {
	const raw: unknown = await req.json().catch(() => null);
	if (!raw || typeof raw !== "object") {
		return Response.json({ error: "invalid JSON body" }, { status: 400 });
	}

	const slug = validateSlug((raw as Record<string, unknown>).slug);
	if (!slug) {
		return Response.json({ error: "invalid slug" }, { status: 400 });
	}

	return Response.json({ slug, views: 1 }, { status: 200 });
}
