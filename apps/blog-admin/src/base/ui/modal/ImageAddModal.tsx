import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@ui/components/button";
import { Dialog, DialogContent } from "@ui/components/dialog";
import { Spinner } from "@ui/components/spinner";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { TrashIcon } from "ui-icon";
import type { ModalProps } from "@/src/types/ui";
import type { GlobalError, ImageFile } from "../../../types/global";
import { useChanooMutation } from "../../libs/queryHook";
import { FileUploadButton } from "../button/FileUploadButton";

export interface ImageAddModalProps extends Omit<ModalProps, "children"> {
	folderId: number;
}

export const ImageAddModal = ({
	folderId,
	open,
	onOpenChange,
}: ImageAddModalProps) => {
	const client = useQueryClient();
	const { enqueueSnackbar } = useSnackbar();
	const [imageList, setImageList] = useState<ImageFile[]>([]);

	const { mutateAsync, isPending: isLoading } = useChanooMutation<
		unknown,
		GlobalError,
		FormData
	>(["POST", `/folders/${folderId}/image`, (data) => data]);

	const getImageList = (imageFiles: ImageFile[]) => {
		setImageList(imageFiles);
	};

	const imageClear = (_index: number) => {
		setImageList((prev) => prev.filter((_, index) => index !== _index));
	};

	const imageListAllClear = () => {
		setImageList([]);
	};

	const imagesUploadHandler = async () => {
		if (isLoading || imageList?.length === 0) return;
		try {
			await Promise.all(
				imageList.map((image) => {
					const formData = new FormData();
					formData.append("image", image.file);
					return mutateAsync(formData);
				}),
			);
			enqueueSnackbar("이미지 업로드 성공!", { variant: "success" });
			client.invalidateQueries({
				queryKey: [`folders/${folderId}`],
			});
			onOpenChange(false);
		} catch (error) {
			enqueueSnackbar("이미지 업로드 실패. 잠시 후 시도해 주세요.", {
				variant: "error",
			});
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="w-[calc(100%-50px)] max-w-800">
				<div className="w-full flex">
					<div className="items-center flex justify-between w-full">
						<FileUploadButton getImageList={getImageList} multiple />
						{imageList.length > 0 && (
							<Button className="text-red-500" onClick={imageListAllClear}>
								모두 지우기 <TrashIcon />
							</Button>
						)}
					</div>
					<div className="bg-gray-100 border-2 border-primary rounded-2xl h-500 mt-2 overflow-auto relative px-2 w-full">
						<div className="grid grid-cols-2 gap-8">
							{imageList?.map((image, index) => (
								<div
									key={index}
									className="relative hover:[&>button]:opacity-100"
								>
									<img
										alt={image.url}
										loading="lazy"
										src={image.url}
										className="w-full"
									/>
									<Button
										className="absolute top-10 right-10 opacity-0 transition-all text-red-500"
										onClick={() => imageClear(index)}
									>
										<TrashIcon />
									</Button>
								</div>
							))}
						</div>
						{isLoading && (
							<Spinner className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
						)}
					</div>
					<div className="items-center mt-2 w-full flex ">
						<Button className="max-w-100 w-full" onClick={imagesUploadHandler}>
							확인
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};
