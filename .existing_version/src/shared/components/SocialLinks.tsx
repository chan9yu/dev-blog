import EmailIcon from "@/shared/assets/icons/email.svg";
import GithubIcon from "@/shared/assets/icons/github.svg";
import LinkedinIcon from "@/shared/assets/icons/linkedin.svg";

export function SocialLinks() {
	return (
		<div className="flex flex-wrap gap-3">
			<a
				href="https://github.com/chan9yu"
				target="_blank"
				rel="noopener noreferrer"
				className="bg-secondary text-primary border-primary group inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 hover:shadow-md"
			>
				<GithubIcon className="size-4 transition-transform duration-200 group-hover:rotate-12" />
				GitHub
			</a>
			<a
				href="https://www.linkedin.com/in/chan9yu/"
				target="_blank"
				rel="noopener noreferrer"
				className="bg-secondary text-primary border-primary group inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 hover:shadow-md"
			>
				<LinkedinIcon className="size-4 transition-transform duration-200 group-hover:rotate-12" />
				LinkedIn
			</a>
			<a
				href="mailto:dev.cgyeo@email.com"
				className="bg-secondary text-primary border-primary group inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 hover:shadow-md"
			>
				<EmailIcon className="size-4 transition-transform duration-200 group-hover:rotate-12" />
				Email
			</a>
		</div>
	);
}
