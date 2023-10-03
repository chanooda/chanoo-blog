import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Typography,
  useSnackbar
} from 'ui';
import { MouseEvent, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Delete } from 'ui-icon';
import { ImageCoverModal } from '../modal/ImageCoverModal';
import { useChanooMutation } from '../../libs/queryHook';
import { GlobalError } from '../../types/global';
import { FolderImage } from '../../types/res';

interface ImageCardProps {
  image: FolderImage;
}

export function ImageCard({ image }: ImageCardProps) {
  const client = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [isShowImageCoverModal, setIsShowImageCoverModal] = useState(false);
  const [showAskAlert, setShowAskAlert] = useState(false);

  const { mutate, isLoading } = useChanooMutation<any, GlobalError, undefined>(
    ['DELETE', `folders/${image.id}/image`, undefined],
    {
      onSuccess() {
        enqueueSnackbar('이미지 삭제가 완료되었습니다.', { variant: 'success' });
        client.invalidateQueries([`folders/${image.folderId}`]);
      }
    }
  );

  const clickImageCardHandler = () => {
    setIsShowImageCoverModal(true);
  };

  const deleteButtonClickHandler = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setShowAskAlert(true);
  };

  const deleteImage = () => {
    if (isLoading) return;
    mutate(undefined);
  };

  const cancelDialog = () => {
    setShowAskAlert(false);
  };

  return (
    <>
      <Card
        aria-describedby="image-option"
        sx={{
          width: '100%',
          height: 200,
          position: 'relative',
          '&:hover': {
            '& button': {
              opacity: 1
            }
          }
        }}
        onClick={clickImageCardHandler}
      >
        <CardActionArea sx={{ width: '100%', height: '100%' }}>
          <CardMedia alt={image.originalname} component="img" height="80%" src={image.url} />
          <CardContent sx={{ p: 1, height: '20%' }}>
            <Typography component="div" gutterBottom variant="body2">
              {image.originalname}
            </Typography>
          </CardContent>
        </CardActionArea>
        <IconButton
          color="error"
          sx={{ opacity: 0, position: 'absolute', top: 10, right: 10, transition: 'all 0.3s' }}
          onClick={deleteButtonClickHandler}
        >
          <Delete />
        </IconButton>
      </Card>

      <Dialog open={showAskAlert} onClose={() => setShowAskAlert(false)}>
        <DialogTitle>안내</DialogTitle>
        <DialogContent>
          <DialogContentText>이미지를 삭제하시겠습니까?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDialog}>Disagree</Button>
          <Button autoFocus onClick={deleteImage}>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
      {image && (
        <ImageCoverModal
          image={image}
          open={isShowImageCoverModal}
          onClose={() => setIsShowImageCoverModal(false)}
        />
      )}
    </>
  );
}
