/* eslint-disable react/function-component-definition */

import { cn } from "@ui/lib/utils";
import { useEffect, useState } from "react";
import type { Components } from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { githubRepoInfo, githubUserInfo } from "./markdownType";
import { convertLink } from "./markdownUtils";

export const Code: Components["code"] = ({
	node,
	className,
	children,
	...props
}) => {
	const match = /language-(\w+)/.exec(className || "");
	return match ? (
		<SyntaxHighlighter
			{...props}
			ref={undefined}
			PreTag="div"
			language={match[1]}
			customStyle={{ borderRadius: "4px" }}
			style={{ ...vscDarkPlus }}
		>
			{String(children).replace(/\n$/, "") || ""}
		</SyntaxHighlighter>
	) : (
		<code
			className={cn(
				"bg-gray-100 text-sm px-1 py-1 rounded-sm text-red-500 ",
				className,
			)}
			{...props}
		>
			{children}
		</code>
	);
};

export const Img: Components["img"] = ({ src, alt, className, ...props }) => {
	return (
		<div className="flex w-full justify-center">
			<img
				alt={alt}
				className={cn(className, "max-w-full max-h-100")}
				src={src}
				{...props}
			/>
		</div>
	);
};

export const Github: Components["a"] = ({ href, className, target }) => {
	const splitUrl = href?.replace("https://", "").split("/");
	const [repoInfo, setRepoInfo] = useState<typeof githubRepoInfo | undefined>(
		undefined,
	);
	const [userInfo, serUserInfo] = useState<typeof githubUserInfo | undefined>(
		undefined,
	);
	const owner = splitUrl?.[1];
	const repo = splitUrl?.[2];

	useEffect(() => {
		if (owner && repo) {
			(async () => {
				const res = await fetch(
					`https://api.github.com/repos/${owner}/${repo}`,
				);
				const data = (await res.json()) as typeof githubRepoInfo;
				setRepoInfo(data);
			})();
		}
		if (owner) {
			(async () => {
				const res = await fetch(`https://api.github.com/users/${owner}`);
				const data = (await res.json()) as typeof githubUserInfo;
				serUserInfo(data);
			})();
		}
	}, [owner, repo]);

	if (repoInfo) {
		return (
			<a
				className={cn(
					className,
					"border-gray-300 border rounded-md flex flex-row overflow-hidden h-[106px]",
				)}
				href={href}
				target={target}
			>
				<div className="h-full p-1 w-[70%] gap-1 flex flex-col">
					<span className="line-clamp-1">Github - {repoInfo.full_name}</span>
					{repoInfo.description && (
						<span className="line-clamp-2">{repoInfo.description}</span>
					)}
					<div className="items-center flex gap-1">
						<div className="min-h-4 min-w-4">
							<svg
								aria-label="github"
								role="img"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
							</svg>
						</div>
						<span className="line-clamp-1">{repoInfo.html_url}</span>
					</div>
				</div>
				<img
					alt={href}
					height="100%"
					src={convertLink(href || "")}
					className="aspect-1/2 h-full w-[30%]"
				/>
			</a>
		);
	}
	if (userInfo) {
		return (
			<a
				className={cn(
					"border-gray-300 border rounded-md flex flex-row gap-1 h-26 w-full overflow-hidden",
					className,
				)}
				href={href}
				target={target}
			>
				<img
					alt="profile"
					className="min-w-26 w-26"
					src={userInfo.avatar_url}
				/>
				<div className="overflow-hidden p-1 w-full">
					<span className="line-clamp-1">{userInfo.name}</span>
					<span className="text-gray-700 h-10 line-clamp-2">
						{userInfo.bio}
					</span>
					<div className="flex items-center gap-1 mt-auto">
						<div className="h-4 min-h-4 w-4 min-w-4">
							<svg
								aria-label="github"
								role="img"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
							</svg>
						</div>
						<span className="line-clamp-1">{userInfo.html_url}</span>
					</div>
					{/* <Stack>
                <EllipsisTypography variant="body2">{userInfo.blog}</EllipsisTypography>
                <EllipsisTypography variant="body2">{userInfo.company}</EllipsisTypography>
              </Stack> */}
				</div>
			</a>
		);
	}
	return null;
};

export const A: Components["a"] = ({ children, href, className, ...props }) => {
	if (href?.indexOf("https://youtu.be/") !== -1)
		return (
			<iframe
				className={cn("border-none h-auto w-full aspect-video", className)}
				height="auto"
				src={convertLink(href || "")}
				title={href}
				width="100%"
			/>
		);
	if (href.indexOf("https://github.com/") !== -1) {
		return (
			<Github href={href} target="_blank" className={className} {...props}>
				{children}
			</Github>
		);
	}
	return (
		<a
			className={cn("text-gray-700 text-decoration-underline", className)}
			href={href}
			target="_blank"
			{...props}
		>
			{children}
		</a>
	);
};

export const Blockquote: Components["blockquote"] = ({
	className,
	...props
}) => {
	return (
		<blockquote
			className={cn(
				"m-0 p-0 text-inherit border-l-0.25 border-gray-800",
				className,
			)}
			{...props}
		/>
	);
};

export const H1: Components["h1"] = ({ className, ...props }) => {
	return <h1 className={cn("text-4xl font-bold", className)} {...props} />;
};
export const H2: Components["h2"] = ({ className, ...props }) => {
	return <h2 className={cn("text-3xl font-bold", className)} {...props} />;
};
export const H3: Components["h3"] = ({ className, ...props }) => {
	return <h2 className={cn("text-2xl font-bold", className)} {...props} />;
};
export const H4: Components["h4"] = ({ className, ...props }) => {
	return <h2 className={cn("text-xl font-bold", className)} {...props} />;
};
export const H5: Components["h5"] = ({ className, ...props }) => {
	return <h2 className={cn("text-lg font-bold", className)} {...props} />;
};
export const H6: Components["h6"] = ({ className, ...props }) => {
	return <h2 className={cn("text-base font-bold", className)} {...props} />;
};
export const P: Components["p"] = ({ className, ...props }) => {
	return <p className={cn("text-base leading-7", className)} {...props} />;
};

export const markdownComponents: Components = {
	h1: H1,
	h2: H2,
	h3: H3,
	h4: H4,
	h5: H5,
	h6: H6,
	p: P,
	code: Code,
	img: Img,
	a: A,
	blockquote: Blockquote,
};
