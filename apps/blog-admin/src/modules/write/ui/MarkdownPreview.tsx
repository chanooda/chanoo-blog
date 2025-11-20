import { Markdown } from "markdown";
import { memo, useMemo } from "react";
import type { Control } from "react-hook-form";
import { useWatch } from "react-hook-form";
import { day } from "utils";
import { useMarkdownValue } from "@/src/modules/write/libs/markdownStore";
import type { WritingForm } from "@/src/types/form";

interface MarkdownPreviewProps {
	control: Control<WritingForm>;
}

export const MarkdownPreview = memo(
	({ control }: MarkdownPreviewProps) => {
		const formValues = useWatch({
			control,
			name: ["mainImage", "series", "tag", "title", "createdAt"],
		});

		const [mainImage, series, tag, title, createdAt] = formValues;

		const markdownValue = useMarkdownValue();

		const write = useMemo(
			() => ({
				content: markdownValue,
				heart: 0,
				id: "0",
				isPublish: true as const,
				seriesId: "0",
				updatedAt: day().todayFull(),
				view: 0,
				imgUrl: mainImage,
				series: series
					? {
							id: "0",
							name: series,
							writes: [],
							writeOrder: [],
						}
					: undefined,
				tags: tag.map((tag) => ({
					id: "0",
					name: tag,
				})),
				title: title,
				createdAt: createdAt || day().todayFull(),
			}),
			[markdownValue, mainImage, series, tag, title, createdAt],
		);

		return <Markdown write={write} />;
	},
	(prevProps, nextProps) => {
		// control 객체가 동일하면 리렌더링하지 않음
		return prevProps.control === nextProps.control;
	},
);
