import React, { MouseEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  ButtonGroup,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Popover,
  Stack,
  Typography,
  useSnackbar
} from 'ui';
import { Folder as FolderIcon, MoreVert } from 'ui-icon';
import { useQueryClient } from '@tanstack/react-query';
import { GlobalError } from 'utils';
import { useChanooMutation } from '../../libs/queryHook';
import { FolderMutateModal } from '../modal/FolderMutateModal';
import { FolderRes } from '../../types/res';

interface FolderCardProps {
  folder: FolderRes;
}

export function FolderCard({ folder }: FolderCardProps) {
  const navigate = useNavigate();
  const client = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [showAskAlert, setShowAskAlert] = useState(false);

  const fileCount =
    // eslint-disable-next-line no-underscore-dangle
    (folder?._count?.folderImage || 0) +
    (folder?.folderImage?.length || 0) +
    (folder?.child?.length || 0);

  const { mutate: deleteFolder, isLoading: isDeleteFolderLoading } = useChanooMutation<
    unknown,
    GlobalError,
    unknown
  >(['DELETE', `/folders/${folder.id}`, undefined], {
    onSuccess() {
      enqueueSnackbar('폴더가 삭제되었습니다.', { variant: 'success' });
      setAnchorEl(null);
      client.invalidateQueries([folder.parentId ? `folders/${folder.parentId}` : `folders/root`]);
    }
  });

  const clickFolderCardHandler = (folderId: number) => {
    navigate(`/folder/${folderId}`);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    setAnchorEl(null);
  };

  const deleteButtonClickHandler = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (isDeleteFolderLoading) return;
    deleteFolder({});
  };

  const editButtonClickHandler = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setAnchorEl(null);
    setIsOpenEditModal(true);
  };

  return (
    <>
      <Card
        variant="outlined"
        sx={(theme) => ({
          width: '100%',
          height: 200,
          position: 'relative',
          p: 1,
          cursor: 'pointer',
          transition: 'all 0.2s',
          '&:hover': {
            border: `1px solid ${theme.palette.primary.main}`
          }
        })}
        onClick={(e) => {
          if (e.defaultPrevented) return;
          e.preventDefault();
          clickFolderCardHandler(folder.id);
        }}
      >
        <CardContent sx={{ height: '100%' }}>
          <Stack alignItems="center" gap={1} height="100%" width="100%">
            <Stack alignItems="center" height="100%" justifyContent="center" width="100%">
              <FolderIcon color="primary" fontSize="large" />
            </Stack>
            <Stack>
              <Typography>{folder.name}</Typography>
            </Stack>
          </Stack>
        </CardContent>
        <IconButton
          aria-describedby="folder-edit"
          sx={{ position: 'absolute', right: 10, top: 10 }}
          onClick={handleClick}
        >
          <MoreVert />
        </IconButton>
        <Popover
          anchorEl={anchorEl}
          id="folder-edit"
          open={!!anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
          onClose={handleClose}
        >
          <Stack width={80}>
            <ButtonGroup color="inherit" orientation="vertical" size="medium" variant="text">
              <Button onClick={editButtonClickHandler}>수정</Button>
              <Button
                onClick={
                  fileCount
                    ? (e) => {
                        e.preventDefault();
                        setShowAskAlert(true);
                      }
                    : deleteButtonClickHandler
                }
              >
                삭제
              </Button>
            </ButtonGroup>
          </Stack>
        </Popover>
      </Card>
      <FolderMutateModal
        folder={folder}
        open={isOpenEditModal}
        parentId={folder.parentId}
        onClose={() => setIsOpenEditModal(false)}
      />
      <Dialog open={showAskAlert}>
        <DialogTitle>안내</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {`${fileCount} 개의 파일이 존재합니다. 삭제하시겠습니까?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAskAlert(false)}>Disagree</Button>
          <Button autoFocus onClick={deleteButtonClickHandler}>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
