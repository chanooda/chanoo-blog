import { Button } from "@ui/components/button";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { ImageIcon } from "ui-icon";
import { ImageAddModal } from "../modal/ImageAddModal";

export function ImageAddButton() {
	const param = useParams();
	const [isShowImageAddModal, setIsShowImageAddModal] = useState(false);

	return (
		<>
			<Button
				className="w-full py-6"
				variant="outline"
				onClick={() => setIsShowImageAddModal(true)}
			>
				<ImageIcon />
				이미지 추가
			</Button>
			<ImageAddModal
				folderId={Number(param.id)}
				open={isShowImageAddModal}
				onOpenChange={() => setIsShowImageAddModal(false)}
			/>
		</>
	);
}
