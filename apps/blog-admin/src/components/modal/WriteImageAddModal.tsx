import {
  Box,
  Button,
  CircularProgress,
  ImageList,
  ImageListItem,
  Input,
  MenuItem,
  Modal,
  ModalProps,
  Select,
  SelectChangeEvent,
  Stack,
  Tab,
  Tabs
} from 'ui';
import { ChangeEvent, forwardRef, useCallback, useRef, useState } from 'react';
import { debounce } from 'lodash';
import { useQueryClient } from '@tanstack/react-query';
import { ModalContent } from './ModalContent';
import { FIleUploadButton } from '../button/FIleUploadButton';
import { GlobalError, ImageFile } from '../../types/global';
import { useChanooMutation, useChanooQuery } from '../../libs/queryHook';
import { FolderImage, FolderRes } from '../../types/res';

export interface WriteImageAddModalProps extends Omit<ModalProps, 'children'> {
  onChooseImage: (url: string) => void;
}

export const WriteImageAddModal = forwardRef<HTMLDivElement, WriteImageAddModalProps>(
  ({ onChooseImage, open, ...modalProps }, ref) => {
    const embedImageRef = useRef<HTMLImageElement>(null);
    const client = useQueryClient();
    const [tabValue, setTabValue] = useState('upload');
    const [imageList, setImageList] = useState<ImageFile[]>([]);
    const [embed, setEmbed] = useState('');
    const [embedUrl, setEmbedUrl] = useState('');
    const [uploadFolderId, setUploadFolderId] = useState('0');
    const [folderId, setFolderId] = useState<string | undefined>(undefined);

    const { data: folders } = useChanooQuery<FolderRes[], GlobalError>(['folders'], {
      enabled: open
    });
    const { data: folderDetail, isLoading } = useChanooQuery<FolderRes, GlobalError>(
      [`folders/${folderId}`],
      {
        enabled: !!folderId && open
      }
    );
    const { mutate, isLoading: addImageLoading } = useChanooMutation<
      FolderImage,
      GlobalError,
      FormData
    >(['POST', `/folders/${uploadFolderId}/image`, (data) => data]);

    const folderImageList = folderDetail?.data?.data?.folderImage || [];

    // 탭 이동
    const dataClear = () => {
      setImageList([]);
      setEmbed('');
      setEmbedUrl('');
      setUploadFolderId('0');
      client.cancelQueries([`folders/${folderId}`]);
    };
    const changeTabHandler = (event: React.SyntheticEvent, newValue: string) => {
      dataClear();
      setTabValue(newValue);
    };

    // 이미지 업로드 버튼
    const clickUploadButtonHandler = () => {
      if (tabValue === 'embed' && embedUrl) onChooseImage(embed);
      if (tabValue === 'upload') {
        if (imageList?.length < 1 || addImageLoading || !uploadFolderId) return;
        const formData = new FormData();
        formData.append('image', imageList[0].file);
        mutate(formData, {
          onSuccess(data) {
            onChooseImage(data.data.data.url);
          }
        });
      }
    };

    // 업로드 이미지
    const getImageList = (imageFiles: ImageFile[]) => {
      setImageList(imageFiles);
    };

    const uploadFolderSelectChangeHandler = (e: SelectChangeEvent) => {
      setUploadFolderId(e.target.value);
    };

    // embed
    const changeUrlHandler = (url: string) => {
      setEmbedUrl(url);
    };

    const debouncedChangeEmbedInputHandler = useCallback(debounce(changeUrlHandler, 500), []);

    const changeEmbedInputHandler = (e: ChangeEvent<HTMLInputElement>) => {
      setEmbed(e.target.value);
      debouncedChangeEmbedInputHandler(e.target.value);
    };

    // file
    const folderSelectChangeHandler = (e: SelectChangeEvent) => {
      setFolderId(e.target.value);
    };

    const insertImage = (url: string) => {
      onChooseImage(url);
    };

    return (
      <Modal {...modalProps} open={open} ref={ref}>
        <ModalContent sx={{ width: 'calc(100% - 24px)', maxWidth: 600 }}>
          <Stack width="100%">
            <Tabs value={tabValue} onChange={changeTabHandler}>
              <Tab label="upload" value="upload" />
              <Tab label="embed" value="embed" />
              <Tab label="file" value="file" />
            </Tabs>
            <Stack mt={2} width="100%">
              {tabValue === 'upload' && (
                <Stack alignItems="flex-end" gap={2} width="100%">
                  <Box width={140}>
                    <FIleUploadButton getImageList={getImageList} />{' '}
                  </Box>
                  {imageList?.map((image) => (
                    <Box height={300} key={image.url} width="100%">
                      <Box
                        component="img"
                        height="100%"
                        src={image.url}
                        sx={{ objectFit: 'contain' }}
                        width="100%"
                      />
                    </Box>
                  ))}
                </Stack>
              )}
              {tabValue === 'embed' && (
                <Stack gap={2} width="100%">
                  <Input
                    placeholder="이미지 링크를 입력해주세요."
                    type="text"
                    value={embed}
                    onChange={changeEmbedInputHandler}
                  />
                  {embedUrl && (
                    <Box height={300} key={embed} width="100%">
                      <Box
                        component="img"
                        height="100%"
                        ref={embedImageRef}
                        src={embedUrl}
                        sx={{ objectFit: 'contain' }}
                        width="100%"
                      />
                    </Box>
                  )}
                </Stack>
              )}
              {tabValue === 'file' && (
                <Stack width="100%">
                  <Select
                    size="medium"
                    value={folderId}
                    variant="standard"
                    onChange={folderSelectChangeHandler}
                  >
                    {folders?.data?.data?.map((folder) => (
                      <MenuItem key={folder.id} value={folder.id}>
                        {folder.name}
                      </MenuItem>
                    ))}
                  </Select>
                  <Stack
                    alignItems="center"
                    justifyContent="center"
                    maxHeight={500}
                    minHeight={200}
                    overflow="auto"
                  >
                    {folderImageList?.length > 0 && (
                      <ImageList cols={2} gap={8} variant="masonry">
                        {folderImageList?.map((img) => (
                          <ImageListItem
                            key={img.id}
                            sx={{ cursor: 'pointer' }}
                            onClick={() => insertImage(img.url)}
                          >
                            <img alt={img.originalname} src={img.url} />
                          </ImageListItem>
                        ))}
                      </ImageList>
                    )}
                    {folderId && isLoading && <CircularProgress />}
                  </Stack>
                </Stack>
              )}
            </Stack>
            <Stack gap={4} mt={4} width="100%">
              {tabValue === 'upload' && (
                <Select
                  size="medium"
                  value={uploadFolderId}
                  variant="standard"
                  onChange={uploadFolderSelectChangeHandler}
                >
                  <MenuItem key={0} value="0">
                    폴더를 선택해주세요.
                  </MenuItem>
                  {folders?.data?.data?.map((folder) => (
                    <MenuItem key={folder.id} value={folder.id}>
                      {folder.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
              {tabValue !== 'file' && (
                <Stack mx="auto" width={300}>
                  <Button variant="contained" onClick={clickUploadButtonHandler}>
                    업로드
                  </Button>
                </Stack>
              )}
            </Stack>
          </Stack>
        </ModalContent>
      </Modal>
    );
  }
);
