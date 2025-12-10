import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { getPostViews, incrementPostViews } from "@/features/views/services";

/**
 * GET /api/views?slug=post-slug
 * 포스트 조회수 조회
 */
export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const slug = searchParams.get("slug");

		if (!slug) {
			return NextResponse.json({ error: "slug parameter is required" }, { status: 400 });
		}

		const views = await getPostViews(slug);

		return NextResponse.json({ slug, views }, { status: 200 });
	} catch (error) {
		console.error("Failed to get views:", error);
		return NextResponse.json({ error: "Failed to get views" }, { status: 500 });
	}
}

/**
 * POST /api/views
 * 포스트 조회수 증가
 */
export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { slug } = body;

		if (!slug || typeof slug !== "string") {
			return NextResponse.json({ error: "Valid slug is required" }, { status: 400 });
		}

		const views = await incrementPostViews(slug);

		return NextResponse.json({ slug, views, success: true }, { status: 200 });
	} catch (error) {
		console.error("Failed to increment views:", error);
		return NextResponse.json({ error: "Failed to increment views", success: false }, { status: 500 });
	}
}
