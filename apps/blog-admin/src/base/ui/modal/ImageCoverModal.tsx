import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@ui/components/dialog";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ModalProps } from "@/src/types/ui";
import type { FolderImage } from "../../../types/res";

interface ImageCoverModalProps extends Omit<ModalProps, "children"> {
	image?: FolderImage;
}

export function ImageCoverModal({
	open,
	onOpenChange,
	image,
}: ImageCoverModalProps) {
	const imageRef = useRef<HTMLImageElement>(null);
	const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

	// 이미지 크기 계산 함수
	const calculateImageSize = useCallback(() => {
		if (window.innerWidth <= 500) {
			setImageSize({
				height: window.innerHeight - 100,
				width: window.innerWidth - 100,
			});
		} else {
			setImageSize({
				height: window.innerHeight - 100,
				width: window.innerWidth - 100,
			});
		}
	}, []);

	// 모달이 열릴 때 초기 크기 설정
	useEffect(() => {
		if (open) {
			calculateImageSize();
		}
	}, [open, calculateImageSize]);

	// resize 이벤트 리스너 등록 (모달이 열려있을 때만)
	useEffect(() => {
		if (!open) return;

		const windowResizeHandler = () => {
			calculateImageSize();
		};

		window.addEventListener("resize", windowResizeHandler);
		return () => {
			window.removeEventListener("resize", windowResizeHandler);
		};
	}, [open, calculateImageSize]);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className=" w-max h-max max-w-max max-h-max sm:max-w-max">
				<DialogHeader>
					<DialogTitle>{image?.originalname}</DialogTitle>
				</DialogHeader>
				<img
					ref={imageRef}
					alt={image?.originalname}
					style={{
						maxWidth: imageSize.width !== 0 ? imageSize.width : "auto",
						maxHeight: imageSize.height !== 0 ? imageSize.height : "auto",
					}}
					src={image?.url}
				/>
			</DialogContent>
		</Dialog>
	);
}
