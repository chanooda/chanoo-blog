import { Button } from "@ui/components/button";
import {
	type ChangeEvent,
	type ComponentProps,
	cloneElement,
	type JSX,
	useRef,
} from "react";
import { UploadIcon } from "ui-icon";
import type { ImageFile } from "../../../types/global";

interface FIleUploadButtonProps extends ComponentProps<"input"> {
	buttonCover?: JSX.Element;
	getImageList: (imageFiles: ImageFile[]) => void;
}

export function FileUploadButton({
	getImageList,
	buttonCover,
	...props
}: FIleUploadButtonProps) {
	const imageUploadRef = useRef<HTMLInputElement>(null);

	const clickImageUploadButtonHandler = () => {
		if (!imageUploadRef?.current) return;
		imageUploadRef.current.value = "";
		imageUploadRef.current.click();
	};

	const buttonCoverWithProps = buttonCover
		? cloneElement(buttonCover, {
				onClick: clickImageUploadButtonHandler,
			})
		: null;

	const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
		const { files } = e.target;
		if (!files || files?.length === 0) return;
		const fileList = Array.from(files).map((file) => ({
			file,
			url: URL.createObjectURL(file),
		}));

		getImageList(fileList);
	};

	return (
		<>
			{buttonCoverWithProps || (
				<Button
					className="w-full"
					variant="outline"
					onClick={clickImageUploadButtonHandler}
				>
					이미지 업로드 <UploadIcon />
				</Button>
			)}
			<input
				accept="image/*"
				hidden
				ref={imageUploadRef}
				type="file"
				onChange={changeImageHandler}
				{...props}
			/>
		</>
	);
}
