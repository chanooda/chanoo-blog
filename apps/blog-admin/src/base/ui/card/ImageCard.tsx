import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/components/card";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@ui/components/dialog";
import { useSnackbar } from "notistack";
import { type MouseEvent, useState } from "react";
import { TrashIcon } from "ui-icon";
import type { GlobalError } from "../../../types/global";
import type { FolderImage } from "../../../types/res";
import { useChanooMutation } from "../../libs/queryHook";
import { ImageCoverModal } from "../modal/ImageCoverModal";

interface ImageCardProps {
	image: FolderImage;
}

export function ImageCard({ image }: ImageCardProps) {
	const client = useQueryClient();
	const { enqueueSnackbar } = useSnackbar();
	const [isShowImageCoverModal, setIsShowImageCoverModal] = useState(false);
	const [showAskAlert, setShowAskAlert] = useState(false);

	const { mutate, isPending: isLoading } = useChanooMutation<
		any,
		GlobalError,
		undefined
	>(["DELETE", `folders/${image.id}/image`, undefined], {
		onSuccess() {
			enqueueSnackbar("이미지 삭제가 완료되었습니다.", {
				variant: "success",
			});
			client.invalidateQueries({
				queryKey: [`folders/${image.folderId}`],
			});
		},
	});

	const clickImageCardHandler = () => {
		setIsShowImageCoverModal(true);
	};

	const deleteButtonClickHandler = (e: MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		setShowAskAlert(true);
	};

	const deleteImage = () => {
		if (isLoading) return;
		mutate(undefined);
	};

	return (
		<>
			<Card
				aria-describedby="image-option"
				className="w-full h-full relative p-4"
				onClick={clickImageCardHandler}
			>
				<CardHeader className="px-0 flex items-center justify-between">
					<CardTitle className="line-clamp-1">{image.originalname}</CardTitle>
					<Button
						variant="outline"
						size="icon"
						className="text-red-400 border-red-400 hover:text-red-500"
						onClick={deleteButtonClickHandler}
					>
						<TrashIcon />
					</Button>
				</CardHeader>
				<CardContent className="px-0">
					<img
						alt={image.originalname}
						className="w-full h-auto aspect-video object-cover rounded-md"
						src={image.url}
					/>
				</CardContent>
			</Card>

			<Dialog open={showAskAlert} onOpenChange={setShowAskAlert}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>안내</DialogTitle>
						<DialogDescription>이미지를 삭제하시겠습니까?</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<DialogClose asChild>
							<Button>Disagree</Button>
						</DialogClose>
						<Button autoFocus onClick={deleteImage}>
							Agree
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<ImageCoverModal
				image={image}
				open={isShowImageCoverModal}
				onOpenChange={setIsShowImageCoverModal}
			/>
		</>
	);
}
