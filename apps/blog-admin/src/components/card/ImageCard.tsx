import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@ui/components/button";
import { Card, CardContent } from "@ui/components/card";
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
import { useChanooMutation } from "../../libs/queryHook";
import type { GlobalError } from "../../types/global";
import type { FolderImage } from "../../types/res";
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

	const cancelDialog = () => {
		setShowAskAlert(false);
	};

	return (
		<>
			<Card
				aria-describedby="image-option"
				className="w-full h-50 relative "
				onClick={clickImageCardHandler}
			>
				<CardContent className="w-full h-full">
					<img
						alt={image.originalname}
						className="w-full h-4/5"
						src={image.url}
					/>
					<CardContent className="p-2 h-1/5">
						<span className="text-sm text-gray-500 leading-0">
							{image.originalname}
						</span>
					</CardContent>
				</CardContent>
				<Button
					size="icon"
					className="absolute top-10 right-10 opacity-0 transition-all"
					onClick={deleteButtonClickHandler}
				>
					<TrashIcon />
				</Button>
			</Card>

			<Dialog open={showAskAlert}>
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
			{image && (
				<ImageCoverModal
					image={image}
					open={isShowImageCoverModal}
					onClose={() => setIsShowImageCoverModal(false)}
				/>
			)}
		</>
	);
}
