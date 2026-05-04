export default function Loading() {
	return (
		<div className="max-w-content mx-auto px-4 py-10 sm:px-6 lg:px-8" role="status">
			<p className="text-muted-foreground">불러오는 중…</p>
			<span className="sr-only">페이지를 불러오고 있습니다</span>
		</div>
	);
}
