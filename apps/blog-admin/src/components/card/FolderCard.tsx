import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@ui/components/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@ui/components/dialog";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@ui/components/popover";
import { useSnackbar } from "notistack";
import type React from "react";
import { type MouseEvent, useId, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DotsVerticalIcon, FileIcon } from "ui-icon";
import { useChanooMutation } from "../../libs/queryHook";
import type { GlobalError } from "../../types/global";
import type { FolderRes } from "../../types/res";
import { FolderMutateModal } from "../modal/FolderMutateModal";

interface FolderCardProps {
	folder: FolderRes;
}

export function FolderCard({ folder }: FolderCardProps) {
	const navigate = useNavigate();
	const client = useQueryClient();
	const { enqueueSnackbar } = useSnackbar();
	const [isOpenEditModal, setIsOpenEditModal] = useState(false);
	const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
	const [showAskAlert, setShowAskAlert] = useState(false);

	const folderEditId = useId();

	const fileCount =
		// eslint-disable-next-line no-underscore-dangle
		(folder?._count?.folderImage || 0) +
		(folder?.folderImage?.length || 0) +
		(folder?.child?.length || 0);

	const { mutate: deleteFolder, isPending: isDeleteFolderLoading } =
		useChanooMutation<unknown, GlobalError, unknown>(
			["DELETE", `/folders/${folder.id}`, undefined],
			{
				onSuccess() {
					enqueueSnackbar("폴더가 삭제되었습니다.", { variant: "success" });
					setAnchorEl(null);
					client.invalidateQueries({
						queryKey: [
							folder.parentId ? `folders/${folder.parentId}` : `folders/root`,
						],
					});
				},
			},
		);

	const clickFolderCardHandler = (folderId: number) => {
		navigate(`/folder/${folderId}`);
	};

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		setAnchorEl(event.currentTarget);
	};

	const handleClose = (event: MouseEvent<HTMLDivElement>) => {
		event.preventDefault();
		setAnchorEl(null);
	};

	const deleteButtonClickHandler = (event: MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		if (isDeleteFolderLoading) return;
		deleteFolder({});
	};

	const editButtonClickHandler = (event: MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		setAnchorEl(null);
		setIsOpenEditModal(true);
	};

	return (
		<>
			<button
				type="button"
				className="border border-primary rounded-xl p-1 cursor-pointer transition-all hover:border-primary"
				onClick={(e) => {
					if (e.defaultPrevented) return;
					e.preventDefault();
					clickFolderCardHandler(folder.id);
				}}
			>
				<div className="flex flex-col h-full w-full">
					<div className="flex items-center gap-1 h-full w-full">
						<div className="flex items-center justify-center h-full w-full">
							<FileIcon color="primary" fontSize="large" />
						</div>
						<div className="flex items-center justify-center h-full w-full">
							<span>{folder.name}</span>
						</div>
					</div>
				</div>
				<Popover>
					<PopoverTrigger>
						<Button
							aria-describedby={folderEditId}
							className="absolute right-10 top-10"
							size="icon"
						>
							<DotsVerticalIcon />
						</Button>
					</PopoverTrigger>
					<PopoverContent>
						<div className="w-20">
							<div className="flex flex-col gap-2">
								<Button onClick={editButtonClickHandler}>수정</Button>
								<Button
									onClick={
										fileCount
											? (e) => {
													e.preventDefault();
													setShowAskAlert(true);
												}
											: deleteButtonClickHandler
									}
								>
									삭제
								</Button>
							</div>
						</div>
					</PopoverContent>
				</Popover>
			</button>
			<FolderMutateModal
				folder={folder}
				open={isOpenEditModal}
				parentId={folder.parentId}
				onClose={() => setIsOpenEditModal(false)}
			/>
			<Dialog open={showAskAlert}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>안내</DialogTitle>
						<DialogDescription>
							{`${fileCount} 개의 파일이 존재합니다. 삭제하시겠습니까?`}
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<DialogClose asChild>
							<Button onClick={() => setShowAskAlert(false)}>Disagree</Button>
						</DialogClose>
						<DialogClose>
							<Button autoFocus onClick={deleteButtonClickHandler}>
								Agree
							</Button>
						</DialogClose>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
