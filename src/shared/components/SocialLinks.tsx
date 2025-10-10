import EmailIcon from "@/assets/icons/email.svg";
import GithubIcon from "@/assets/icons/github.svg";
import LinkedinIcon from "@/assets/icons/linkedin.svg";

export function SocialLinks() {
	return (
		<div className="flex flex-wrap gap-3">
			<a
				href="https://github.com/chan9yu"
				target="_blank"
				rel="noopener noreferrer"
				className="bg-secondary text-primary border-primary inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all hover:shadow-md"
			>
				<GithubIcon className="size-4" />
				GitHub
			</a>
			<a
				href="https://www.linkedin.com/in/chan9yu/"
				target="_blank"
				rel="noopener noreferrer"
				className="bg-secondary text-primary border-primary inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all hover:shadow-md"
			>
				<LinkedinIcon className="size-4" />
				LinkedIn
			</a>
			<a
				href="mailto:dev.cgyeo@email.com"
				className="bg-secondary text-primary border-primary inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all hover:shadow-md"
			>
				<EmailIcon className="size-4" />
				Email
			</a>
		</div>
	);
}
