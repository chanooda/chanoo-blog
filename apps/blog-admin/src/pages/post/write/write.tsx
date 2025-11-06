import { MarkdownPreview } from "markdown";
import { useEffect, useId, useMemo, useState } from "react";
import { Controller, type FieldErrors, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
	Button,
	Input,
	MultiSelectInput,
	Stack,
	Switch,
	TextField,
	useSnackbar,
} from "ui";
import {
	day,
	type IdRes,
	type Series,
	type Tag,
	type WriteDetail,
} from "utils";
import { MarkdownEditor } from "../../../components/markdown/MarkdownEditor";
import { WriteImageAddModal } from "../../../components/modal/WriteImageAddModal";
import { useChanooMutation, useChanooQuery } from "../../../libs/queryHook";
import type { WritingForm } from "../../../types/form";
import type { GlobalError } from "../../../types/global";

interface WritingProps {
	id?: string;
}

export function Write({ id }: WritingProps) {
	const navigate = useNavigate();
	const [editorValue, setEditorValue] = useState("");
	const [showImageAddModal, setShowImageAddModal] = useState(false);
	const [hideInfo, setHideInfo] = useState(false);
	const { enqueueSnackbar } = useSnackbar();

	const isPublishId = useId();
	const seriesId = useId();

	const { data: write } = useChanooQuery<WriteDetail, GlobalError>(
		[`/write/${id}`],
		{
			enabled: !!id,
			throwOnError: true,
		},
	);

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
		() => [...(write?.data?.data?.tags?.map((tag) => tag.tag.name) || [])],
		[write?.data?.data],
	);

	const { register, watch, setValue, handleSubmit, reset, control } =
		useForm<WritingForm>({
			defaultValues: {
				tag: initialTagList || [],
				title: write?.data?.data?.title || "",
				mainImage: write?.data?.data?.imgUrl || "",
				series: write?.data?.data?.series?.name || "",
				isPublish: write?.data?.data?.isPublish || false,
			},
		});

	const updateWriteSuccessHandler = (isWriteButton?: boolean) => {
		enqueueSnackbar({
			message: "임시 저장 완료!",
			variant: "success",
		});
		if (isWriteButton) {
			navigate(`/post/${id}`);
		}
	};

	const getWriteFormData = (formData: WritingForm) => {
		const { mainImage, series, tag, title, isPublish } = formData;

		if (!editorValue) {
			enqueueSnackbar({
				message: "본문을 입력해주세요.",
				variant: "error",
			});
			return false;
		}

		const writeFormData = new FormData();
		writeFormData.append("title", title);
		writeFormData.append("content", editorValue);
		writeFormData.append("imgUrl", mainImage);
		writeFormData.append("seriesName", series);
		writeFormData.append("isPublish", JSON.stringify(isPublish));
		writeFormData.append("tagNames", JSON.stringify(tag));

		return writeFormData;
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
		reset({
			tag: initialTagList || [],
			title: write?.data?.data?.title || "",
			mainImage: write?.data?.data?.imgUrl || "",
			series: write?.data?.data?.series?.name || "",
			isPublish: write?.data?.data?.isPublish || false,
		});
		setEditorValue(write?.data?.data?.content || "");
	}, [write?.data?.data, initialTagList, reset]);

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
		<>
			<Stack
				className="container light"
				direction="row"
				height="100%"
				width="100%"
				sx={{
					".w-md-editor": {
						width: "100%",
					},
				}}
			>
				<Stack
					borderRight={({ palette }) => `1px solid ${palette.grey[300]}`}
					height="100%"
					width="50%"
				>
					<Stack
						alignItems="center"
						borderBottom={(theme) => `1px solid ${theme.palette.grey[500]}`}
						direction="row"
						justifyContent="space-between"
						px={2}
						py={2}
						width="100%"
					>
						<Stack alignItems="center" direction="row">
							<Controller
								control={control}
								name="isPublish"
								render={({ field: { name, onChange, ref, value } }) => (
									<Switch
										checked={value}
										id={isPublishId}
										name={name}
										ref={ref}
										onChange={onChange}
									/>
								)}
							/>
							{/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
							<label htmlFor={isPublishId}>공개 여부</label>
						</Stack>
						<Stack direction="row" gap={2} ml="auto">
							<Button variant="contained" onClick={clickWriteButtonHandler}>
								{id ? "수정하기" : "글쓰기"}
							</Button>
						</Stack>
					</Stack>
					{!hideInfo && (
						<Stack height={210} minHeight={210} overflow="auto">
							<Stack gap={2} px={2} py={2} width="100%">
								<TextField
									placeholder="제목을 입력해주세요."
									size="small"
									type="text"
									variant="standard"
									{...register("title", {
										required: "제목을 입력해주세요.",
									})}
								/>
								<Input
									autoComplete="off"
									inputProps={{ list: "series" }}
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
								<MultiSelectInput
									initialValue={initialTagList}
									placeholder="태그"
									selectOptionList={tagList?.data?.data?.map((tag) => ({
										label: tag.name,
										value: tag.name,
									}))}
									{...register("tag")}
								/>
								<Stack
									direction="row"
									justifyContent="space-between"
									width="100%"
								>
									<Button
										color="secondary"
										sx={{ maxWidth: 130 }}
										variant="contained"
										onClick={() => setShowImageAddModal(true)}
									>
										메인 이미지 추가
									</Button>
									<Button color="secondary" onClick={() => setHideInfo(true)}>
										접기
									</Button>
								</Stack>
							</Stack>
						</Stack>
					)}
					{hideInfo && (
						<Stack width="100%">
							<Button color="secondary" onClick={() => setHideInfo(false)}>
								펼치기
							</Button>
						</Stack>
					)}
					<Stack height="100%" minHeight={0}>
						<MarkdownEditor
							value={editorValue}
							onChange={(value?: string) => setEditorValue(value || "")}
						/>
					</Stack>
				</Stack>
				<Stack height="100%" width="50%">
					<Stack
						direction="column"
						height="100%"
						overflow="auto"
						px={2}
						sx={{ overflow: "auto" }}
						width="100%"
					>
						<MarkdownPreview
							write={{
								mainImage: watch("mainImage"),
								series: watch("series"),
								tag: watch("tag"),
								title: watch("title"),
								createdAt: write?.data?.data?.createdAt || day().todayFull(),
							}}
						>
							{editorValue}
						</MarkdownPreview>
					</Stack>
				</Stack>
			</Stack>
			<WriteImageAddModal
				open={showImageAddModal}
				onClose={() => setShowImageAddModal(false)}
				onChooseImage={(url: string) => {
					setValue("mainImage", url);
					setShowImageAddModal(false);
				}}
			/>
		</>
	);
}
