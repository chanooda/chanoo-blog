"use client";

import { type GetIdType, Markdown } from "markdown";
import { useRouter } from "next/navigation";
import type { Write } from "utils";
import { LINK } from "@/src/_base/config";

interface PostDetailProps {
	write: Write;
}

export function WriteDetail({ write }: PostDetailProps) {
	const router = useRouter();
	const handleGetId = (type: GetIdType, id: string) => {
		if (type === "post") {
			router.push(`${LINK.writes}/${id}`);
		}
		if (type === "series") {
			router.push(`${LINK.series}?seriesId=${id}`);
		}
		if (type === "tag") {
			router.push(`${LINK.writes}?tagId=${id}`);
		}
	};

	return (
		<Markdown
			handleGetId={handleGetId}
			write={{
				id: write.id,
				createdAt: write.createdAt,
				imgUrl: write.imgUrl,
				series: write.series,
				tags: write.tags,
				title: write.title,
			}}
		>
			{write.content}
		</Markdown>
	);
}
