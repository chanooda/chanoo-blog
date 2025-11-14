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
import type { GlobalError } from "../../../types/global";
import type { FolderRes } from "../../../types/res";
import { useChanooMutation } from "../../libs/queryHook";
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
			<Card
				className="flex flex-col w-full min-h-40 flex-1 border rounded-xl p-4 gap-2"
				onClick={(e) => {
					if (e.defaultPrevented) return;
					clickFolderCardHandler(folder.id);
				}}
			>
				<CardContent className="p-0 w-full h-full min-h-0 flex-1 flex flex-col items-center justify-center">
					<FileIcon className="size-10 text-primary" />
				</CardContent>
				<CardHeader className="flex items-center justify-between gap-2 p-0">
					<CardTitle>{folder.name}</CardTitle>
					<Popover>
						<PopoverTrigger asChild>
							<Button
								onClick={(e) => {
									e.stopPropagation();
								}}
								aria-describedby={folderEditId}
								size="icon"
								variant="ghost"
							>
								<DotsVerticalIcon />
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-max p-2">
							<div className="flex flex-col w-max gap-2">
								<Button variant="ghost" onMouseDown={editButtonClickHandler}>
									수정
								</Button>
								<Button
									variant="ghost"
									onMouseDown={
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
						</PopoverContent>
					</Popover>
				</CardHeader>
			</Card>
			<FolderMutateModal
				folder={folder}
				open={isOpenEditModal}
				parentId={folder.parentId}
				onOpenChange={() => setIsOpenEditModal(false)}
			/>
			<Dialog open={showAskAlert} onOpenChange={setShowAskAlert}>
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
