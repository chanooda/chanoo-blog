import { Card, Stack, Grid2, Button, Typography, CardActionArea, CardMedia, CardContent } from 'ui';
import { AddPhotoAlternate, CreateNewFolder } from 'ui-icon';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useChanooQuery } from '../libs/queryHook';
import { Folder } from '../types/folder';
import { FolderCard } from '../components/card/FolderCard';
import { FolderMutateModal } from '../components/modal/FolderMutateModal';
import { ImageCoverModal } from '../components/modal/ImageCoverModal';
import { Image } from '../types/image';

// TODO 이미지는 오른쪽 클릭시에 설정 팝업이 뜨게 하기

export function FolderPage() {
  const params = useParams();
  const { data: rootFolder } = useChanooQuery<Folder[]>(['folders'], {
    enabled: !params.id
  });
  const { data: detailFolder } = useChanooQuery<Folder>([`folders/${params.id}`], {
    enabled: !!params.id
  });
  const [isFolderAddModalOpen, setIsFolderAddModalOpen] = useState(false);
  const [chooseImage, setChooseImage] = useState<Image | undefined>(undefined);

  return (
    <Stack direction="column" width="100%">
      <Grid2
        columns={{ xs: 2, sm: 8, md: 12, lg: 16, xl: 15 }}
        container
        spacing={{ xs: 2, md: 3 }}
      >
        <Grid2 md={4} sm={4} xl={3} xs={2}>
          <Card sx={{ height: '100%', minHeight: 180 }}>
            <Stack
              alignItems="center"
              height="100%"
              justifyContent="center"
              p={2}
              spacing={2}
              width="100%"
            >
              <Button
                fullWidth
                size="large"
                startIcon={<CreateNewFolder />}
                variant="outlined"
                onClick={() => setIsFolderAddModalOpen(true)}
              >
                폴더추가
              </Button>
              {params.id && (
                <Button
                  fullWidth
                  size="large"
                  startIcon={<AddPhotoAlternate />}
                  variant="contained"
                >
                  이미지 추가
                </Button>
              )}
            </Stack>
          </Card>
        </Grid2>
        {rootFolder &&
          !params.id &&
          rootFolder?.data?.data?.map((rootFolderData) => (
            <Grid2 key={rootFolderData.id} md={4} sm={4} xl={3} xs={2}>
              <FolderCard folder={rootFolderData} />
            </Grid2>
          ))}
        {detailFolder &&
          detailFolder?.data?.data?.child?.map((childFolder) => (
            <Grid2 key={childFolder.id} md={4} sm={4} xl={3} xs={2}>
              <FolderCard folder={childFolder} />
            </Grid2>
          ))}
        {detailFolder &&
          detailFolder?.data?.data?.folderImage?.map((image) => {
            return (
              <Grid2 key={image.id} md={4} sm={4} xl={3} xs={2}>
                <Card sx={{ minHeight: 180 }} onClick={() => setChooseImage(image)}>
                  <CardActionArea>
                    <CardMedia
                      alt={image.originalname}
                      component="img"
                      height="80%"
                      src={image.url}
                    />
                    <CardContent sx={{ p: 1 }}>
                      <Typography component="div" gutterBottom variant="body2">
                        {image.originalname}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid2>
            );
          })}
      </Grid2>
      <FolderMutateModal
        open={isFolderAddModalOpen}
        parentId={Number(params.id)}
        onClose={() => setIsFolderAddModalOpen(false)}
      />
      <ImageCoverModal
        image={chooseImage}
        open={!!chooseImage}
        onClose={() => setChooseImage(undefined)}
      />
    </Stack>
  );
}
