import { Markdown } from "markdown";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { day } from "utils";
import { useMarkdownValue } from "@/src/libs/markdownStore";
import type { WritingForm } from "@/src/types/form";

// interface MarkdownPreviewProps {
// 	control: Control<WritingForm>;
// }

export const MarkdownPreview = memo(
	() => {
		const formContext = useFormContext<WritingForm>();
		// control만 추출하여 메모이제이션 - control 객체는 변경되지 않으므로 리렌더링 방지
		const control = useMemo(() => formContext.control, [formContext.control]);

		const formValues = useWatch({
			control,
			name: ["mainImage", "series", "tag", "title", "createdAt"],
		});

		const [mainImage, series, tag, title, createdAt] = formValues;

		const markdownValue = useMarkdownValue();
		const [value, setValue] = useState(markdownValue);
		const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
		const prevValueRef = useRef(markdownValue);

		useEffect(() => {
			// 값이 실제로 변경되지 않았으면 무시
			if (prevValueRef.current === markdownValue) {
				return;
			}
			prevValueRef.current = markdownValue;

			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
			timeoutRef.current = setTimeout(() => {
				setValue(markdownValue);
			}, 500);

			return () => {
				if (timeoutRef.current) {
					clearTimeout(timeoutRef.current);
				}
			};
		}, [markdownValue]);

		const write = useMemo(
			() => ({
				content: value,
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
			[value, mainImage, series, tag, title, createdAt],
		);

		return <Markdown write={write} />;
	},
	// (prevProps, nextProps) => {
	// 	// control 객체가 동일하면 리렌더링하지 않음
	// 	return prevProps.control === nextProps.control;
	// },
);
