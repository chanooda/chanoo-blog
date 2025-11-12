import { Button } from "@ui/components/button";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { ImageAddModal } from "../modal/ImageAddModal";

export function ImageAddButton() {
	const param = useParams();
	const [isShowImageAddModal, setIsShowImageAddModal] = useState(false);

	return (
		<>
			<Button
				size="lg"
				variant="outline"
				onClick={() => setIsShowImageAddModal(true)}
			>
				이미지 추가
			</Button>
			<ImageAddModal
				folderId={Number(param.id)}
				open={isShowImageAddModal}
				onClose={() => setIsShowImageAddModal(false)}
			/>
		</>
	);
}
