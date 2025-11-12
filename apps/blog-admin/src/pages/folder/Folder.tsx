import { useParams } from "react-router-dom";
import { FolderAddButton } from "../../components/button/FolderAddButton";
import { ImageAddButton } from "../../components/button/ImageAddButton";
import { FolderCard } from "../../components/card/FolderCard";
import { ImageCard } from "../../components/card/ImageCard";
import { useChanooQuery } from "../../libs/queryHook";
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
			<div className="grid grid-cols-4 gap-4">
				<div className="flex items-center justify-center p-2 w-full">
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
