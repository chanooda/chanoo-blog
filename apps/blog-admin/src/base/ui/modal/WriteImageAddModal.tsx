import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@ui/components/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@ui/components/dialog";
import { Input } from "@ui/components/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@ui/components/select";
import { Spinner } from "@ui/components/spinner";
import { Tabs, TabsList, TabsTrigger } from "@ui/components/tabs";
import { type ChangeEvent, useCallback, useRef, useState } from "react";
import { debounce } from "utils";
import type { ModalProps } from "@/src/types/ui";
import type { GlobalError, ImageFile } from "../../../types/global";
import type { FolderImage, FolderRes } from "../../../types/res";
import { useChanooMutation, useChanooQuery } from "../../libs/queryHook";
import { FileUploadButton } from "../button/FileUploadButton";

export interface WriteImageAddModalProps extends ModalProps {
	onChooseImage: (url: string) => void;
}

export const WriteImageAddModal = ({
	onChooseImage,
	onOpenChange,
	open,
}: WriteImageAddModalProps) => {
	const embedImageRef = useRef<HTMLImageElement>(null);
	const client = useQueryClient();
	const [tabValue, setTabValue] = useState("upload");
	const [imageList, setImageList] = useState<ImageFile[]>([]);
	const [embed, setEmbed] = useState("");
	const [embedUrl, setEmbedUrl] = useState("");
	const [uploadFolderId, setUploadFolderId] = useState("0");
	const [folderId, setFolderId] = useState<string | undefined>(undefined);

	const { data: folders } = useChanooQuery<FolderRes[], GlobalError>([
		"folders",
	]);
	const { data: folderDetail, isLoading } = useChanooQuery<
		FolderRes,
		GlobalError
	>([`folders/${folderId}`], { enabled: !!folderId });
	const { mutate, isPending: addImageLoading } = useChanooMutation<
		FolderImage,
		GlobalError,
		FormData
	>(["POST", `/folders/${uploadFolderId}/image`, (data) => data]);

	const folderImageList = folderDetail?.data?.data?.folderImage || [];

	// 탭 이동
	const dataClear = () => {
		setImageList([]);
		setEmbed("");
		setEmbedUrl("");
		setUploadFolderId("0");
		client.cancelQueries({ queryKey: [`folders/${folderId}`] });
	};
	const changeTabHandler = (newValue: string) => {
		dataClear();
		setTabValue(newValue);
	};

	// 이미지 업로드 버튼
	const clickUploadButtonHandler = () => {
		if (tabValue === "embed" && embedUrl) {
			onChooseImage(embedUrl);
		}
		if (tabValue === "upload") {
			if (imageList?.length < 1 || addImageLoading || !uploadFolderId) return;
			const formData = new FormData();
			formData.append("image", imageList[0].file);
			mutate(formData, {
				onSuccess(data) {
					onChooseImage(data.data.data.url);
				},
			});
		}
	};

	// 업로드 이미지
	const getImageList = (imageFiles: ImageFile[]) => {
		setImageList(imageFiles);
	};

	const uploadFolderSelectChangeHandler = (value: string) => {
		setUploadFolderId(value);
	};

	// embed
	const changeUrlHandler = (url: string) => {
		setEmbedUrl(url);
	};

	const debouncedChangeEmbedInputHandler = useCallback(
		debounce(changeUrlHandler, 500),
		[],
	);

	const changeEmbedInputHandler = (e: ChangeEvent<HTMLInputElement>) => {
		setEmbed(e.target.value);
		debouncedChangeEmbedInputHandler(e.target.value);
	};

	// file
	const folderSelectChangeHandler = (value: string) => {
		setFolderId(value);
	};

	const insertImage = (url: string) => {
		onChooseImage(url);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="w-[calc(100% - 24px)] max-w-600">
				<DialogHeader>
					<DialogTitle>이미지 추가</DialogTitle>
				</DialogHeader>
				<div className="w-full">
					<Tabs
						value={tabValue}
						onValueChange={changeTabHandler}
						className="w-full mt-4"
					>
						<TabsList className="w-full">
							<TabsTrigger value="upload">upload</TabsTrigger>
							<TabsTrigger value="embed">embed</TabsTrigger>
							<TabsTrigger value="file">file</TabsTrigger>
						</TabsList>
					</Tabs>
					<div className="mt-4 w-full flex flex-col gap-2">
						{tabValue === "upload" && (
							<div className="flex gap-4 w-full flex-col">
								<FileUploadButton
									className="w-full"
									getImageList={getImageList}
								/>

								{imageList?.map((image) => (
									<div className="h-80 w-full" key={image.url}>
										<img
											alt={image.url}
											className="object-contain h-full w-full"
											src={image.url}
										/>
									</div>
								))}
							</div>
						)}
						{tabValue === "embed" && (
							<div className="flex flex-col gap-2 w-full">
								<Input
									placeholder="이미지 링크를 입력해주세요."
									type="text"
									value={embed}
									onChange={changeEmbedInputHandler}
								/>
								{embedUrl && (
									<div className="h-80 w-full" key={embed}>
										<img
											className="object-contain h-full w-full"
											alt={embedUrl}
											ref={embedImageRef}
											src={embedUrl}
										/>
									</div>
								)}
							</div>
						)}
						{tabValue === "file" && (
							<div className="flex flex-col gap-2 w-full">
								<Select
									value={folderId}
									onValueChange={folderSelectChangeHandler}
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Select a folder" />
									</SelectTrigger>
									<SelectContent>
										{folders?.data?.data?.map((folder) => (
											<SelectItem key={folder.id} value={String(folder.id)}>
												{folder.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<div className="flex items-center justify-center overflow-auto">
									{folderImageList?.length > 0 && (
										<div className="grid grid-cols-3 gap-4">
											{folderImageList?.map((img) => (
												<button
													type="button"
													key={img.id}
													className="cursor-pointer"
													onClick={() => insertImage(img.url)}
												>
													<img alt={img.originalname} src={img.url} />
												</button>
											))}
										</div>
									)}
									{folderId && isLoading && <Spinner />}
								</div>
							</div>
						)}
					</div>
					<div className="flex flex-col gap-4 mt-4 w-full">
						{tabValue === "upload" && (
							<Select
								value={uploadFolderId}
								onValueChange={uploadFolderSelectChangeHandler}
							>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Select a folder" />
								</SelectTrigger>
								<SelectContent>
									{folders?.data?.data?.map((folder) => (
										<SelectItem key={folder.id} value={String(folder.id)}>
											{folder.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						)}
						{tabValue !== "file" && (
							<Button className="w-full" onClick={clickUploadButtonHandler}>
								업로드
							</Button>
						)}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};
