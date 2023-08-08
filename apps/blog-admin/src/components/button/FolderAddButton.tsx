import React, { useState } from 'react';
import { Button } from 'ui';
import { CreateNewFolder } from 'ui-icon';
import { useParams } from 'react-router-dom';
import { FolderMutateModal } from '../modal/FolderMutateModal';

export function FolderAddButton() {
  const params = useParams();
  const [isFolderAddModalOpen, setIsFolderAddModalOpen] = useState(false);

  return (
    <>
      <Button
        fullWidth
        size="large"
        startIcon={<CreateNewFolder />}
        variant="outlined"
        onClick={() => setIsFolderAddModalOpen(true)}
      >
        폴더추가
      </Button>
      <FolderMutateModal
        open={isFolderAddModalOpen}
        parentId={Number(params.id)}
        onClose={() => setIsFolderAddModalOpen(false)}
      />
    </>
  );
}
