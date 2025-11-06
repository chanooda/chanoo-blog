"use client";

import { type GetIdType, MarkdownPreview } from "markdown";
import { useRouter } from "next/navigation";
import React from "react";
import { Stack } from "ui";
import type { WriteDetail } from "utils";

interface PostDetailProps {
	write: WriteDetail;
}

export function PostDetail({ write }: PostDetailProps) {
	const router = useRouter();
	const handleGetId = (type: GetIdType, id: number) => {
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
		<Stack mb={4}>
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
		</Stack>
	);
}
