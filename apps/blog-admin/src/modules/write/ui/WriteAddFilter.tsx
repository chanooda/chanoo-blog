import { Button } from "@ui/components/button";
import { Input } from "@ui/components/input";
import { MultiSelectInput } from "@ui/components/MultiSelectInput";
import { Switch } from "@ui/components/switch";
import { cn } from "@ui/lib/utils";
import { enqueueSnackbar } from "notistack";
import { useEffect, useId, useMemo, useState } from "react";
import {
	Controller,
	type FieldErrors,
	type GlobalError,
	useFormContext,
} from "react-hook-form";
import { useNavigate } from "react-router-dom";
import type { IdRes, Series, Tag, Write } from "utils";
import { useChanooMutation, useChanooQuery } from "@/src/base/libs/queryHook";
import { WriteImageAddModal } from "@/src/base/ui/modal/WriteImageAddModal";
import {
	useMarkdownValue,
	useSetMarkdownValue,
} from "@/src/modules/write/libs/markdownStore";
import type { WritingForm } from "@/src/types/form";

export const WriteAddFilter = ({ id }: { id?: string }) => {
	const navigate = useNavigate();
	const [hideInfo, setHideInfo] = useState(false);
	const [showImageAddModal, setShowImageAddModal] = useState(false);

	const isPublishId = useId();
	const seriesId = useId();

	const value = useMarkdownValue();
	const setMarkdownValue = useSetMarkdownValue();

	const { control, register, handleSubmit, setValue } =
		useFormContext<WritingForm>();

	const { data: write } = useChanooQuery<Write, GlobalError>([`/write/${id}`], {
		enabled: !!id,
		throwOnError: true,
	});
	const { data: seriesList } = useChanooQuery<Series[], GlobalError>([
		"/series",
	]);
	const { data: tagList } = useChanooQuery<Tag[], GlobalError>(["/tag"]);
	const { mutate: createWrite, isPending: createWriteLoading } =
		useChanooMutation<IdRes, GlobalError, FormData>([
			"POST",
			"/write",
			(data) => data,
		]);
	const { mutate: updateWrite, isPending: updateWriteLoading } =
		useChanooMutation<
			IdRes,
			GlobalError,
			{ formData: FormData; writeId: string }
		>([
			"PATCH",
			({ writeId }) => `/write/${writeId}`,
			({ formData }) => formData,
		]);

	const initialTagList = useMemo(
		() => [...(write?.data?.data?.tags?.map((tag) => tag.name) || [])],
		[write?.data?.data],
	);

	const updateWriteSuccessHandler = (isWriteButton?: boolean) => {
		enqueueSnackbar({
			message: "임시 저장 완료!",
			variant: "success",
		});
		if (isWriteButton) {
			navigate(`/writes/${id}`);
		}
	};

	const formErrorHandler = (error: FieldErrors<WritingForm>) => {
		Object.values(error || {}).forEach((err) => {
			if (err?.message) {
				enqueueSnackbar({
					message: err.message,
					variant: "error",
				});
			}
		});
	};

	const updateWriteSubmitHandler = handleSubmit(
		(formData) => {
			if (!id || updateWriteLoading) return;
			const writeFormData = getWriteFormData(formData);
			if (!writeFormData) return;
			updateWrite(
				{ formData: writeFormData, writeId: id },
				{
					onSuccess() {
						updateWriteSuccessHandler(true);
					},
				},
			);
		},
		(error) => {
			formErrorHandler(error);
		},
	);

	const getWriteFormData = (formData: WritingForm) => {
		const { mainImage, series, tag, title, isPublish } = formData;

		if (!value) {
			enqueueSnackbar({
				message: "본문을 입력해주세요.",
				variant: "error",
			});
			return false;
		}

		const writeFormData = new FormData();
		writeFormData.append("title", title);
		writeFormData.append("content", value);
		writeFormData.append("imgUrl", mainImage || "");
		writeFormData.append("seriesName", series);
		writeFormData.append("isPublish", JSON.stringify(isPublish));
		writeFormData.append("tagNames", JSON.stringify(tag));

		return writeFormData;
	};

	const writeSubmitHandler = handleSubmit(
		(formData) => {
			if (createWriteLoading) return;
			const writeFormData = getWriteFormData(formData);
			if (!writeFormData) return;
			createWrite(writeFormData, {
				onSuccess(data) {
					enqueueSnackbar({
						message: "글쓰기 완료",
						variant: "success",
					});
					const writeId = data?.data?.data?.id;
					navigate(`/writes/${writeId}`);
				},
			});
		},
		(error) => {
			formErrorHandler(error);
		},
	);

	const clickWriteButtonHandler = () => {
		if (id) {
			updateWriteSubmitHandler();
		} else {
			writeSubmitHandler();
		}
	};

	useEffect(() => {
		if (write) {
			setValue("title", write.data.data.title);
			setValue("series", write.data.data.series.name);
			setValue(
				"tag",
				write.data.data.tags.map((tag) => tag.name),
			);
			setValue("mainImage", write.data.data.imgUrl || "");
			setValue("isPublish", write.data.data.isPublish);
			setMarkdownValue(write.data.data.content || "");
		}
	}, [write, setValue, setMarkdownValue]);

	return (
		<div className="flex flex-col">
			<div className="flex flex-row items-center justify-between px-2 py-2 w-full">
				<div className="flex gap-2 items-center">
					<Controller
						control={control}
						name="isPublish"
						render={({ field: { name, onChange, ref, value } }) => (
							<Switch
								checked={value}
								id={isPublishId}
								name={name}
								ref={ref}
								onCheckedChange={onChange}
							/>
						)}
					/>
					{/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
					<label htmlFor={isPublishId}>공개 여부</label>
				</div>
				<div className="flex gap-2 ml-auto">
					<Button
						type="button"
						color="secondary"
						variant="link"
						onClick={() => setHideInfo(!hideInfo)}
					>
						{hideInfo ? "펼치기" : "접기"}
					</Button>
				</div>
			</div>

			<div
				className={cn(
					"overflow-auto flex flex-col h-42",
					hideInfo ? "h-0" : "h-42",
				)}
			>
				<div className="flex flex-col gap-4 p-2">
					<Input
						placeholder="제목을 입력해주세요."
						type="text"
						{...register("title", {
							required: "제목을 입력해주세요.",
						})}
					/>
					<MultiSelectInput
						initialValue={initialTagList}
						placeholder="태그"
						selectOptionList={tagList?.data?.data?.map((tag) => ({
							label: tag.name,
							value: tag.name,
						}))}
						{...register("tag")}
					/>

					<div className="flex gap-2 w-full">
						<div className="w-1/2">
							<Input
								autoComplete="off"
								list={seriesId}
								{...register("series")}
								placeholder="시리즈"
							/>
							<datalist autoSave="false" id={seriesId}>
								{seriesList?.data?.data?.map((series) => (
									<option key={series.id} value={series.name}>
										{series.name}
									</option>
								))}
							</datalist>
						</div>
						<Button
							variant="outline"
							type="button"
							className="w-1/2"
							onClick={() => setShowImageAddModal(true)}
						>
							메인 이미지 추가
						</Button>
					</div>
				</div>
			</div>

			<div className="w-full flex justify-center px-2 pb-2">
				<Button className="w-full" onClick={clickWriteButtonHandler}>
					{id ? "수정하기" : "글쓰기"}
				</Button>
			</div>

			<WriteImageAddModal
				open={showImageAddModal}
				onOpenChange={setShowImageAddModal}
				onChooseImage={(url: string) => {
					setValue("mainImage", url);
					setShowImageAddModal(false);
				}}
			/>
		</div>
	);
};
