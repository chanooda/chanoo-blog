import { Button } from "@ui/components/button";
import { Markdown } from "markdown";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { Write } from "utils";
import { useChanooQuery } from "@/src/base/libs/queryHook";
import { WriteDeleteModal } from "@/src/base/ui/modal/WriteDeleteModal";

export function WriteDetail() {
	const { id } = useParams();
	const [isShowDeleteModal, setIsShowDeleteModal] = useState(false);
	const { data: write } = useChanooQuery<Write>([`/write/${id}`], {
		enabled: !!id,
	});

	const clickDeleteHandler = () => {
		setIsShowDeleteModal(true);
	};

	return (
		<div className="max-w-3xl mx-auto w-full">
			<div className="flex flex-row gap-1 justify-end mt-4 mx-auto px-2 w-full">
				<Button variant="default" asChild>
					<Link to={`/writes/${id}/edit`}>수정</Link>
				</Button>
				<Button
					variant="outline"
					onClick={clickDeleteHandler}
					className="text-red-500 hover:text-red-600"
				>
					삭제
				</Button>
			</div>
			{write && <Markdown write={write.data.data} />}
			{id && isShowDeleteModal && (
				<WriteDeleteModal
					id={id}
					open={isShowDeleteModal}
					title={write?.data.data.title || ""}
					onOpenChange={() => setIsShowDeleteModal(false)}
				/>
			)}
		</div>
	);
}
