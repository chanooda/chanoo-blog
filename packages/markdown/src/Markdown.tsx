/* eslint-disable react/function-component-definition */

import { Badge } from "@ui/components/badge";
import type { ComponentProps } from "react";
import { memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { day, type Write } from "utils";
import { markdownComponents } from "./MarkdownComponents";

export type GetIdType = "write" | "tag" | "series";
export interface MarkdownProps extends ComponentProps<typeof ReactMarkdown> {
	write: Partial<Write>;
	handleGetId?: (type: GetIdType, id: string) => void;
}

export const Markdown = memo(function Markdown({
	write,
	handleGetId,
}: MarkdownProps) {
	return (
		<div className="font-inherit h-full mx-auto w-full">
			<div className="flex flex-col py-4">
				<div className="flex flex-col w-full gap-4">
					{write?.title && (
						<h1 className="text-4xl font-bold">{write.title}</h1>
					)}
					<div className="flex gap-1">
						<p>김찬우</p> ・ <p>{day(write?.createdAt).format("YYYY-MM-DD")}</p>
					</div>
					{write?.tags && write?.tags.length > 0 && (
						<div className="flex flex-row flex-wrap gap-2 w-full">
							{write?.tags?.map((writeTag) => (
								<Badge
									key={writeTag.name}
									onClick={() => handleGetId?.("tag", writeTag.id)}
									className="cursor-pointer"
								>
									{writeTag.name}
								</Badge>
							))}
						</div>
					)}
					{write.series && (
						<div className="bg-primary rounded-md p-4 w-full">
							<button
								type="button"
								aria-label={`시리즈 "${write.series.name}"로 이동`}
								className="text-white mb-2 text-xl hover:underline cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded text-left font-bold"
								onClick={() => handleGetId?.("series", write.series?.id || "")}
							>
								{write.series.name}
							</button>
							<ul className="flex flex-col gap-2">
								{write.series.writes.map((write, index) => (
									<li key={write.id}>
										<button
											type="button"
											aria-label={`글 "${write.title}"로 이동`}
											onClick={() => handleGetId?.("write", write.id)}
											className="text-white hover:underline cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded text-left w-full"
										>
											{index + 1}. {write.title}
										</button>
									</li>
								))}
							</ul>
						</div>
					)}
					{write.imgUrl && (
						<div className="mt-2 w-full">
							<img
								alt="메인 이미지"
								src={write.imgUrl}
								className="object-cover aspect-video w-full"
							/>
						</div>
					)}
				</div>
				<div className="flex flex-col mt-4 gap-4">
					<ReactMarkdown
						remarkPlugins={[remarkGfm]}
						components={markdownComponents}
					>
						{write.content}
					</ReactMarkdown>
				</div>{" "}
			</div>
		</div>
	);
});
