import { Button } from "@ui/components/button";
import { Dialog, DialogContent } from "@ui/components/dialog";
import { Input } from "@ui/components/input";
import { type ChangeEvent, useState } from "react";
import type { ModalProps } from "@/src/types/ui";

interface WriteEmbedAddModalProps extends Omit<ModalProps, "children"> {
	getEmbedUrl: (url: string) => void;
}

export function WriteEmbedAddModal({
	getEmbedUrl,
	onClose,
	open,
}: WriteEmbedAddModalProps) {
	const [embedUrl, setEmbedUrl] = useState("");

	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		setEmbedUrl(e.target.value);
	};

	const submitHandler = () => {
		if (embedUrl) getEmbedUrl(embedUrl);
	};

	return (
		<Dialog open={open} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="w-[calc(100%-40px)] max-w-500">
				<Input
					placeholder="url을 입력해주세요."
					type="text"
					onChange={onChange}
				/>
				<Button className="mt-2 w-full" onClick={submitHandler}>
					확인
				</Button>
			</DialogContent>
		</Dialog>
	);
}
