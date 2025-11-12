import { Dialog } from "@ui/components/dialog";
import { useEffect, useRef, useState } from "react";
import type { ModalProps } from "@/src/types/ui";
import type { FolderImage } from "../../types/res";
import { ModalContent } from "./ModalContent";

interface ImageCoverModalProps extends Omit<ModalProps, "children"> {
	image?: FolderImage;
}

export function ImageCoverModal({
	open,
	onClose,
	image,
}: ImageCoverModalProps) {
	const imageRef = useRef<HTMLImageElement>(null);
	const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

	useEffect(() => {
		const imageElement = imageRef?.current;

		if (window.innerWidth <= 500) {
			setImageSize(() => ({
				height: window.innerHeight - 20,
				width: window.innerWidth,
			}));
		} else {
			setImageSize(() => ({
				height: window.innerHeight - 100,
				width: window.innerWidth - 100,
			}));
		}

		const windowResizeHandler = () => {
			if (imageElement) {
				if (window.innerWidth <= 500) {
					setImageSize(() => ({
						height: window.innerHeight - 20,
						width: window.innerWidth,
					}));
				} else {
					setImageSize(() => ({
						height: window.innerHeight - 100,
						width: window.innerWidth - 100,
					}));
				}
			}
		};

		window?.addEventListener("resize", windowResizeHandler);
		return () => window?.removeEventListener("resize", windowResizeHandler);
	}, []);

	return (
		<Dialog open={open}>
			<ModalContent noBackground>
				<img
					ref={imageRef}
					alt={image?.originalname}
					style={{
						maxWidth: imageSize.width !== 0 ? imageSize.width : "auto",
						maxHeight: imageSize.height !== 0 ? imageSize.height : "auto",
					}}
					src={image?.url}
				/>
			</ModalContent>
		</Dialog>
	);
}
