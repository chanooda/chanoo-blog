import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { day } from "utils";
import { MarkdownEditor } from "@/src/pages/writes/ui/MarkdownEditor";
import type { WritingForm } from "@/src/types/form";
import { MarkdownPreview } from "./ui/MarkdownPreview";
import { WriteAddFilter } from "./ui/WriteAddFilter";

interface WritingProps {
	id?: string;
}

export function WriteAdd({ id }: WritingProps) {
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

	useEffect(() => {
		const { confirm, history, location } = window;
		const preventGoBack = () => {
			if (confirm("페이지 이동 시 저장되지 않을 수 있습니다.")) {
				history.go(-2);
			} else {
				history.back();
			}
		};
		const beforeunloadHandler = (e: BeforeUnloadEvent) => {
			e.preventDefault();
			e.returnValue = "";
			return "";
		};

		history.pushState(null, "", location.href);

		window.addEventListener("popstate", preventGoBack);
		window.addEventListener("beforeunload", beforeunloadHandler);

		return () => {
			window.removeEventListener("popstate", preventGoBack);
			window.removeEventListener("beforeunload", beforeunloadHandler);
		};
	}, []);

	return (
		<FormProvider {...form}>
			<div className=" flex flex-row h-full w-full [.w-md-editor]:w-full">
				<div className="h-full w-1/2 border-r border-gray-300 flex flex-col">
					<WriteAddFilter id={id} />
					<div className="h-full min-h-0">
						<MarkdownEditor />
					</div>
				</div>
				<div className="h-full w-1/2">
					<div className="flex flex-col h-full min-h-0 px-2 overflow-auto">
						<MarkdownPreview />
					</div>
				</div>
			</div>
		</FormProvider>
	);
}
