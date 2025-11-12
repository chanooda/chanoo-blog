"use client";

import { type GetIdType, MarkdownPreview } from "markdown";
import { useRouter } from "next/navigation";

import type { Write } from "utils";

interface PostDetailProps {
	write: Write;
}

export function WriteDetail({ write }: PostDetailProps) {
	const router = useRouter();
	const handleGetId = (type: GetIdType, id: string) => {
		if (type === "post") {
			router.push(`/post/${id}`);
		}
		if (type === "series") {
			router.push(`/series?seriesId=${id}`);
		}
		if (type === "tag") {
			router.push(`/post?tagId=${id}`);
		}
	};

	return (
		<MarkdownPreview
			handleGetId={handleGetId}
			write={{
				id: write.id,
				createdAt: write.createdAt,
				mainImage: write.imgUrl,
				series: write.series,
				tag: write.tags,
				title: write.title,
			}}
		>
			{write.content}
		</MarkdownPreview>
	);
}
