import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@ui/components/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@ui/components/dialog";
import { Input } from "@ui/components/input";
import { useSnackbar } from "notistack";
import { type ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ModalProps } from "@/src/types/ui";
import type { GlobalError } from "../../../types/global";
import { useChanooMutation } from "../../libs/queryHook";

interface WriteDeleteModalProps extends Omit<ModalProps, "children"> {
	id: string;
	title: string;
}

export function WriteDeleteModal({
	id,
	title,
	onOpenChange,
	open,
}: WriteDeleteModalProps) {
	const navigate = useNavigate();
	const [enteredTitle, setEnteredTitle] = useState("");
	const { enqueueSnackbar } = useSnackbar();

	const { mutate } = useChanooMutation<undefined, GlobalError>(
		["DELETE", `write/${id}`],
		{
			onSuccess() {
				enqueueSnackbar({
					variant: "success",
					message: "삭제되었습니다.",
				});
				navigate("/writes");
			},
		},
	);

	const changeEnteredTitle = (e: ChangeEvent<HTMLInputElement>) => {
		setEnteredTitle(e.target.value);
	};

	const clickDeleteButtonHandler = () => {
		if (title !== enteredTitle) {
			enqueueSnackbar({
				variant: "error",
				message: "제목과 입력이 같지 않습니다.",
			});
			return;
		}
		mutate();
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>정말 글을 삭제하시겠습니까?</DialogTitle>
					<DialogDescription>
						<b>{title}</b> 을 삭제하기 위해서 아래에 <b>글의 제목</b>을
						입력해주세요.
					</DialogDescription>
				</DialogHeader>
				<div className="flex flex-col gap-2 mt-1">
					<Input placeholder="글 제목" onChange={changeEnteredTitle} />
					<Button onClick={clickDeleteButtonHandler}>글 삭제</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
