import { Button } from "@ui/components/button";
import { Input } from "@ui/components/input";
import { MultiSelectInput } from "@ui/components/MultiSelectInput";
import { Switch } from "@ui/components/switch";
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
import { WriteImageAddModal } from "@/src/components/modal/WriteImageAddModal";
import { useMarkdownValue } from "@/src/libs/markdownStore";
import { useChanooMutation, useChanooQuery } from "@/src/libs/queryHook";
import type { WritingForm } from "@/src/types/form";

export const WriteAddFilter = ({ id }: { id?: string }) => {
	const navigate = useNavigate();
	const [hideInfo, setHideInfo] = useState(false);
	const [showImageAddModal, setShowImageAddModal] = useState(false);

	const isPublishId = useId();
	const seriesId = useId();

	const value = useMarkdownValue();

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
			navigate(`/post/${id}`);
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
		writeFormData.append("imgUrl", mainImage);
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
					navigate(`/post/${writeId}`);
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
			setValue("mainImage", write.data.data.imgUrl);
			setValue("isPublish", write.data.data.isPublish);
		}
	}, [write, setValue]);

	return (
		<div>
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
					<Button onClick={clickWriteButtonHandler}>
						{id ? "수정하기" : "글쓰기"}
					</Button>
				</div>
			</div>
			{!hideInfo && (
				<div className="h-53 min-h-53 overflow-auto flex flex-col ">
					<div className="flex flex-col gap-4 p-2 w-full h-full">
						<Input
							placeholder="제목을 입력해주세요."
							type="text"
							{...register("title", {
								required: "제목을 입력해주세요.",
							})}
						/>
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
						<div className="flex gap-2 w-full">
							<div className="w-1/2">
								<MultiSelectInput
									initialValue={initialTagList}
									placeholder="태그"
									selectOptionList={tagList?.data?.data?.map((tag) => ({
										label: tag.name,
										value: tag.name,
									}))}
									{...register("tag")}
								/>
							</div>
							<Button
								type="button"
								className="w-1/2"
								onClick={() => setShowImageAddModal(true)}
							>
								메인 이미지 추가
							</Button>
						</div>
						<div className="flex justify-center w-full">
							<Button
								type="button"
								variant="link"
								onClick={() => setHideInfo(true)}
							>
								접기
							</Button>
						</div>
					</div>
				</div>
			)}
			{hideInfo && (
				<div className="w-full flex justify-center p-2">
					<Button
						type="button"
						color="secondary"
						variant="link"
						onClick={() => setHideInfo(false)}
					>
						펼치기
					</Button>
				</div>
			)}
			<WriteImageAddModal
				open={showImageAddModal}
				onClose={() => setShowImageAddModal(false)}
				onChooseImage={(url: string) => {
					setValue("mainImage", url);
					setShowImageAddModal(false);
				}}
			/>
		</div>
	);
};
