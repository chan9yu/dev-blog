import type { MetadataRoute } from "next";

import { SITE } from "@/shared/config";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: SITE.title,
		short_name: SITE.name,
		description: SITE.description,
		start_url: "/",
		display: "standalone",
		background_color: "#ffffff",
		theme_color: "#000000",
		icons: [
			{
				src: "/favicons/android-chrome-192x192.png",
				sizes: "192x192",
				type: "image/png",
				purpose: "any"
			},
			{
				src: "/favicons/android-chrome-192x192.png",
				sizes: "192x192",
				type: "image/png",
				purpose: "maskable"
			}
		]
	};
}
