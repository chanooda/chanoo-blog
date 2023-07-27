import { Card, Stack, Grid2, Button } from 'ui';
import { AddPhotoAlternate, CreateNewFolder } from 'ui-icon';
import { useState } from 'react';
import { useChanooQuery } from '../libs/queryHook';
import { Folder } from '../types/folder';
import { FolderCard } from '../components/card/FolderCard';
import { FolderAddModal } from '../components/modal/FolderAddModal';

export function FolderPage() {
  const { data: folders } = useChanooQuery<Folder[]>(['folders']);
  const [isFolderAddModalOpen, setIsFolderAddModalOpen] = useState(false);

  return (
    <Stack direction="column" width="100%">
      <Grid2
        columns={{ xs: 2, sm: 8, md: 12, lg: 16, xl: 15 }}
        container
        spacing={{ xs: 2, md: 3 }}
      >
        <Grid2 md={4} sm={4} xl={3} xs={2}>
          <Card sx={{ height: '100%' }}>
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
              <Button fullWidth size="large" startIcon={<AddPhotoAlternate />} variant="contained">
                이미지 추가
              </Button>
            </Stack>
          </Card>
        </Grid2>
        {folders?.data?.data?.map((folder) => (
          <Grid2 key={folder.id} md={4} sm={4} xl={3} xs={2}>
            <FolderCard name={folder.name} />
          </Grid2>
        ))}
      </Grid2>
      <FolderAddModal open={isFolderAddModalOpen} onClose={() => setIsFolderAddModalOpen(false)} />
    </Stack>
  );
}
