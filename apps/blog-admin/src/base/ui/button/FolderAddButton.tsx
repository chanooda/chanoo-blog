import { Button } from "@ui/components/button";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { FilePlusIcon } from "ui-icon";
import { FolderMutateModal } from "../modal/FolderMutateModal";

export function FolderAddButton() {
	const params = useParams();
	const [isFolderAddModalOpen, setIsFolderAddModalOpen] = useState(false);

	return (
		<>
			<Button
				className="w-full py-6"
				variant="outline"
				onClick={() => setIsFolderAddModalOpen(true)}
			>
				<FilePlusIcon /> 폴더추가
			</Button>
			<FolderMutateModal
				open={isFolderAddModalOpen}
				parentId={Number(params.id)}
				onOpenChange={setIsFolderAddModalOpen}
			/>
		</>
	);
}
