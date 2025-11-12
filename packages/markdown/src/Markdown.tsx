/* eslint-disable react/function-component-definition */

import { Badge } from "@ui/components/badge";
import type { ComponentProps } from "react";
import { memo } from "react";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";
import remarkGfm from "remark-gfm";
import { day, type Write } from "utils";
import { markdownComponents } from "./MarkdownComponents";

export interface MarkdownProps extends ComponentProps<typeof ReactMarkdown> {
	write: Partial<Write>;
}

export const Markdown = memo(function Markdown({ write }: MarkdownProps) {
	return (
		<div className="font-inherit h-full mx-auto px-2 w-full">
			<div className="flex flex-col py-4">
				<div className="flex flex-col w-full gap-4">
					{write?.title && (
						<h1 className="text-2xl font-bold">{write.title}</h1>
					)}
					<div className="flex gap-1">
						<p>김찬우</p> ・ <p>{day(write?.createdAt).format("YYYY-MM-DD")}</p>
					</div>
					{write?.tags && write?.tags.length > 0 && (
						<div className="flex flex-row flex-wrap gap-2 w-full">
							{write?.tags?.map((writeTag) => (
								<Badge key={writeTag.id}>{writeTag.name}</Badge>
							))}
						</div>
					)}
					{write.series && (
						<div className="bg-gray-200 rounded-md p-4 w-full">
							<h6 className="mb-2 text-xl">{write.series.name}</h6>
							<ul className="flex flex-col gap-2">
								{write.series.writes.map((write, index) => (
									<li key={write.id}>
										<Link
											to={`/writes/${write.id}`}
											className="hover:underline"
										>
											{index + 1}. {write.title}
										</Link>
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
