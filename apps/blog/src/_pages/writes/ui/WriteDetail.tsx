"use client";

import { type GetIdType, Markdown } from "markdown";
import type { Write } from "utils";
import { LINK } from "@/src/_base/config";

interface PostDetailProps {
	write: Write;
}

export function WriteDetail({ write }: PostDetailProps) {
	const handleGetId = (type: GetIdType, id: string) => {
		if (type === "write") {
			open(`${LINK.writes}/${id}`, "_blank", "noopener,noreferrer");
		}
		if (type === "series") {
			open(`${LINK.writes}?seriesId=${id}`, "_blank", "noopener,noreferrer");
		}
		if (type === "tag") {
			open(`${LINK.writes}?tagId=${id}`, "_blank", "noopener,noreferrer");
		}
	};

	return (
		<div className="max-w-3xl w-full mx-auto">
			<Markdown handleGetId={handleGetId} write={write}>
				{write.content}
			</Markdown>
		</div>
	);
}
