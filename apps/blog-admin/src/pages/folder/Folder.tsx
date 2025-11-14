import { useParams } from "react-router-dom";
import { useChanooQuery } from "../../base/libs/queryHook";
import { FolderAddButton } from "../../base/ui/button/FolderAddButton";
import { ImageAddButton } from "../../base/ui/button/ImageAddButton";
import { FolderCard } from "../../base/ui/card/FolderCard";
import { ImageCard } from "../../base/ui/card/ImageCard";
import type { FolderRes } from "../../types/res";

// TODO 이미지는 오른쪽 클릭시에 설정 팝업이 뜨게 하기

export function FolderPage() {
	const params = useParams();
	const { data: rootFolder } = useChanooQuery<FolderRes[]>(["folders/root"], {
		enabled: !params.id,
	});
	const { data: detailFolder } = useChanooQuery<FolderRes>(
		[`folders/${params.id}`],
		{
			enabled: !!params.id,
		},
	);

	return (
		<div className="flex flex-col p-4 w-full">
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				<div className="flex flex-col gap-4 items-center justify-center p-2 w-full">
					<FolderAddButton />
					{params.id && <ImageAddButton />}
				</div>

				{rootFolder &&
					!params.id &&
					rootFolder?.data?.data?.map((rootFolderData) => (
						<div key={rootFolderData.id}>
							<FolderCard folder={rootFolderData} />
						</div>
					))}

				{detailFolder?.data?.data?.child?.map((childFolder) => (
					<div key={childFolder.id}>
						<FolderCard folder={childFolder} />
					</div>
				))}
				{detailFolder?.data?.data?.folderImage?.map((image) => {
					return (
						<div key={image.id}>
							<ImageCard image={image} />
						</div>
					);
				})}
			</div>
		</div>
	);
}
