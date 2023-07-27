import { Button, Input, Modal, ModalProps, Stack, useSnackbar } from 'ui';
import { FormEvent, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ModalContent } from './ModalContent';
import { useChanooMutation } from '../../libs/queryHook';
import { GlobalError } from '../../types/global';
import { AddFolder as FolderAdd } from '../../types/folder';

export function FolderAddModal({ open, onClose }: Omit<ModalProps, 'children'>) {
  const [folderName, setFolderName] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const client = useQueryClient();

  const { mutate } = useChanooMutation<undefined, GlobalError, FolderAdd>([
    'POST',
    '/folders',
    (data) => ({ ...data })
  ]);

  const folderAddSubmitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    mutate(
      {
        name: folderName,
        parentId: null
      },
      {
        onSuccess() {
          enqueueSnackbar('폴더 생성 성공!', { variant: 'success' });
          setFolderName('');
          client.invalidateQueries(['folders']);
          if (onClose) onClose({}, 'escapeKeyDown');
        }
      }
    );
  };

  return (
    <Modal keepMounted open={open} onClose={onClose}>
      <ModalContent>
        <Stack component="form" spacing={2} width={300} onSubmit={folderAddSubmitHandler}>
          <Input
            placeholder="폴더 이름"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
          />
          <Button size="small" type="submit" variant="contained">
            폴더추가하기
          </Button>
        </Stack>
      </ModalContent>
    </Modal>
  );
}
