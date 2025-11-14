import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@ui/components/button";
import { Dialog, DialogContent } from "@ui/components/dialog";
import { Input } from "@ui/components/input";
import { useSnackbar } from "notistack";
import { type FormEvent, useState } from "react";
import type { ModalProps } from "@/src/types/ui";
import type { GlobalError } from "../../../types/global";
import type { AddFolder, EditFolder } from "../../../types/req";
import type { FolderRes } from "../../../types/res";
import { useChanooMutation } from "../../libs/queryHook";

interface FolderAddModalProps extends Omit<ModalProps, "children"> {
	folder?: FolderRes;
	parentId?: FolderRes["parentId"];
}

export const FolderMutateModal = ({
	open,
	onOpenChange,
	parentId,
	folder,
}: FolderAddModalProps) => {
	const [folderName, setFolderName] = useState("");
	const { enqueueSnackbar } = useSnackbar();
	const client = useQueryClient();

	const { mutate: addFolder, isPending: isAddFolderLoading } =
		useChanooMutation<undefined, GlobalError, AddFolder>(
			["POST", "/folders", (data) => ({ ...data })],
			{
				onSuccess() {
					enqueueSnackbar("폴더 생성 성공!", { variant: "success" });
					setFolderName("");
					client.invalidateQueries({
						queryKey: parentId ? [`folders/${parentId}`] : [`folders/root`],
					});

					onOpenChange?.(false);
				},
			},
		);

	const { mutate: editFolder, isPending: isEditFolderLoading } =
		useChanooMutation<undefined, unknown, EditFolder>(
			["PATCH", `/folders/${folder?.id}`, (data) => ({ ...data })],
			{
				onSuccess() {
					enqueueSnackbar("폴더 수정 성공!", { variant: "success" });
					setFolderName("");
					client.invalidateQueries({
						queryKey: parentId ? [`folders/${parentId}`] : [`folders/root`],
					});
					onOpenChange?.(false);
				},
			},
		);

	const folderAddSubmitHandler = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (!folderName || isAddFolderLoading || isEditFolderLoading) return;

		if (folder) {
			editFolder({
				name: folderName,
			});
		} else {
			addFolder({
				name: folderName,
				parentId: parentId ? Number(parentId) : null,
			});
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<form className="flex flex-col gap-2" onSubmit={folderAddSubmitHandler}>
					<Input
						placeholder="폴더 이름"
						value={folderName}
						onChange={(e) => setFolderName(e.target.value)}
					/>
					<Button type="submit">
						{folder ? "폴더 수정하기" : "폴더추가하기"}
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
};
