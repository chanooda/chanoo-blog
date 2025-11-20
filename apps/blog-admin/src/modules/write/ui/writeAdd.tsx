import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useBlocker } from "react-router-dom";
import { day } from "utils";
import { useResetMarkdown } from "@/src/modules/write/libs/markdownStore";
import { MarkdownEditor } from "@/src/modules/write/ui/MarkdownEditor";
import type { WritingForm } from "@/src/types/form";
import { MarkdownPreview } from "./MarkdownPreview";
import { WriteAddFilter } from "./WriteAddFilter";

interface WritingProps {
	id?: string;
}

export function WriteAdd({ id }: WritingProps) {
	const resetMarkdown = useResetMarkdown();

	const form = useForm<WritingForm>({
		defaultValues: {
			content: "",
			isPublish: false,
			mainImage: "",
			series: "",
			tag: [],
			title: "",
			createdAt: day().todayFull(),
		},
	});

	// 새 글 작성 모드(id가 없음)로 진입할 때 markdownStore 초기화
	useEffect(() => {
		if (!id) {
			resetMarkdown();
		}
	}, [id, resetMarkdown]);

	// 페이지를 떠날 때 markdownStore 초기화
	// 수정 모드로 다시 돌아오면 WriteAddFilter에서 데이터를 다시 불러와서 설정함
	useEffect(() => {
		return () => {
			resetMarkdown();
		};
	}, [resetMarkdown]);

	// 항상 네비게이션을 블로킹 (내부 네비게이션)
	const blocker = useBlocker(true);

	// 블로킹된 네비게이션 처리
	useEffect(() => {
		if (blocker.state === "blocked") {
			const shouldProceed = window.confirm(
				"페이지 이동 시 저장되지 않을 수 있습니다.",
			);

			if (shouldProceed) {
				// 확인을 선택하면 네비게이션 진행
				blocker.proceed();
			} else {
				// 취소를 선택하면 현재 페이지에 머물기
				blocker.reset();
			}
		}
	}, [blocker]);

	// 브라우저 탭 닫기/새로고침 방지
	useEffect(() => {
		const beforeunloadHandler = (e: BeforeUnloadEvent) => {
			e.preventDefault();
			e.returnValue = "";
			return "";
		};

		window.addEventListener("beforeunload", beforeunloadHandler);

		return () => {
			window.removeEventListener("beforeunload", beforeunloadHandler);
		};
	}, []);

	return (
		<FormProvider {...form}>
			<div className=" flex flex-row h-full w-full [.w-md-editor]:w-full">
				<div className="h-full w-1/2 border-r border-gray-300 flex flex-col min-h-0">
					<WriteAddFilter id={id} />
					<div className="h-full min-h-0">
						<MarkdownEditor />
					</div>
				</div>
				<div className="h-full w-1/2">
					<div className="flex flex-col h-full min-h-0 px-2 overflow-auto">
						<MarkdownPreview control={form.control} />
					</div>
				</div>
			</div>
		</FormProvider>
	);
}
