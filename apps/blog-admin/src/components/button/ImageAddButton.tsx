import React, { useState } from 'react';
import { Button } from 'ui';
import { AddPhotoAlternate } from 'ui-icon';
import { useParams } from 'react-router-dom';
import { ImageAddModal } from '../modal/ImageAddModal';

export function ImageAddButton() {
  const param = useParams();
  const [isShowImageAddModal, setIsShowImageAddModal] = useState(false);

  return (
    <>
      <Button
        fullWidth
        size="large"
        startIcon={<AddPhotoAlternate />}
        variant="contained"
        onClick={() => setIsShowImageAddModal(true)}
      >
        이미지 추가
      </Button>
      <ImageAddModal
        folderId={Number(param.id)}
        open={isShowImageAddModal}
        onClose={() => setIsShowImageAddModal(false)}
      />
    </>
  );
}
