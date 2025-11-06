import { useParams } from "react-router-dom";
import { Card, Grid2, Stack } from "ui";
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
		<Stack direction="column" p={4} width="100%">
			<Grid2
				columns={{ xs: 2, sm: 8, md: 12, lg: 16, xl: 15 }}
				container
				spacing={{ xs: 2, md: 3 }}
			>
				<Grid2 size={{ md: 4, sm: 4, xl: 3, xs: 2 }}>
					<Card sx={{ height: 200 }}>
						<Stack
							alignItems="center"
							height="100%"
							justifyContent="center"
							p={2}
							spacing={2}
							width="100%"
						>
							<FolderAddButton />
							{params.id && <ImageAddButton />}
						</Stack>
					</Card>
				</Grid2>
				{rootFolder &&
					!params.id &&
					rootFolder?.data?.data?.map((rootFolderData) => (
						<Grid2
							key={rootFolderData.id}
							size={{ md: 4, sm: 4, xl: 3, xs: 2 }}
						>
							<FolderCard folder={rootFolderData} />
						</Grid2>
					))}

				{detailFolder?.data?.data?.child?.map((childFolder) => (
					<Grid2 key={childFolder.id} size={{ md: 4, sm: 4, xl: 3, xs: 2 }}>
						<FolderCard folder={childFolder} />
					</Grid2>
				))}
				{detailFolder?.data?.data?.folderImage?.map((image) => {
					return (
						<Grid2 key={image.id} size={{ md: 4, sm: 4, xl: 3, xs: 2 }}>
							<ImageCard image={image} />
						</Grid2>
					);
				})}
			</Grid2>
		</Stack>
	);
}
