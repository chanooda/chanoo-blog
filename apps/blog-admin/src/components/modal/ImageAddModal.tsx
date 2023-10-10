import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  ImageList,
  ImageListItem,
  Modal,
  ModalProps,
  Stack,
  useSnackbar
} from 'ui';
import { forwardRef, useState } from 'react';
import { Delete } from 'ui-icon';
import { useQueryClient } from '@tanstack/react-query';
import { ModalContent } from './ModalContent';
import { GlobalError, ImageFile } from '../../types/global';
import { useChanooMutation } from '../../libs/queryHook';
import { FIleUploadButton } from '../button/FIleUploadButton';

export interface ImageAddModalProps extends Omit<ModalProps, 'children'> {
  folderId: number;
}

export const ImageAddModal = forwardRef<HTMLDivElement, ImageAddModalProps>(
  ({ folderId, open, onClose, ...modalProps }, ref) => {
    const client = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();
    const [imageList, setImageList] = useState<ImageFile[]>([]);

    const { mutateAsync, isLoading } = useChanooMutation<unknown, GlobalError, FormData>([
      'POST',
      `/folders/${folderId}/image`,
      (data) => data
    ]);

    const getImageList = (imageFiles: ImageFile[]) => {
      setImageList(imageFiles);
    };

    const imageClear = (_index: number) => {
      setImageList((prev) => prev.filter((_, index) => index !== _index));
    };

    const imageListAllClear = () => {
      setImageList([]);
    };

    const imagesUploadHandler = async () => {
      if (isLoading || imageList?.length === 0) return;
      try {
        await Promise.all(
          imageList.map((image) => {
            const formData = new FormData();
            formData.append('image', image.file);
            return mutateAsync(formData);
          })
        );
        enqueueSnackbar('이미지 업로드 성공!', { variant: 'success' });
        client.invalidateQueries([`folders/${folderId}`]);
        if (onClose) onClose({}, 'escapeKeyDown');
      } catch (error) {
        enqueueSnackbar('이미지 업로드 실패. 잠시 후 시도해 주세요.', { variant: 'error' });
      }
    };

    return (
      <Modal open={open} ref={ref} onClose={onClose} {...modalProps}>
        <ModalContent sx={{ width: 'calc(100% - 50px)', maxWidth: 800 }}>
          <Stack width="100%">
            <Stack alignItems="center" direction="row" justifyContent="space-between" width="100%">
              <FIleUploadButton getImageList={getImageList} multiple />
              {imageList.length > 0 && (
                <Button color="error" endIcon={<Delete />} onClick={imageListAllClear}>
                  모두 지우기
                </Button>
              )}
            </Stack>
            <Stack
              bgcolor={(theme) => theme.palette.grey[100]}
              border={(theme) => `2px solid ${theme.palette.primary.main}`}
              borderRadius={2}
              height={500}
              mt={2}
              overflow="auto"
              position="relative"
              px={2}
              width="100%"
            >
              <ImageList cols={2} gap={8} variant="masonry">
                {imageList?.map((image, index) => (
                  <ImageListItem key={image.url}>
                    <Box
                      position="relative"
                      sx={{
                        '&:hover': {
                          '& > button': {
                            opacity: 1
                          }
                        }
                      }}
                    >
                      <Box
                        alt={image.url}
                        component="img"
                        loading="lazy"
                        src={image.url}
                        width="100%"
                      />
                      <IconButton
                        color="error"
                        sx={{
                          position: 'absolute',
                          top: 10,
                          right: 10,
                          opacity: 0,
                          transition: 'all 0.3s'
                        }}
                        onClick={() => imageClear(index)}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </ImageListItem>
                ))}
              </ImageList>
              {isLoading && (
                <CircularProgress
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                  }}
                />
              )}
            </Stack>
            <Stack alignItems="center" mt={2} width="100%">
              <Button
                sx={{ maxWidth: 400, width: '100%' }}
                variant="contained"
                onClick={imagesUploadHandler}
              >
                확인
              </Button>
            </Stack>
          </Stack>
        </ModalContent>
      </Modal>
    );
  }
);
