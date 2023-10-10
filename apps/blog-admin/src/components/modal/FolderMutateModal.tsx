import { Button, Input, Modal, ModalProps, Stack, useSnackbar } from 'ui';
import { FormEvent, forwardRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ModalContent } from './ModalContent';
import { useChanooMutation } from '../../libs/queryHook';
import { GlobalError } from '../../types/global';
import { FolderRes } from '../../types/res';
import { AddFolder, EditFolder } from '../../types/req';

interface FolderAddModalProps extends Omit<ModalProps, 'children'> {
  folder?: FolderRes;
  parentId?: FolderRes['parentId'];
}

export const FolderMutateModal = forwardRef<HTMLDivElement, FolderAddModalProps>(
  ({ open, onClose, parentId, folder, ...modalProps }, ref) => {
    const [folderName, setFolderName] = useState('');
    const { enqueueSnackbar } = useSnackbar();
    const client = useQueryClient();

    const { mutate: addFolder, isLoading: isAddFolderLoading } = useChanooMutation<
      undefined,
      GlobalError,
      AddFolder
    >(['POST', '/folders', (data) => ({ ...data })], {
      onSuccess() {
        enqueueSnackbar('폴더 생성 성공!', { variant: 'success' });
        setFolderName('');
        client.invalidateQueries(parentId ? [`folders/${parentId}`] : [`folders/root`]);
        if (onClose) onClose({}, 'escapeKeyDown');
      }
    });

    const { mutate: editFolder, isLoading: isEditFolderLoading } = useChanooMutation<
      undefined,
      unknown,
      EditFolder
    >(['PATCH', `/folders/${folder?.id}`, (data) => ({ ...data })], {
      onSuccess() {
        enqueueSnackbar('폴더 수정 성공!', { variant: 'success' });
        setFolderName('');
        client.invalidateQueries(parentId ? [`folders/${parentId}`] : [`folders/root`]);
        if (onClose) onClose({}, 'escapeKeyDown');
      }
    });

    const folderAddSubmitHandler = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!folderName || isAddFolderLoading || isEditFolderLoading) return;

      if (folder) {
        editFolder({
          name: folderName
        });
      } else {
        addFolder({
          name: folderName,
          parentId: parentId ? Number(parentId) : null
        });
      }
    };

    return (
      <Modal keepMounted open={open} ref={ref} onClose={onClose} {...modalProps}>
        <ModalContent>
          <Stack component="form" spacing={2} width={300} onSubmit={folderAddSubmitHandler}>
            <Input
              placeholder="폴더 이름"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
            />
            <Button size="small" type="submit" variant="contained">
              {folder ? '폴더 수정하기' : '폴더추가하기'}
            </Button>
          </Stack>
        </ModalContent>
      </Modal>
    );
  }
);
